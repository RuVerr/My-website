import React from "react";
import dynamic from "next/dynamic";
import { AtomLoading } from "../../Atoms/GROUP-AtomBackgrounds/AtomLoading/AtomLoading";

const OrganismsHome = dynamic(() => import("@/app/Components/UI/Organisms/OrganismsHome/OrganismsHome"), {
  loading: () => <AtomLoading className="bg-white" spanClassName="text-black" />
});
export default function TemplateHome() {
  return (
    <>
      <OrganismsHome />
    </>
  );
}
