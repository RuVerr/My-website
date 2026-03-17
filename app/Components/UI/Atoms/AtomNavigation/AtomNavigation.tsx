import Link from "next/link";
import React from "react";

interface AtomNavigationProp {
  children: React.ReactNode;
}

export const AtomNavigation = ({ children }: AtomNavigationProp) => {
  return <ul className="navigation_list w-full flex justify-evenly align-middle py-[20px]">{children}</ul>;
};
