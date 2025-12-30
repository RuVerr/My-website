import React from "react";
import BackgroundVanta from "../../Atoms/BackgroundVanta/BackroundVanta";
import MoleculesPortfolio from "../../Molecules/MoleculesPortfolio/MoleculesPortfolio";

export default function OrganismsPortfolio() {
  return (
    <>
      <section className="portfolio bg-gray-500">
        <BackgroundVanta effect="waves" />
        <div className="container mx-auto">
          <div className="portfolio_content relative z-[2]">
            <MoleculesPortfolio />
          </div>
        </div>
      </section>
    </>
  );
}
