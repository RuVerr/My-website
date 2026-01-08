("");
import React from "react";
import MoleculesPortfolio from "../../Molecules/MoleculesPortfolio/MoleculesPortfolio";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";

export default function OrganismsPortfolio() {
  return (
    <>
      <section className="portfolio bg-gray-500 ">
        <MoleculesBackground
          className=" backdrop: blur-[3px] bg-amber-50 "
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
