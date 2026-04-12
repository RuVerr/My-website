"use client";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomList from "../../Atoms/GROUP-AtomTypography/AtomList/AtomList";
import AtomLink from "../../Atoms/GROUP-AtomTypography/AtomLink/AtomLink";
import { usePathname } from "next/navigation";

import gsap from "gsap";
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/WindowUtils/overflowHidden";
import { fetchDataWithController } from "@/app/utils/FetchUtils/fetchDataWithController";
import AtomLi from "../../Atoms/GROUP-AtomTypography/AtomLi/AtomLi";

import { contactsDBProp } from "@/Data/contactsDB";

export const MoleculesNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);
  const navigationItem = ["Home", "About me", "Portfolio", "Contacts"];
  const linkNextRef = useRef<HTMLAnchorElement | null>(null);
  const navigationContentRef = useRef<HTMLDivElement | null>(null);
  const liRefs = useRef<HTMLLIElement[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const pathname = usePathname() || "/";

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

  // const navigationTheme: Record<string, string> = {
  //   "/": "text-black",
  //   "/aboutme": "text-white",
  //   "/portfolio": "text-black",
  //   "/contacts": "text-white"
  // };

  const handleShowMenu = () => {
    setShowMenu((prev) => !prev);
  };

  // const itemColor = navigationTheme[pathname] ?? "text-gray-600";

  useEffect(() => {
    return fetchDataWithController({
      fetchApi: "/api/contacts",
      setData: setContactsDB
    });
  }, []);

  useLayoutEffect(() => {
    const navigationContent = navigationContentRef.current;
    const li = liRefs.current;
    const underList = listRef.current;

    if (!navigationContent || !li.length || !underList) return;
    const ctx = gsap.context(() => {
      const masterTl = gsap.timeline({ defaults: { ease: "power4.inOut" } });
      masterTl.fromTo(
        li,
        { xPercent: showMenu ? 100 : 0 },
        {
          xPercent: showMenu ? 0 : 100,
          duration: 0.5,
          stagger: { each: 0.1, from: showMenu ? "start" : "start" },
          onComplete: () => {
            if (showMenu) {
              animationActiveOverflowHidden(true);
            } else {
              animationActiveOverflowHidden(false);
            }
          }
        }
      );

      if (showMenu) {
        masterTl.from(underList, { yPercent: -200, autoAlpha: 0, duration: 0.5, ease: "circ.inOut" });
      } else {
        masterTl.to(underList, { yPercent: 200, autoAlpha: 0, duration: 0.5 });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [showMenu]);

  return (
    <>
      <div
        onClick={() => handleShowMenu()}
        className={`bg_hidden fixed inset-0 bg-black/50 pointer-events-auto ${showMenu ? "opacity-100" : "opacity-0"}`}
      />
      <button
        onClick={handleShowMenu}
        className=" absolute z-[400] right-0 bg-amber-700 w-[50px] h-[40px] rounded-tl-2xl rounded-bl-2xl"
      />

      <div ref={navigationContentRef} className="navigation-content fixed right-0 flex flex-col z-[200]">
        <AtomList className={`flex flex-col justify-between h-screen`}>
          {navigationItem.map((item, itemIndex) => (
            <li
              ref={(el) => setRefs(el, liRefs)}
              key={itemIndex}
              className="navigation_item flex items-center justify-start flex-1 pl-[20px] bg-gray-100"
            >
              <AtomLink
                onClickChildren={(e) => {
                  handleShuffle(e);
                  handleShowMenu();
                }}
                linkNextRef={linkNextRef}
                href={item === "Home" ? "/" : item.trim().toLowerCase().replace(/\s+/g, "")}
                linkTitle={item}
                type="next"
                className={"text-black navigation-font-family w-[700px]"}
              ></AtomLink>
            </li>
          ))}
          <AtomList
            listRef={listRef}
            className="grid grid-cols-3 justify-items-center z-[-10] bg-black gap-4 py-[10px]"
          >
            {contactsDB.map((item) => (
              <AtomLi key={item.socHref}>
                <AtomLink className="text-[14px] text-white" type="blank" href={item.socHref}>
                  {item.socTitle}
                </AtomLink>
              </AtomLi>
            ))}
          </AtomList>
        </AtomList>
      </div>
    </>
  );
};
