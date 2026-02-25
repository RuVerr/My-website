"use client";

import React, { useLayoutEffect, useRef } from "react";

import { useRouter } from "next/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";

// Регистрируем плагин ScrollTrigger для GSAP
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  // =================================
  // Data
  // =================================
  // Массив букв для заголовка
  const lettersName = ["R", "U", "B", "O"];

  // =================================
  // Refs
  // =================================
  // Ссылки на все элементы <span> с буквами
  const letterRefs = useRef<HTMLSpanElement[]>([]);

  // Заголовок
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  // Элемент для page transition
  const transitionDivRef = useRef<HTMLDivElement | null>(null);

  // =================================
  // Router
  // =================================
  const router = useRouter();
  // =================================
  // GSAP animations
  // =================================
  useLayoutEffect(() => {
    const letters = letterRefs.current;
    const heading = headingRef.current;
    const transitionEl = transitionDivRef.current;

    // GSAP context —
    // изолирует анимации и упрощает cleanup
    const ctx = gsap.context(() => {
      // Guard: если нет элементов — выходим
      if (!letters?.length || !heading || !transitionEl) return;

      // Скрываем transition-элемент на старте
      gsap.set(transitionEl, {
        autoAlpha: 0
      });

      // =================================
      // Intro animation
      // =================================
      gsap.from(letters, {
        z: () => gsap.utils.random(-50, 100),
        y: () => gsap.utils.random(-300, 300),
        rotation: () => gsap.utils.random(-100, 30),
        autoAlpha: 0,
        duration: 3,

        // Блокируем скролл на время анимации
        onStart: () => {
          animationActiveOverflowHidden(true);
        },

        // Возвращаем скролл обратно
        onComplete: () => {
          animationActiveOverflowHidden(false);
        }
      });

      // =================================
      // Scroll animation
      // =================================
      const tl = gsap.timeline({
        defaults: {
          duration: 2,
          ease: "circ.inOut"
        },
        scrollTrigger: {
          trigger: heading,
          start: "top top+=200",
          end: () => window.innerHeight,
          markers: true,
          pin: true,
          anticipatePin: 1,
          scrub: true,

          // Переход на следующую страницу
          onLeave: () => {
            transitionPagesInPage({
              transitionEl,
              router,
              routerPushNext: "/aboutme"
            });
          }
        }
      });

      // Анимация букв при скролле
      tl.fromTo(
        letters,
        {
          x: 0,
          y: 0,
          z: 0,
          rotation: 0,
          scale: 1
        },
        {
          x: 0,
          y: 600,
          z: 1000,
          scale: 1.5,
          rotation: () => gsap.utils.random(-200, 200),
          stagger: {
            each: 0.2,
            from: "random"
          }
        }
      );
    });

    // Очищаем все GSAP-анимации
    // при размонтировании компонента
    return () => ctx.revert();
  }, []);

  // =================================
  // JSX
  // =================================
  return (
    <>
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

      {/* Фейковый скролл для ScrollTrigger */}
      <div className="fakeScroll pointer-events-none h-[200vh]" />

      <div
        ref={transitionDivRef}
        className="transitionDiv overflow-hidden pointer-events-auto w-[200px] h-[200px] fixed z-50
                   bottom-0 left-0 -translate-x-1/2 -translate-y-1/2
                   rounded-full bg-black"
      />
    </>
  );
}
