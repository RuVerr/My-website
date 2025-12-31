import React, { ReactNode } from "react";
interface AtomBackgroundCanvasProp {
  canvasRef: React.Ref<HTMLCanvasElement>;
}
export default function AtomBackgroundCanvas({ canvasRef }: AtomBackgroundCanvasProp) {
  return <canvas className=" bg-black fixed inset-0 w-full h-full" ref={canvasRef}></canvas>;
}
