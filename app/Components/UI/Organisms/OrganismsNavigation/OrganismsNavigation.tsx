"use client";
import React from "react";
import { MoleculesNavigation } from "../../Molecules/MoleculesNavigation/MoleculesNavigation";
import MoleculesBackgroundAudio from "../../Molecules/MoleculesBackgroundAudio/MoleculesBackgroundAudio";

export default function OrganismsNavigation() {
  return (
    <nav className="fixed top-0 right-0 z-50">
      <div className="container mx-auto">
        <MoleculesNavigation />
      </div>
    </nav>
  );
}
