// app/api/auth/login/route.js
import { NextResponse } from "next/server";
import { strapiLogin, strapiMe, findMyProfile, createProfile, AUTH_COOKIE } from "@/lib/strapi";

export async function POST(req) {
  try {
    const { identifier, password } = await req.json();
    const out = await strapiLogin({ identifier, password });
    const token = out?.jwt;
    if (!token) throw new Error("Invalid credentials");

    const me = await strapiMe(token);

    const existing = await findMyProfile(token, me.id);
    if (!existing) {
      const slugBase = (me.username || me.email || "user").toLowerCase().replace(/\s+/g, "-");
      await createProfile(token, me.id, {
        slug: slugBase,
        YourName: me.username || "",
        contactEmail: me.email || "",
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
