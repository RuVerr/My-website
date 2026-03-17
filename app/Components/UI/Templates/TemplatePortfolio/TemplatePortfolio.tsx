import dynamic from "next/dynamic";
import React from "react";
import { AtomLoading } from "../../Atoms/AtomLoading/AtomLoading";
// import OrganismsPortfolio from "../../Organisms/OrganismsPortfolio/OrganismsPortfolio";

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
