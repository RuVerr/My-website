"use client";
import React, { useLayoutEffect, useRef } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import { setRefs } from "@/app/utils/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useRouter } from "next/navigation";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesHome() {
  const lettersName = ["R", "U", "B", "O"];
  const letterRefs = useRef<HTMLSpanElement[]>([]);
  const fakeScroll = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const router = useRouter();

  useLayoutEffect(() => {
    const scroll = fakeScroll.current;
    const letters = letterRefs.current;
    const heading = headingRef.current;
    const ctx = gsap.context(() => {
      if (!scroll || !letters) return;
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "circ.inOut" },
        scrollTrigger: {
          trigger: heading,
          start: "top top+=200",
          end: "+=1200",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            if (self.progress >= 0.81 && self.progress < 0.91) {
              router.push("/aboutme");
            }
          }
        }
      });
      tl.fromTo(
        letters,
        { z: 0, y: 0, scale: 1 },
        { z: 500, y: 3000, scale: 4, stagger: { each: 0.2, from: "random" } }
      );
    });
    return () => ctx.revert();
  }, []);
  return (
    <>
      <AtomHeading
        className="perspective-[100px]"
        headingRef={(el) => setRefs(el, undefined, headingRef)}
        children={lettersName.map((letter, letterIndex) => (
          <span
            ref={(el) => setRefs(el, letterRefs)}
            key={letterIndex}
            className="inline-block transform-3d text-black global-main-heading-classes mx-[20px]"
          >
            {letter}
          </span>
        ))}
      />
      <div ref={fakeScroll} className="fakeScroll pointer-events-none h-[200vh]"></div>
    </>
  );
}
