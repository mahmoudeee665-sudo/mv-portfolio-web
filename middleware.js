// middleware.js
import { NextResponse } from "next/server";

const AUTH_COOKIE = process.env.AUTH_COOKIE || "jwt";
const PROTECTED = ["/dashboard"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  if (PROTECTED.some((p) => pathname.startsWith(p))) {
    const has = req.cookies.get(AUTH_COOKIE)?.value;
    if (!has) {
      const url = new URL("/login", req.url);
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
