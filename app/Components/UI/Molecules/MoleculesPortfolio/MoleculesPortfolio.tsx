"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomPortfolioCard from "../../Atoms/AtomPortofolioCard/AtomPortfolioCard";
import AtomLink from "../../Atoms/AtomLink/AtomLink";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";

import { portfolioDBProp } from "@/Data/portfolioDB";
// ============== Функция соберальщик Ref ==============
import { setRefs } from "@/app/utils/SetElements/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";

// Регистрируем плагин ScrollTrigger, иначе GSAP его просто не увидит
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesPortfolio() {
  // ============== State ==============

  // Данные портфолио, которые приходят с API
  const [portfolioDB, setPortfolioDB] = useState<portfolioDBProp[]>([]);

  // ============== Refs ==============
  const cardRefs = useRef<HTMLElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const cardImgRefs = useRef<HTMLDivElement[]>([]);

  // ======= Загрузка данных =======
  useEffect(() => {
    // Получаем данные портфолио с сервера
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolioDB(data));
  }, []);

  // ======= GSAP анимации =======
  useLayoutEffect(() => {
    // Если карточки ещё не отрендерились или данных нет — выходим
    if (!cardRefs.current.length || !portfolioDB) return;

    // Главный заголовок
    const mainHeading = headingRef.current;

    // Все карточки, кроме первых двух
    // (первая — особенная, остальные анимируются по скроллу)
    const everyCards = cardRefs.current.slice(2);

    // Первая карточка портфолио и картинка
    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);

    // GSAP context — нужен, чтобы корректно чистить анимации при размонтировании
    const ctx = gsap.context(() => {
      // ======= Анимация главного заголовка =======
      if (mainHeading) {
        // Заголовок появляется с сильным смещением и масштабом
        gsap.from(mainHeading, {
          x: -1200,
          y: -400,
          scale: 2,
          autoAlpha: 1,
          duration: 2,
          ease: "back.out"
        });
      }

      // ======= Анимация первой карточки =======
      if (firstCard && firstCardImg) {
        // Все элементы карточки выезжают справа по очереди
        gsap.from(firstCard.children, {
          x: 200,
          duration: 2,
          autoAlpha: 0,
          stagger: 0.3,
          delay: 1,
          ease: "circ.out",
          onStart: () => animationActiveOverflowHidden(true),
          onComplete: () => animationActiveOverflowHidden(false)
        });

        // Картинка первой карточки:
        // огромная + далеко слева → плавно на место
        gsap.from(firstCardImg, {
          scale: 4,
          x: -2000,
          duration: 2,
          ease: "expo.out"
        });
      }

      // ======= Анимация остальных карточек по скроллу =======
      everyCards.forEach((card) => {
        // Для каждой карточки создаём отдельный timeline
        const tl = gsap.timeline({
          defaults: {
            x: 200,
            duration: 2,
            ease: "back.out(1.2)",
            stagger: 0.25
          },
          scrollTrigger: {
            // Каждая карточка сама является триггером
            trigger: card,

            // Анимация начинается, когда карточка почти вошла во viewport
            start: "top 90%",

            // Заканчивается, когда карточка уходит вверх
            end: "bottom top+=660",

            // scrub — привязывает анимацию к скроллу
            scrub: 1
          }
        });

        // Дети карточки появляются с прозрачности
        tl.from(card.children, {
          autoAlpha: 0
        });
      });
    });

    // При размонтировании компонента чистим все GSAP-анимации
    return () => ctx.revert();
  }, [portfolioDB]);
  return (
    <>
      <AtomHeading children={"Portfolio"} level={1} className="text-black" headingRef={headingRef} />

      <div className="portfolio_card global-space-main-elements">
        {portfolioDB.map((portfolioElement) => (
          <AtomPortfolioCard
            className="will-change-transform global-combining-classes-space-elements"
            // Сохраняем ref каждой карточки в массив
            cardRef={(el) => setRefs(el, cardRefs)}
            // Сохраняем ref картинки карточки
            cardImgRef={(el) => setRefs(el, cardImgRefs)}
            key={portfolioElement.id}
            src={portfolioElement.img}
            heading={
              <AtomHeading
                children={portfolioElement.heading}
                level={2}
                className="base-mini-heading-combining-classes text-black"
              />
            }
            onlineLink={<AtomLink href={portfolioElement.link} className="text-black" />}
            technologies={portfolioElement.technologies}
            paragraph={
              <AtomParagraph
                children={portfolioElement.paragraph}
                className="text-[14px] text-black global-combining-classes-space-elements lowercase first-letter:uppercase"
              />
            }
          />
        ))}
      </div>
    </>
  );
}
