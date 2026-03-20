import Link from "next/link";
import React from "react";

interface AtomListProp {
  children: React.ReactNode;
  className: string;
}

export const AtomList = ({ children, className = "" }: AtomListProp) => {
  return <ul className={`${className}`}>{children}</ul>;
};
