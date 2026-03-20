"use client";
import React, { useEffect, useRef, useState } from "react";
import AtomBackgroundAudio from "../../Atoms/GROUP-AtomBackgrounds/AtomBackgroundAudio/AtomBackgroundAudio";

export default function MoleculesBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  function fadeOutAudio(audio: HTMLAudioElement, duration = 1000) {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    let start: number | null = null;
    const startValue = audio.volume;

    audio.play();

    function animate(timestamp: number) {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const percent = progress / duration;

      audio.volume = Math.max(0, startValue * (1 - percent));

      if (percent < 1) {
        requestAnimationFrame(animate);
      } else {
        audio.pause();
      }
    }
    animRef.current = requestAnimationFrame(animate);
  }

  function fadeInAudio(audio: HTMLAudioElement, duration = 1000) {
    if (animRef.current) cancelAnimationFrame(animRef.current);

    let start: number | null = null;
    const startVolume = audio.volume;
    audio.volume = 0;
    audio.play();

    function animate(timestamp: number) {
      if (!start) start = timestamp;

      const progress = timestamp - start;
      const percent = Math.min(progress / duration, 1);

      audio.volume = Math.min(1, percent);

      if (percent < 1) {
        requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);
  }

  const handlePlayAudio = () => {
    if (!audioRef.current) return;

    setIsActive((prev) => {
      const next = !prev;

      if (next) {
        fadeInAudio(audioRef.current!, 1200);
      } else {
        fadeOutAudio(audioRef.current!, 1200);
      }

      return next;
    });
  };

  return (
    <div className="background_audio_content fixed bottom-0 right-0 z-[9999] pointer-events-auto group">
      <button
        onClick={() => handlePlayAudio()}
        className={`  base-button-combining-classes mr-[10px] mb-[10px] transition duration-300 ${isActive ? "bg-white text-black" : "bg-black text-white"}`}
      >
        Sound
      </button>
      <AtomBackgroundAudio audioRef={audioRef} />
    </div>
  );
}
