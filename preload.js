const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('still', Object.freeze({
  createTab: (url = '') => ipcRenderer.invoke('browser:create-tab', url),
  activateTab: id => ipcRenderer.invoke('browser:activate-tab', id),
  closeTab: id => ipcRenderer.invoke('browser:close-tab', id),
  navigate: (id, url) => ipcRenderer.invoke('browser:navigate', id, url),
  go: (id, direction) => ipcRenderer.invoke('browser:go', id, direction),
  home: id => ipcRenderer.invoke('browser:home', id),
  setShortcuts: shortcuts => ipcRenderer.invoke('browser:set-shortcuts', shortcuts),
  setContentBounds: bounds => ipcRenderer.invoke('browser:set-content-bounds', bounds),
  getActiveTab: () => ipcRenderer.invoke('browser:active-tab'),
  extractPage: id => ipcRenderer.invoke('browser:extract-page', id),
  setAdBlock: enabled => ipcRenderer.invoke('browser:set-adblock', enabled),
  getCredentialStatus: () => ipcRenderer.invoke('credentials:status'),
  saveCredential: (provider, value) => ipcRenderer.invoke('credentials:save', provider, value),
  clearCredential: provider => ipcRenderer.invoke('credentials:clear', provider),
  askAI: payload => ipcRenderer.invoke('ai:ask', payload),
  on: (channel, callback) => {
    const allowed = new Set(['browser:tab-event', 'browser:tab-created', 'browser:tab-closed', 'browser:tab-activated', 'browser:shortcut']);
    if (!allowed.has(channel) || typeof callback !== 'function') return () => {};
    const listener = (_event, payload) => callback(payload);
    ipcRenderer.on(channel, listener);
    return () => ipcRenderer.removeListener(channel, listener);
  }
}));
