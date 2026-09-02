/**
 * Image service — fetches photography dynamically instead of shipping
 * image files inside the repository.
 *
 * Famous places:  Wikipedia REST API (keyless, CORS-enabled) returns the
 *                 lead photo of the actual landmark — accurate by design.
 * Destinations:   Unsplash API when VITE_UNSPLASH_ACCESS_KEY is present;
 *                 otherwise the curated Unsplash-CDN cover from the dataset.
 *
 * Results are cached in sessionStorage and requests are lightly queued so
 * the same image is never fetched twice and we stay polite to the APIs.
 */

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const CACHE_PREFIX = 'wanderly:img:';

function readCache(key) {
  try {
    const raw = sessionStorage.getItem(CACHE_PREFIX + key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(key, value) {
  try {
    sessionStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    /* storage full / unavailable — caching is best-effort */
  }
}

/* Tiny queue: spaces requests ~120ms apart to avoid rate limiting */
let chain = Promise.resolve();
function enqueue(task) {
  const run = chain.then(task, task);
  chain = run.then(
    () => new Promise((r) => setTimeout(r, 120)),
    () => new Promise((r) => setTimeout(r, 120))
  );
  return run;
}

/**
 * Photo of a specific landmark via its Wikipedia article.
 * Returns { src, alt } or null when nothing is available.
 */
export async function getPlaceImage(wikiTitle) {
  const cached = readCache(wikiTitle);
  if (cached) return cached;

  return enqueue(async () => {
    const again = readCache(wikiTitle);
    if (again) return again;

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Wikipedia responded ${res.status}`);
    const data = await res.json();
    const thumb = data.thumbnail?.source;
    // SVGs here are logos/maps/coats of arms, not photography — skip them
    // so the caller can use its designed fallback instead.
    if (!thumb || /\.svg/i.test(thumb)) return null;

    // Wikimedia only serves fixed thumbnail widths (330 / 500 / 960 / 1280…).
    // Upgrade to the largest bucket that is still smaller than the original.
    const originalWidth = data.originalimage?.width ?? 0;
    const bucket = [960, 500].find((w) => originalWidth > w + 40);
    const src = bucket ? thumb.replace(/\/(\d+)px-/, `/${bucket}px-`) : thumb;

    const result = { src, alt: `${data.title} — photo from Wikipedia` };
    writeCache(wikiTitle, result);
    return result;
  });
}

/**
 * Optional upgrade: a fresh editorial photo for a destination from the
 * Unsplash API. Only used when an access key is configured.
 */
export async function getDestinationImage(query) {
  if (!UNSPLASH_KEY) return null;
  const cacheKey = `unsplash:${query}`;
  const cached = readCache(cacheKey);
  if (cached) return cached;

  const url =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' travel')}` +
    `&per_page=1&orientation=landscape&content_filter=high`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!res.ok) throw new Error(`Unsplash responded ${res.status}`);
  const data = await res.json();
  const photo = data.results?.[0];
  if (!photo) return null;

  const result = {
    src: `${photo.urls.raw}&auto=format&fit=crop&w=1600&q=75`,
    alt: photo.alt_description || query,
    credit: photo.user?.name ?? null,
  };
  writeCache(cacheKey, result);
  return result;
}
