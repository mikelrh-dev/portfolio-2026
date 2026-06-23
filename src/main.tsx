import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { initI18n } from './i18n/config';
import './index.css';

// Bootstrap diagnostic
console.log('[BOOT] main.tsx start', new Date().toISOString());

// Catch any unhandled error or rejection and surface it on screen
function showFatal(msg: string, detail?: unknown): void {
  const pre = document.createElement('pre');
  pre.style.cssText =
    'position:fixed;inset:0;background:#1a0000;color:#ff8888;padding:2rem;font-family:monospace;font-size:13px;z-index:99999;overflow:auto;white-space:pre-wrap;margin:0;';
  let detailText = '';
  if (detail instanceof Error) {
    detailText = `${detail.name}: ${detail.message}\n${detail.stack || ''}`;
  } else if (detail !== undefined) {
    try {
      detailText = JSON.stringify(detail, Object.getOwnPropertyNames(detail as object), 2);
    } catch {
      detailText = String(detail);
    }
  }
  pre.textContent = `FATAL: ${msg}\n\n${detailText}`;
  document.body.appendChild(pre);
}

window.addEventListener('error', (e) => {
  console.error('[window.error]', e.error || e.message);
  showFatal(e.message, e.error);
});
window.addEventListener('unhandledrejection', (e) => {
  console.error('[unhandledrejection]', e.reason);
  showFatal('Unhandled Promise Rejection', e.reason);
});

try {
  initI18n();
  console.log('[BOOT] i18n initialized');
} catch (err) {
  console.error('[BOOT] i18n init failed', err);
  showFatal('i18n init failed', err);
  throw err;
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  showFatal('No #root element found in DOM');
} else {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
    console.log('[BOOT] React.render called');
  } catch (err) {
    console.error('[BOOT] React.render failed', err);
    showFatal('React.render failed', err);
  }
}
