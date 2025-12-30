import React from "react";
import MoleculesAboutMe from "../../Molecules/MoleculesAboutMe/MoleculesAboutMe";
import BackgroundVanta from "../../Atoms/BackgroundVanta/BackroundVanta";
import MoleculesBackgroundCanvas from "../../Molecules/MoleculesBackgroundCanvas/MoleculesBackgroundCanvas";

export default function OrganismsAboutMe() {
  return (
    <section className="about_me bg-black">
      <MoleculesBackgroundCanvas />
      <div className="container mx-auto">
        <div className="about_me_content relative z-[2] w-full global-space-main-elements">
          <MoleculesAboutMe />
        </div>
      </div>
    </section>
  );
}
