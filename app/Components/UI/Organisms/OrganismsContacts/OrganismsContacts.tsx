"use client";
import React, { useEffect, useState } from "react";
import MoleculesContacts from "../../Molecules/MoleculesContacts/MoleculesContacts";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

export default function OrganismsContacts() {
  return (
    <section className="contacts">
      <MoleculesBackground
        backgroundSRC="/Images-and-video/Background/Video/circle-red.mp4"
        className=" backdrop: blur-[40px] "
      />
      <div className="container mx-auto">
        <div className="contacts_content relative z-[2]">
          <MoleculesContacts />
        </div>
      </div>
    </section>
  );
}
