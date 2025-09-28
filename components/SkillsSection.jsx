// components/SkillsSection.jsx
"use client";

import { memo } from "react";
import { motion } from "framer-motion";

/**
 * Props:
 *  - title?: string
 *  - subtitle?: string
 *  - skills: Array<{
 *      name: string;
 *      level: number;          // 0..100
 *      color?: string | null;  // hex from Strapi, e.g. #E34F26
 *      tag?: string | null;    // e.g. "Language", "Framework"
 *      iconUrl?: string | null;// absolute/relative URL from Strapi media
 *    }>
 */
function SkillsSection({
  title = "Skills",
  subtitle = "Gooey Nebula — liquid, living UI",
  skills = [],
}) {
  return (
    <section
      id="experience"
      className="relative overflow-hidden py-16 md:py-24 bg-gradient-to-b from-black via-violet-950 to-black"
    >
      {/* SVG filter (goo) */}
      <svg
        className="absolute -z-10 pointer-events-none"
        width="0"
        height="0"
        aria-hidden
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* background */}
      <div className="absolute inset-0 -z-20 opacity-90 bg-[radial-gradient(circle_at_10%_10%,rgba(139,92,246,0.15),transparent_55%),radial-gradient(circle_at_90%_20%,rgba(236,72,153,0.15),transparent_55%),linear-gradient(180deg,#0b0b10_0%,#0f0f16_100%)]" />

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-xs uppercase tracking-[0.3em] text-purple-300/90">
            Fluid Capabilities
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm md:text-base text-purple-200/80">
              {subtitle}
            </p>
          )}
          <div className="mx-auto mt-4 h-1 w-28 rounded-full bg-gradient-to-r from-violet-500 to-pink-500" />
        </div>

        {/* Grid */}
        {skills.length > 0 ? (
          <div className="relative mx-auto max-w-5xl">
            <div
              className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
              style={{ filter: "url(#goo)" }}
            >
              {skills.map((s, i) => (
                <Blob
                  key={`${s.name}-${i}`}
                  name={s.name.toUpperCase()}
                  level={s.level}
                  color={s.color}
                  tag={s.tag}
                  iconUrl={s.iconUrl}
                  index={i}
                />
              ))}

              {/* tiny floating dots for organic feel */}
              {Array.from({ length: 6 }).map((_, i) => (
                <FloatingDot key={`dot-${i}`} delay={i * 0.6} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center text-purple-200/70">No skills yet.</div>
        )}
      </div>
    </section>
  );
}

function Blob({ name, level, color, tag, iconUrl, index }) {
  const pct = clamp(level);

  const float = {
    y: [0, -10, 0, 6, 0],
    x: [0, 6, 0, -4, 0],
    transition: {
      repeat: Infinity,
      duration: 6 + (index % 5),
      ease: "easeInOut",
    },
  };

  // Ring strictly uses Strapi color when valid; neutral when missing.
  const ringStyle = isHex(color)
    ? {
        background: `conic-gradient(${color} ${
          pct * 3.6
        }deg, rgba(255,255,255,0.08) 0deg)`,
      }
    : {
        background: `conic-gradient(rgba(255,255,255,0.35) ${
          pct * 3.6
        }deg, rgba(255,255,255,0.08) 0deg)`,
      };

  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      animate={float}
      className="relative rounded-[2.5rem] p-1"
    >
      {/* outer liquid */}
      <div className="rounded-[2.5rem] p-1 bg-gradient-to-br from-violet-600/30 to-pink-600/30">
        {/* inner card */}
        <div className="relative rounded-[2rem] bg-zinc-900/80 border border-white/10 backdrop-blur">
          {/* subtle glow */}
          <div
            className="absolute -inset-px rounded-[2rem] opacity-0 hover:opacity-100 transition pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 10%,rgba(168,85,247,0.25),transparent 70%)",
            }}
          />

          {/* header */}
          <div className="flex items-center gap-3 p-4">
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full grid place-items-center bg-zinc-800/80 border border-white/10 overflow-hidden">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt={`${name} icon`}
                    className="w-7 h-7 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs text-purple-200">•</span>
                )}
              </div>
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-white truncate">{name}</h3>
              {tag ? (
                <p className="text-[11px] text-purple-200/70">{tag}</p>
              ) : null}
            </div>
          </div>

          {/* progress: ring + bar */}
          <div className="px-4 pb-4 grid grid-cols-[auto_1fr] items-center gap-3">
            <div className="relative w-12 h-12 rounded-full" style={ringStyle}>
              <div className="absolute inset-[3px] rounded-full bg-zinc-900 grid place-items-center">
                <span className="text-[10px] text-purple-100/90">{pct}%</span>
              </div>
            </div>

            {/* Keep a global accent for the linear bar (not per-skill) */}
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{ duration: 0.9 }}
                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500"
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function FloatingDot({ delay = 0 }) {
  return (
    <motion.div
      className="w-6 h-6 rounded-3xl bg-gradient-to-br from-violet-400/40 to-pink-400/40"
      initial={{ opacity: 0.6 }}
      animate={{ opacity: [0.6, 1, 0.6], y: [0, -20, 0], x: [0, 10, 0] }}
      transition={{ repeat: Infinity, duration: 7, ease: "easeInOut", delay }}
    />
  );
}

/* ------------------------------ utils ------------------------------ */

function clamp(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(100, Math.round(x)));
}

function isHex(s) {
  return (
    typeof s === "string" && /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(s.trim())
  );
}

export default memo(SkillsSection);
