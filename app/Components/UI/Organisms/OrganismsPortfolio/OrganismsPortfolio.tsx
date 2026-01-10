"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import MoleculesPortfolio from "../../Molecules/MoleculesPortfolio/MoleculesPortfolio";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

export default function OrganismsPortfolio() {
  const [activeHidden, setActiveHidden] = useState<boolean>(true);
  useLayoutEffect(() => {
    let hiddenTimeout: ReturnType<typeof setTimeout>;

    hiddenTimeout = setTimeout(() => {
      setActiveHidden(false);
    }, 1000);
  }, []);
  return (
    <>
      <section className="portfolio w-full h-full bg-gray-500 overflow-hidden">
        <HiddenScreen active={activeHidden} />
        <MoleculesBackground
          className="bg-amber-50 "
          backgroundSRC="/Images-and-video/Background/Video/white-lines.mp4"
        />
        <div className="container mx-auto">
          <div className="portfolio_content relative z-[2]">
            <MoleculesPortfolio />
          </div>
        </div>
      </section>
    </>
  );
}
