# Still Browser

A dark-first desktop browser prototype built with plain HTML, CSS, JavaScript, and Electron. The UI runs in a local, sandboxed renderer. Each website runs in its own isolated Chromium `WebContentsView`, so navigation works for sites that block iframe embedding.

## Run locally

Requirements: Node.js 22 or newer and npm.

```sh
cd outputs
npm install
npm start
```

The first install downloads Electron. The browser then runs as a desktop app; opening `index.html` directly in a regular browser does not provide the Electron bridge or embedded browser tabs.

## Build an installer

Electron Forge is configured to create a macOS DMG, a Windows Squirrel installer, a Debian/Ubuntu `.deb`, and a ZIP bundle. Install dependencies once, then run the make command for your computer:

```sh
cd outputs
npm install
npm run make
```

The distributables are written under `out/make`. On an Apple Silicon Mac, this builds for the native ARM64 architecture. To select a target explicitly, pass Forge's platform and architecture flags after `--`:

```sh
npm run make -- --platform=darwin --arch=arm64
```

Build each platform on its matching operating system for the most reliable result. The DMG maker only runs on macOS. The Debian maker requires `fakeroot` and `dpkg`; install those tools first when building a `.deb`. Forge can also create an unpacked app bundle without an installer using `npm run package`; that output is in `out/`.

These packages are unsigned. macOS notarization and Windows code signing need developer certificates and are not configured here.

## Included

- Tabs, address/search bar, back/forward/reload, new-window links as tabs, homepage, bookmarks, and recent pages.
- Dark, light, and system themes, five accent presets plus a custom color, optional homepage widgets, and editable quick links.
- A language picker with more than 190 language tags, named with the runtime's `Intl.DisplayNames` data. Bundled interface translations cover English, Spanish, French, German, Portuguese, Italian, Russian, Japanese, Chinese, Hindi, and Arabic. Other listed languages currently fall back to English; add a dictionary entry in `I18N` in `app.js` to extend translated UI coverage.
- AI panels for OpenAI and Gemini. Add your API keys in Settings, switch engines in the panel, and use the optional page-context toggle before asking for a summary. Chat history is kept in memory per provider for the current app session.
- Customizable browser shortcuts and a small starter list of ad/tracker hostnames.

## AI connections

The app makes AI requests from Electron's main process, not from a website renderer. OpenAI uses the Responses API with `gpt-4.1-mini`; Gemini uses `gemini-3.8-flash` and the `generateContent` endpoint. You need separate API credentials from each provider; a ChatGPT/Gemini consumer subscription is not an API key.

On macOS and Windows, credentials are encrypted at rest with Electron `safeStorage`. On Linux, Still refuses to persist credentials when Electron reports its unprotected `basic_text` backend; the key remains in memory for that app session. Credentials are not placed in browser `localStorage`. When you send a prompt, its text and (only if enabled) the extracted page text are sent to the selected provider over HTTPS.

## Scope and production follow-up

This is a runnable browser foundation, not a replacement for mature browsers. The ad-block switch uses a short built-in domain list rather than maintained filter lists. The language selector offers 190+ language tags, but complete translations are bundled for 11 locales. Before distributing a production browser, add signed installers/updates, a maintained ad filter source, permission and download UX, crash reporting, and a broader reviewed localization catalog.

Electron version 44 is selected for the current 2026-10-03 build. The app uses `WebContentsView` for site rendering and asynchronous `safeStorage` APIs for credentials.
