// app/api/profile/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  AUTH_COOKIE,
  strapiMe,
  findMyProfile,
  createProfile,
  updateProfile,
} from "@/lib/strapi";

async function ensureProfile(token, me) {
  let profile = await findMyProfile(token, me.id);
  if (!profile) {
    const slug = (me.username || me.email || "user").toLowerCase().replace(/\s+/g, "-");
    await createProfile(token, me.id, {
      slug,
      YourName: me.username || "",
      contactEmail: me.email || "",
      headline: "",
    });
    profile = await findMyProfile(token, me.id);
  }
  return profile;
}

export async function GET() {
  try {
    const token = cookies().get(AUTH_COOKIE)?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const me = await strapiMe(token);
    const profile = await ensureProfile(token, me);

    return NextResponse.json({ ok: true, me, profile });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

export async function POST(req) {
  try {
    const token = cookies().get(AUTH_COOKIE)?.value;
    if (!token) return NextResponse.json({ ok: false }, { status: 401 });

    const patch = await req.json();
    const me = await strapiMe(token);
    const profile = await ensureProfile(token, me);

    await updateProfile(token, profile.id, patch, profile.documentId);

    // Return freshly *populated* profile so all media has URLs
    const refreshed = await findMyProfile(token, me.id);
    return NextResponse.json({ ok: true, profile: refreshed });
  } catch (e) {
    const status = e.status && Number.isInteger(e.status) ? e.status : 400;
    return NextResponse.json(
      { ok: false, error: e.message || "Update failed", detail: e.payload || null },
      { status }
    );
  }
}

export async function PUT(req) {
  return POST(req);
}
