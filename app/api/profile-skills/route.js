// app/api/profile-skills/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { STRAPI_URL, AUTH_COOKIE } from "@/lib/strapi";

/** Small helpers */
function clampPct(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}
function err(msg, status = 400, detail = null) {
  return NextResponse.json({ ok: false, error: msg, detail }, { status });
}

/**
 * Create a new profile_skill row
 * Body: { developer_profile: number, skill: number, level?: number }
 */
export async function POST(req) {
  const token = cookies().get(AUTH_COOKIE)?.value;
  if (!token) return err("Unauthorized", 401);

  let body;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body");
  }

  const developer_profile = Number(body?.developer_profile);
  const skill = Number(body?.skill);
  const level = body?.level != null ? clampPct(body.level) : 0;

  if (!developer_profile || !skill) {
    return err("developer_profile and skill are required");
  }

  const payload = { data: { developer_profile, skill, level } };

  const res = await fetch(`${STRAPI_URL}/api/profile-skills`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      json?.error?.message ||
      json?.message ||
      (typeof json === "string" ? json : "Create failed");
    return err(msg, res.status, json);
  }

  return NextResponse.json({ ok: true, data: json?.data || null }, { status: 201 });
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
