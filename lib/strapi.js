// lib/strapi.js

export const STRAPI_URL =
  (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");

export const AUTH_COOKIE = process.env.AUTH_COOKIE || "jwt";

/** Core fetch wrapper */
async function strapiFetch(path, { method = "GET", token, body } = {}) {
  const res = await fetch(`${STRAPI_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  let data = null;
  try { data = await res.json(); } catch { data = null; }

  if (!res.ok) {
    const msg = data?.error?.message || data?.message || res.statusText || "Strapi error";
    const err = new Error(msg);
    err.status = res.status;
    err.payload = data;
    throw err;
  }
  return data;
}

/* ---------------- AUTH ---------------- */
export async function strapiRegister({ username, email, password }) {
  return strapiFetch(`/api/auth/local/register`, {
    method: "POST",
    body: { username, email, password },
  });
}
export async function strapiLogin({ identifier, password }) {
  return strapiFetch(`/api/auth/local`, {
    method: "POST",
    body: { identifier, password },
  });
}
export async function strapiMe(token) {
  return strapiFetch(`/api/users/me?populate=*`, { token });
}

/* ---------------- PROFILE ---------------- */

/**
 * Build a URLSearchParams with safe media population:
 * - never use "*" for UploadFile (media) -> request specific fields only
 * - it avoids the forbidden "related" key and keeps previews working after refresh
 */
function addFields(params, baseKey, fields) {
  fields.forEach((f, idx) => {
    params.set(`${baseKey}[${idx}]`, f);
  });
}

export async function findMyProfile(token, userId) {
  const p = new URLSearchParams();

  // filter by owner
  p.set("filters[users_permissions_user][id][$eq]", String(userId));

  // simple relations / repeatables we can fully populate
  p.set("populate[Herosection]", "*");
  p.set("populate[socials]", "*");
  p.set("populate[profile_skills]", "*");
  p.set("populate[profile_skills][populate][skill]", "*");

  // About.avatar (MEDIA) -> request explicit fields (NO "*")
  addFields(p, "populate[About][populate][avatar][fields]", [
    "url",
    "formats",
    "alternativeText",
    "width",
    "height",
    "mime",
    "name",
    "size",
  ]);

  // Projects & media
  p.set("populate[projects]", "*");
  addFields(p, "populate[projects][populate][cover][fields]", [
    "url",
    "formats",
    "alternativeText",
    "width",
    "height",
    "mime",
    "name",
    "size",
  ]);
  addFields(p, "populate[projects][populate][gallery][fields]", [
    "url",
    "formats",
    "alternativeText",
    "width",
    "height",
    "mime",
    "name",
    "size",
  ]);

  // If your Skill model has a media "icon", fetch safe fields too
  addFields(p, "populate[profile_skills][populate][skill][populate][icon][fields]", [
    "url",
    "formats",
    "alternativeText",
    "width",
    "height",
    "mime",
    "name",
    "size",
  ]);

  const res = await strapiFetch(`/api/developer-profiles?${p.toString()}`, { token });
  const raw = res?.data?.[0];
  if (!raw) return null;

  // normalize → flat object
  return raw.attributes ? { id: raw.id, documentId: raw.documentId, ...raw.attributes } : raw;
}

/** Create a profile linked to user */
export async function createProfile(token, userId, payload) {
  const res = await strapiFetch(`/api/developer-profiles`, {
    method: "POST",
    token,
    body: {
      data: {
        ...payload,
        users_permissions_user: userId,
      },
    },
  });
  const raw = res?.data;
  return raw?.attributes ? { id: raw.id, documentId: raw.documentId, ...raw.attributes } : raw;
}

/**
 * Update profile (tries id first, then documentId if id 404s)
 * patch: partial fields, e.g. { About: { description, avatar: mediaId } }
 */
export async function updateProfile(token, profileKey, patch, documentId) {
  try {
    const res = await strapiFetch(`/api/developer-profiles/${profileKey}`, {
      method: "PUT",
      token,
      body: { data: patch },
    });
    const raw = res?.data;
    return raw?.attributes ? { id: raw.id, documentId: raw.documentId, ...raw.attributes } : raw;
  } catch (e) {
    if ((e.status === 404 || e.message === "Not Found") && documentId) {
      const res2 = await strapiFetch(`/api/developer-profiles/${documentId}`, {
        method: "PUT",
        token,
        body: { data: patch },
      });
      const raw2 = res2?.data;
      return raw2?.attributes ? { id: raw2.id, documentId: raw2.documentId, ...raw2.attributes } : raw2;
    }
    throw e;
  }
}

/** Convenience: update only YourName */
export async function updateProfileName(token, profileKey, YourName, documentId) {
  return updateProfile(token, profileKey, { YourName }, documentId);
}
