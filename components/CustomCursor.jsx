"use client"
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";

const CustomCursor = () => {
  const cursorRef = useRef(null);        // dot
  const cursorBorderRef = useRef(null);  // ring
  const [isMobile, setIsMobile] = useState(false);

  // Determine mobile once and on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mql.matches);

    update();
    // modern browsers: 'change' event
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  // Cursor logic (skips when mobile)
  useEffect(() => {
    if (isMobile) return;

    const dot = cursorRef.current;
    const ring = cursorBorderRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const xToDot  = gsap.quickTo(dot,  "x", { duration: 0.12, ease: "power3.out" });
    const yToDot  = gsap.quickTo(dot,  "y", { duration: 0.12, ease: "power3.out" });
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.40, ease: "power3.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.40, ease: "power3.out" });

    const onMove = (e) => {
      xToDot(e.clientX);  yToDot(e.clientY);
      xToRing(e.clientX); yToRing(e.clientY);
    };
    const onDown = () => {
      gsap.to(ring, { scale: 0.6, duration: 0.2, ease: "power3.out" });
      gsap.to(dot,  { scale: 0.8, duration: 0.2, ease: "power3.out" });
    };
    const onUp = () => {
      gsap.to([ring, dot], { scale: 1, duration: 0.2, ease: "power3.out" });
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);
    };
  }, [isMobile]);

  // Only render after hooks have been declared
  if (isMobile) return null;

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 w-[25px] h-[25px] bg-white rounded-full pointer-events-none z-[999] mix-blend-difference"
      />
      <div
        ref={cursorBorderRef}
        className="fixed top-0 left-0 w-[56px] h-[56px] border border-white rounded-full pointer-events-none z-[998] mix-blend-difference opacity-60"
      />
    </>
  );
};

export default CustomCursor;
