"use client";
import React, { useLayoutEffect, useRef } from "react";
import MoleculesBackground from "../MoleculesBackground/MoleculesBackground";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import gsap from "gsap";
import AtomContactCards from "../../Atoms/AtomContactCards/AtomContactCards";

export default function MoleculesContacts() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    if (!headingRef.current) return;
    const heading = headingRef.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 2, autoAlpha: 0, ease: "power4.out" } });

      tl.from(heading, { x: -400, scale: 0.5 });
    });

    return () => ctx.revert();
  }, []);
  return (
    <>
      <AtomHeading
        children="Contacts"
        level={1}
        headingRef={headingRef}
        className="global-combining-classes-space-elements text-white"
      />
      <div className="contacts_cards">
        <AtomContactCards heading="Telegram" imgSRC="/Images-and-video/icon/soc-icon/telegram.svg" link="google.com" paragraph={"test"} />
      </div>
    </>
  );
}
