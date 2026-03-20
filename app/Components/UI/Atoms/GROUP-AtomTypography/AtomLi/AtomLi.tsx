import React, { Children } from "react";

interface AtomLiProp {
  children: React.ReactNode;
  className: string;
  refLi: React.Ref<HTMLLIElement>;
}

export default function AtomLi({ children, className = "", refLi }: AtomLiProp){
  return (
    <li
      ref={refLi}
      className={`text-amber-50 base-li-combining-classes inline-block global-user-no-select ${className}`}
    >
      {children}
    </li>
  );
};
