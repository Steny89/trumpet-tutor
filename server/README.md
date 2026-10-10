# Trumpet Coach Proxy

A tiny Cloudflare Worker that sits between the Trumpet Tutor app and Google's
Gemini API. The phone app sends the kid's question here; the worker adds the
tutor prompt, calls Gemini with the **server-side** API key, and returns the
answer. The key is never in the app, so anyone with the app can use the AI
coach without you sharing the key.

Free Cloudflare tier is plenty (100k requests/day).

## One-time setup

1. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up
   (no credit card needed).

2. **Install Wrangler** (the Cloudflare CLI) and log in:

   ```powershell
   npm.cmd install -g wrangler
   wrangler login
   ```

   (Use `npx wrangler` instead of `wrangler` if you skip the global install.)

3. **Store your Gemini API key as a secret** (never in code):

   ```powershell
   cd server
   wrangler secret put GEMINI_API_KEY
   ```

   Paste the key when prompted. Get/rotate one at
   https://aistudio.google.com/apikey

4. **(Optional) Add a shared password** so only your family's app can call it:

   ```powershell
   wrangler secret put PROXY_KEY
   ```

   Pick any random string. If you set this, put the same value in the app's
   `src/constants/coach.ts` as `COACH_PROXY_KEY`.

5. **Deploy:**

   ```powershell
   wrangler deploy
   ```

   You'll get a URL like `https://trumpet-coach-proxy.YOURNAME.workers.dev`.

6. **Point the app at it** — in the app's `src/constants/coach.ts`, set:

   ```ts
   export const COACH_PROXY_URL = "https://trumpet-coach-proxy.YOURNAME.workers.dev";
   ```

   Then push an app update (`eas update`). Done — the coach works for everyone
   with the app, no keys on any phone.

## Notes

- If `COACH_PROXY_URL` is left empty, the app falls back to the old behavior
  (Gemini key entered in Settings on each device).
- The worker rate-limits to 30 requests/minute per IP — plenty for family use
  and it protects your Gemini quota if the URL ever leaks.
- To update the worker later: edit `src/index.js`, run `wrangler deploy` again.
