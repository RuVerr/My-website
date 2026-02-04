"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import AtomBackground from "../../Atoms/AtomBackground/AtomBackground";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

interface MoleculesBackgroundProp {
  scrollRef?: React.RefObject<HTMLDivElement>;
  backgroundSRC: string;
  className: string;
}

export default function MoleculesBackground({ scrollRef, backgroundSRC, className }: MoleculesBackgroundProp) {
  const backgroundVideoRef = useRef<HTMLVideoElement | null>(null);
  const backgroundVideoDivRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useLayoutEffect(() => {
    const video = backgroundVideoRef.current;
    if (!video) return;

    const MAX_SPEED = 2;
    const MIN_SPEED = 0.8;

    let currentSpeed = MIN_SPEED;
    let targetSpeed = MIN_SPEED;

    let timeout: number;

    const handleMouseMove = () => {
      targetSpeed = MAX_SPEED;

      clearTimeout(timeout);

      timeout = window.setTimeout(() => {
        targetSpeed = MIN_SPEED;
      }, 500);
    };

    function animate() {
      currentSpeed += (targetSpeed - currentSpeed) * 0.8;

      currentSpeed = Math.min(2, Math.max(0.5, currentSpeed));

      video!.playbackRate = currentSpeed;
      requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  useLayoutEffect(() => {
    const background = backgroundVideoDivRef.current;
    const scrollEl = scrollRef?.current;
    if (!background) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return;
          const { desktop, tablet, mobile } = context.conditions;
          const tl = gsap.timeline({
            defaults: { duration: 2, ease: "power4.inOut" },
            scrollTrigger: {
              trigger: scrollEl,
              scrub: true,
              start: "top bottom",
              end: "bottom top",
              onLeaveBack: () => {
                router.push("/");
              }
            }
          });

          if (desktop) {
            tl.fromTo(background, { scale: 10 }, { scale: 1 });
          }
          if (tablet) {
            tl.fromTo(background, { scale: 3.5 }, { scale: 3 });
          }
          if (mobile) {
            tl.fromTo(background, { scale: 6 }, { scale: 3.5 });
          }
        }
      );
    });
    return () => ctx.revert();
  }, [router, scrollRef?.current]);
  return (
    <>
      <AtomBackground
        className={`${className}`}
        backgroundVideoRef={backgroundVideoRef}
        backgroundVideoDivRef={backgroundVideoDivRef}
        videoSrc={`${backgroundSRC}`}
      />
    </>
  );
}
