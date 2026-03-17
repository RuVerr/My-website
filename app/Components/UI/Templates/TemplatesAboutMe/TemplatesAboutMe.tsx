import React from "react";
import dynamic from "next/dynamic";
import { AtomLoading } from "../../Atoms/AtomLoading/AtomLoading";

const OrganismsAboutMe = dynamic(() => import("@/app/Components/UI/Organisms/OrganismsAboutMe/OrganismsAboutMe"), {
  loading: () => <AtomLoading className="bg-black" spanClassName="text-white"/>
});

export default function TemplatesAboutMe() {
  return (
    <>
      <OrganismsAboutMe />
    </>
  );
}
