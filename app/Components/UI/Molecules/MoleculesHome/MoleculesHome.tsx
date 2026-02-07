"use client";
import React, { useLayoutEffect, useRef } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import { setRefs } from "@/app/utils/SetElements/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";

// Регистрируем плагин ScrollTrigger для GSAP
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  // Массив букв для заголовка
  const lettersName = ["R", "U", "B", "O"];
  // Ссылки на все элементы <span> с буквами
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  // const blackTransitionRef = useRef<HTMLDivElement | null>(null);
  // Флаг для перехода на другую страницу после скролла
  const navigationFlag = useRef<boolean | null>(false);

  //Для переброса на нужную страницу
  const router = useRouter();

  useLayoutEffect(() => {
    const letters = letterRefs.current;
    const heading = headingRef.current;
    // const transition = blackTransitionRef.current;

    // Контекст GSAP для изоляции анимаций (очень удобно с React)
    const ctx = gsap.context(() => {
      if (!letters?.length || !heading) return; // Если нет элементов, выходим
      gsap.from(letters, {
        z: () => gsap.utils.random(-50, 100), // Случайная глубина при старте
        y: () => gsap.utils.random(-300, 300), // Случайное вертикальное смещение
        rotation: () => gsap.utils.random(-100, 30), // Случайный угол поворота
        autoAlpha: 0, // Прозрачные в начале
        duration: 3,
        // Блок документа при анимации
        onStart: () => {
          animationActiveOverflowHidden(true);
        },
        // Разблок документа после анимации
        onComplete: () => {
          animationActiveOverflowHidden(false);
        }
      });

      // ========================== Анимация букв при скролле ==========================
      // Используем ScrollTrigger: буквы двигаются, увеличиваются и вращаются по мере скролла
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: heading, // Элемент, за которым следим
          start: "top top+=200", // Начало триггера (через 200px после верха)
          end: "+=1200", // Длина триггера (на сколько прокрутки)
          pin: true,
          anticipatePin: 1,
          scrub: true // Анимация синхронизирована с прокруткой // Фиксируем заголовок на месте
          // onUpdate: (self) => {
          //   // Когда прогресс ScrollTrigger между 0.81 и 0.91 — навигация на другую страницу
          //   if (self.progress >= 0.81 && self.progress < 0.91) {
          //     navigationFlag.current = true;
          //     router.push("/aboutme");
          //   }
          // }
        }
      });
      // Анимация движения букв при скролле
      tl.fromTo(
        letters,
        {
          x: 0,
          z: 0,
          y: 0,
          rotation: 0,
          scale: 1
        },
        {
          x: 0, // Центр по горизонтали
          y: 600, // Двигаем вниз на 600px
          z: 900, // Приближаем к камере на 900px
          scale: 1.5, // Увеличиваем размер
          rotation: () => gsap.utils.random(-200, 200), // Случайный поворот
          stagger: { each: 0.2, from: "random" } // Рандомное смещение букв
        }
      );

      // //Анимация перехода
      // tl.fromTo(
      //   transition,
      //   { scale: 0, autoAlpha: 0 },
      //   { scale: 20, duration: 1, autoAlpha: 1, delay: 1, ease: "sine.inOut" },
      //   "<"
      // );
    });

    // Очищаем все анимации при размонтировании компонента
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Div для перехода */}
      {/* <div
        ref={blackTransitionRef}
        className="black-transition w-[200px] h-[200px] bg-black fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-100 rounded-[50%]"
      ></div> */}
      <AtomHeading
        className="perspective-[1000px]" // Перспектива для 3D эффекта
        headingRef={(el) => setRefs(el, undefined, headingRef)}
        children={lettersName.map((letter, letterIndex) => (
          <span
            ref={(el) => setRefs(el, letterRefs)}
            key={letterIndex}
            className="inline-block transform-3d text-black global-main-heading-classes"
          >
            {letter}
          </span>
        ))}
      />
      {/* Фейковый скролл, чтобы ScrollTrigger работал */}
      <div className="fakeScroll pointer-events-none h-[200vh]"></div>
    </>
  );
}
