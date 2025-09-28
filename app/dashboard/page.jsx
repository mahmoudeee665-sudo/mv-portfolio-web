// app/dashboard/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mediaAny } from "@/lib/media";


/* =============================== NEW UI KIT =============================== */
function Shell({ children }) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-50 text-zinc-900 dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 dark:text-zinc-100">
      <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
    </main>
  );
}

function Topbar({ left, right }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200/70 bg-white/80 px-5 py-4 shadow-lg shadow-zinc-900/5 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/70">
      <div className="flex items-center gap-3">{left}</div>
      <div className="flex items-center gap-2 sm:gap-3">{right}</div>
    </div>
  );
}

const H1 = ({ children, sub }) => (
  <div>
    <h1 className="text-[22px] font-bold tracking-tight">{children}</h1>
    {sub ? <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{sub}</p> : null}
  </div>
);

function Pane({ children, title, sub, footer, className = "" }) {
  return (
    <section className={`rounded-2xl border border-zinc-200/70 bg-white/90 p-6 shadow-md shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/70 ${className}`}>
      {(title || sub) && (
        <div className="mb-5">
          {title ? <h2 className="text-[18px] font-semibold">{title}</h2> : null}
          {sub ? <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{sub}</p> : null}
        </div>
      )}
      {children}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </section>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`h-12 w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 ${props.className || ""}`}
    />
  );
}

function Textarea(props) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-zinc-300/90 bg-white px-3.5 py-3 text-[15px] outline-none transition placeholder:text-zinc-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 dark:focus:border-indigo-400 ${props.className || ""}`}
    />
  );
}

function Button({ children, variant = "primary", className = "", type = "button", ...rest }) {
  const styles =
    variant === "primary"
      ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
      : variant === "ghost"
      ? "bg-transparent text-zinc-700 hover:bg-zinc-100 active:bg-zinc-200 dark:text-zinc-200 dark:hover:bg-zinc-800/70"
      : "bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100";
  return (
    <button type={type} {...rest} className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${styles} ${className}`}>
      {children}
    </button>
  );
}

function Sidebar({ tabs, current, onChange }) {
  return (
    <aside className="sticky top-4 h-fit w-full rounded-2xl border border-zinc-200/70 bg-white/90 p-4 shadow-md shadow-zinc-900/5 backdrop-blur-sm dark:border-zinc-800/60 dark:bg-zinc-900/70 lg:w-80">
      <div className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Sections</div>
      <nav className="flex flex-col">
        {tabs.map((t) => {
          const active = current === t.key;
          return (
            <button
              key={t.key}
              onClick={() => onChange(t.key)}
              className={`mb-2 flex items-center justify-between rounded-xl px-4 py-[10px] text-sm transition ${
                active
                  ? "border border-zinc-200 bg-zinc-50 font-medium text-zinc-900 shadow-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/60"
              }`}
            >
              <span className="truncate">{t.title}</span>
              {active ? (
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 shadow-[0_0_12px] shadow-indigo-500/60" />
              ) : (
                <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

/* ------------------------------ Small helpers ------------------------------ */
function Callout({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border border-indigo-200 bg-indigo-50 p-4 shadow-sm dark:border-indigo-800 dark:bg-indigo-900/20 ${className}`}>{children}</div>
  );
}

/* ---------- Pretty Upload Button (green) ---------- */
function UploadButton({
  label = "Upload file",
  hint,
  multiple = false,
  accept = "image/*",
  onChange,
  className = "",
  buttonClassName = "",
  id: givenId,
}) {
  const id = useMemo(() => givenId || `up_${Math.random().toString(36).slice(2)}`, [givenId]);
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <label
        htmlFor={id}
        className={`inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition
        bg-emerald-600 text-white hover:bg-emerald-700 active:translate-y-[1px] focus:outline-none focus:ring-2 focus:ring-emerald-500/30
        dark:bg-emerald-600 dark:hover:bg-emerald-500 ${buttonClassName}`}
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 opacity-90" fill="currentColor">
          <path d="M12 3a1 1 0 0 1 1 1v7h3.5a1 1 0 0 1 .78 1.63l-5.5 6.5a1 1 0 0 1-1.56 0l-5.5-6.5A1 1 0 0 1 5.5 11H9V4a1 1 0 0 1 1-1h2z" />
        </svg>
        <span>{label}</span>
      </label>
      <input id={id} type="file" className="sr-only" accept={accept} multiple={multiple} onChange={onChange} aria-label={label} />
      {hint ? <span className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</span> : null}
    </div>
  );
}

/* --------------------------------- HELPERS -------------------------------- */
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
const mediaUrl = (m) => {
  const d = m?.data ?? m;
  const u = d?.attributes?.url || d?.url;
  if (!u) return null;
  return u.startsWith("http") ? u : `${STRAPI}${u}`;
};
const coerceId = (v) => v?.id ?? v?.data?.id ?? (typeof v === "number" ? v : null);

/* ================================== PAGE ================================== */
export default function DashboardPage() {
  const router = useRouter();

  // DATA
  const [me, setMe] = useState(null);
  const [profile, setProfile] = useState(null); // {id, ...attrs}

  // basics
  const [yourName, setYourName] = useState("");
  const [slug, setSlug] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [socials, setSocials] = useState([]);
  const FALLBACK_PROVIDER_ENUM = ["github", "instagram", "linkedin", "facebook", "x", "youtube", "website"];
  const [providerOptions, setProviderOptions] = useState(FALLBACK_PROVIDER_ENUM);

  // hero
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [heroDesign, setHeroDesign] = useState("magic_ball");

  // hero options (from Strapi)
  const [heroOptionsFromApi, setHeroOptionsFromApi] = useState(null);

  // about
  const [aboutDescription, setAboutDescription] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarMediaId, setAvatarMediaId] = useState(null);

  // projects
  const [projects, setProjects] = useState([]);
  const [coverPreviewCache, setCoverPreviewCache] = useState({}); // id -> blob url

  // skills (read from profile.profile_skills)
  const [skills, setSkills] = useState([]);
  // skills editor
  const [allSkills, setAllSkills] = useState([]); // dropdown options
  const [newSkillId, setNewSkillId] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState("");
const [skillsLoading, setSkillsLoading] = useState(false);
const [skillsError, setSkillsError] = useState(null);


  // ui
  const [tab, setTab] = useState("basics");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // ---- pending changes state (batch mode) ----
const [pending, setPending] = useState({
  updates: new Map(),      // id -> { level?, skill? }
  deletes: new Set(),      // ids to delete
  creates: [],             // [{ tempId, skill, level }]
});

const [saving, setSaving] = useState(false);


  const aboutAvatarUrl = useMemo(() => {
    if (avatarPreview) return avatarPreview;
    return mediaUrl(profile?.About?.avatar);
  }, [profile, avatarPreview]);

  async function load() {
    setLoading(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/profile", { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/login");
        return;
      }
      const j = await res.json();

      // keep id + attributes
      const prof = j.profile?.data
        ? { id: j.profile.data.id, ...(j.profile.data.attributes || {}) }
        : j.profile || null;

      setMe(j.me || null);
      setProfile(prof || null);

      // basics
      setYourName(prof?.YourName || "");
      setSlug(prof?.slug || "");
      setContactEmail(prof?.contactEmail || "");
      const socialsArr = Array.isArray(prof?.socials) ? prof.socials : [];
      setSocials(socialsArr);

      // provider options (optional)
      try {
        const pres = await fetch("/api/social-providers", { cache: "no-store" });
        if (pres.ok) {
          const pj = await pres.json().catch(() => ({}));
          const fromApi = Array.isArray(pj) ? pj : Array.isArray(pj?.providers) ? pj.providers : [];
          const normalized = fromApi
            .map((x) => (typeof x === "string" ? x : x?.name))
            .filter(Boolean)
            .map((x) => x.toLowerCase().trim());
          if (normalized.length) setProviderOptions(normalized);
        }
      } catch {}

      // hero (values)
      const h = (Array.isArray(prof?.Herosection) ? prof.Herosection : [])[0] || {};
      setHeroTitle(h?.heroTitle || "");
      setHeroSubtitle(h?.heroSubtitle || "");
      setHeroDescription(h?.heroDescription || "");
      if (typeof h?.heroDesign === "string") setHeroDesign(h.heroDesign);

      // about
      setAboutDescription(prof?.About?.description || "");
      setAvatarMediaId(coerceId(prof?.About?.avatar) || null);
      setAvatarPreview(null);

      // projects
      const rawProjects = Array.isArray(prof?.projects) ? prof.projects : [];
      const built = await Promise.all(
        rawProjects.map(async (p) => {
          const coverId = coerceId(p?.cover) || null;
          let coverUrl = mediaUrl(p?.cover) || null;

          if (!coverUrl && coverId) {
            coverUrl = coverPreviewCache[coverId] || null;
            if (!coverUrl) coverUrl = await fetchMediaUrlById(coverId);
          }

          const gallery = Array.isArray(p?.gallery) ? p.gallery : [];
          const galleryIds = gallery.map(coerceId).filter(Boolean);
          const galleryUrls = gallery.map(mediaUrl).filter(Boolean);

          return {
            title: p?.title || "",
            description: p?.description || "",
            liveUrl: p?.liveUrl || "",
            repoUrl: p?.repoUrl || "",
            coverId,
            coverUrl: coverUrl || null,
            galleryIds,
            galleryUrls,
          };
        })
      );
      setProjects(built);

      // skills (strictly from the profile relation)
      const rows = Array.isArray(prof?.profile_skills) ? prof.profile_skills : [];
      setSkills(
        rows.map((ps) => {
          const skillNode = ps?.skill || {};
          const icon = skillNode?.icon || null;
          return {
            id: ps?.id ?? null, // profile-skill row id
            level: typeof ps?.level === "number" ? ps.level : 0,
            skill: {
              id: skillNode?.id ?? skillNode?.data?.id ?? null,
              name: skillNode?.name || "Skill",
              tag: skillNode?.tag || "",
              iconUrl: icon ? (icon?.url?.startsWith("http") ? icon.url : `${STRAPI}${icon.url}`) : null,
            },
          };
        })
      );

      // options for the dropdown
try {
  const r2 = await fetch("/api/skills", { cache: "no-store" });
  const j2 = await r2.json().catch(() => ({}));
  const items = r2.ok && j2?.ok ? j2.items || [] : [];

  if (items.length) {
    setAllSkills(items); // ← full collection from Strapi
  } else {
    // fallback: only if API returns nothing
    const fallback = rows
      .map((ps) => ps?.skill)
      .filter(Boolean)
      .map((s) => ({
        id: s?.id ?? s?.data?.id ?? null,
        name: s?.name || "Skill",
        tag: s?.tag || "",
      }))
      .filter((s) => s.id);
    setAllSkills(fallback);
  }
} catch {
  setAllSkills([]);
}

    } catch (e) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  // fetch hero design options (thumbnails) from Strapi via our proxy
// fetch hero design options (thumbnails) from Strapi via our proxy
async function loadHeroOptions() {
  try {
    const res = await fetch("/api/hero-designs", { cache: "no-store" });
    const j = await res.json();
    if (!res.ok || j?.ok === false) throw new Error(j?.error || "Failed hero options");

    // Works for Strapi v4 (data.data) and v5 (data)
    const records = Array.isArray(j?.data) ? j.data : (Array.isArray(j?.data?.data) ? j.data.data : []);

    const allowed = new Set(["magic_ball", "robot"]);

    const opts = records
      .map((item) => (item?.attributes ? { ...item.attributes, id: item.id } : item || {}))
      .map((a) => {
        const key = (a?.key || "").trim();
        const label = a?.label || key || "Hero";

        // Try multiple possible locations for the image URL (v4/v5 + formats)
        const candidates = [
          a?.thumbnail?.url,                                      // v5 populated
          a?.thumbnail?.formats?.thumbnail?.url,                  // v5 formats
          a?.thumbnail?.data?.attributes?.url,                    // v4 populated
          a?.thumbnail?.data?.attributes?.formats?.thumbnail?.url // v4 formats
        ].filter(Boolean);

        let raw = candidates[0] || null;
        let thumb = raw ? (raw.startsWith("http") ? raw : `${STRAPI}${raw}`) : null;

        // Hard fallback to local static assets
        if (!thumb && key === "magic_ball") thumb = "/hero/magic_ball.png";
        if (!thumb && key === "robot") thumb = "/hero/robot.png";

        return { key, label, thumb };
      })
      .filter((o) => o.key && allowed.has(o.key) && o.thumb);

    setHeroOptionsFromApi(opts);
  } catch (e) {
    console.warn(e);
  }
}


  useEffect(() => {
    load();
    loadHeroOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep current heroDesign valid
  useEffect(() => {
    if (heroOptionsFromApi && heroOptionsFromApi.length) {
      if (!heroOptionsFromApi.some((o) => o.key === heroDesign)) {
        setHeroDesign(heroOptionsFromApi[0].key);
      }
    }
  }, [heroOptionsFromApi]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchMediaUrlById(id) {
    const res = await fetch(`/api/media?id=${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const j = await res.json().catch(() => ({}));
    return j?.ok ? j.url || null : null;
  }

  async function savePatch(patch, okText = "Saved ✅") {
    setBusy(true);
    setMsg("");
    setErr("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.ok === false) {
        setErr(j?.error || "Save failed");
        return;
      }
      setMsg(okText);
      await load();
    } catch (e) {
      setErr(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }

  /* ------------------------------ BASICS ------------------------------ */
  function addSocial() {
    setSocials((prev) => [...prev, { provider: providerOptions?.[0] || "", url: "" }]);
  }
  function updateSocial(i, key, value) {
    setSocials((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  }
  function removeSocial(i) {
    setSocials((prev) => prev.filter((_, idx) => idx !== i));
  }
  async function saveBasics() {
    const allowed = new Set((providerOptions?.length ? providerOptions : FALLBACK_PROVIDER_ENUM).map((p) => p.toLowerCase()));
    const bad = socials.find((s) => !allowed.has((s.provider || "").toLowerCase().trim()));
    if (bad) {
      setErr(`Provider must be one of: ${Array.from(allowed).join(", ")}. Invalid value: "${bad.provider || ""}".`);
      return;
    }
    await savePatch(
      {
        YourName: yourName,
        slug,
        contactEmail,
        socials: socials.map((s) => ({
          provider: (s.provider || "").toLowerCase().trim(),
          url: s.url || "",
        })),
      },
      "Basics saved ✅"
    );
  }

  /* ------------------------------- HERO ------------------------------- */
  async function saveHero() {
    await savePatch({ Herosection: [{ heroTitle, heroSubtitle, heroDescription, heroDesign }] }, "Hero section saved ✅");
  }

  /* ------------------------------ ABOUT ------------------------------ */
  async function onAvatarChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setAvatarPreview(URL.createObjectURL(f));

    const fd = new FormData();
    fd.append("files", f);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || j?.ok === false) {
      setErr(j?.error || "Upload failed");
      return;
    }
    const file = (j.files && j.files[0]) || null;
    if (!file?.id) {
      setErr("Upload returned no id");
      return;
    }
    setAvatarMediaId(file.id);
    setMsg("Avatar uploaded ✅ (Save About to apply)");
  }
  async function saveAbout() {
    await savePatch(
      {
        About: {
          description: aboutDescription || "",
          avatar: avatarMediaId || null,
        },
      },
      "About saved ✅"
    );
  }

  /* ----------------------------- PROJECTS ----------------------------- */
  function addProject() {
    setProjects((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        liveUrl: "",
        repoUrl: "",
        coverId: null,
        coverUrl: null,
        galleryIds: [],
        galleryUrls: [],
      },
    ]);
  }
  function updateProject(i, key, value) {
    setProjects((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], [key]: value };
      return next;
    });
  }
  function removeProject(i) {
    setProjects((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function uploadId(file) {
    const fd = new FormData();
    fd.append("files", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const j = await res.json().catch(() => ({}));
    if (!res.ok || j?.ok === false) throw new Error(j?.error || "Upload failed");
    const up = (j.files && j.files[0]) || null;
    if (!up?.id) throw new Error("Upload returned no id");
    return up.id;
  }

  async function onProjectCover(i, e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const local = URL.createObjectURL(file);
    updateProject(i, "coverUrl", local);
    try {
      const id = await uploadId(file);
      setCoverPreviewCache((prev) => ({ ...prev, [id]: local }));
      updateProject(i, "coverId", id);
      setMsg("Cover uploaded ✅ (Save Projects to apply)");
      e.target.value = "";
    } catch (er) {
      setErr(er.message);
    }
  }

  async function onProjectGallery(i, e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const localUrls = files.map((f) => URL.createObjectURL(f));
    updateProject(i, "galleryUrls", [...(projects[i]?.galleryUrls || []), ...localUrls]);

    try {
      const ids = [];
      for (const f of files) ids.push(await uploadId(f));
      updateProject(i, "galleryIds", [...(projects[i]?.galleryIds || []), ...ids]);
      setMsg("Gallery uploaded ✅ (Save Projects to apply)");
      e.target.value = "";
    } catch (er) {
      setErr(er.message);
    }
  }

  async function saveProjects() {
    setBusy(true);
    setMsg("");
    setErr("");
    try {
      const payload = projects.map((p) => ({
        title: p.title || "",
        description: p.description || "",
        liveUrl: p.liveUrl || "",
        repoUrl: p.repoUrl || "",
        cover: p.coverId || null,
        gallery: p.galleryIds || [],
      }));

      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projects: payload }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok || j?.ok === false) {
        setErr(j?.error || "Save failed");
        return;
      }

      await load();
      setMsg("Projects saved ✅");
    } catch (e) {
      setErr(e?.message || "Save failed");
    } finally {
      setBusy(false);
    }
  }
/* ----------------------------- SKILLS CRUD (BATCH) ----------------------------- */

// local-only change: level
function updateProfileSkillLevel(rowId, level) {
  const lvl = clampPct(level);
  setSkills(prev => prev.map(r => (r.id === rowId ? { ...r, level: lvl } : r)));

  if (String(rowId).startsWith("tmp_")) {
    setPending(prev => ({
      ...prev,
      creates: (prev.creates || []).map(c => (c.tempId === rowId ? { ...c, level: lvl } : c)),
    }));
    return;
  }

  setPending(prev => {
    const next = new Map(prev.updates);
    const prevPatch = next.get(rowId) || {};
    next.set(rowId, { ...prevPatch, level: lvl });
    return { ...prev, updates: next };
  });
}


// local-only change: link to another skill
function updateProfileSkillLink(rowId, skillId) {
  const sId = Number(skillId) || null;

  // prevent duplicates (excluding the current row)
  const usedByOthers = (skills || []).some(r => r.id !== rowId && !r._markedForDelete && r?.skill?.id === sId);
  const usedByCreates = (pending.creates || []).some(c => c.tempId !== rowId && c.skill === sId);
  if (sId && (usedByOthers || usedByCreates)) {
    setErr("That skill is already selected.");
    return;
  }

  const meta = allSkills.find(s => s.id === sId) || {};
  setSkills(prev => prev.map(r => (r.id === rowId
    ? { ...r, skill: { id: sId, name: meta.name || r.skill.name, tag: meta.tag || r.skill.tag, iconUrl: meta.iconUrl || r.skill.iconUrl } }
    : r
  )));

  if (String(rowId).startsWith("tmp_")) {
    setPending(prev => ({
      ...prev,
      creates: (prev.creates || []).map(c => (c.tempId === rowId ? { ...c, skill: sId } : c)),
    }));
    return;
  }

  setPending(prev => {
    const next = new Map(prev.updates);
    const prevPatch = next.get(rowId) || {};
    next.set(rowId, { ...prevPatch, skill: sId });
    return { ...prev, updates: next };
  });
}


// mark/unmark for delete (no network yet)
function deleteProfileSkill(rowId) {
  if (String(rowId).startsWith("tmp_")) {
    // remove local-only create
    setPending(prev => ({ ...prev, creates: (prev.creates || []).filter(c => c.tempId !== rowId) }));
    setSkills(prev => prev.filter(r => r.id !== rowId));
    return;
  }
  setPending(prev => {
    const del = new Set(prev.deletes);
    if (del.has(rowId)) del.delete(rowId); else del.add(rowId);
    return { ...prev, deletes: del };
  });
  setSkills(prev => prev.map(r => (r.id === rowId ? { ...r, _markedForDelete: !r._markedForDelete } : r)));
}


// SAVE ALL queued changes
async function saveSkillsBatch() {
  if (pending.updates.size === 0 && pending.deletes.size === 0 && (!pending.creates || pending.creates.length === 0)) return;
  setSaving(true);
  setMsg("");
  setErr("");

  try {
    // 1) delete existing
    for (const id of pending.deletes) {
      await fetch(`/api/profile-skills/${id}`, { method: "DELETE" });
    }

    // 2) create new
    if (pending.creates && pending.creates.length) {
      for (const c of pending.creates) {
        await fetch(`/api/profile-skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            developer_profile: Number(profile.id),
            skill: Number(c.skill),
            level: clampPct(c.level),
          }),
        });
      }
    }

    // 3) update existing (skip deleted)
    for (const [id, patch] of pending.updates.entries()) {
      if (pending.deletes.has(id)) continue;
      const body = {};
      if (typeof patch.level === "number") body.level = clampPct(patch.level);
      if (patch.skill != null) body.skill = Number(patch.skill) || null;
      if (Object.keys(body).length === 0) continue;

      await fetch(`/api/profile-skills/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    setPending({ updates: new Map(), deletes: new Set(), creates: [] });
    await load();
    setMsg("Skills saved ✅");
  } catch (e) {
    setErr(e?.message || "Save failed");
  } finally {
    setSaving(false);
  }
}


function resetSkillsPending() {
  setPending({ updates: new Map(), deletes: new Set() });
  // Optional: reload to discard local edits & delete marks
  load();
}


  // Add a new row: link selected skill + level to this profile
function addProfileSkill() {
  if (!profile?.id) {
    setErr("Missing profile id.");
    return;
  }
  const skill = Number(newSkillId);
  const level = clampPct(newSkillLevel);
  if (!skill) {
    setErr("Select a skill first.");
    return;
  }

  // prevent duplicates against current rows (not marked delete) + pending creates
  const usedExisting = new Set((skills || []).filter(r => !r._markedForDelete).map(r => r?.skill?.id));
  const usedPending  = new Set((pending.creates || []).map(c => c.skill));
  if (usedExisting.has(skill) || usedPending.has(skill)) {
    setErr("That skill is already selected.");
    return;
  }

  const tempId = `tmp_${Math.random().toString(36).slice(2, 10)}`;
  const meta = allSkills.find(s => s.id === skill) || {};

  // add temp row to UI
  setSkills(prev => [
    ...prev,
    {
      id: tempId,
      level,
      skill: { id: skill, name: meta.name || "Skill", tag: meta.tag || "", iconUrl: meta.iconUrl || null },
      _isNew: true,
    },
  ]);

  // queue create
  setPending(prev => ({ ...prev, creates: [...(prev.creates || []), { tempId, skill, level }] }));

  setNewSkillId("");
  setNewSkillLevel("");
  setMsg("Added locally — click Save Skills to apply.");
}


  /* -------------------------------- AUTH -------------------------------- */
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  /* -------------------------------- RENDER ------------------------------- */
  const portfolioHref = slug ? `/u/${slug}` : "#";

  // hero options to render (from API or local fallback)
  const heroOpts =
    heroOptionsFromApi && heroOptionsFromApi.length
      ? heroOptionsFromApi
      : [
          { key: "magic_ball", label: "Magic Ball", thumb: "/hero/magic_ball.png" },
          { key: "robot", label: "Robot", thumb: "/hero/robot.png" },
        ];

  if (loading) {
    return (
      <Shell>
        <Topbar left={<H1>Dashboard</H1>} right={<div />} />
        <Pane>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Loading…</p>
        </Pane>
      </Shell>
    );
  }

  const TABS = [
    { key: "basics", title: "Basics" },
    { key: "hero", title: "Hero Section" },
    { key: "about", title: "About" },
    { key: "projects", title: "Projects" },
    { key: "skills", title: "Skills" },
  ];

  return (
    <Shell>
      <Topbar
        left={<H1 sub="Manage your public portfolio content.">Dashboard</H1>}
        right={
          <>
            <Link
              href={portfolioHref}
              target="_blank"
              prefetch={false}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                slug ? "bg-indigo-600 text-white hover:bg-indigo-700" : "pointer-events-none bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
              }`}
            >
              View Portfolio
            </Link>
            <Button variant="ghost" onClick={logout}>
              Logout
            </Button>
          </>
        }
      />

      {msg ? (
        <div className="mb-4 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-sm dark:border-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200">
          {msg}
        </div>
      ) : null}
      {err ? (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 shadow-sm dark:border-red-800 dark:bg-red-900/40 dark:text-red-200">
          {err}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[22rem_1fr]">
        {/* Sidebar */}
        <Sidebar tabs={TABS} current={tab} onChange={setTab} />

        {/* Content */}
        <div className="space-y-6">
          {/* BASICS */}
          {tab === "basics" && (
            <Pane
              title="Basic information"
              sub="Your profile handle & contact details."
              footer={
                <div className="space-y-3">
                  <Callout>
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-300">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                            <path d="M11 11V6a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5z" />
                          </svg>
                        </span>
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Add a new social link</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">Choose provider and paste the profile URL.</div>
                        </div>
                      </div>
                      <Button onClick={addSocial} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        + Add social
                      </Button>
                    </div>
                  </Callout>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button disabled={busy} onClick={saveBasics}>
                      {busy ? "Saving…" : "Save Basics"}
                    </Button>
                    <Link
                      href={portfolioHref}
                      target="_blank"
                      prefetch={false}
                      className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                        slug ? "bg-zinc-900 text-white hover:bg-black dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200" : "pointer-events-none bg-zinc-300 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400"
                      }`}
                    >
                      View Portfolio
                    </Link>
                  </div>
                </div>
              }
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Your name</span>
                  <Input placeholder="YourName" value={yourName} onChange={(e) => setYourName(e.target.value)} />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Slug</span>
                  <Input placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
                </label>
              </div>

              <div className="mt-5 grid gap-1.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Contact email</span>
                <Input type="email" placeholder="Contact email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
              </div>

              <div className="mt-8 border-t border-zinc-200/80 pt-6 dark:border-zinc-800/70">
                <div className="mb-3">
                  <h3 className="text-[16px] font-semibold">Social links</h3>
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Links shown across your portfolio.</p>
                </div>

                {socials?.length ? null : <p className="text-sm text-zinc-600 dark:text-zinc-300">No socials yet—add one.</p>}

                <div className="space-y-4">
                  {(socials || []).map((s, i) => (
                    <div key={i} className="grid gap-4 rounded-xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60 md:grid-cols-4">
                      <div>
                        <span className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Provider</span>
                        <select
                          aria-label="Provider"
                          className="h-12 w-full rounded-xl border border-zinc-300 bg-white px-3 text-[15px] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                          value={s.provider || ""}
                          onChange={(e) => updateSocial(i, "provider", e.target.value)}
                        >
                          {providerOptions.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <span className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">URL</span>
                        <Input placeholder="https://…" value={s.url || ""} onChange={(e) => updateSocial(i, "url", e.target.value)} />
                      </div>

                      <div className="col-span-full flex items-center justify-between md:col-span-1">
                        <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/30" onClick={() => removeSocial(i)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Pane>
          )}

          {/* HERO */}
          {tab === "hero" && (
            <Pane title="Hero Section" sub="The first impression on your landing hero." footer={<Button disabled={busy} onClick={saveHero}>{busy ? "Saving…" : "Save Hero"}</Button>}>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hero title</span>
                  <Input placeholder="heroTitle" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                </label>
                <label className="grid gap-1.5">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hero subtitle</span>
                  <Input placeholder="heroSubtitle" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                </label>
              </div>

              <div className="mt-5 grid gap-1.5">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hero description</span>
                <Textarea rows={5} placeholder="heroDescription" value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} />
              </div>

              <div className="mt-5 grid gap-2">
                <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Hero design</span>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {(heroOptionsFromApi && heroOptionsFromApi.length
                    ? heroOptionsFromApi
                    : [
                        { key: "magic_ball", label: "Magic Ball", thumb: "/hero/magic_ball.png" },
                        { key: "robot", label: "Robot", thumb: "/hero/robot.png" },
                      ]
                  ).map((opt) => {
                    const active = heroDesign === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setHeroDesign(opt.key)}
                        className={`group relative overflow-hidden rounded-2xl border p-3 text-left transition ${
                          active ? "border-indigo-500 ring-2 ring-indigo-500/20 dark:border-indigo-400" : "border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="aspect-video w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
<img
  src={opt.thumb}
  alt={opt.label || opt.key}
  className="h-full w-full object-contain"
/>                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-sm font-medium">{opt.label}</div>
                          <span className={`h-2.5 w-2.5 rounded-full ${active ? "bg-indigo-500 shadow-[0_0_10px] shadow-indigo-500/50" : "bg-zinc-300 dark:bg-zinc-600"}`} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </Pane>
          )}

          {/* ABOUT */}
          {tab === "about" && (
            <Pane title="About" sub="Introduce yourself with an avatar & bio." footer={<Button disabled={busy} onClick={saveAbout}>{busy ? "Saving…" : "Save About"}</Button>}>
              <div className="flex flex-col gap-6 xl:flex-row">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-48 w-48 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/50">
                    {aboutAvatarUrl ? (
                      <img src={aboutAvatarUrl} alt="avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-zinc-400 dark:text-zinc-500">No avatar</div>
                    )}
                  </div>
                  <UploadButton label="Change avatar" accept="image/*" onChange={onAvatarChange} hint="JPG/PNG, up to ~5MB" />
                </div>

                <div className="flex-1 space-y-3">
                  <span className="block text-xs font-medium text-zinc-500 dark:text-zinc-400">About description</span>
                  <Textarea rows={8} placeholder="Description" value={aboutDescription} onChange={(e) => setAboutDescription(e.target.value)} />
                </div>
              </div>
            </Pane>
          )}

          {/* PROJECTS */}
          {tab === "projects" && (
            <Pane
              title="Projects"
              sub="Manage work samples, covers & galleries."
              footer={
                <div className="space-y-3">
                  <Callout>
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-700 dark:text-indigo-300">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                            <path d="M11 11V6a1 1 0 1 1 2 0v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H6a1 1 0 1 1 0-2h5z" />
                          </svg>
                        </span>
                        <div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Add a new project</div>
                          <div className="text-xs text-zinc-600 dark:text-zinc-400">Start with title, URLs, a cover & gallery.</div>
                        </div>
                      </div>
                      <Button onClick={addProject} className="bg-indigo-600 text-white hover:bg-indigo-700">
                        + Add project
                      </Button>
                    </div>
                  </Callout>

                  <div className="flex flex-wrap items-center gap-2">
                    <Button disabled={busy} onClick={saveProjects}>
                      {busy ? "Saving…" : "Save Projects"}
                    </Button>
                  </div>
                </div>
              }
            >
              {projects?.length ? null : <p className="text-sm text-zinc-600 dark:text-zinc-300">No projects yet—add one.</p>}

              <div className="space-y-6">
                {(projects || []).map((p, i) => (
                  <div key={i} className="space-y-5 rounded-2xl border border-zinc-200/80 bg-white/80 p-5 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Project title</span>
                        <Input placeholder="Title" value={p.title} onChange={(e) => updateProject(i, "title", e.target.value)} />
                      </label>
                      <label className="grid gap-1.5">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Live URL</span>
                        <Input placeholder="https://…" value={p.liveUrl} onChange={(e) => updateProject(i, "liveUrl", e.target.value)} />
                      </label>
                      <label className="grid gap-1.5 md:col-span-2">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Repository URL</span>
                        <Input placeholder="https://github.com/…" value={p.repoUrl} onChange={(e) => updateProject(i, "repoUrl", e.target.value)} />
                      </label>
                    </div>

                    <div className="grid gap-4 md:grid-cols-[1fr_280px]">
                      <div className="order-2 md:order-1">
                        <span className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Description</span>
                        <Textarea rows={5} placeholder="Description" value={p.description} onChange={(e) => updateProject(i, "description", e.target.value)} />
                      </div>
                      <div className="order-1 md:order-2">
                        <span className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Cover image</span>
                        <UploadButton label="Upload cover" accept="image/*" onChange={(e) => onProjectCover(i, e)} hint="Recommended 1600×900 or larger" />
                        <div className="mt-3 h-48 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-100 shadow-sm dark:border-zinc-800 dark:bg-zinc-800/40 sm:h-56 md:h-64">
                          {p.coverUrl ? (
                            <img src={p.coverUrl} alt="cover" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-zinc-500 dark:text-zinc-400">No cover</div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span className="mb-2 block text-xs font-medium text-zinc-500 dark:text-zinc-400">Gallery images</span>
                      <UploadButton label="Add to gallery" multiple accept="image/*" onChange={(e) => onProjectGallery(i, e)} hint="You can select multiple images" />
                      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                        {p.galleryUrls?.length ? (
                          p.galleryUrls.map((u, gi) => <img key={gi} src={u} alt="gallery" className="h-32 w-full rounded-xl border border-zinc-200 object-cover shadow-sm transition hover:scale-[1.01] dark:border-zinc-800 sm:h-36 md:h-40" />)
                        ) : (
                          <div className="col-span-full text-xs text-zinc-500 dark:text-zinc-400">No gallery images</div>
                        )}
                      </div>
                    </div>

                    <div className="pt-1">
                      <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/30" onClick={() => removeProject(i)}>
                        Remove project
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Pane>
          )}

          {/* SKILLS */}
          {tab === "skills" && (
<Pane
  title="Skills"
  sub="Manage your profile skills just like in Strapi."
  footer={
    <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
      <span className="mr-auto text-xs text-zinc-500">
        {(pending.creates?.length || 0)} to add · {pending.updates.size} edited · {pending.deletes.size} to delete
      </span>

      <Button
        variant="ghost"
        onClick={resetSkillsPending}
        disabled={saving || (pending.updates.size === 0 && pending.deletes.size === 0 && (!pending.creates || pending.creates.length === 0))}
        className="px-6 py-3 text-base rounded-2xl"
      >
        Reset
      </Button>

      <Button
        onClick={saveSkillsBatch}
        disabled={saving || (pending.updates.size === 0 && pending.deletes.size === 0 && (!pending.creates || pending.creates.length === 0))}
        className="px-6 py-3 text-base rounded-2xl min-w-[160px]"
      >
        {saving ? "Saving…" : "Save Skills"}
      </Button>
    </div>
  }
>




              {/* Existing skills list */}
              <div className="space-y-4">
                {(skills || []).map((ps) => (
                  <div
  key={ps.id ?? `${ps.skill.id}-${ps.level}`}
  className={`flex items-center justify-between rounded-xl border border-zinc-200/80 bg-white/80 p-4 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900/60 ${
    ps._markedForDelete ? "opacity-60 line-through" : ""
  }`}
>

                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800">
                        {ps.skill.iconUrl ? <img src={ps.skill.iconUrl} alt="" className="h-full w-full object-cover" /> : <div className="grid h-full w-full place-items-center text-[10px] text-zinc-400 dark:text-zinc-500">no icon</div>}
                      </div>
                      <div className="text-sm">
                        <div className="font-medium">{ps.skill.name || "Skill"}</div>
                        {ps.skill.tag ? <div className="text-xs text-zinc-500 dark:text-zinc-400">{ps.skill.tag}</div> : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* change skill */}
                      {allSkills.length === 0 ? (
  <option value="">No skills available</option>
) : (
  allSkills
    .filter(s => {
      const usedByOthers = (skills || []).some(r => r.id !== ps.id && !r._markedForDelete && r?.skill?.id === s.id);
      const usedByCreates = (pending.creates || []).some(c => c.skill === s.id);
      return !usedByOthers && !usedByCreates;
    })
    .map((s) => (
      <option key={s.id} value={s.id}>
        {s.name}{s.tag ? ` — ${s.tag}` : ""}
      </option>
    ))
)}


                      {/* level input */}
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          className="w-20 h-10"
                          value={ps.level ?? 0}
                          onChange={(e) => updateProfileSkillLevel(ps.id, e.target.value)}
                        />
                      </div>

                      <Button variant="ghost" className="text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-900/30" onClick={() => deleteProfileSkill(ps.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                {!(skills || []).length && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">No profile skills yet—add one below.</p>
                )}
              </div>

              {/* Add new skill */}
              <div className="mt-6 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
                <div className="mb-2 text-sm font-semibold">Add new skill</div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
  aria-label="Select skill"
  className="h-10 rounded-lg border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
  value={newSkillId ?? ""}
  onChange={(e) => setNewSkillId(e.target.value)}
>
  <option value="">Select a skill…</option>
  {allSkills
    .filter(s => {
      const usedExisting = (skills || []).some(r => !r._markedForDelete && r?.skill?.id === s.id);
      const usedPending  = (pending.creates || []).some(c => c.skill === s.id);
      return !usedExisting && !usedPending;
    })
    .map((s) => {
      const label = s.name || s.label || "Skill";
      const extra = s.tag ? ` — ${s.tag}` : "";
      return (
        <option key={s.id} value={s.id}>
          {label}{extra}
        </option>
      );
    })}
</select>


                  <Input
                    type="number"
                    min={0}
                    max={100}
                    placeholder="Level"
                    className="w-28 h-10"
                    value={newSkillLevel}
                    onChange={(e) => setNewSkillLevel(e.target.value)}
                  />

                  <Button onClick={addProfileSkill}>Add</Button>
                </div>
              </div>
            </Pane>
          )}

          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <strong className="font-semibold">User:</strong> {me?.username} ({me?.email})
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ----------------------------- small utils ----------------------------- */
function clampPct(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}
