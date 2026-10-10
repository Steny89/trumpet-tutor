/**
 * AI Coach connection settings.
 *
 * Preferred: deploy the proxy in `server/` (see server/README.md) and put its
 * URL here. The app then talks to your proxy, which holds the Gemini API key
 * server-side — no key needed on any phone.
 *
 * If empty, the coach reports it isn't connected (Settings → App Updates
 * can verify the build, but the proxy URL must be set for the coach).
 */
export const COACH_PROXY_URL =
  "https://trumpet-coach-proxy.jesse030117.workers.dev";

/** Optional shared secret — must match the worker's PROXY_KEY secret, if set. */
export const COACH_PROXY_KEY = "";
