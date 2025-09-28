"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Reusable modal lightbox for showing a project's cover + gallery and meta.
 * Props:
 *  - project: { title, cover, gallery?: string[], description?, liveUrl?, repoUrl? } | null
 *  - open: boolean
 *  - onClose: () => void
 *  - initialIndex?: number
 */
export default function ProjectDetailsModal({ project, open, onClose, initialIndex = 0 }) {
  const [i, setI] = useState(initialIndex);

  // COVER first, then gallery (deduped)
  const images = useMemo(() => {
    if (!project) return [];
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    const urls = [project.cover, ...gallery].filter(Boolean);
    return Array.from(new Set(urls));
  }, [project]);

  useEffect(() => {
    if (open) setI(initialIndex);
  }, [open, initialIndex]);

  const total = images.length;
  const contentRef = useRef(null);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const dx = useRef(0);
  const dragging = useRef(false);

  const go = useCallback(
    (n) => setI((prev) => (total ? (prev + n + total) % total : prev)),
    [total]
  );

  // keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  // snap to slide
  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${i * 100}%)`;
  }, [i]);

  // swipe handlers
  const onDown = (e) => {
    dragging.current = true;
    startX.current = e.touches?.[0]?.clientX ?? e.clientX ?? 0;
    dx.current = 0;
  };
  const onMove = (e) => {
    if (!dragging.current || !trackRef.current) return;
    const x = e.touches?.[0]?.clientX ?? e.clientX ?? 0;
    dx.current = x - startX.current;
    const pct = (dx.current / trackRef.current.clientWidth) * 100;
    const cur = -(i * 100) + pct;
    trackRef.current.style.transform = `translateX(${cur}%)`;
  };
  const onUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (dx.current < -40) go(1);
    else if (dx.current > 40) go(-1);
    else setI((v) => v);
  };

  // lock body scroll when open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, [open]);

  return (
    <AnimatePresence>
      {open && project ? (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-hidden={!open}
          role="dialog"
          aria-modal="true"
          // CLOSE when clicking outside
          onMouseDown={(e) => {
            if (contentRef.current && !contentRef.current.contains(e.target)) onClose?.();
          }}
          onTouchStart={(e) => {
            if (contentRef.current && !contentRef.current.contains(e.target)) onClose?.();
          }}
        >
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-4"
            initial={{ scale: 0.98, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <div
              ref={contentRef}
              className="w-full max-w-6xl bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              {/* header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
                <h3 className="text-white font-semibold truncate">{project.title}</h3>
                <button
                  onClick={onClose}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15"
                  aria-label="Close details"
                >
                  ✕
                </button>
              </div>

              {/* body */}
              <div className="p-5 grid md:grid-cols-5 gap-5">
                {/* carousel */}
                <div className="md:col-span-3">
                  <div
                    className="relative w-full overflow-hidden rounded-xl bg-neutral-800 border border-white/10 select-none"
                    onMouseDown={onDown}
                    onMouseMove={onMove}
                    onMouseUp={onUp}
                    onMouseLeave={onUp}
                    onTouchStart={onDown}
                    onTouchMove={onMove}
                    onTouchEnd={onUp}
                  >
                    <div
                      ref={trackRef}
                      className="flex transition-transform duration-300 ease-out will-change-transform"
                      style={{ transform: `translateX(-${i * 100}%)` }}
                    >
                      {images.map((src, idx) => (
                        <div key={idx} className="shrink-0 w-full">
                          <div className="aspect-video w-full">
                            <img
                              src={src}
                              alt={`${project.title} slide ${idx + 1}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              draggable="false"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {images.length > 1 && (
                      <>
                        <button
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/60 border border-white/10 grid place-items-center"
                          onClick={() => go(-1)}
                          aria-label="Previous image"
                        >
                          ‹
                        </button>
                        <button
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/60 border border-white/10 grid place-items-center"
                          onClick={() => go(1)}
                          aria-label="Next image"
                        >
                          ›
                        </button>
                      </>
                    )}
                  </div>

                  {/* dots */}
                  {images.length > 1 && (
                    <div className="mt-3 flex items-center justify-center gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setI(idx)}
                          className={`h-2.5 w-2.5 rounded-full ${
                            i === idx ? "bg-white" : "bg-white/40"
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* details */}
                <div className="md:col-span-2 flex flex-col gap-4">
                  {project.description && (
                    <div>
                      <h4 className="font-semibold mb-2">About this project</h4>
                      <p className="text-sm text-neutral-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-1">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 transition font-semibold"
                      >
                        View Live
                      </a>
                    )}
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-center px-4 py-2 rounded-xl bg-neutral-800 border border-white/10 hover:bg-neutral-750 transition font-semibold"
                      >
                        View Repo
                      </a>
                    )}
                  </div>

                  {/* thumbs */}
                  {images.length > 1 && (
                    <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
                      {images.map((src, idx) => (
                        <button
                          key={idx}
                          onClick={() => setI(idx)}
                          className={`shrink-0 border rounded-lg overflow-hidden transition ${
                            idx === i ? "border-violet-500" : "border-white/10 hover:border-white/20"
                          }`}
                          aria-label={`View image ${idx + 1}`}
                        >
                          <img
                            src={src}
                            alt=""
                            className="h-16 w-24 object-cover"
                            loading="lazy"
                            draggable="false"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
