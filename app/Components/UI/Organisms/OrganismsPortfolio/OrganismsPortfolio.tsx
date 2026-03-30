"use client";
import MoleculesPortfolio from "../../Molecules/MoleculesPortfolio/MoleculesPortfolio";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";

export default function OrganismsPortfolio() {
  return (
    <>
      <section className="portfolio w-full bg-gray-500 overflow-hidden">
        <MoleculesBackground
          className=" backdrop: blur-[5px] "
          backgroundSRC="/Images-and-video/Background/Video/white-lines.mp4"
        />
        <div className="container mx-auto">
          <MoleculesPortfolio />
        </div>
      </section>
    </>
  );
}
