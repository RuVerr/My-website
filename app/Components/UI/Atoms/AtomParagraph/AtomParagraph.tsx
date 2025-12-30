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
      className={`base-paragraph-combining-classes global-user-no-select whitespace-pre-line will-change-transform ${className}`}
    >
      {children}
    </p>
  );
}
