"use client"
import React from "react";
import { MoleculesNavigation } from "../../Molecules/MoleculesNavigation/MoleculesNavigation";

export default function OrganismsNavigation() {
  return (
    <nav className="sticky top-0 z-[100]">
      <div className="container mx-auto">
        <MoleculesNavigation />
      </div>
    </nav>
  );
}
