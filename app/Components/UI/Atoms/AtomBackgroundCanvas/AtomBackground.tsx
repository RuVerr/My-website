import React, { ReactNode } from "react";
interface AtomBackgroundCanvasProp {
  canvasRef: React.Ref<HTMLDivElement>;
}
export default function AtomBackground({ canvasRef }: AtomBackgroundCanvasProp) {
  return <div className=" bg-black fixed inset-0 w-full h-full" ref={canvasRef}></div>;
}
