import React from "react";
import AtomLink from "../../GROUP-AtomTypography/AtomLink/AtomLink";

interface AtomContactCardsProp {
  heading: React.ReactNode;
  imgSRC: string;
  link: string;
  cardRef: React.Ref<HTMLAnchorElement | null>;
}

export default function AtomContactCards({ heading, imgSRC, link, cardRef }: AtomContactCardsProp) {
  return (
    <AtomLink
      type="blank"
      href={link}
      // @ts-ignore
      aBlankRef={cardRef}
      className="group block w-full pb-[20px]"
      children={
        <article className="contacts_card relative overflow-hidden border-2 border-amber-50 rounded-4xl px-[40px] py-[20px]">
          <div className="imgAndHeading flex items-center max-sm:justify-center">
            <img
              src={imgSRC}
              className="w-[120px] max-lg:w-[80px]"
              alt={typeof heading === "string" ? heading + "icon" : "contacts icon"}
            />
            <div className="w-full max-sm:hidden">{heading}</div>
          </div>
          <div className="link_svg absolute inset-0 flex items-center justify-center -translate-y-full group-hover:translate-y-0 transition-transform pointer-events-none duration-300 rounded-3xl bg-amber-50">
            <img src="/Images-and-video/Icon/soc-icon/link.svg" alt="link icon" />
          </div>
        </article>
      }
    />
  );
}
