import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { upsertMyProfile } from "@/lib/strapi";

export async function POST(req) {
  const token = cookies().get("strapi_jwt")?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  try {
    const data = await upsertMyProfile(token, payload);
    return NextResponse.json({ data });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
