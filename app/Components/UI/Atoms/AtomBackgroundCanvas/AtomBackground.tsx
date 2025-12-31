import React, { ReactNode } from "react";
interface AtomBackgroundCanvasProp {
  backgroundRef: React.Ref<HTMLDivElement>;
}
export default function AtomBackground({ backgroundRef }: AtomBackgroundCanvasProp) {
  return <div className=" bg-black fixed inset-0 w-full h-full" ref={backgroundRef}></div>;
}
