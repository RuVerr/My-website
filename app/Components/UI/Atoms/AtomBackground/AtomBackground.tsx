import React from "react";
interface AtomBackgroundCanvasProp {
  backgroundRef?: React.Ref<HTMLDivElement>;
  backgroundVideoRef?: React.Ref<HTMLVideoElement>;
  videoSrc: string;
  backgroundVideoDivRef?: React.Ref<HTMLDivElement>;
  className: string
}
export default function AtomBackground({
  backgroundRef,
  backgroundVideoRef,
  backgroundVideoDivRef,
  videoSrc,
  className
  
}: AtomBackgroundCanvasProp) {
  return (
    <div ref={backgroundRef} className="fixed inset-0 w-full h-full block perspective-[1000px]">
      <div ref={backgroundVideoDivRef} className={`transform-3d ${className}`}>
        <video
          ref={backgroundVideoRef}
          autoPlay
          loop
          muted
          playsInline
          src={videoSrc}
          preload="auto"
          className="w-full h-full object-cover block"
        ></video>
      </div>
    </div>
  );
}
