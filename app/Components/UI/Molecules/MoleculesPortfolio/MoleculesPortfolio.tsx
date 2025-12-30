"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import AtomPortfolioCard from "../../Atoms/AtomPortofolioCard/AtomPortfolioCard";
import { portfolioDBProp } from "@/Data/portfolioDB";
import AtomLink from "../../Atoms/AtomLink/AtomLink";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";
import Lenis from "@studio-freight/lenis/types";

gsap.registerPlugin(ScrollTrigger);

export default function MoleculesPortfolio() {
  const [portfolioDB, setPortfolioDB] = useState<portfolioDBProp[]>([]);
  const cardRefs = useRef<HTMLElement[]>([]);
  const headingRefs = useRef<HTMLElement[]>([]);
  const paragraphRefs = useRef<HTMLParagraphElement[]>([]);
  const technologiesRefs = useRef<HTMLDivElement[]>([]);
  const cardImgRefs = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const smoothScrollWrapperRef = useRef<HTMLDivElement | null>(null);

  console.log(cardRefs.current);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => setPortfolioDB(data));
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((card) => {
        const tl = gsap.timeline({
          defaults: { x: 200, duration: 2, visibility: "hidden", ease: "power4.inOut" },
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "bottom 70%",
            scrub: true
          }
        });

        tl.from(card.children, {
          opacity: 0,
          stagger: 1,
          visibility: "visible"
        });
      });
    });

    return () => ctx.revert();
  }, [portfolioDB]);

  const setCard = (el: HTMLElement | null) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  const setHeading = (el: HTMLElement | null) => {
    if (el && !headingRefs.current.includes(el)) headingRefs.current.push(el);
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
        // headingRef={setPortfolioElements}
        children={"Portfolio"}
        level={1}
        className="global-combining-classes-space-elements text-black"
      />
      <div ref={smoothScrollWrapperRef} className="wrapper">
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
                  headingRef={setHeading}
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
      </div>
    </>
  );
}
