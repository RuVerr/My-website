"use client";
import React, { useLayoutEffect, useRef } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import { setRefs } from "@/app/utils/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

// Регистрируем плагин ScrollTrigger для GSAP
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  // Массив букв для заголовка
  const lettersName = ["R", "U", "B", "O"];
  // Ссылки на все элементы <span> с буквами
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  // Флаг для перехода на другую страницу после скролла
  const navigationFlag = useRef<boolean | null>(false);

  //Для переброса на нужную страницу
  const router = useRouter();

  useLayoutEffect(() => {
    const letters = letterRefs.current;
    const heading = headingRef.current;

    // Контекст GSAP для изоляции анимаций (очень удобно с React)
    const ctx = gsap.context(() => {
      if (!letters?.length || !heading) return; // Если нет элементов, выходим
      // ========================== Интро анимация букв ==========================
      // Буквы стартуют случайно разбросанными по Y и Z с поворотом, затем собираются в центр
      gsap.fromTo(
        letters,
        {
          z: () => gsap.utils.random(0, 100), // Случайная глубина при старте
          y: () => gsap.utils.random(-300, 300), // Случайное вертикальное смещение
          autoAlpha: 0, // Прозрачные в начале
          rotation: () => gsap.utils.random(-30, 30) // Случайный угол поворота
        },
        {
          z: 0, // Все буквы на нулевой глубине
          y: 0, // Выравниваем по вертикали
          rotation: 0, // Убираем поворот
          duration: 2, // Длительность интро
          autoAlpha: 1, // Делаем видимыми
          ease: "sine.inOut",
          stagger: { each: 0.2, from: "random" } // Рандомное появление букв
        }
      );

      // ========================== Анимация букв при скролле ==========================
      // Используем ScrollTrigger: буквы двигаются, увеличиваются и вращаются по мере скролла
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: heading, // Элемент, за которым следим
          start: "top top+=200", // Начало триггера (через 200px после верха)
          end: "+=1200", // Длина триггера (на сколько прокрутки)
          scrub: true, // Анимация синхронизирована с прокруткой
          pin: true, // Фиксируем заголовок на месте
          anticipatePin: 1, // Немного предугадываем пин для плавности
          onUpdate: (self) => {
            // Когда прогресс ScrollTrigger между 0.81 и 0.91 — навигация на другую страницу
            if (self.progress >= 0.81 && self.progress < 0.91) {
              navigationFlag.current = true;
              router.push("/aboutme");
            }
          }
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
    });

    // Очищаем все анимации при размонтировании компонента
    return () => ctx.revert();
  }, []);

  return (
    <>
      <AtomHeading
        className="perspective-[1000px]" // Перспектива для 3D эффекта
        headingRef={(el) => setRefs(el, undefined, headingRef)}
        children={lettersName.map((letter, letterIndex) => (
          <span
            ref={(el) => setRefs(el, letterRefs)}
            key={letterIndex}
            className="inline-block transform-3d text-black global-main-heading-classes mx-[20px]"
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
