import Link from "next/link";
import React from "react";

interface AtomListProp {
  children?: React.ReactNode;
  className?: string;
  listRef?: React.Ref<HTMLUListElement>;
}

export default function AtomList({ children, className = "", listRef }: AtomListProp) {
  return (
    <ul ref={listRef} className={`${className}`}>
      {children}
    </ul>
  );
}
