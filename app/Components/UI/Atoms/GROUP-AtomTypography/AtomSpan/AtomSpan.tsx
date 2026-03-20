import React from "react";

interface AtomSpanProp {
  children: React.ReactNode;
  className: string;
  refPercentages: React.Ref<HTMLSpanElement>;
}

export default function AtomSpan({ children, className = "", refPercentages }: AtomSpanProp) {
  return (
    <span ref={refPercentages} className={`${className}`}>
      {children}
    </span>
  );
}
