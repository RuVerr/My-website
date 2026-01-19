"use client";
import React, { useRef } from "react";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import MoleculesHome from "../../Molecules/MoleculesHome/MoleculesHome";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

export default function OrganismsHome() {
  return (
    <section className="home global-space-main-elements">
      {/* //FIXME - пока нет блока экрана */}
      {/* <HiddenScreen active={activeHidden} /> */}
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
