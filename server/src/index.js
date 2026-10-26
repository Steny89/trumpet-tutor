/**
 * Trumpet Tutor — AI Coach proxy (Cloudflare Worker)
 *
 * The phone app calls POST /coach with { "message": "..." }.
 * This worker adds the trumpet-tutor system prompt, calls Gemini with the
 * server-side API key, and returns { "reply": "..." }.
 *
 * The Gemini key is NEVER in this code — set it as a Worker secret:
 *   wrangler secret put GEMINI_API_KEY
 *
 * Optional shared secret to restrict who can call the proxy:
 *   wrangler secret put PROXY_KEY
 * If PROXY_KEY is set, callers must send header: x-proxy-key: <value>
 */

const MODEL = "gemini-3.6-flash";

const SYSTEM_PROMPT = `You are a friendly expert trumpet tutor inside the Trumpet Tutor practice app.
Answer questions about trumpet technique (embouchure, breathing, tonguing, articulation),
valve combinations and fingerings, practice routines, trumpet maintenance, and music
theory for trumpet players. Keep answers short (2-4 sentences), encouraging, and
practical. If asked about something unrelated to trumpet or music, briefly redirect
the conversation back to trumpet topics.`;

// --- simple per-IP rate limiting (per isolate, good enough for family use) ---
const hits = new Map();
function isRateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const recent = (hits.get(ip) || []).filter((t) => t > windowStart);
  recent.push(now);
  // occasional cleanup so the map doesn't grow forever
  if (hits.size > 5000) hits.clear();
  hits.set(ip, recent);
  return recent.length > 30; // 30 requests/minute per IP
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-proxy-key",
};

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || !url.pathname.endsWith("/coach")) {
      return new Response("Not found", { status: 404, headers: corsHeaders });
    }

    if (!env.GEMINI_API_KEY) {
      return json({ error: "Server is not configured yet." }, 500);
    }

    const ip = request.headers.get("cf-connecting-ip") || "unknown";
    if (isRateLimited(ip)) {
      return json({ error: "Too many requests — slow down a little." }, 429);
    }

    if (env.PROXY_KEY) {
      const got = request.headers.get("x-proxy-key") || "";
      if (got !== env.PROXY_KEY) {
        return json({ error: "Unauthorized." }, 401);
      }
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "Bad request." }, 400);
    }
    const message = (body.message || "").toString().slice(0, 2000).trim();
    if (!message) {
      return json({ error: "Empty message." }, 400);
    }

    let geminiRes;
    try {
      geminiRes = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: message }] }],
            generationConfig: { maxOutputTokens: 180, temperature: 0.7 },
          }),
        },
      );
    } catch {
      return json({ error: "Couldn't reach the AI coach." }, 502);
    }

    if (!geminiRes.ok) {
      return json({ error: "The coach is having trouble right now." }, 502);
    }

    let data;
    try {
      data = await geminiRes.json();
    } catch {
      return json({ error: "The coach gave a garbled answer." }, 502);
    }
    const parts = data?.candidates?.[0]?.content?.parts;
    const reply =
      Array.isArray(parts) && parts.length > 0
        ? parts.map((p) => p.text ?? "").join("")
        : "";
    return json({ reply: reply.trim() });
  },
};
