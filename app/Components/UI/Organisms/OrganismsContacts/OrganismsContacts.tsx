"use client";
import React from "react";
import MoleculesContacts from "../../Molecules/MoleculesContacts/MoleculesContacts";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";

export default function OrganismsContacts() {
  return (
    <section className="contacts">
      <MoleculesBackground
        backgroundSRC="/Images-and-video/Background/Video/circle-red.mp4"
        className=" backdrop: blur-[10px] "
      />
      <div className="container mx-auto">
        <MoleculesContacts />
      </div>
    </section>
  );
}
