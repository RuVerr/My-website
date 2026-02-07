"use client";
// ====================== IMPORTS ========================
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import MoleculesAboutMe from "../../Molecules/MoleculesAboutMe/MoleculesAboutMe";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

// =================== COMPONENT =========================

export default function OrganismsAboutMe() {
  // ===================== STATE ==========================
  const [activeHidden, setActiveHidden] = useState<boolean>(true); // экран-заглушка при входе
  // ===================== REFS ===========================
  const scrollAboutMeRef = useRef<HTMLDivElement | null>(null); // основной scroll-триггер
  const transitionDivRef = useRef<HTMLDivElement | null>(null); // элемент для transition-анимации
  const transitionFlag = useRef<boolean>(true); // флаг, чтобы анимация сработала 1 раз
  // ===================== ROUTER =========================
  const router = useRouter();
  // ============== HIDDEN SCREEN LOGIC ===================
  useEffect(() => {
    let hiddenTimeout: ReturnType<typeof setTimeout>;

    hiddenTimeout = setTimeout(() => {
      setActiveHidden(false); // убираем hidden-экран
    }, 2500);

    return () => clearInterval(hiddenTimeout);
  }, []);
  // ============ GSAP + SCROLLTRIGGER ====================
  useLayoutEffect(() => {
    const scrollEl = scrollAboutMeRef.current;
    const transitionEl = transitionDivRef.current;
    const scrollHeight = window.innerHeight;

    console.log(scrollHeight);

    if (!scrollEl || !transitionEl || !scrollHeight) return;
    // ===== начальное состояние transition-элемента =====
    const ctx = gsap.context(() => {
      transitionPagesInPage({
        scrollEl,
        transitionEl,
        transitionFlag,
        scrollHeight,
        scrollProgress: 98,
        router,
        routerPushNext: "/portfolio",
        routerPushBack: "/"
      });
    });

    return () => ctx.revert(); // чистим gsap context
  }, []);

  return (
    <section ref={scrollAboutMeRef} className="about_me global-space-main-elements h-lvh">
      {/* ===== экран-заглушка при загрузке ===== */}
      <HiddenScreen active={activeHidden} />
      {/* ===== фоновое видео ===== */}
      <MoleculesBackground
        className="backdrop: blur-[30px] max-lg:blur-[5px]"
        backgroundSRC="/Images-and-video/Background/Video/rotating-riangles.mp4"
        //@ts-ignore
        scrollRef={scrollAboutMeRef}
      />
      {/* ===== основной контент ===== */}
      <div className="container mx-auto">
        <div className="about_me_content relative z-[2] w-full global-space-main-elements">
          <MoleculesAboutMe />
        </div>
      </div>
      {/* ===== transition-элемент ===== */}
      <div
        ref={transitionDivRef}
        className="transitionDiv pointer-events-auto w-[200px] h-[200px] fixed z-50
                   top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   rounded-full bg-amber-50 text-amber-50"
      />
    </section>
  );
}
