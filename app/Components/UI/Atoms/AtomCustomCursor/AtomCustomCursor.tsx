"use client";
import React, { forwardRef } from "react";

export const AtomCustomCursor = forwardRef<HTMLDivElement, {}>((prop, ref) => {
  return (
    <div className="custom_cursor_main fixed z-10000 hidden md:block">
      <div
        ref={ref}
        className="custom_cursor relative border border-solid rounded-3xl w-[50px] h-[50px] pointer-events-none will-change-transform"
      ></div>
    </div>
  );
});
