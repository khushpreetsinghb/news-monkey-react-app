// Vercel serverless function: proxies GNews so the browser never calls it
// directly (GNews free plan blocks cross-origin browser requests).
// The API key stays server-side in GNEWS_API_KEY — never shipped to the client.

const ALLOWED_ENDPOINTS = new Set(["top-headlines", "search"]);
const ALLOWED_CATEGORIES = new Set([
  "general",
  "world",
  "nation",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
]);

const clamp = (value, fallback, min, max) => {
  const n = parseInt(value, 10);
  if (Number.isNaN(n)) return fallback;
  return Math.min(Math.max(n, min), max);
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const key = process.env.GNEWS_API_KEY;
  if (!key) {
    return res.status(500).json({
      error: "Server API key not configured. Add GNEWS_API_KEY in Vercel environment variables and redeploy.",
    });
  }

  const params = req.query || {};
  const endpoint = String(params.endpoint || "top-headlines");
  const country = String(params.country || "us").slice(0, 8);
  const lang = String(params.lang || "en").slice(0, 8);
  const max = clamp(params.max, 10, 1, 10);
  const page = clamp(params.page, 1, 1, 10);

  let url;
  if (endpoint === "search") {
    const term = String(params.q || "").trim().slice(0, 100);
    if (!term) return res.status(400).json({ error: "Missing search query" });
    url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(term)}&lang=en&country=${country}&max=${max}&page=${page}&apikey=${key}`;
  } else if (endpoint === "top-headlines") {
    const category = String(params.category || "general");
    if (!ALLOWED_CATEGORIES.has(category)) return res.status(400).json({ error: "Invalid category" });
    url = `https://gnews.io/api/v4/top-headlines?category=${category}&country=${country}&lang=${lang}&max=${max}&page=${page}&apikey=${key}`;
  } else {
    return res.status(400).json({ error: "Invalid endpoint" });
  }

  try {
    const upstream = await fetch(url);
    const data = await upstream.json().catch(() => ({}));
    if (!upstream.ok) {
      const message = Array.isArray(data.errors) ? data.errors.join(", ") : `GNews request failed: ${upstream.status}`;
      return res.status(upstream.status).json({ error: message });
    }
    if (Array.isArray(data.errors)) {
      return res.status(429).json({ error: data.errors.join(", ") });
    }
    // Cache at the edge for 10 min: repeat visitors don't burn the 100 req/day quota
    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch {
    return res.status(502).json({ error: "Could not reach the news service. Please retry." });
  }
}
