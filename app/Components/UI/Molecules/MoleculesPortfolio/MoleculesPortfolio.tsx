"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { useRouter } from "next/navigation";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomPortfolioCard from "../../Atoms/AtomPortofolioCard/AtomPortfolioCard";
import AtomLink from "../../Atoms/AtomLink/AtomLink";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";

import { portfolioDBProp } from "@/Data/portfolioDB";

// ============== Функция-сборщик Ref ==============
import { setRefs } from "@/app/utils/SetElements/setRefs";

import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
import { transitionPagesBackPage, transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";

// Регистрируем плагин ScrollTrigger,
// иначе GSAP его просто не увидит
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesPortfolio() {
  // =================================
  // Hooks
  // =================================
  const router = useRouter();

  // =================================
  // State
  // =================================
  // Данные портфолио, которые приходят с API
  const [portfolioDB, setPortfolioDB] = useState<portfolioDBProp[]>([]);

  // =================================
  // Refs
  // =================================
  const headingRef = useRef<HTMLHeadingElement>(null);

  const cardRefs = useRef<HTMLElement[]>([]);
  const cardImgRefs = useRef<HTMLDivElement[]>([]);

  const fakeScrollRef = useRef<HTMLDivElement | null>(null);

  const portfolioCardsHeightRef = useRef<HTMLDivElement | null>(null);

  const transitionDivRef = useRef<HTMLDivElement | null>(null);

  // =================================
  // Загрузка данных
  // =================================
  useEffect(() => {
    // Получаем данные портфолио с сервера
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolioDB(data));
  }, []);

  // =================================
  // GSAP анимации
  // =================================
  useLayoutEffect(() => {
    // ----------- Ref-ы -----------
    const scrollEl = fakeScrollRef.current;
    const mainHeading = headingRef.current;
    const transitionEl = transitionDivRef.current;

    // ----------- Карточки -----------
    // Все карты и картинки, кроме первой
    const everyCards = cardRefs.current.slice(1);
    const everyCardsImg = cardImgRefs.current.slice(1);

    // Первая карта и её картинка
    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);

    // ----------- Размеры -----------
    const cardsSectionHeight = portfolioCardsHeightRef.current?.offsetHeight;

    // ----------- Guard -----------
    // Если чего-то нет — не продолжаем
    if (
      !scrollEl ||
      !everyCards.length ||
      !everyCardsImg.length ||
      !cardsSectionHeight ||
      !firstCard ||
      !firstCardImg ||
      !mainHeading ||
      !transitionEl
    )
      return;

    // GSAP context — нужен,
    // чтобы корректно чистить анимации при размонтировании
    const ctx = gsap.context(() => {
      // ----------- Media queries -----------
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

          // =================================
          // Анимация главного заголовка
          // =================================
          gsap.fromTo(
            mainHeading,
            {
              x: -1200,
              y: -400,
              autoAlpha: 0
            },
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: 2,
              ease: "back.out"
            }
          );

          // =================================
          // Анимация первой карточки
          // =================================
          gsap.from(firstCard.children, {
            x: 200,
            autoAlpha: 0,
            duration: 2,
            stagger: 0.3,
            delay: 1,
            ease: "circ.out",
            onStart: () => animationActiveOverflowHidden(true),
            onComplete: () => animationActiveOverflowHidden(false)
          });

          // Картинка первой карточки
          gsap.from(firstCardImg, {
            x: -2000,
            scale: 4,
            duration: 2,
            ease: "expo.out"
          });

          // =================================
          // Таймлайны
          // =================================
          const imagesTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top top",
              markers: true,
              end: () =>
                desktop
                  ? cardsSectionHeight
                  : tablet
                    ? cardsSectionHeight * 1.5
                    : mobile
                      ? cardsSectionHeight * 1.1
                      : window.innerHeight * 2,
              scrub: 1,
              onLeave: () => {
                transitionPagesInPage({
                  transitionEl,
                  router,
                  routerPushNext: "/contacts"
                });
              },
              onLeaveBack: () => {
                transitionPagesBackPage({
                  transitionEl,
                  router,
                  routerPushBack: "/aboutme"
                });
              }
            }
          });

          const cardTextTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top 20%",
              end: () =>
                desktop
                  ? cardsSectionHeight * 0.6
                  : tablet
                    ? cardsSectionHeight * 1.1
                    : mobile
                      ? cardsSectionHeight * 0.8
                      : window.innerHeight * 2,
              scrub: 1
            }
          });

          // =================================
          // Desktop
          // =================================
          if (desktop) {
            imagesTL.from(everyCardsImg, {
              x: -600,
              stagger: 0.3
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: 10,
                stagger: 0.3
              });
            });
          }

          // =================================
          // Tablet
          // =================================
          if (tablet) {
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-1900, 1900], true),
                scale: gsap.utils.random([0.1, 2], true),
                rotate: gsap.utils.random([-80, 80], true),
                stagger: 0.3
              });
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: 2,
                stagger: 0.1,
                autoAlpha: 0
              });
            });
          }

          // =================================
          // Mobile
          // =================================
          if (mobile) {
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-900, 900], true),
                scale: gsap.utils.random(0.1, 2, true),
                stagger: 0.2,
                autoAlpha: 0
              });
            });

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

    // Чистим все GSAP-анимации при размонтировании
    return () => ctx.revert();
  }, [portfolioDB]);

  // =================================
  // JSX
  // =================================
  return (
    <>
      <AtomHeading headingRef={headingRef} level={1} className="text-black opacity-0">
        Portfolio
      </AtomHeading>

      <div ref={fakeScrollRef} className="fakeScroll fixed inset-0 h-[400vh]" />

      <div ref={portfolioCardsHeightRef} className="portfolio_card global-space-main-elements mb-[100px]">
        {portfolioDB.map((portfolioElement) => (
          <AtomPortfolioCard
            key={portfolioElement.id}
            className="will-change-transform global-combining-classes-space-elements"
            // Сохраняем ref карточки
            cardRef={(el) => setRefs(el, cardRefs)}
            // Сохраняем ref картинки карточки
            cardImgRef={(el) => setRefs(el, cardImgRefs)}
            src={portfolioElement.img}
            heading={
              <AtomHeading level={2} className="base-mini-heading-combining-classes text-black">
                {portfolioElement.heading}
              </AtomHeading>
            }
            onlineLink={<AtomLink href={portfolioElement.link} className="text-black" />}
            technologies={portfolioElement.technologies}
            paragraph={
              <AtomParagraph className="text-[14px] text-black global-combining-classes-space-elements lowercase first-letter:uppercase">
                {portfolioElement.paragraph}
              </AtomParagraph>
            }
          />
        ))}
      </div>

      <div
        ref={(el) => setRefs(el, undefined, transitionDivRef)}
        className="transitionDiv fixed top-20 left-[-900px] z-50 transitionDivPortfolio bg-black w-[500px] h-[500px]"
      />
    </>
  );
}
