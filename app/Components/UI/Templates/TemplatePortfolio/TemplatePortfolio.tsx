import React from "react";
import dynamic from "next/dynamic";
import { AtomLoading } from "../../Atoms/GROUP-AtomBackgrounds/AtomLoading/AtomLoading";

const OrganismsPortfolio = dynamic(
  () => import("@/app/Components/UI/Organisms/OrganismsPortfolio/OrganismsPortfolio"),
  { loading: () => <AtomLoading className="bg-white" spanClassName="text-black" /> }
);
export default function TemplatePortfolio() {
  return (
    <>
      <OrganismsPortfolio />
    </>
  );
}
