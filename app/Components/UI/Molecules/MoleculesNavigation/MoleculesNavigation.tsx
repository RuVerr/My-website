"use client";
import React, { useCallback, useRef } from "react";
import { AtomList } from "../../Atoms/GROUP-AtomTypography/AtomList/AtomList";
import AtomLink from "../../Atoms/GROUP-AtomTypography/AtomLink/AtomLink";
import { usePathname } from "next/navigation";

export const MoleculesNavigation = () => {
  const navigationItem = ["Home", "About me", "Portfolio", "Contacts"];
  const linkNextRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  const handleShuffle = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget;
    const text = e.currentTarget.textContent || "";
    let letter = text.split("");

    const randomChar = () => String.fromCharCode(Math.floor(Math.random() * 94) + 33);

    const shuffleInterval = setInterval(() => {
      for (let i = letter.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [letter[i], letter[j]] = [letter[j], letter[i]];
      }

      const crumbleLetters = letter.map((char) => (Math.random() > 0.5 ? randomChar() : char)).join("");

      el.textContent = crumbleLetters;
    }, 100);
    setTimeout(() => {
      el.textContent = text;
      clearInterval(shuffleInterval);
    }, 1000);
  }, []);

  const navigationTheme: Record<string, string> = {
    "/": "text-black",
    "/aboutme": "text-white",
    "/patfolio": "text-black",
    "/contacts": "text-white"
  };

  const itemColor = navigationTheme[pathname] ?? "text-gray-600";

  return (
    <>
      <AtomList
        className="navigation_list w-full flex justify-evenly align-middle py-[20px]"
        children={navigationItem.map((item, itemIndex) => (
          <li key={itemIndex} className="navigation_item w-full text-center">
            <AtomLink
              onClickChildren={(e) => handleShuffle(e)}
              linkNextRef={linkNextRef}
              href={item === "Home" ? "/" : item.trim().toLowerCase().replace(/\s+/g, "")}
              linkTitle={item}
              type="next"
              className={itemColor}
            ></AtomLink>
          </li>
        ))}
      />
    </>
  );
};
