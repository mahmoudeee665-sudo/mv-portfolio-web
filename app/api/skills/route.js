import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const AUTH_COOKIE = process.env.AUTH_COOKIE || "jwt";

export async function GET() {
  try {
    const token = cookies().get(AUTH_COOKIE)?.value || null;

    const u = new URL(`${STRAPI}/api/skills`);
    u.searchParams.set("sort", "name:asc");
    u.searchParams.set("fields[0]", "id");
    u.searchParams.set("fields[1]", "name");
    u.searchParams.set("fields[2]", "tag");
    // if you want icon in UI later:
    u.searchParams.set("populate[icon][fields][0]", "url");

    const r = await fetch(u.toString(), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });
    const j = await r.json().catch(() => ({}));

    if (!r.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: j?.error?.message || j?.message || "Failed to fetch skills",
        },
        { status: r.status }
      );
    }

    // Works for both Strapi v4 (attributes) and v5 (flat)
    const items = (j?.data || []).map((d) => {
      const a = d?.attributes ? d.attributes : d;

      // icon url (handles v4 and v5 shapes)
      const rawIconUrl =
        a?.icon?.data?.attributes?.url ?? // v4 populated
        a?.icon?.url ?? // v5 populated
        null;
      const iconUrl = rawIconUrl
        ? rawIconUrl.startsWith("http")
          ? rawIconUrl
          : `${STRAPI}${rawIconUrl}`
        : null;

      return {
        id: d.id ?? a.id,
        name: a?.name ?? a?.Name ?? "",
        tag: a?.tag ?? a?.Tag ?? "",
        iconUrl,
      };
    });

    return NextResponse.json({ ok: true, items }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e?.message || e) },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
