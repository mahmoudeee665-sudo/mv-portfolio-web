// components/ScrollBoot.tsx
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Registers GSAP + ScrollTrigger once and refreshes safely on load. */
export default function ScrollBoot() {
  useEffect(() => {
    if (!gsap.core.globals().ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    // first paint refresh (helps in dev / hydration)
    const id = setTimeout(() => ScrollTrigger.refresh(), 0);

    return () => {
      window.removeEventListener("load", onLoad);
      clearTimeout(id);
      // don't kill all triggers globally; each section cleans up its own
    };
  }, []);

  return null;
}
