"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MoleculesPortfolio from "../../Molecules/MoleculesPortfolio/MoleculesPortfolio";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import gsap from "gsap";

import { useRouter } from "next/navigation";

export default function OrganismsPortfolio() {
  // const [activeHidden, setActiveHidden] = useState<boolean>(true);
  const scrollPortfolioRef = useRef<HTMLDivElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  let transitionFlag = useRef<boolean>(true);

  const router = useRouter();

  useLayoutEffect(() => {
    const scrollEl = scrollPortfolioRef.current;
    const transitionEl = transitionDivRef.current;
    const scrollHeight = scrollEl?.offsetHeight;

    console.log(scrollHeight);

    if (!scrollEl || !transitionDivRef || !transitionEl || !scrollHeight) return;
    const ctx = gsap.context(() => {
      transitionPagesInPage({
        scrollEl,
        transitionEl,
        transitionFlag,
        scrollHeight,
        scrollProgress: 98,
        router,
        routerPushNext: "/contacts",
        routerPushBack: "/aboutme"
      });
    });
    return () => ctx.revert();
  }, []);
  return (
    <>
      <section ref={scrollPortfolioRef} className="portfolio w-full h-screen-[100dvh] bg-gray-500 overflow-hidden">
        {/* <HiddenScreen active={activeHidden} /> */}
        <MoleculesBackground
          className="bg-amber-50 "
          backgroundSRC="/Images-and-video/Background/Video/white-lines.mp4"
        />
        <div className="container mx-auto">
          <div className="portfolio_content relative z-[2]">
            <MoleculesPortfolio />
          </div>
        </div>
        <div
          ref={transitionDivRef}
          className="transitionDiv fixed top-20 left-[-900px] z-50 transitionDivPortfolio bg-black w-[500px] h-[500px]"
        ></div>
      </section>
    </>
  );
}
