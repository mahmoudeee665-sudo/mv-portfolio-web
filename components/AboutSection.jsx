"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Props:
 *  - avatar: full http(s) URL to the image (already resolved)
 *  - description: string
 */
export default function AboutSection({ avatar, description = "" }) {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);

  // Create random stars only on the client (prevents hydration mismatch)
  const [stars, setStars] = useState([]);
  useEffect(() => {
    const s = Array.from({ length: 12 }, (_, i) => ({
      size: 8 + i * 2,
      opacity: 0.25 + Math.random() * 0.35,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));
    setStars(s);
  }, []);

  const starEls = useRef([]);
  const setStarEl = (el, i) => {
    if (el) starEls.current[i] = el;
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 100, opacity: 0 },
        {
          y: -300,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 30%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    if (introRef.current) {
      gsap.fromTo(
        introRef.current,
        { y: 100, opacity: 0, filter: "blur(10px)" },
        {
          y: -430,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.5,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 40%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }

    starEls.current.forEach((el, idx) => {
      const dir = idx % 2 === 0 ? 1 : -1;
      const speed = 0.5 + Math.random() * 0.5;
      gsap.to(el, {
        x: `${dir * (100 + idx * 20)}`,
        y: `${dir * (-50 - idx * 10)}`,
        rotation: dir * 360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: speed,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t?.vars?.trigger === sectionRef.current) t.kill();
      });
      if (starEls.current?.length) gsap.killTweensOf(starEls.current);
    };
  }, [stars.length]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="h-screen relative overflow-hidden bg-gradient-to-b from-black to-[#9a74cf50]"
    >
      {/* stars */}
      <div className="absolute inset-0 overflow-hidden">
        {stars.map((s, i) => (
          <div
            key={i}
            ref={(el) => setStarEl(el, i)}
            className="absolute rounded-full"
            style={{
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: "white",
              opacity: s.opacity,
              top: `${s.top}%`,
              left: `${s.left}%`,
            }}
          />
        ))}
      </div>

      {/* title */}
      <div className="container mx-auto px-4 h-full flex flex-col items-center justify-center">
        <h1
          ref={titleRef}
          className="font-sans text-4xl md:text-7xl font-bold sm:mb-1 text-center text-white opacity-0"
        >
          About Me
        </h1>
      </div>

      {/* content row */}
      <div
        ref={introRef}
        className="absolute lg:bottom-[-20rem] md:bottom-[-10rem] bottom-[-20rem] left-0 w-full
                   flex md:flex-row flex-col justify-between lg:px-24 px-5 items-center opacity-0"
      >
        <h3 className="font-sans text-lg md:text-4xl font-bold text-purple-200 z-50
                       lg:max-w-[45rem] max-w-[27rem] tracking-wider md:mt-20 sm:mt-[-40rem] mt-[-32rem]">
          {description}
        </h3>

        {/* render only if we have a real URL */}
        {avatar ? (
          <img
            className="lg:h-[40rem] md:h-[35rem] h-[30rem] mix-blend-lighten"
            src={avatar}
            alt="profile"
            loading="lazy"
          />
        ) : null}
      </div>
    </section>
  );
}
