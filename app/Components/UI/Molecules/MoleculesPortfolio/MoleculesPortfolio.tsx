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

  // ================= Fetch Portfolio Data ====================
  useEffect(() => {
    // Fetch portfolio items with abort controller safety
    return fetchDataWithController({
      fetchApi: "/api/portfolio",
      setData: setPortfolioDB
    });
  }, []);

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    // ================= Scroll Reset ====================
    autoScrollTop();

    // ================= Extract Elements ====================
    const scrollEl = portfolioContentRef.current;
    const mainHeading = headingRef.current;
    const transitionEl = transitionDivRef.current;

    // ================= Cards Separation ====================
    const everyCards = cardRefs.current.slice(1);
    const everyCardsImg = cardImgRefs.current.slice(1);

    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);

    // ================= Guard ====================
    if (
      !scrollEl ||
      !everyCards.length ||
      !everyCardsImg.length ||
      !firstCard ||
      !firstCardImg ||
      !mainHeading ||
      !transitionEl
    )
      return;

    // ================= Animation Constants ====================
    const FAST_DURATION = 1;
    const MIDDLE_DURATION = 2;
    const SLOW_DURATION = 10;

    // ================= GSAP Context ====================
    // Scope animations to component lifecycle
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ================= Responsive Animations ====================
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return;

          const { desktop, tablet, mobile } = context.conditions;

          // ================= Transition Initial State ====================
          gsap.set(transitionEl, { scale: 0 });

          // ================= Heading Intro Animation ====================
          gsap.fromTo(
            mainHeading,
            { x: -1200, y: -400, autoAlpha: 0 },
            {
              x: 0,
              y: 0,
              autoAlpha: 1,
              duration: FAST_DURATION,
              ease: "back.out"
            }
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
              start: desktop ? "top 30%" : tablet || mobile ? "top center" : "top top",
              end: () => {
                const maxScroll = scrollEl.scrollHeight - window.innerHeight;
                const endValue = Math.min(scrollEl.scrollHeight, maxScroll);
                return `+=${endValue}`;
              },
              scrub: 1.1
            }
          });
          const cardTextTL = gsap.timeline({
            scrollTrigger: {
              trigger: scrollEl,
              start: desktop ? "top top" : tablet || mobile ? "top 20%" : "top top",
              end: () => {
                const maxScroll = scrollEl.scrollHeight - window.innerHeight;
                const endValue = Math.min(scrollEl.scrollHeight, maxScroll);
                return `+=${endValue}`;
              },
              scrub: 1.1
            }
          });

          // ================= Page Transition Triggers ====================
          ScrollTrigger.create({
            trigger: scrollEl,
            start: desktop || tablet ? "top top" : "top 20%",
            end: () => {
              const maxScroll = scrollEl.scrollHeight - window.innerHeight;
              const endValue = Math.min(scrollEl.scrollHeight, maxScroll);
              return `+=${endValue}`;
            },
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
          });

          // ================= Desktop Animations ====================
          if (desktop) {
            imagesTL.from(everyCardsImg, {
              x: -600,
              stagger: 2,
              autoAlpha: 0,
              duration: FAST_DURATION
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: SLOW_DURATION,
                stagger: 0.2,
                autoAlpha: 0
              });
            });
          }

          // ================= Tablet Animations ====================
          if (tablet) {
            everyCardsImg.forEach((img) => {
              imagesTL.from(img, {
                x: gsap.utils.random([-1900, 1900], true),
                scale: gsap.utils.random([0.1, 2], true),
                rotate: gsap.utils.random([-100, 100], true),
                duration: MIDDLE_DURATION
              });
            });

            everyCards.forEach((card) => {
              cardTextTL.from(card.children, {
                x: 600,
                duration: FAST_DURATION,
                stagger: 0.1,
                autoAlpha: 0
              });
            });
          }

          // ================= Mobile Animations ====================
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
                x: 900,
                scale: gsap.utils.random(0.1, 2, true),
                autoAlpha: 0,
                duration: FAST_DURATION,
                stagger: 0.2
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
    <div ref={portfolioContentRef} className="portfolio_content pb-[200px]">
      {/* ================= Page Heading ==================== */}
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
                className="global-font-family border-1 border-black rounded-2xl w-1/2 py-[5px] text-center text-black uppercase"
              />
            }
            technologies={portfolioElement.technologies}
            paragraph={
              <AtomParagraph
                className="global-font-family text-[14px] text-black global-combining-classes-space-elements lowercase first-letter:uppercase"
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
