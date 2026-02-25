"use client";
import React from "react";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import MoleculesHome from "../../Molecules/MoleculesHome/MoleculesHome";

export default function OrganismsHome() {
  return (
    <section className="home global-space-main-elements h-lvh">
      <MoleculesBackground
        className=" backdrop: blur-[3px] "
        backgroundSRC="/Images-and-video/Background/Video/whistling-circles.mp4"
      />
      <div className="container mx-auto">
        <div className="home_content flex justify-center w-full h-full">
          <MoleculesHome />
        </div>
      </div>
    </section>
  );
}
