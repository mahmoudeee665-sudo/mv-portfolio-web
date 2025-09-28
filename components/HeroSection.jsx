"use client";
import { motion } from "framer-motion";
import Spline from "@splinetool/react-spline";

/**
 * Map a design key (from Strapi enum) -> Spline scene URL.
 * Replace these with your favorite scenes.
 */
const DESIGN_SCENES = {
  magic_ball: "https://prod.spline.design/NNQjK5RJlLdWlR1d/scene.splinecode",
  robot: "https://prod.spline.design/gfycnAkW4qmsKpTk/scene.splinecode",
};

function sceneFromDesign(designKey) {
  if (!designKey) return DESIGN_SCENES.magic_ball; // fallback
  return DESIGN_SCENES[designKey] || DESIGN_SCENES.magic_ball;
}

export default function HeroSection({
  title = "Building Fast",
  subtitle = "Reliable Results",
  description = `I’m a passionate Frontend Developer who loves crafting sleek,
  responsive, and interactive web experiences. With a focus on React,
  Tailwind CSS, and modern tools, I turn ideas into fast and reliable
  user interfaces that blend performance with design.`,
  designKey = "magic_ball", // <- new prop from Strapi enum
}) {
  const sceneUrl = sceneFromDesign(designKey);

  return (
    <section className="h-screen bg-gradient-to-b from-violet-900 flex xl:flex-row flex-col-reverse items-center justify-between lg:px-24 px-10 relative overflow-hidden">
      {/* left section */}
      <div className="z-40 xl:mb-0 mb-[20%]">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            delay: 1.3,
            duration: 1.5,
          }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold z-10 mb-6 font-sans"
        >
          {title} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-tl from-purple-700 to-violet-300">
            {subtitle}
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 40,
            damping: 25,
            delay: 1.8,
            duration: 1.5,
          }}
          className="font-sans text-xl md:text-1xl lg:text-2xl text-purple-200 max-w-2xl"
        >
          {description}
        </motion.p>
      </div>

      {/* right section (Spline 3D scene) */}
      <Spline
        className="absolute xl:right-[-28%] right-0 top-[-20%] lg:top-0"
        scene={sceneUrl}
      />
    </section>
  );
}
