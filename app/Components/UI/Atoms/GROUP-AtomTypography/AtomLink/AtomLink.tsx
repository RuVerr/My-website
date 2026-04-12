import Link from "next/link";
import React from "react";

type LinkType = "default" | "next" | "blank";

interface AtomLinkProp {
  href: string;
  className?: string;
  linkTitle?: string;
  children?: React.ReactNode
  type?: LinkType;
  onClickChildren?: React.MouseEventHandler<HTMLAnchorElement>;
  aBlankRef?: React.RefObject<HTMLAnchorElement | null>;
  linkNextRef?: React.RefObject<HTMLAnchorElement | null>;
}

export default function AtomLink({
  href,
  aBlankRef,
  linkTitle,
  children,
  className = "",
  type,
  onClickChildren,
  linkNextRef
}: AtomLinkProp) {
  switch (type) {
    case "next":
      return (
        <Link
          onClick={onClickChildren}
          ref={linkNextRef}
          className={`decoration-none ${className}`}
          href={href}
        >
          {linkTitle || children}
        </Link>
      );
    case "blank":
      return (
        <a href={href} ref={aBlankRef} target="_blank" className={`block decoration-none text-amber-50 ${className}`}>
          {linkTitle || children}
        </a>
      );
    default:
      return (
        <a href={href} className={`global-font-family decoration-none ${className}`}>
          {linkTitle || children}
        </a>
      );
      break;
  }
}
