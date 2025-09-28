// app/api/auth/register/route.js
import { NextResponse } from "next/server";
import {
  strapiRegister, strapiMe, findMyProfile, createProfile,
  AUTH_COOKIE
} from "@/lib/strapi";

export async function POST(req) {
  try {
    const { username, email, password } = await req.json();

    const reg = await strapiRegister({ username, email, password });
    const token = reg?.jwt;
    if (!token) throw new Error("No JWT returned from Strapi");

    const me = await strapiMe(token);

    const existing = await findMyProfile(token, me.id);
    if (!existing) {
      const slug = (username || email).toLowerCase().replace(/\s+/g, "-");
      await createProfile(token, me.id, {
        slug,
        YourName: username || "",
        contactEmail: me.email || email || "",
        headline: "",
      });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
    return res;
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}
