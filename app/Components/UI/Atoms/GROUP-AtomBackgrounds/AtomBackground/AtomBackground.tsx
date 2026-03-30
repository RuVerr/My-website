"use client";
import React from "react";
interface AtomBackgroundCanvasProp {
  backgroundRef?: React.Ref<HTMLDivElement>;
  backgroundVideoRef?: React.Ref<HTMLVideoElement>;
  videoSrc: string;
  backgroundVideoDivRef?: React.Ref<HTMLDivElement>;
  className: string;
}
export default function AtomBackground({
  backgroundRef,
  backgroundVideoRef,
  backgroundVideoDivRef,
  videoSrc,
  className
}: AtomBackgroundCanvasProp) {
  return (
    <div ref={backgroundRef} className="fixed inset-0 w-full h-full block perspective-[2000px] bg-black">
      <div
        ref={backgroundVideoDivRef}
        className={` absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] w-full h-full origin-center ${className}`}
      >
        <video
          ref={backgroundVideoRef}
          autoPlay
          loop
          muted
          playsInline
          src={videoSrc}
          preload="auto"
          className="w-full h-full object-contain block"
        ></video>
      </div>
    </div>
  );
}
