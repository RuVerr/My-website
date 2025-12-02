"use client";
import { useAppSelector } from "@/app/Redux/Store/hooks";
import React, { useEffect, useRef } from "react";

export default function AudioBackground() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSound = useAppSelector((state) => state.StartPage.activeSound);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.05;

    if (activeSound) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current?.pause();
    }
  }, [activeSound]);

  return <audio ref={audioRef} src="/Audio/Background-Audio/ambient-piano-loop.mp3" loop></audio>;
}
