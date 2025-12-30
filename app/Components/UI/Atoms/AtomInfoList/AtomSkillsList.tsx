import React from "react";
import AtomHeading from "../AtomHeading/AtomHeading";

interface AtomInfoListProp {
  children: string;
  classNameLI?: string;
  refLi?: React.Ref<HTMLLIElement>;
  refPercentages: React.Ref<HTMLSpanElement>;
}

export default function AtomSkillsList({ children, classNameLI, refPercentages, refLi }: AtomInfoListProp) {
  return (
    <li
      ref={refLi}
      className={`text-amber-50 base-li-combining-classes inline-block global-user-no-select w-full will-change-transform ${classNameLI}`}
    >
      {children}
      <span ref={refPercentages} className="percentages whitespace-pre-wrap text-red-700 will-change-transform">
        {`  (0%)`}
      </span>
    </li>
  );
}
