// app/api/profile-skills/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const AUTH_COOKIE = process.env.AUTH_COOKIE || "jwt";

/* ---------- helpers ---------- */
function jsonOK(data, status = 200) {
  return NextResponse.json({ ok: true, data }, { status });
}
function jsonErr(message, status = 400, detail = null) {
  return NextResponse.json({ ok: false, error: message, detail }, { status });
}
function getToken() {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) throw new Error("Unauthorized");
  return token;
}
function clampPct(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

/**
 * Strapi v5: المسار /:id يستخدم documentId (UUID) وليس الـ id الرقمي.
 * هذه الدالة تقبل إما id رقمي أو documentId وتُرجِع documentId دائمًا.
 */
async function ensureDocumentId(input, token) {
  const val = String(input);
  // إذا لم يكن أرقامًا فقط -> نعتبره documentId جاهز
  if (!/^\d+$/.test(val)) return val;

  // لو أرقام فقط -> ابحث عن documentId من خلال id الرقمي
  const u = new URL(`${STRAPI_URL}/api/profile-skills`);
  u.searchParams.set("filters[id][$eq]", val);
  u.searchParams.set("fields[0]", "documentId");

  const r = await fetch(u.toString(), {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j?.error?.message || j?.message || "Resolve failed");

  const docId = j?.data?.[0]?.documentId;
  if (!docId) throw new Error("Not Found");
  return String(docId);
}

/* ---------------- PATCH (update) ----------------
   يقبل:
   { level: 0..100 } أو { skill: <id> } أو { data: {...} }
   ويرسل إلى Strapi بصيغة PUT + { data: ... } على documentId
-------------------------------------------------- */
export async function PATCH(req, { params }) {
  let token;
  try {
    token = getToken();
  } catch {
    return jsonErr("Unauthorized", 401);
  }

  let body = {};
  try { body = await req.json(); } catch {}

  // طبع البيانات بصيغة {data}
  const patch = { ...(body?.data || {}) };

  if (Object.prototype.hasOwnProperty.call(body, "level")) {
    patch.level = clampPct(body.level);
  } else if (Object.prototype.hasOwnProperty.call(patch, "level")) {
    patch.level = clampPct(patch.level);
  }

  if (Object.prototype.hasOwnProperty.call(body, "skill")) {
    patch.skill = Number(body.skill) || null;
  }

  if (!Object.keys(patch).length) {
    return jsonErr("Nothing to update");
  }

  let documentId;
  try {
    documentId = await ensureDocumentId(params.id, token);
  } catch (e) {
    const msg = e?.message || "Resolve id failed";
    const code = msg === "Not Found" ? 404 : 400;
    return jsonErr(msg, code);
  }

  const r = await fetch(`${STRAPI_URL}/api/profile-skills/${documentId}`, {
    method: "PUT", // IMPORTANT: Strapi update via PUT
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ data: patch }), // IMPORTANT: wrap into { data: ... }
    cache: "no-store",
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    return jsonErr(j?.error?.message || j?.message || "Update failed", r.status, j);
  }
  return jsonOK(j?.data ?? null, 200);
}

/* ---------------- DELETE ----------------
   يحذف عبر documentId (حتى لو مررت id رقمي)
-------------------------------------------------- */
export async function DELETE(_req, { params }) {
  let token;
  try {
    token = getToken();
  } catch {
    return jsonErr("Unauthorized", 401);
  }

  let documentId;
  try {
    documentId = await ensureDocumentId(params.id, token);
  } catch (e) {
    const msg = e?.message || "Resolve id failed";
    const code = msg === "Not Found" ? 404 : 400;
    return jsonErr(msg, code);
  }

  const r = await fetch(`${STRAPI_URL}/api/profile-skills/${documentId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const j = await r.json().catch(() => ({}));
  if (!r.ok) {
    return jsonErr(j?.error?.message || j?.message || "Delete failed", r.status, j);
  }
  return jsonOK(j?.data ?? null, 200);
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
