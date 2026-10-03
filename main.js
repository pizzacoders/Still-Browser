const { app, BrowserWindow, WebContentsView, ipcMain, safeStorage, session } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');

const CONTENT_PARTITION = 'persist:still-browser';
const AD_HOSTS = new Set([
  'doubleclick.net', 'googlesyndication.com', 'googleadservices.com', 'adnxs.com',
  'adsrvr.org', 'adservice.google.com', 'taboola.com', 'outbrain.com', 'criteo.com',
  'scorecardresearch.com', 'demdex.net', 'amazon-adsystem.com', 'advertising.com'
]);

let windowRef;
let contentSession;
let nextTabNumber = 1;
let activeTabId = null;
let contentBounds = { x: 0, y: 132, width: 0, height: 0 };
let adBlockingEnabled = false;
let appShortcuts = new Set();
const tabs = new Map();
const credentials = { openai: '', gemini: '' };
let credentialsLoaded = false;
let credentialsLoading;

function sendToRenderer(channel, payload) {
  if (windowRef && !windowRef.isDestroyed()) windowRef.webContents.send(channel, payload);
}

function normalizedWebUrl(input) {
  const value = String(input || '').trim();
  if (!value) return null;
  if (/^(https?:\/\/)/i.test(value)) {
    try {
      const parsed = new URL(value);
      return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : null;
    } catch { return null; }
  }
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/.*)?$/.test(value) && !value.includes(' ')) {
    return `https://${value}`;
  }
  return `https://duckduckgo.com/?q=${encodeURIComponent(value)}`;
}

function emitTab(tab, type, extra = {}) {
  if (!tab) return;
  const wc = tab.view.webContents;
  sendToRenderer('browser:tab-event', {
    type,
    tabId: tab.id,
    url: wc.getURL() || tab.url || '',
    title: tab.title || wc.getTitle() || 'New tab',
    canGoBack: wc.navigationHistory.canGoBack(),
    canGoForward: wc.navigationHistory.canGoForward(),
    ...extra
  });
}

function updateContentBounds() {
  for (const [id, tab] of tabs) {
    if (id === activeTabId && contentBounds.width > 0 && contentBounds.height > 0) {
      tab.view.setBounds(contentBounds);
      tab.view.setVisible(true);
    } else {
      tab.view.setVisible(false);
    }
  }
}

function attachTabEvents(tab) {
  const wc = tab.view.webContents;
  wc.on('did-start-loading', () => emitTab(tab, 'loading', { loading: true }));
  wc.on('did-stop-loading', () => emitTab(tab, 'loading', { loading: false }));
  wc.on('did-navigate', (_event, url) => {
    tab.url = url;
    emitTab(tab, 'navigate', { url });
  });
  wc.on('did-navigate-in-page', (_event, url) => {
    tab.url = url;
    emitTab(tab, 'navigate', { url });
  });
  wc.on('page-title-updated', (_event, title) => {
    tab.title = title || 'New tab';
    emitTab(tab, 'title', { title: tab.title });
  });
  wc.on('did-fail-load', (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame && errorCode !== -3) emitTab(tab, 'error', { error: errorDescription, url: validatedURL });
  });
  wc.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown' || !(input.meta || input.control)) return;
    const parts = [input.meta ? 'Meta' : 'Ctrl'];
    if (input.shift) parts.push('Shift');
    if (input.alt) parts.push('Alt');
    parts.push(input.key.length === 1 ? input.key.toUpperCase() : input.key[0].toUpperCase() + input.key.slice(1));
    const accelerator = parts.join('+');
    if (!appShortcuts.has(accelerator)) return;
    event.preventDefault();
    sendToRenderer('browser:shortcut', {
      key: input.key,
      metaKey: Boolean(input.meta),
      ctrlKey: Boolean(input.control),
      shiftKey: Boolean(input.shift),
      altKey: Boolean(input.alt)
    });
  });
  wc.setWindowOpenHandler(({ url }) => {
    createTab(url);
    return { action: 'deny' };
  });
  wc.on('render-process-gone', (_event, details) => emitTab(tab, 'error', { error: `Page stopped (${details.reason})` }));
}

function createTab(initialUrl = '') {
  const id = `tab-${nextTabNumber++}`;
  const view = new WebContentsView({
    webPreferences: {
      session: contentSession,
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      spellcheck: true
    }
  });
  windowRef.contentView.addChildView(view);
  const tab = { id, view, url: '', title: 'New tab' };
  tabs.set(id, tab);
  attachTabEvents(tab);
  activeTabId = id;
  updateContentBounds();
  if (initialUrl) navigateTab(id, initialUrl);
  sendToRenderer('browser:tab-created', { id, title: tab.title, url: tab.url, active: true });
  return id;
}

function navigateTab(id, rawUrl) {
  const tab = tabs.get(id);
  const url = normalizedWebUrl(rawUrl);
  if (!tab || !url) return false;
  tab.url = url;
  tab.view.webContents.loadURL(url).catch((error) => emitTab(tab, 'error', { error: error.message, url }));
  return true;
}

function closeTab(id) {
  const tab = tabs.get(id);
  if (!tab) return;
  const wasActive = activeTabId === id;
  windowRef.contentView.removeChildView(tab.view);
  tab.view.webContents.close();
  tabs.delete(id);
  sendToRenderer('browser:tab-closed', { id });
  if (wasActive) {
    const fallback = [...tabs.keys()].at(-1);
    activeTabId = fallback || null;
    if (fallback) sendToRenderer('browser:tab-activated', { id: fallback });
    updateContentBounds();
  }
}

function credentialsPath() {
  return path.join(app.getPath('userData'), 'ai-credentials.json');
}

async function hasSecureCredentialStorage() {
  if (!await safeStorage.isAsyncEncryptionAvailable()) return false;
  if (process.platform === 'linux' && safeStorage.getSelectedStorageBackend() === 'basic_text') return false;
  return true;
}

async function loadCredentials() {
  if (credentialsLoaded) return;
  if (credentialsLoading) return credentialsLoading;
  credentialsLoading = (async () => {
    try {
      const stored = JSON.parse(await fs.readFile(credentialsPath(), 'utf8'));
      for (const provider of ['openai', 'gemini']) {
        if (stored[provider] && await hasSecureCredentialStorage()) {
          const decrypted = await safeStorage.decryptStringAsync(Buffer.from(stored[provider], 'base64'));
          credentials[provider] = decrypted.result;
        }
      }
    } catch { /* First run or no saved credentials. */ }
    finally { credentialsLoaded = true; }
  })();
  return credentialsLoading;
}

async function saveCredentials() {
  const encrypted = {};
  if (await hasSecureCredentialStorage()) {
    for (const provider of ['openai', 'gemini']) {
      if (credentials[provider]) encrypted[provider] = (await safeStorage.encryptStringAsync(credentials[provider])).toString('base64');
    }
  }
  await fs.mkdir(path.dirname(credentialsPath()), { recursive: true });
  await fs.writeFile(credentialsPath(), JSON.stringify(encrypted, null, 2), { mode: 0o600 });
}

function composePrompt(prompt, pageContext, history = []) {
  const page = pageContext ? `Page context:\n${pageContext}\n\n` : '';
  const conversation = history.length ? `Conversation so far:\n${history.map(item => `${item.role === 'assistant' ? 'Assistant' : 'User'}: ${String(item.text || '').slice(0, 4000)}`).join('\n')}\n\n` : '';
  return `${page}${conversation}User: ${prompt}`;
}

async function askOpenAI(prompt, pageContext, history) {
  const key = credentials.openai;
  if (!key) throw new Error('Add your OpenAI API key in AI settings first.');
  const input = composePrompt(prompt, pageContext, history);
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'gpt-4.1-mini', input }),
    signal: AbortSignal.timeout(90000)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `OpenAI returned ${response.status}.`);
  const text = data.output_text || data.output?.flatMap(item => item.content || []).map(part => part.text || '').join('') || '';
  return text || 'The assistant returned an empty response.';
}

async function askGemini(prompt, pageContext, history) {
  const key = credentials.gemini;
  if (!key) throw new Error('Add your Gemini API key in AI settings first.');
  const text = composePrompt(prompt, pageContext, history);
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({ contents: [{ role: 'user', parts: [{ text }] }] }),
    signal: AbortSignal.timeout(90000)
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || `Gemini returned ${response.status}.`);
  return data.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('') || 'The assistant returned an empty response.';
}

function installAdBlocker() {
  contentSession.webRequest.onBeforeRequest((details, callback) => {
    let blocked = false;
    if (adBlockingEnabled) {
      try {
        const host = new URL(details.url).hostname.toLowerCase();
        blocked = [...AD_HOSTS].some(domain => host === domain || host.endsWith(`.${domain}`));
      } catch { /* Ignore malformed request URLs. */ }
    }
    callback({ cancel: blocked });
  });
}

function createWindow() {
  windowRef = new BrowserWindow({
    width: 1440,
    height: 940,
    minWidth: 980,
    minHeight: 650,
    backgroundColor: '#0b0d10',
    title: 'Still Browser',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true
    }
  });
  windowRef.loadFile(path.join(__dirname, 'index.html'));
  windowRef.on('resize', updateContentBounds);
  windowRef.on('closed', () => { windowRef = null; });
}

app.whenReady().then(() => {
  contentSession = session.fromPartition(CONTENT_PARTITION);
  installAdBlocker();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
});

ipcMain.handle('browser:create-tab', (_event, url) => createTab(url || ''));
ipcMain.handle('browser:activate-tab', (_event, id) => {
  if (!tabs.has(id)) return false;
  activeTabId = id;
  updateContentBounds();
  sendToRenderer('browser:tab-activated', { id });
  return true;
});
ipcMain.handle('browser:close-tab', (_event, id) => closeTab(id));
ipcMain.handle('browser:navigate', (_event, id, url) => navigateTab(id, url));
ipcMain.handle('browser:go', (_event, id, direction) => {
  const wc = tabs.get(id)?.view.webContents;
  if (!wc) return false;
  const history = wc.navigationHistory;
  if (direction === 'back' && history.canGoBack()) history.goBack();
  if (direction === 'forward' && history.canGoForward()) history.goForward();
  if (direction === 'reload') wc.reload();
  return true;
});
ipcMain.handle('browser:home', (_event, id) => {
  const tab = tabs.get(id);
  if (!tab) return false;
  tab.url = '';
  tab.title = 'New tab';
  tab.view.webContents.loadURL('about:blank').catch(() => {});
  emitTab(tab, 'home', { url: '', title: 'New tab', canGoBack: false, canGoForward: false });
  return true;
});
ipcMain.handle('browser:set-shortcuts', (_event, shortcuts) => {
  if (!Array.isArray(shortcuts)) return false;
  appShortcuts = new Set(shortcuts.filter(value => typeof value === 'string' && value.length <= 32));
  return true;
});
ipcMain.handle('browser:set-content-bounds', (_event, bounds) => {
  const { x, y, width, height } = bounds || {};
  if (![x, y, width, height].every(Number.isFinite)) return false;
  contentBounds = { x: Math.max(0, x), y: Math.max(0, y), width: Math.max(0, width), height: Math.max(0, height) };
  updateContentBounds();
  return true;
});
ipcMain.handle('browser:active-tab', () => activeTabId);
ipcMain.handle('browser:extract-page', async (_event, id) => {
  const wc = tabs.get(id)?.view.webContents;
  if (!wc) return { title: '', url: '', text: '' };
  try {
    return await wc.executeJavaScript(`({title:document.title,url:location.href,text:(document.body?.innerText||'').slice(0,14000)})`, true);
  } catch { return { title: wc.getTitle(), url: wc.getURL(), text: '' }; }
});
ipcMain.handle('browser:set-adblock', (_event, enabled) => { adBlockingEnabled = Boolean(enabled); return adBlockingEnabled; });
ipcMain.handle('credentials:status', async () => {
  await loadCredentials();
  return { openai: Boolean(credentials.openai), gemini: Boolean(credentials.gemini), encryptedAtRest: await hasSecureCredentialStorage() };
});
ipcMain.handle('credentials:save', async (_event, provider, value) => {
  if (!['openai', 'gemini'].includes(provider)) throw new Error('Unknown AI provider.');
  await loadCredentials();
  credentials[provider] = String(value || '').trim();
  await saveCredentials();
  return { [provider]: Boolean(credentials[provider]), encryptedAtRest: await hasSecureCredentialStorage() };
});
ipcMain.handle('credentials:clear', async (_event, provider) => {
  if (!['openai', 'gemini'].includes(provider)) throw new Error('Unknown AI provider.');
  await loadCredentials();
  credentials[provider] = '';
  await saveCredentials();
  return { [provider]: false };
});
ipcMain.handle('ai:ask', async (_event, { provider, prompt, pageContext = '', history = [] }) => {
  await loadCredentials();
  if (!String(prompt || '').trim()) throw new Error('Write a message first.');
  const safeHistory = Array.isArray(history) ? history.slice(-12).map(item => ({ role: item.role === 'assistant' ? 'assistant' : 'user', text: String(item.text || '').slice(0, 4000) })) : [];
  return provider === 'gemini' ? askGemini(String(prompt), String(pageContext), safeHistory) : askOpenAI(String(prompt), String(pageContext), safeHistory);
});

app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
