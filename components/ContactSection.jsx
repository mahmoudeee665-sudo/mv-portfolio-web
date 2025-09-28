"use client"
import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { openContactWidget } from "@/lib/contactBus"; // ← NEW

const ContactSection = ({ name = "Mahmoud", description = "Your description here" }) => {  // ← make name dynamic
  const circleRef = useRef(null);
  const sectionRef = useRef(null);
  const initialTextRef = useRef(null);
  const finalTextRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // kill any previous triggers tied to this section (hot reload safety)
    const cleanup = () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === sectionRef.current) st.kill(true);
      });
    };
    cleanup();

    // initial state
    gsap.set(circleRef.current, { scale: 1, backgroundColor: "white" });
    gsap.set(initialTextRef.current, { opacity: 1 });
    gsap.set(finalTextRef.current, { opacity: 0 });

    // timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "+=200%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // initial state to mid
    tl.to(circleRef.current, {
      scale: 5,
      backgroundColor: "#9333EA",
      ease: "power1.inOut",
      duration: 0.5,
    }, 0);

    // fade out initial text
    tl.to(initialTextRef.current, { opacity: 0, ease: "power1.out", duration: 0.2 }, 0.1);

    // mid-zoom
    tl.to(circleRef.current, {
      scale: 17,
      backgroundColor: "#E9D5FF",
      boxShadow: "0 0 50px 20px rgba(233, 213, 255, 0.3)",
      ease: "power2.inOut",
      duration: 0.5,
    }, 0.5);

    // fade in final text
    tl.to(finalTextRef.current, { opacity: 1, ease: "power2.in", duration: 0.2 }, 0.7);

    return cleanup;
  }, []);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="flex items-center justify-center bg-black relative"
      style={{ overscrollBehavior: "none" }}
    >
      {/* circle nesting */}
      <div
        ref={circleRef}
        className="w-24 sm:w-28 md:w-32 h-24 sm:h-28 md:h-32 rounded-full flex items-center justify-center relative transition-shadow duration-1000 shadow-violet-300/50 shadow-lg bg-gradient-to-r from-violet-400 to-pink-100"
      >
        {/* initial text */}
        <p
          ref={initialTextRef}
          className="font-sans text-black font-bold text-base sm:text-lg md:text-xl absolute inset-0 flex items-center justify-center text-center"
        >
          Scroll Down
        </p>

        {/* final text block */}
        <div
          ref={finalTextRef}
          className="text-center relative flex flex-col items-center justify-center"
        >
          <h1 className="font-sans text-black md:w-[10rem] w-[20rem] lg:scale-[0.4] sm:scale-[0.25] scale-[0.07] md:font-bold text-sm sm:text-base leading-none mb-5">
            Step Into the Future with {name}
          </h1>

          <p className="font-sans text-black lg:w-[40rem] w-[20rem] absolute sm:mt-3 mt-1 md:scale-[0.1] scale-[0.068]">
  {description}
          </p>

          <button
            className="px-10 py-2 rounded-xl bg-black hover:bg-white hover:text-black transition-all duration-500 scale-[0.1] absolute sm:mt-9 mt-7 text-nowrap"
            onClick={() => openContactWidget({ source: "contact-section" })}  // ← NEW
            aria-haspopup="dialog"
            aria-controls="contact-widget"
          >
            contact me
          </button>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
