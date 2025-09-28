import { NextResponse } from "next/server";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ""; // optional

export async function GET() {
  const url = `${STRAPI}/api/hero-design-options?filters[active][$eq]=true&populate=thumbnail&pagination[pageSize]=100`;
  const res = await fetch(url, {
    headers: STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {},
    cache: "no-store",
  });
  if (!res.ok) {
    return NextResponse.json({ ok: false, error: "Failed to load hero designs" }, { status: res.status });
  }
  const data = await res.json();
  return NextResponse.json({ ok: true, data });
}
