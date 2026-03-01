"use client";
import React from "react";

import MoleculesAboutMe from "../../Molecules/MoleculesAboutMe/MoleculesAboutMe";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";

export default function OrganismsAboutMe() {
  return (
    <section className="about_me global-space-main-elements">
      {/* ===== фоновое видео ===== */}
      <MoleculesBackground
        className="backdrop: blur-[30px] max-lg:blur-[5px]"
        backgroundSRC="/Images-and-video/Background/Video/rotating-riangles.mp4"
      />
      {/* ===== основной контент ===== */}
      <div className="container mx-auto">
        <MoleculesAboutMe />
      </div>
    </section>
  );
}
