// Centralized fatal-error reporting surface.
//
// Dev-only by design: in production builds the overlay never renders.
// Global handlers still report via console.error so diagnostics are not
// lost, and the React ErrorBoundary remains the sole user-facing error
// surface (audit findings R1-001 / R1-002).

/** Pure gate decision, kept injectable so it is trivially unit-testable. */
export function shouldShowFatalOverlay(isDev: boolean): boolean {
  return isDev;
}

let overlayEl: HTMLPreElement | null = null;

function formatDetail(detail?: unknown): string {
  if (detail instanceof Error) {
    return `${detail.name}: ${detail.message}\n${detail.stack || ""}`;
  }
  if (detail !== undefined) {
    try {
      return JSON.stringify(
        detail,
        Object.getOwnPropertyNames(detail as object),
        2,
      );
    } catch {
      return String(detail);
    }
  }
  return "";
}

/**
 * Renders (or updates) the fullscreen fatal-error overlay.
 * Reuses a single node: repeated events update the overlay instead of
 * stacking new ones, so the UI can never accumulate debug layers.
 */
export function showFatal(msg: string, detail?: unknown): void {
  if (!shouldShowFatalOverlay(import.meta.env.DEV)) return;

  if (!overlayEl || !overlayEl.isConnected) {
    overlayEl = document.createElement("pre");
    overlayEl.style.cssText =
      "position:fixed;inset:0;background:#1a0000;color:#ff8888;padding:2rem;font-family:monospace;font-size:13px;z-index:99999;overflow:auto;white-space:pre-wrap;margin:0;";
    document.body.appendChild(overlayEl);
  }

  overlayEl.textContent = `FATAL: ${msg}\n\n${formatDetail(detail)}`;
}
