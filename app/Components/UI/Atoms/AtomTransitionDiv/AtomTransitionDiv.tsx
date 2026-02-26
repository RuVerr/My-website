import React from "react";

interface AtomTransitionDivProp {
  transitionDivRef: React.Ref<HTMLDivElement | null>;
  className: string;
}

export default function AtomTransitionDiv({ transitionDivRef, className = "" }: AtomTransitionDivProp) {
  return (
    <div
      ref={transitionDivRef}
      className={`transitionDiv pointer-events-auto w-[300vmax] h-[300vmax] fixed z-[9999]
                       rounded-full ${className}`}
    />
  );
}
