"use client";
import React, { useLayoutEffect, useRef } from "react";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import MoleculesHome from "../../Molecules/MoleculesHome/MoleculesHome";

import gsap from "gsap";
import { transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { useRouter } from "next/navigation";

export default function OrganismsHome() {
  const scrollHomeRef = useRef<HTMLDivElement | null>(null); // элемент для transition-анимации
  const transitionDivRef = useRef<HTMLDivElement | null>(null); // элемент для transition-анимации
  const transitionFlag = useRef<boolean>(true); // флаг, чтобы анимация сработала 1 раз

  const router = useRouter();

  useLayoutEffect(() => {
    const scrollEl = scrollHomeRef.current;
    const transitionEl = transitionDivRef.current;
    const scrollHeight = window.innerHeight;

    if (!scrollEl || !transitionDivRef || !transitionEl || !scrollHeight) return;
    const ctx = gsap.context(() => {
      transitionPagesInPage({
        scrollEl,
        transitionEl,
        transitionFlag,
        scrollHeight,
        scrollProgress: 20,
        router,
        routerPushNext: "/aboutme"
      });
    });

    return () => ctx.revert();
  }, []);
  return (
    <section ref={scrollHomeRef} className="home global-space-main-elements h-lvh">
      <MoleculesBackground
        className=" backdrop: blur-[3px] "
        backgroundSRC="/Images-and-video/Background/Video/whistling-circles.mp4"
      />
      <div className="container mx-auto">
        <div className="home_content flex justify-center w-full h-full">
          <MoleculesHome />
        </div>
      </div>
      <div
        ref={transitionDivRef}
        className="transitionDiv pointer-events-auto w-[200px] h-[200px] fixed z-50
                   bottom-0 left-0 -translate-x-1/2 -translate-y-1/2
                   rounded-full aboutMeTransition"
      />
    </section>
  );
}
