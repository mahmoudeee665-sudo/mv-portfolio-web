import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "@/lib/strapi";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
