import React from "react";
import { JSX } from "react/jsx-runtime";

interface AtomHeadingProp {
  children?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
}

export default function AtomHeading({ children, level = 1, className, headingRef }: AtomHeadingProp) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <>
      {/* @ts-ignore */}
      <Tag ref={headingRef} className={`base-heading-combining-classes global-user-no-select will-change-transform pt-[30px] ${className}`}>
        {children}
      </Tag>
    </>
  );
}
