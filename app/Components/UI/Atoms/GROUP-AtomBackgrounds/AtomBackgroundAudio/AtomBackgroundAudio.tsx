import React from "react";
interface AtomBackgroundAudioProp {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

export default function AtomBackgroundAudio({ audioRef }: AtomBackgroundAudioProp) {
  return <audio ref={audioRef} src="/Audio/Background-Audio/ambient-piano-loop.mp3" loop></audio>;
}
