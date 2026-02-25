"use client";
import React, { useLayoutEffect, useRef } from "react";
import { AtomCustomCursor } from "../../Atoms/AtomCustomCursor/AtomCustomCursor";
import { usePathname } from "next/navigation";

export default function MoleculesCustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const location = usePathname();

  useLayoutEffect(() => {
    if (!cursorRef.current) return;
    const cursor = cursorRef.current;

    location === "/"
      ? (cursor.style.borderColor = "black")
      : location === "/aboutme"
        ? (cursor.style.borderColor = "white")
        : location === "/portfolio"
          ? (cursor.style.borderColor = "black")
          : (cursor.style.borderColor = "white");

    const moveCursor = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px,0)`;
    };

    window.addEventListener("mousemove", moveCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
    };
  }, [location]);

  return (
    <div>
      <AtomCustomCursor ref={cursorRef} />
    </div>
  );
}
