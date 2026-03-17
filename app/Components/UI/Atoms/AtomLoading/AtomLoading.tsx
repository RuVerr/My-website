import React from "react";

interface AtomLoadingProp {
  children?: React.ReactNode;
  className: string;
  spanClassName: string;
}

export const AtomLoading = ({ children = "Loading", className = "", spanClassName = "" }: AtomLoadingProp) => {
  return (
    <div className={`w-full h-full flex justify-center items-center fixed inset-0 z-[99999] ${className}`}>
      <span className={`global-font-family loading-animate text-9xl uppercase ${(className = spanClassName)}`}>
        {children}
      </span>
    </div>
  );
};
