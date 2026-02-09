import React from "react";

type HeadingTag = "h1" | "h2" | "h3" | "h4";

interface AtomHeadingProp {
  children?: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
}

export default function AtomHeading({ children, level = 1, className, headingRef }: AtomHeadingProp) {
  const Tag = `h${level}` as HeadingTag;
  return (
    <>
      <Tag
        ref={headingRef}
        className={`base-heading-combining-classes global-user-no-select will-change-transform pt-[10px] ${className}`}
      >
        {children}
      </Tag>
    </>
  );
}
