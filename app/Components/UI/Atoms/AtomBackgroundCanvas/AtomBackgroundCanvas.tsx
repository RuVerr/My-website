import React, { ReactNode } from "react";
interface AtomBackgroundCanvasProp {
  canvasRef: React.Ref<HTMLCanvasElement>;
}
export default function AtomBackgroundCanvas({ canvasRef }: AtomBackgroundCanvasProp) {
  return <canvas ref={canvasRef}></canvas>;
}
