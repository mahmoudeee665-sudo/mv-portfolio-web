// app/u/[slug]/page.jsx
export const dynamic = "force-dynamic";

import { STRAPI_URL, mediaUrl } from "@/lib/media";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CustomCursor from "@/components/CustomCursor";
import AboutSection from "@/components/AboutSection";
import ProjectsShowcase from "@/components/ProjectsShowcase";
import ContactSection from "@/components/ContactSection";
import SkillsSection from "@/components/SkillsSection";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";
import ScrollBoot from "@/components/ScrollBoot";

/* ----------------------------- utils ----------------------------- */
function clampPct(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

/* ------------------------ Strapi v5 fetchers ---------------------- */
// NOTE: We now populate profile_skills (skill + icon) here, so we DO NOT call any separate skills endpoint.
async function fetchProfile(slug) {
  const q =
    `?filters[slug][$eq]=${encodeURIComponent(slug)}` +
    `&populate[Herosection]=*` +
    `&populate[About][populate][avatar][fields][0]=url` +
    `&populate[About][populate][avatar][fields][1]=formats` +
    `&populate[projects][populate][cover][fields][0]=url` +
    `&populate[projects][populate][cover][fields][1]=formats` +
    `&populate[projects][populate][gallery][fields][0]=url` +
    `&populate[projects][populate][gallery][fields][1]=formats` +
    `&populate[socials]=*` +
    // 👇 add skills like the dashboard does
    `&populate[profile_skills][fields][0]=level` +
    `&populate[profile_skills][populate][skill][fields][0]=name` +
    `&populate[profile_skills][populate][skill][fields][1]=tag` +
    `&populate[profile_skills][populate][skill][fields][2]=color` +
    `&populate[profile_skills][populate][skill][populate][icon][fields][0]=url` +
    `&populate[profile_skills][populate][skill][populate][icon][fields][1]=formats`;

  const res = await fetch(`${STRAPI_URL}/api/developer-profiles${q}`, { cache: "no-store" });
  if (!res.ok) return null;
  const js = await res.json();
  return js?.data?.[0] ?? null;
}

/* ----------------------------- mappers ---------------------------- */
function mapProjects(profile) {
  const list = profile?.projects || [];
  return list.map((p, i) => {
    const coverRel =
      p?.cover?.formats?.medium?.url ||
      p?.cover?.url ||
      null;

    const galleryRel = Array.isArray(p?.gallery) ? p.gallery : [];
    const gallery = galleryRel
      .map((g) => g?.formats?.medium?.url || g?.url || null)
      .filter(Boolean);

    return {
      id: p?.id ?? i,
      title: p?.title || "Untitled Project",
      cover: mediaUrl(coverRel) ?? null,
      gallery: gallery.map((u) => mediaUrl(u)).filter(Boolean),
      description: p?.description || "",
      liveUrl: p?.liveUrl || "",
      repoUrl: p?.repoUrl || "",
    };
  });
}

// 🔁 Build skills EXACTLY like the dashboard: from profile.profile_skills
function buildSkillsFromProfile(profile) {
  const rows = Array.isArray(profile?.profile_skills) ? profile.profile_skills : [];

  return rows
    .map((ps) => {
      const lvl = clampPct(ps?.level);
      const s = ps?.skill || {};
      const iconRaw =
        s?.icon?.formats?.thumbnail?.url ||
        s?.icon?.url ||
        null;

      return {
        // SkillsSection expects flat fields: name, level, color?, tag?, iconUrl?
        name: s?.name || "Skill",
        level: lvl,
        color: s?.color ?? null, // keep from Strapi if present
        tag: s?.tag ?? null,
        iconUrl: mediaUrl(iconRaw),
      };
    })
    .sort((a, b) => b.level - a.level);
}

/* ------------------------------- Page ------------------------------ */
export default async function UserPortfolioPage({ params }) {
  const { slug } = await params;

  const profile = await fetchProfile(slug);
  if (!profile) {
    return (
      <main className="p-6 space-y-3">
        <p className="text-lg font-semibold">Portfolio not found.</p>
        <p className="text-sm text-neutral-400">
          Make sure the developer profile with slug{" "}
          <code className="font-mono">{slug}</code> is published and the Public
          role has <code>find</code> access.
        </p>
      </main>
    );
  }

  // Brand / socials / email
  const brand = profile.YourName || profile.fullName || "Portfolio";
  const socials = (profile.socials || []).map((c) => ({
    provider: c?.provider,
    url: c?.url,
  }));
  const primaryEmail = profile.contactEmail || "";

  // Hero
  const heroArr = profile.Herosection || profile.herosection || profile.heroSection || [];
  const heroRaw = Array.isArray(heroArr) ? heroArr[0] : heroArr || null;
  const hero = heroRaw || {};
  const heroTitle = hero?.heroTitle ?? profile.heroTitle ?? "Building Fast";
  const heroSubtitle = hero?.heroSubtitle ?? profile.heroSubtitle ?? "Reliable Results";
  const heroDescription = hero?.heroDescription ?? profile.heroDescription ?? profile.bio ?? "";
  const heroDesign = hero?.heroDesign || "magic_ball";

  // About
  const about = profile.About || profile.about || {};
  const aboutDescription = about?.description ?? about?.aboutDescription ?? profile.bio ?? "";
  const aboutAvatarUrl = mediaUrl(
    about?.avatar?.formats?.medium?.url || about?.avatar?.url || null
  );

  // Projects
  const projects = mapProjects(profile);

  // ✅ Skills from the same relation used in dashboard:
  const skills = buildSkillsFromProfile(profile);

  return (
    <main>
      <ScrollBoot />

      <Header brand={brand} contacts={socials} primaryEmail={primaryEmail} />

      <HeroSection
        title={heroTitle}
        subtitle={heroSubtitle}
        description={heroDescription}
        designKey={heroDesign}
      />

      <CustomCursor />

      <AboutSection avatar={aboutAvatarUrl} description={aboutDescription} />

      <ProjectsShowcase projects={projects} />

      <ContactSection name={brand} description={aboutDescription} />

      <SkillsSection
        title="Skills"
        subtitle="Gooey Nebula — liquid, living UI"
        skills={skills} // [{ name, level, iconUrl, color, tag }]
      />

      <Footer name={brand} description={aboutDescription} contacts={socials} />
      <ProgressBar />
    </main>
  );
}
