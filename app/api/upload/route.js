// app/api/upload/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE, STRAPI_URL } from "@/lib/strapi";

export async function POST(req) {
  try {
    const token = cookies().get(AUTH_COOKIE)?.value;
    if (!token) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData(); // contains "files"

    const res = await fetch(`${STRAPI_URL}/api/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return NextResponse.json(
        { ok: false, error: data?.error?.message || "Upload failed" },
        { status: res.status }
      );
    }

    return NextResponse.json({ ok: true, files: data });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message || "Upload error" }, { status: 400 });
  }
}
