"use client";

import React, { useLayoutEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import AtomTransitionDiv from "../../Atoms/AtomTransitionDiv/AtomTransitionDiv";

// Регистрируем плагин ScrollTrigger для GSAP
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  // ================= Data ====================
  const lettersName = ["R", "U", "B", "O"];

  // ================= Refs ====================
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  const homeContentRef = useRef<HTMLDivElement | null>(null);

  // ================= Router ====================
  const router = useRouter();

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    const letters = letterRefs.current;
    const heading = headingRef.current;
    const transitionEl = transitionDivRef.current;
    const homeContent = homeContentRef.current;

    // ================= Guard ====================
    // Проверяем, что все refs существуют
    if (!letters?.length || !heading || !transitionEl || !homeContent) return;

    // ================= GSAP Context ====================
    const ctx = gsap.context(() => {
      // ================= Transition Element ====================
      gsap.set(transitionEl, { scale: 0 });

      // ================= Intro Animation ====================
      gsap.from(letters, {
        z: () => gsap.utils.random(-50, 100),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-100, 30),
        autoAlpha: 0,
        duration: 1.5,
        ease: "sine.out",
        onStart: () => animationActiveOverflowHidden(true),
        onComplete: () => animationActiveOverflowHidden(false)
      });

      // ================= Scroll Animation ====================
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: homeContent,
          start: "top top+=100",
          end: "+=150%",
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
          rotation: () => gsap.utils.random(-200, 200),
          stagger: { each: 0.2, from: "random" }
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
      <AtomHeading className="perspective-[600px]" headingRef={(el) => setRefs(el, undefined, headingRef)}>
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
