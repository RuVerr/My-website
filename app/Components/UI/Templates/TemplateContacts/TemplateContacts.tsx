import React from "react";
import dynamic from "next/dynamic";
import { AtomLoading } from "../../Atoms/GROUP-AtomBackgrounds/AtomLoading/AtomLoading";

const OrganismsContacts = dynamic(() => import("@/app/Components/UI/Organisms/OrganismsContacts/OrganismsContacts"), {
  loading: () => <AtomLoading className="bg-black" spanClassName="text-white" />
});

export default function TemplateContacts() {
  return (
    <>
      <OrganismsContacts />
    </>
  );
}
