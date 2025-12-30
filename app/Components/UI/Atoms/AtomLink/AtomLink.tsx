"use client";
import React from "react";

interface AtomLinkProp {
  href: string;
  className?: string;
}

export default function AtomLink({ href, className = "" }: AtomLinkProp) {
  return (
    <a href={href} target="_blanc" className={`block underline decoration-1 text-amber-50 ${className}`}>
      Project Link
    </a>
  );
}
