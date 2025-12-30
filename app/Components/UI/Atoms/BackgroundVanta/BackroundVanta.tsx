"use client";

import { useLayoutEffect, useRef } from "react";

interface BackgroundVantaProp {
  effect: string;
}

export default function BackgroundVanta({ effect }: BackgroundVantaProp) {
  const ref = useRef<HTMLDivElement>(null);
  const vantaRef = useRef<any>(null);

  useLayoutEffect(() => {
    const head = document.head;

    const loadScript = (src: string) => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        head.appendChild(script);
      });
    };

    (async () => {
      try {
        // Загружаем Three.js
        await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
        // Загружаем Vanta.js
        if (effect === "birds") {
          await loadScript("https://cdn.jsdelivr.net/npm/vanta/dist/vanta.birds.min.js");
        } else if (effect === "waves") {
          await loadScript("https://cdn.jsdelivr.net/npm/vanta/dist/vanta.waves.min.js");
        }

        if (ref.current && (window as any).VANTA && (window as any).VANTA[effect.toUpperCase()]) {
          let effectOptions: Record<string, any> = {
            el: ref.current,
            THREE: (window as any).THREE,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 2.0
          };
          if (effect === "birds") {
            vantaRef.current = (window as any).VANTA[effect.toUpperCase()]({
              ...effectOptions,
              birdSize: 1,
              quantity: 3,
              backgroundColor: 0x0,
              color1: 0xffffff
            });
          } else if (effect === "waves") {
            vantaRef.current = (window as any).VANTA[effect.toUpperCase()]({
              ...effectOptions,
              color: 0x989898,
              shininess: 15.0,
              waveHeight: 10.0,
              waveSpeed: 1,
              zoom: 0.8
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      if (vantaRef.current) {
        vantaRef.current.destroy();
        vantaRef.current = null;
      }
      if (ref.current) {
        ref.current.innerHTML = "";
      }

      //@ts-ignore
      if (window.THREE?.WebGLRenderer?.forceContextLoss) {
        const canvas = ref.current?.querySelector("canvas");
        canvas?.getContext("webgl")?.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  return <div ref={ref} className="background_vanta blur-[3px] fixed inset-0 w-full h-full" />;
}
