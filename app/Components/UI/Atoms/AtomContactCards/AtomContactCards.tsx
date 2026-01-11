import contacts from "@/app/(Pages)/(Contacts)/contacts/page";
import React from "react";
import { string } from "three/tsl";

interface AtomContactCardsProp {
  heading: React.ReactNode;
  imgSRC: string;
  link: React.ReactNode;
  paragraph: React.ReactNode;
}

export default function AtomContactCards({ heading, imgSRC, link, paragraph }: AtomContactCardsProp) {
  return (
    <article className="contacts_card max-w-[600px]">
      {heading}
      <img src={imgSRC} alt={typeof heading === "string" ? heading + "icon" : "contacts icon"} />
      <div className="contacts_card_desc">{paragraph}</div>
      {link}
    </article>
  );
}
