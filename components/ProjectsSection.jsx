"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlShareAlt } from "react-icons/sl";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

/**
 * ProjectsShowcase + Swiper
 * - 3-up on xl, 2-up on lg, 1–1.25 on mobile
 * - Moves ONE at a time (arrows & autoplay)
 * - NO loop; uses rewind so both directions wrap (first⇄last)
 * - Autoplay pauses on hover
 * - Lightbox starts with COVER then gallery
 * - Clicking outside the modal closes it
 */
export default function ProjectsShowcase({
  projects = [],
  autoDelayMs = 2500, // autoplay interval
}) {
  const [active, setActive] = useState(null);
  const open = (p) => setActive(p);
  const close = () => setActive(null);

  // nav refs
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section
      id="projects"
      className="relative py-20 bg-gradient-to-b from-[#9a74cf50] to-[#070011b4]"
    >
      {/* Heading */}
      <div className="container mx-auto px-4 mb-12">
        <motion.h2
          className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          Latest Projects
        </motion.h2>
        <motion.div
          className="h-1 w-40 mx-auto mt-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Slider + Arrows */}
      <div className="container mx-auto px-4 relative">
        {/* arrows (custom) */}
        <div className="absolute -top-14 right-4 z-10 flex gap-2">
          <button
            ref={prevRef}
            className="h-10 w-10 rounded-full bg-black/50 border border-white/10 hover:bg-black/60 text-white grid place-items-center"
            aria-label="Previous projects"
          >
            ‹
          </button>
          <button
            ref={nextRef}
            className="h-10 w-10 rounded-full bg-black/50 border border-white/10 hover:bg-black/60 text-white grid place-items-center"
            aria-label="Next projects"
          >
            ›
          </button>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Keyboard]}
          speed={600}
          loop={false} // loop OFF
          rewind={true} // wrap BOTH directions
          watchOverflow
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onInit={(swiper) => {
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          keyboard={{ enabled: true }}
          autoplay={{
            delay: autoDelayMs,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
            stopOnLastSlide: false, // with rewind, it jumps to first and keeps going
          }}
          // ONE-by-ONE movement
          breakpoints={{
            1280: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 24 },
            1024: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 20 },
            640: {
              slidesPerView: 1.25,
              slidesPerGroup: 1,
              spaceBetween: 16,
              centeredSlides: true,
            },
            0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 12 },
          }}
          className="!overflow-visible"
        >
          {projects.map((p, i) => (
            <SwiperSlide key={p.id ?? `${p.title}-${i}`} className="!h-auto">
              <ProjectCard project={p} index={i} onOpen={() => open(p)} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {active && <Lightbox project={active} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Card ---------- */
function ProjectCard({ project, index, onOpen }) {
  const cardRef = useRef(null);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  // simple parallax on mouse move
  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width; // 0..1
    const y = (e.clientY - rect.top) / rect.height; // 0..1
    setMx((x - 0.5) * 8); // tilt
    setMy((y - 0.5) * -8);
  };

  return (
    <motion.article
      ref={cardRef}
      className="group relative select-none"
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setMx(0);
        setMy(0);
      }}
      onClick={onOpen}
      style={{ perspective: 1000 }}
    >
      {/* image */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border border-white/10 bg-neutral-900/40 shadow-2xl"
        style={{ transform: `rotateX(${my}deg) rotateY(${mx}deg)` }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 200, damping: 18 }}
      >
        <div className="aspect-[16/10] w-full">
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* subtle shimmer */}
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute -inset-[40%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
          </div>
        </div>

        {/* label */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-black/0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-white font-semibold line-clamp-1">
              {project.title}
            </h3>
            <span className="text-violet-300/90 opacity-0 group-hover:opacity-100 transition-opacity">
              <SlShareAlt />
            </span>
          </div>
        </div>
      </motion.div>

      {/* meta */}
      {project.description ? (
        <p className="mt-3 text-sm text-neutral-300 line-clamp-2">
          {/* {project.description} */}
        </p>
      ) : null}
    </motion.article>
  );
}

/* ---------- Lightbox (modal + carousel) ---------- */
function Lightbox({ project, onClose }) {
  const [i, setI] = useState(0);

  // COVER FIRST, then the rest of the gallery (deduped)
  const images = useMemo(() => {
    const gallery = Array.isArray(project.gallery) ? project.gallery : [];
    const urls = [project.cover, ...gallery].filter(Boolean);
    return Array.from(new Set(urls)); // dedupe by URL
  }, [project.cover, project.gallery]);

  const total = images.length;

  const overlayRef = useRef(null);
  const contentRef = useRef(null); // dialog container
  const trackRef = useRef(null);
  const startX = useRef(0);
  const dx = useRef(0);
  const dragging = useRef(false);

  const go = useCallback(
    (n) => setI((prev) => (prev + n + total) % total),
    [total]
  );

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose?.();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

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

  // lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        // CLOSE when clicking/tapping outside the dialog
        onMouseDown={(e) => {
          if (contentRef.current && !contentRef.current.contains(e.target)) {
            onClose?.();
          }
        }}
        onTouchStart={(e) => {
          if (contentRef.current && !contentRef.current.contains(e.target)) {
            onClose?.();
          }
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
              <h3 className="text-white font-semibold truncate">
                {project.title}
              </h3>
              <button
                onClick={onClose}
                className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15"
              >
                ✕
              </button>
            </div>

            {/* carousel + details */}
            <div className="p-5 grid md:grid-cols-5 gap-5">
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
                      >
                        ‹
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/50 hover:bg-black/60 border border-white/10 grid place-items-center"
                        onClick={() => go(1)}
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

                {/* mini thumbs */}
                {images.length > 1 && (
                  <div className="mt-2 flex gap-3 overflow-x-auto pb-1">
                    {images.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => setI(idx)}
                        className={`shrink-0 border rounded-lg overflow-hidden transition ${
                          idx === i
                            ? "border-violet-500"
                            : "border-white/10 hover:border-white/20"
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
    </AnimatePresence>
  );
}
