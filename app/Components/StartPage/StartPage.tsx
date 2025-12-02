"use client";

import gsap from "gsap";
import React, { useRef, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/Redux/Store/hooks";
import { useDispatch } from "react-redux";
import { deactivateStartPage, activateSound } from "@/app/Redux/Store/StartPageSlice/StartPageSlice";

export default function StartPage() {
  const soundRef = useRef<HTMLSpanElement | null>(null);

  const activeStartPage = useAppSelector((state) => state.StartPage.active);
  const activeSound = useAppSelector((state) => state.StartPage.activeSound);
  const dispatch = useAppDispatch();

  const handleSoundRefColor = () => {
    if (!soundRef.current) return;

    if (activeSound) {
      gsap.to(soundRef.current, { color: "#e7000b", duration: 0.3 });
    } else {
      gsap.to(soundRef.current, { color: "white", duration: 0.3 });
    }
  };
  return (
    <>
      {activeStartPage && (
        <div className="w-full h-full flex justify-center items-center fixed inset z-[1000] bg-[#00000060] backdrop-blur-3xl">
          <button
            className="global-base-button-font base-button-combining-classes border-r-0 rounded-r-[0]"
            onClick={() => dispatch(deactivateStartPage())}
          >
            Start
          </button>
          <button
            className="global-base-button-font base-button-combining-classes rounded-l-[0] p-[5px] text-red-600"
            onClick={() => {
              handleSoundRefColor();
              dispatch(activateSound());
            }}
          >
            <span ref={soundRef}>Sound</span>
          </button>
        </div>
      )}
    </>
  );
}
