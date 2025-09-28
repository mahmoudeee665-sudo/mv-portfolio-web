// lib/skills.js
export async function fetchAllSkills(q = "") {
  const p = new URLSearchParams();
  if (q) p.set("q", q);
  const res = await fetch(`/api/skills?${p.toString()}`, { cache: "no-store" });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || "Failed to fetch skills");
  }
  // Read items first; fall back to data if older code expects it
  const arr = Array.isArray(json.items) ? json.items : Array.isArray(json.data) ? json.data : [];
  // Normalize shape to always have id, name, tag
  return arr.map((s) => ({
    id: s.id ?? s?.attributes?.id ?? null,
    name: s.name ?? s?.attributes?.name ?? "",
    tag: s.tag ?? s?.attributes?.tag ?? "",
    color: s.color ?? s?.attributes?.color ?? "",
    icon: s.icon ?? s?.attributes?.icon ?? null,
  }));
}
