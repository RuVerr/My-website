import Link from "next/link";
import React from "react";

type LinkType = "default" | "next" | "blank";

interface AtomLinkProp {
  href: string;
  children?: React.ReactNode;
  className?: string;
  linkTitle?: string;
  type?: LinkType;
  onClickChildren: React.MouseEventHandler<HTMLAnchorElement>;
  aBlankRef?: React.RefObject<HTMLAnchorElement | null>;
  linkNextRef?: React.RefObject<HTMLAnchorElement | null>;
}

export default function AtomLink({
  href,
  children,
  aBlankRef,
  linkTitle,
  className = "",
  type,
  onClickChildren,
  linkNextRef
}: AtomLinkProp) {
  switch (type) {
    case "next":
      return (
        <Link onClick={onClickChildren} ref={linkNextRef} className={`global-font-family ${className}`} href={href}>
          {linkTitle}
        </Link>
      );
    case "blank":
      return (
        <a href={href} ref={aBlankRef} target="_blank" className={`block decoration-none text-amber-50 ${className}`}>
          {children}
        </a>
      );
    default:
      return (
        <a href={href} className={`global-font-family ${className}`}>
          {linkTitle}
        </a>
      );
      break;
  }
}
