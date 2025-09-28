"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { SlShareAlt } from "react-icons/sl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import ProjectDetailsModal from "@/components/ProjectDetailsModal";

/**
 * Slider with project cards.
 * Props:
 *  - projects: Array<{ id, title, cover, gallery?, description?, liveUrl?, repoUrl? }>
 *  - autoDelayMs?: number
 */
export default function ProjectsShowcase({ projects = [], autoDelayMs = 2500 }) {
  const [active, setActive] = useState(null);
  const open = (p) => setActive(p);
  const close = () => setActive(null);

  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section id="projects" className="relative py-20 bg-gradient-to-b from-[#9a74cf50] to-[#070011b4]">
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
          loop={false}
          rewind={true}
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
            stopOnLastSlide: false,
          }}
          breakpoints={{
            1280: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 24 },
            1024: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 20 },
            640:  { slidesPerView: 1.25, slidesPerGroup: 1, spaceBetween: 16, centeredSlides: true },
            0:    { slidesPerView: 1,    slidesPerGroup: 1, spaceBetween: 12 },
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

      {/* Reusable modal */}
      <ProjectDetailsModal project={active} open={!!active} onClose={close} />
    </section>
  );
}

/* ------- Card (kept local to showcase) ------- */
function ProjectCard({ project, index, onOpen }) {
  const cardRef = useRef(null);
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);

  const onMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMx((x - 0.5) * 8);
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
          <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute -inset-[40%] rotate-12 bg-gradient-to-r from-transparent via-white/10 to-transparent blur-xl" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-black/0">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-white font-semibold line-clamp-1">{project.title}</h3>
            <span className="text-violet-300/90 opacity-0 group-hover:opacity-100 transition-opacity">
              <SlShareAlt />
            </span>
          </div>
        </div>
      </motion.div>

      {project.description ? (
        <p className="mt-3 text-sm text-neutral-300 line-clamp-2"></p>
      ) : null}
    </motion.article>
  );
}
