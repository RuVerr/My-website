"use client";

// ================= React ====================
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// ================= Navigation ====================
import { useRouter } from "next/navigation";

// ================= GSAP ====================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ================= Atomic Components ====================
import AtomHeading from "../../Atoms/GROUP-AtomTypography/AtomHeading/AtomHeading";
import AtomPortfolioCard from "../../Atoms/GROUP-AtomPortofolioCard/AtomPortfolioCard";
import AtomLink from "../../Atoms/GROUP-AtomTypography/AtomLink/AtomLink";
import AtomParagraph from "../../Atoms/GROUP-AtomTypography/AtomParagraph/AtomParagraph";
import AtomTransitionDiv from "../../Atoms/GROUP-AtomCustomEffects/AtomTransitionDiv/AtomTransitionDiv";

// ================= Types ====================
import { portfolioDBProp } from "@/Data/portfolioDB";

// ================= Utils ====================
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/WindowUtils/overflowHidden";
import { transitionPagesBackPage, transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { autoScrollTop } from "@/app/utils/WindowUtils/autoScrollTop";
import { fetchDataWithController } from "@/app/utils/FetchUtils/fetchDataWithController";
import AtomSpan from "../../Atoms/GROUP-AtomTypography/AtomSpan/AtomSpan";

gsap.registerPlugin(ScrollTrigger);

export default function MoleculesPortfolio() {
  // ================= Router ====================
  const router = useRouter();

  // ================= State ====================
  const [portfolioDB, setPortfolioDB] = useState<portfolioDBProp[]>([]);

  // ================= Refs ====================
  const headingRef = useRef<HTMLHeadingElement>(null);

  const cardRefs = useRef<HTMLElement[]>([]);
  const cardImgRefs = useRef<HTMLDivElement[]>([]);

  const portfolioContentRef = useRef<HTMLDivElement | null>(null);
  const portfolioCardsHeightRef = useRef<HTMLDivElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);

  // ================= Fetch Data ====================
  useEffect(() => {
    return fetchDataWithController({
      fetchApi: "/api/portfolio",
      setData: setPortfolioDB
    });
  }, []);

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    // ================= Auto scroll top ====================
    autoScrollTop();
    // ================= Elements ====================
    const scrollEl = portfolioContentRef.current;
    const mainHeading = headingRef.current;
    const transitionEl = transitionDivRef.current;

    // ================= Cards ====================
    const everyCards = cardRefs.current.slice(1);
    const everyCardsImg = cardImgRefs.current.slice(1);

    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);

    // ================= Measurements ====================
    const cardsSectionHeight = portfolioCardsHeightRef.current?.offsetHeight;

    // ================= Guard ====================
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

    // ========== GSAP constants settings ============
    const FAST_DURATION = 1;
    const MIDDLE_DURATION = 2;
    const SLOW_DURATION = 10;

    // ================= GSAP Context ====================
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

          // ================= Transition Initial ====================
          gsap.set(transitionEl, { scale: 0 });

          // ================= Heading Intro ====================
          gsap.fromTo(
            mainHeading,
            { x: -1200, y: -400, autoAlpha: 0 },
            { x: 0, y: 0, autoAlpha: 1, duration: FAST_DURATION, ease: "back.out" }
          );

          // ================= First Card Intro ====================
          gsap.from(firstCard.children, {
            x: 200,
            autoAlpha: 0,
            duration: FAST_DURATION,
            stagger: 0.2,
            ease: "circ.out",
            onStart: () => animationActiveOverflowHidden(true),
            onComplete: () => animationActiveOverflowHidden(false)
          });

          gsap.from(firstCardImg, {
            x: -2000,
            scale: 4,
            duration: FAST_DURATION,
            ease: "expo.out"
          });

          // ================= Scroll Timelines ====================
          const imagesTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top top",
              end: () => (desktop ? cardsSectionHeight * 0.7 : tablet ? cardsSectionHeight : cardsSectionHeight),
              scrub: 1,
              onLeave: () =>
                transitionPagesInPage({
                  transitionEl,
                  router,
                  routerPushNext: "/contacts"
                }),

              onLeaveBack: () =>
                transitionPagesBackPage({
                  transitionEl,
                  router,
                  routerPushBack: "/aboutme"
                })
            }
          });

          const cardTextTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: "top 20%",
              end: () =>
                desktop ? cardsSectionHeight * 0.6 : tablet ? cardsSectionHeight * 1.1 : cardsSectionHeight * 0.8,
              scrub: 1
            }
          });

          // ================= Desktop ====================
          if (desktop) {
            imagesTL.from(everyCardsImg, {
              x: -600,
              stagger: 0.3
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: SLOW_DURATION,
                stagger: 0.3
              });
            });
          }

          // ================= Tablet ====================
          if (tablet) {
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-1900, 1900], true),
                scale: gsap.utils.random([0.1, 2], true),
                rotate: gsap.utils.random([-80, 80], true)
              });
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: MIDDLE_DURATION,
                stagger: 0.1,
                autoAlpha: 0
              });
            });
          }

          // ================= Mobile ====================
          if (mobile) {
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-900, 900], true),
                scale: gsap.utils.random(0.1, 2, true),
                autoAlpha: 0
              });
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: gsap.utils.random([-900, 900], true),
                scale: gsap.utils.random(0.1, 2, true),
                autoAlpha: 0,
                duration: MIDDLE_DURATION
              });
            });
          }
        }
      );
    });

    // ================= Cleanup ====================
    return () => ctx.revert();
  }, [portfolioDB]);

  // ================= JSX ====================
  return (
    <div ref={portfolioContentRef} className="portfolio_content min-h-screen">
      {/* ================= Heading ==================== */}
      <AtomHeading headingRef={headingRef} level={1} className="text-black opacity-0">
        Portfolio
      </AtomHeading>

      {/* ================= Portfolio Cards ==================== */}
      <div ref={portfolioCardsHeightRef} className="portfolio_card global-space-main-elements mb-[100px]">
        {portfolioDB.map((portfolioElement) => (
          <AtomPortfolioCard
            key={portfolioElement.id}
            className="will-change-transform global-combining-classes-space-elements"
            cardRef={(el) => setRefs(el, cardRefs)}
            cardImgRef={(el) => setRefs(el, cardImgRefs)}
            src={portfolioElement.img}
            heading={
              <AtomHeading
                level={2}
                children={portfolioElement.heading}
                className="base-mini-heading-combining-classes text-black"
              />
            }
            onlineLink={
              <AtomLink
                type="blank"
                linkTitle={"Go Live"}
                href={portfolioElement.link}
                className=" global-font-family border-1 border-black rounded-2xl w-1/2 py-[5px] text-center text-black uppercase"
              />
            }
            technologies={portfolioElement.technologies}
            paragraph={
              <AtomParagraph
                className=" global-font-family text-[14px] text-black global-combining-classes-space-elements lowercase first-letter:uppercase"
                children={portfolioElement.paragraph}
              />
            }
          />
        ))}
      </div>

      {/* ================= Transition Layer ==================== */}
      <AtomTransitionDiv
        transitionDivRef={transitionDivRef}
        className="bottom-[-300px] left-1/2 -translate-x-1/2 bg-black"
      />
    </div>
  );
}
