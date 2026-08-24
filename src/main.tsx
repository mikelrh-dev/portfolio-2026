import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { initI18n } from "./i18n/config";
import { showFatal } from "./lib/errorOverlay";
import "./index.css";

// Global handlers report every unhandled error/rejection. The fullscreen
// debug overlay only renders in dev (see src/lib/errorOverlay.ts); in
// production the ErrorBoundary is the sole user-facing error surface.
window.addEventListener("error", (e) => {
  console.error("[window.error]", e.error || e.message);
  showFatal(e.message, e.error);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[unhandledrejection]", e.reason);
  showFatal("Unhandled Promise Rejection", e.reason);
});

try {
  initI18n();
} catch (err) {
  console.error("[bootstrap] i18n init failed", err);
  throw err;
}

const rootEl = document.getElementById("root");
if (rootEl) {
  try {
    ReactDOM.createRoot(rootEl).render(
      <React.StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </React.StrictMode>,
    );
  } catch (err) {
    console.error("[bootstrap] React.render failed", err);
    showFatal("React.render failed", err);
  }
} else {
  showFatal("No #root element found in DOM");
  console.error("[bootstrap] No #root element found in DOM");
}
