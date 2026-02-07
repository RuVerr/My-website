"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MoleculesContacts from "../../Molecules/MoleculesContacts/MoleculesContacts";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";

import gsap from "gsap";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { useRouter } from "next/navigation";

export default function OrganismsContacts() {
  const scrollContactsRef = useRef<HTMLDivElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  const transitionFlag = useRef<boolean>(true);
  const router = useRouter();
  useLayoutEffect(() => {
    const scrollEl = scrollContactsRef.current;
    const transitionEl = transitionDivRef.current;
    const scrollHeight = window.innerHeight;

    if (!scrollEl || !transitionFlag || !transitionEl || !scrollHeight) return;
    const ctx = gsap.context(() => {
      transitionPagesInPage({
        scrollEl,
        transitionEl,
        transitionFlag,
        scrollHeight,
        router,
        routerPushBack: "/portfolio"
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <section ref={scrollContactsRef} className="contacts">
      <MoleculesBackground
        backgroundSRC="/Images-and-video/Background/Video/circle-red.mp4"
        className=" backdrop: blur-[40px] "
      />
      <div className="container mx-auto">
        <div className="contacts_content relative z-[2]">
          <MoleculesContacts />
        </div>
      </div>
      <div
        ref={transitionDivRef}
        className="transitionDiv pointer-events-auto w-[200px] h-[200px] fixed z-50
                   bottom-0 left-0 -translate-x-1/2 -translate-y-1/2
                   rounded-full bg-white"
      />
    </section>
  );
}
