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
    const scale = window.innerWidth < 768 ? 7 : 1;
    const background = backgroundVideoDivRef.current;
    const scrollEl = scrollRef?.current;
    if (!background) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        background,
        { scale: 4 },
        {
          scale: scale,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: scrollEl,
            scrub: true,
            markers: true,
            start: "top bottom",
            end: "bottom top",
            onLeaveBack: () => {
              router.push("/");
            }
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
