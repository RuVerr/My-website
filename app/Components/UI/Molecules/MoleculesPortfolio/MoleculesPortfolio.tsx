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

  const fakeScrollRef = useRef<HTMLDivElement | null>(null);
  const portfolioCardsHeightRef = useRef<HTMLDivElement | null>(null);

  // ======= Загрузка данных =======
  useEffect(() => {
    // Получаем данные портфолио с сервера
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolioDB(data));
  }, []);

  // ======= GSAP анимации =======
  useLayoutEffect(() => {
    // ============ Ссылки на Ref-ы ============
    const scrollEl = fakeScrollRef.current;
    const mainHeading = headingRef.current;
    // ============ Все карты и картинки кроме первой ============
    const everyCards = cardRefs.current.slice(1);
    const everyCardsImg = cardImgRefs.current.slice(1);
    //==============Первая карта и его картинка===================
    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);
    //==============Расчет высоты секции карт===================
    const cardsSectionHeight = portfolioCardsHeightRef.current?.offsetHeight;

    //==============Если чего-то нет не продолжаем===================
    if (!scrollEl || !everyCards.length || !cardsSectionHeight || !everyCardsImg.length || !firstCard || !firstCardImg)
      return;
    //==============Медиа настройки для gsap===================
    const mm = gsap.matchMedia();
    // GSAP context — нужен, чтобы корректно чистить анимации при размонтировании
    const ctx = gsap.context(() => {
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return;
          const { desktop, tablet, mobile } = context.conditions;

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

          // Все элементы карточки выезжают справа по очереди
          gsap.from(firstCard.children, {
            x: 200,
            duration: 2,
            autoAlpha: 0,
            stagger: 0.3,
            delay: 1,
            ease: "circ.out"
            // onStart: () => animationActiveOverflowHidden(true),
            // onComplete: () => animationActiveOverflowHidden(false)
          });

          //==============Картинка первой карточки===================
          gsap.from(firstCardImg, {
            scale: 4,
            x: -2000,
            duration: 2,
            ease: "expo.out"
          });

          //==============Таймлайны картинок и текст в карточках===================
          const imagesTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top 20%",
              end: () =>
                desktop
                  ? cardsSectionHeight * 0.7
                  : tablet
                    ? cardsSectionHeight * 1.1
                    : mobile
                      ? cardsSectionHeight * 0.8
                      : window.innerHeight * 2,
              scrub: 1
            }
          });

          const cardTextTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top 20%",
              end: () =>
                desktop
                  ? cardsSectionHeight * 0.7
                  : tablet
                    ? cardsSectionHeight * 1.1
                    : mobile
                      ? cardsSectionHeight * 0.8
                      : window.innerHeight * 2,
              scrub: 1
            }
          });

          // =======================
          //Desktop Desktop esktop
          // =======================
          if (desktop) {
            //==============Анимация картинок===================
            imagesTL.from(everyCardsImg, {
              x: -600,
              stagger: 0.3
            });
            //==============Анимация текста===================
            everyCards.forEach((card) => {
              cardTextTL.from(card.children, { x: 600, duration: 10, stagger: 0.3 });
            });
          }
          // =======================
          //Tablet Tablet Tablet
          // =======================
          if (tablet) {
            //==============Анимация картинок===================
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-1900, 1900], true),
                scale: gsap.utils.random([0.1, 2], true),
                rotate: gsap.utils.random([-80, 80], true),
                stagger: 0.3
              });
            });
            //==============Анимация текста===================
            everyCards.forEach((card) => {
              cardTextTL.from(card.children, { x: 600, duration: 2, stagger: 0.1, autoAlpha: 0 });
            });
          }

          // =======================
          //Mobile Mobile Mobile
          // =======================
          if (mobile) {
            //==============Анимация картинок===================
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-900, 900], true),
                scale: gsap.utils.random(0.1, 2, true),
                stagger: 0.2,
                autoAlpha: 0
              });
            });
            //==============Анимация текста===================
            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: gsap.utils.random([-900, 900], true),
                scale: gsap.utils.random(0.1, 2, true),
                autoAlpha: 0,
                duration: 2,
                delay: 0.2,
                stagger: 0.1
              });
            });
          }
        }
      );
    });

    // При размонтировании компонента чистим все GSAP-анимации
    return () => ctx.revert();
  }, [portfolioDB]);
  return (
    <>
      <div ref={fakeScrollRef} className="fakeScroll fixed inset-0 h-[400vh]"></div>
      <AtomHeading children={"Portfolio"} level={1} className="text-black" headingRef={headingRef} />

      <div ref={portfolioCardsHeightRef} className="portfolio_card global-space-main-elements">
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
