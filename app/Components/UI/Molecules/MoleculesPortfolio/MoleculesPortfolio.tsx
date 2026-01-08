"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import AtomPortfolioCard from "../../Atoms/AtomPortofolioCard/AtomPortfolioCard";
import { portfolioDBProp } from "@/Data/portfolioDB";
import AtomLink from "../../Atoms/AtomLink/AtomLink";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";

gsap.registerPlugin(ScrollTrigger);

export default function MoleculesPortfolio() {
  const [portfolioDB, setPortfolioDB] = useState<portfolioDBProp[]>([]);
  const cardRefs = useRef<HTMLElement[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);
  const technologiesRefs = useRef<HTMLDivElement[]>([]);
  const cardImgRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  console.log(headingRef.current);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolioDB(data));
  }, []);

  useLayoutEffect(() => {
    if (!cardRefs.current.length) return;
    const mainHeading = headingRef.current;
    const everyCards = cardRefs.current.slice(2);
    const firstCard = cardRefs.current.at(0);
    const firstCardImg = cardImgRefs.current.at(0);

    const ctx = gsap.context(() => {
      //Анимация главного заголовка
      if (mainHeading) {
        gsap.from(mainHeading, { x: -900, y: -400, scale: 2, autoAlpha: 1, duration: 2, ease: "back.out" });
      }
      // Анимация первой карты и картинки
      if (firstCard && firstCardImg) {
        gsap.from(firstCard.children, {
          x: 200,
          duration: 2,
          autoAlpha: 0,
          visibility: "hidden",
          stagger: 0.3,
          ease: "circ.out"
        });
        gsap.from(firstCardImg, { scale: 4, x: -1100, duration: 2, ease: "expo.out" }), ">";
      }
      everyCards.forEach((card) => {
        const tl = gsap.timeline({
          defaults: { x: 200, duration: 2, ease: "back.out(1.2)", stagger: 0.25 },
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom +=500",
            scrub: 1
          }
        });

        tl.from(card.children, {
          autoAlpha: 0,
          visibility: "visible"
        });
      });
    });

    return () => ctx.revert();
  }, [portfolioDB]);

  const setCard = (el: HTMLElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };
  const setParagraph = (el: HTMLParagraphElement | null) => {
    if (el && !paragraphRefs.current.includes(el)) paragraphRefs.current.push(el);
  };

  const setTechnologiesRef = (el: HTMLParagraphElement | null) => {
    if (el && !technologiesRefs.current.includes(el)) technologiesRefs.current.push(el);
  };

  const setCardImg = (el: HTMLParagraphElement | null) => {
    if (el && !cardImgRefs.current.includes(el)) cardImgRefs.current.push(el);
  };

  return (
    <>
      <AtomHeading
        children={"Portfolio"}
        level={1}
        className="global-combining-classes-space-elements text-black"
        headingRef={headingRef}
      />
      <div ref={containerRef} className="portfolio_card global-space-main-elements">
        {portfolioDB.map((portfolioElement) => (
          <AtomPortfolioCard
            className=" will-change-transform global-combining-classes-space-elements"
            cardRef={setCard}
            cardImgRef={setCardImg}
            technologiesRef={setTechnologiesRef}
            key={portfolioElement.id}
            src={portfolioElement.img}
            heading={
              <AtomHeading
                children={portfolioElement.heading}
                level={2}
                className=" base-mini-heading-combining-classes text-black "
              />
            }
            onlineLink={<AtomLink href={portfolioElement.link} className="text-black" />}
            technologies={portfolioElement.technologies}
            paragraph={
              <AtomParagraph
                paragraphRef={setParagraph}
                children={portfolioElement.paragraph}
                className=" text-[14px] text-black global-combining-classes-space-elements lowercase first-letter:uppercase"
              />
            }
          />
        ))}
      </div>
    </>
  );
}
