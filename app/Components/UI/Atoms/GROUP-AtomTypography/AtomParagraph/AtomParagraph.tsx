import React from "react";

interface AtomParagraphProp {
  children?: React.ReactNode;
  className?: string;
  paragraphRef?: React.Ref<HTMLParagraphElement>;
}

export default function AtomParagraph({ children, className, paragraphRef }: AtomParagraphProp) {
  return (
    <p
      ref={paragraphRef}
      className={`${className}`}
    >
      {children}
    </p>
  );
}
