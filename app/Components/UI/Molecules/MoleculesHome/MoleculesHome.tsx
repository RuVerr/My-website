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
  // ================= Data ====================
  const lettersName = ["R", "U", "B", "O"];
  // ================= Elements ====================
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  const homeContentRef = useRef<HTMLDivElement | null>(null);

  // ================= Router ====================
  const router = useRouter();

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    // ================= Auto scroll top ====================
    autoScrollTop();
    // ================= Refs ====================
    const letters = letterRefs.current;
    const heading = headingRef.current;
    const transitionEl = transitionDivRef.current;
    const homeContent = homeContentRef.current;

    // ================= Guard ====================
    // Проверяем, что все refs существуют
    if (!letters?.length || !heading || !transitionEl || !homeContent) return;
    // ========== GSAP constants settings ============
    const FAST_DURATION = 1.5;
    const MIDDLE_DURATION = 2;

    // ================= GSAP Context ====================
    const ctx = gsap.context(() => {
      // ================= Transition Element ====================
      gsap.set(transitionEl, { scale: 0 });
      // ================= Intro Animation ====================
      gsap.from(letters, {
        z: gsap.utils.random([-50, 100], true),
        y: gsap.utils.random(-1000, 300, true),
        rotation: gsap.utils.random([-100, 100], true),
        autoAlpha: 0,
        duration: FAST_DURATION,
        ease: "sine.out",
        onStart: () => animationActiveOverflowHidden(true),
        onComplete: () => animationActiveOverflowHidden(false)
      });

      // ================= Scroll Animation ====================
      const tl = gsap.timeline({
        defaults: { duration: MIDDLE_DURATION, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: homeContent,
          start: "top top+=100",
          end: "+=100%",
          markers: true,
          pin: true,
          anticipatePin: 1,
          pinSpacing: true,
          scrub: true,
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
      <AtomHeading className="perspective-[1000px]" headingRef={(el) => setRefs(el, undefined, headingRef)}>
        {lettersName.map((letter, letterIndex) => (
          <span
            key={letterIndex}
            ref={(el) => setRefs(el, letterRefs)}
            className="inline-block transform-3d text-black global-main-heading-classes"
          >
            {letter}
          </span>
        ))}
      </AtomHeading>
      {/* ================= Transition Div ==================== */}
      <AtomTransitionDiv
        transitionDivRef={transitionDivRef}
        className="-translate-x-1/2 -translate-y-1/2 top-0 left-0 bg-black"
      />
    </div>
  );
}
