import contacts from "@/app/(Pages)/(Contacts)/contacts/page";
import React from "react";
import { string } from "three/tsl";

interface AtomContactCardsProp {
  heading: React.ReactNode;
  imgSRC: string;
  link: string;
}

export default function AtomContactCards({ heading, imgSRC, link }: AtomContactCardsProp) {
  return (
    <a href={link} target="_blank" className="group block">
      <article className="contacts_card relative overflow-hidden backdrop-blur-2xl rounded-4xl px-[40px]">
        <div className="imgAndHeading flex items-center">
          <img src={imgSRC} alt={typeof heading === "string" ? heading + "icon" : "contacts icon"} />
          {heading}
        </div>
        <div className="link_svg absolute inset-0 flex items-center justify-center -translate-y-full group-hover:translate-y-0 transition-transform pointer-events-none duration-300 bg-amber-50">
          <img src="/Images-and-video/Icon/soc-icon/link.svg" alt="link icon" />
        </div>
      </article>
    </a>
  );
}
