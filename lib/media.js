export const STRAPI_URL =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");

export function mediaUrl(u) {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u; // already absolute
  return `${STRAPI_URL}${u.startsWith("/") ? "" : "/"}${u}`;
}
// Accepts a Strapi v5 media object or a direct URL string and returns an absolute URL.
export function mediaAny(x) {
  if (!x) return null;
  if (typeof x === "string") return mediaUrl(x);
  const url = x?.data?.attributes?.url || x?.url || null;
  return url ? mediaUrl(url) : null;
}
