import React, { useRef } from "react";
import AtomBackgroundCanvas from "../../Atoms/AtomBackgroundCanvas/AtomBackgroundCanvas";

export default function MoleculesBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  return <AtomBackgroundCanvas canvasRef={canvasRef} />;
}
