/**
 * Cloudflare Pages Function: GET /api/reviews
 *
 * Returns { rating, count } for the business's Google profile, cached at
 * Cloudflare's edge so the Places API is called at most once per CACHE_TTL,
 * not once per visitor. Requires two secrets set in the Cloudflare Pages
 * dashboard (Settings -> Environment variables), never committed to the repo:
 *
 *   GOOGLE_PLACES_API_KEY   an API key with the Places API (New) enabled
 *   GOOGLE_PLACE_ID         this business's Place ID (see setup notes below)
 *
 * On any failure (missing key, API error, rate limit) this returns a 200
 * with a null rating rather than an error, so the page's static fallback
 * text is left in place instead of showing something broken.
 */

const CACHE_TTL_SECONDS = 24 * 60 * 60; // 24 hours: fresh enough to matter,
                                          // far below Google's re-request limits

export async function onRequestGet(context) {
  const { env } = context;
  const cache = caches.default;
  const cacheKey = new Request("https://internal/api/reviews-cache", context.request);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const fallback = jsonResponse({ rating: null, count: null }, 200);

  if (!env.GOOGLE_PLACES_API_KEY || !env.GOOGLE_PLACE_ID) {
    return fallback;
  }

  try {
    const url = `https://places.googleapis.com/v1/places/${env.GOOGLE_PLACE_ID}` +
                `?fields=rating,userRatingCount`;
    const res = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": env.GOOGLE_PLACES_API_KEY,
        "X-Goog-FieldMask": "rating,userRatingCount",
      },
    });

    if (!res.ok) return fallback;

    const data = await res.json();
    const body = {
      rating: typeof data.rating === "number" ? data.rating : null,
      count: typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    };

    const response = jsonResponse(body, 200, CACHE_TTL_SECONDS);
    context.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (err) {
    return fallback;
  }
}

function jsonResponse(body, status, cacheSeconds) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };
  if (cacheSeconds) {
    headers["Cache-Control"] = `public, max-age=${cacheSeconds}`;
  }
  return new Response(JSON.stringify(body), { status, headers });
}
