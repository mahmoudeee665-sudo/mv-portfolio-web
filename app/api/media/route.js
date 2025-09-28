// app/api/media/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337").replace(/\/+$/, "");
const AUTH_COOKIE = process.env.AUTH_COOKIE || "jwt";

/**
 * GET /api/media?id=123
 * Response: { ok: true, url, file }
 */
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const token = cookies().get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = await fetch(`${STRAPI_URL}/api/upload/files/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message || res.statusText },
        { status: res.status }
      );
    }

    const rawUrl = data?.url || null;
    const url = rawUrl ? (rawUrl.startsWith("http") ? rawUrl : `${STRAPI_URL}${rawUrl}`) : null;

    return NextResponse.json({ ok: true, url, file: data });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e.message || "Media lookup failed" },
      { status: 400 }
    );
  }
}
