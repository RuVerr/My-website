"use client";

// ================= React ====================
import React, { useLayoutEffect, useRef } from "react";

// ================= Atomic Components ====================
import AtomHeading from "../../Atoms/GROUP-AtomTypography/AtomHeading/AtomHeading";
import AtomTransitionDiv from "../../Atoms/GROUP-AtomCustomEffects/AtomTransitionDiv/AtomTransitionDiv";

// ================= Navigation ====================
import { useRouter } from "next/navigation";

// ================= Utils ====================
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/WindowUtils/overflowHidden";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { autoScrollTop } from "@/app/utils/WindowUtils/autoScrollTop";

// ================= GSAP ====================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  // ================= Static Data ====================
  // Letters used for main animated heading
  const lettersName = "Ruben";

  // ================= Refs ====================
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  const homeContentRef = useRef<HTMLDivElement | null>(null);

  // ================= Router ====================
  const router = useRouter();

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    // ================= Auto Scroll Reset ====================
    autoScrollTop();

    // ================= Extract Refs ====================
    const letters = letterRefs.current;
    const heading = headingRef.current;
    const transitionEl = transitionDivRef.current;
    const scrollEl = homeContentRef.current;

    // ================= Guard ====================
    if (!letters?.length || !heading || !transitionEl || !scrollEl) return;

    // ================= Animation Constants ====================
    const FAST_DURATION = 1.5;
    const MIDDLE_DURATION = 2;

    // ================= GSAP Context ====================
    const ctx = gsap.context(() => {
      // ================= Transition Initial State ====================
      gsap.set(transitionEl, { scale: 0 });

      gsap.from(letters, {
        scale: gsap.utils.random([0.1, 2], true),
        y: gsap.utils.random(-1000, 1000, true),
        rotation: gsap.utils.random([-180, 180], true),
        autoAlpha: 0,
        duration: FAST_DURATION,
        ease: "sine.out",
        onStart: () => animationActiveOverflowHidden(true),
        onComplete: () => animationActiveOverflowHidden(false)
      });

      // ================= Scroll Timeline ====================
      const tl = gsap.timeline({
        defaults: { duration: MIDDLE_DURATION, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: scrollEl,
          start: "top top+=100",
          end: "+=1000",
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          scrub: true,

          // ================= Page Transition ====================
          onLeave: () => {
            transitionPagesInPage({
              transitionEl,
              router,
              routerPushNext: "/aboutme"
            });
          }
        }
      });

      // ================= Letters Scroll Animation ====================
      tl.fromTo(
        letters,
        { x: 0, y: 0, z: 0, rotation: 0, scale: 1 },
        {
          x: 0,
          y: 0,
          z: 1000,
          scale: 1.5,
          rotation: gsap.utils.random([-200, 100, 200, 400], true),
          stagger: { each: 0.5, from: "random" }
        }
      );
    });

    // ================= Cleanup ====================
    return () => {
      ctx.revert();
      letterRefs.current = [];
    };
  }, []);

  // ================= JSX ====================
  return (
    <div ref={homeContentRef} className="home_content min-h-screen">
      {/* ================= Main Heading ==================== */}
      <AtomHeading className="perspective-[1000px]" headingRef={(el) => setRefs(el, undefined, headingRef)}>
        {lettersName
          .toLowerCase()
          .split("")
          .map((letter, letterIndex) => (
            <span
              key={letterIndex}
              ref={(el) => setRefs(el, letterRefs)}
              className="inline-block transform-3d text-black global-main-heading-classes"
            >
              {letter}
            </span>
          ))}
      </AtomHeading>

      {/* ================= Transition Layer ==================== */}
      <AtomTransitionDiv
        transitionDivRef={transitionDivRef}
        className="-translate-x-1/2 -translate-y-1/2 top-0 left-0 bg-black"
      />
    </div>
  );
}
