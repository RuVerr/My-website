"use client";

import React, { useEffect } from "react";

interface props {
  active: boolean;
}

export default function HiddenScreen({ active }: props) {
  useEffect(() => {
    const body = document.body;
    const html = document.documentElement;
    window.scrollTo(0, 0);
    if (active) {
      body.style.overflow = "hidden";
      html.style.overflow = "hidden";
    } else {
      body.style.overflow = "";
      html.style.overflow = "";
    }
  }, [active]);
  return null;
}
