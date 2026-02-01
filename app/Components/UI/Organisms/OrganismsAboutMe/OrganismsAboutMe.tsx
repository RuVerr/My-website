"use client";
// ====================== IMPORTS ========================
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import MoleculesAboutMe from "../../Molecules/MoleculesAboutMe/MoleculesAboutMe";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

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
    if (!scrollEl || !transitionEl || !scrollHeight) return;
    // ===== начальное состояние transition-элемента =====
    gsap.set(transitionEl, {
      autoAlpha: 0,
      scale: 0.1,
      ease: "expo.inOut"
    });
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return;
          const { desktop, tablet, mobile } = context.conditions;

          // ===== ScrollTrigger =====
          const st = ScrollTrigger.create({
            trigger: scrollEl,
            start: "top 10%",
            end: () =>
              desktop
                ? scrollHeight * 2.5
                : tablet
                  ? "+=" + scrollHeight * 1.5
                  : mobile
                    ? "+=" + scrollHeight * 3
                    : scrollHeight,
            scrub: 1,

            // ===== отслеживаем прогресс скролла =====
            onUpdate: (self) => {
              if (self.direction > 0 && self.progress >= 0.98 && transitionFlag.current) {
                transitionFlag.current = false;
                // ===== финальная transition-анимация =====
                handleTransitionEl("/portfolio");
              }
              if (self.direction < 0 && self.progress < 0.05 && transitionFlag.current) {
                // ===== Обратный transition-анимация =====

                transitionFlag.current = false;
                handleTransitionEl("/");
              }
            }
          });

          function handleTransitionEl(routerPush?: string) {
            gsap.to(transitionEl, {
              scale: 16,
              autoAlpha: 1,
              duration: 1,
              onComplete: () => {
                router.push(`${routerPush}`); // переход на страницу
                st.disable(); // убиваем только этот ScrollTrigger
              }
            });
          }
        }
      );
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
