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
import MoleculesBackgroundAudio from "../MoleculesBackgroundAudio/MoleculesBackgroundAudio";

export const MoleculesNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);
  const navigationItem = ["Home", "About me", "Portfolio", "Contacts"];
  const linkNextRef = useRef<HTMLAnchorElement | null>(null);
  const navigationContentRef = useRef<HTMLDivElement | null>(null);
  const liRefs = useRef<HTMLLIElement[]>([]);
  const listRef = useRef<HTMLUListElement | null>(null);
  const bgHidden = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() || "/";
  const masterTL = useRef<gsap.core.Timeline | null>(null);
  const burgerMenuLines = useRef<HTMLSpanElement[]>([]);

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
    const li = liRefs.current;
    const underList = listRef.current;
    const burgerLines = burgerMenuLines.current;
    const bgHiddenScreen = bgHidden.current;

    if (!li.length || !underList || masterTL.current) return;

    gsap.set(li, { xPercent: 100 });

    const ctx = gsap.context(() => {
      masterTL.current = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } });

      masterTL.current
        .to(li, {
          xPercent: 0,
          duration: 0.5,
          autoAlpha: 1,
          stagger: { each: 0.1, from: showMenu ? "start" : "start" }
        })
        .from(bgHiddenScreen, { scale: 0.1, duration: 0.5, autoAlpha: 0 }, "<")
        .from(underList, { yPercent: -200, autoAlpha: 0, duration: 0.2 }, "-=0.3")
        .to(
          burgerLines,
          {
            scale: (el) => {
              const value = [0.4, 0.6, 0.8];
              return value[el];
            },
            stagger: 0.1
          },
          "<"
        );
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (showMenu) {
      masterTL.current?.play();
      animationActiveOverflowHidden(true);
    } else {
      masterTL.current?.reverse();
      animationActiveOverflowHidden(false);
    }
  }, [showMenu]);

  return (
    <>
      <div
        onClick={() => handleShowMenu()}
        className={`bg_hidden fixed inset-0 z-[20] bg-black/50 pointer-events-auto `}
        ref={bgHidden}
      />
      <button
        onClick={handleShowMenu}
        className=" absolute right-5 top-[10px] flex flex-col justify-center gap-[5px] z-[400] bg-black mix-blend-difference w-[50px] h-[40px] px-[5px] cursor-pointer"
      >
        {[1, 2, 3].map((__, spanIndex) => (
          <span
            key={spanIndex}
            ref={(el) => setRefs(el, burgerMenuLines)}
            className="block w-full h-[4px] bg-white border-1 border-white"
          />
        ))}
      </button>

      <div ref={navigationContentRef} className="navigation-content fixed right-0 flex flex-col z-[200]">
        <AtomList className={`flex flex-col justify-between h-screen`}>
          {navigationItem.map((item, itemIndex) => (
            <li
              ref={(el) => setRefs(el, liRefs)}
              key={itemIndex}
              className="navigation_item flex z-[20] items-center justify-start flex-1 pl-[20px] bg-gray-100"
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
                className={"text-black navigation-font-family w-full"}
              ></AtomLink>
            </li>
          ))}
          <AtomList listRef={listRef} className="grid grid-cols-3 justify-items-center z-[10] bg-black gap-4 py-[10px]">
            {contactsDB.map((item) => (
              <AtomLi key={item.socHref}>
                <AtomLink className="text-[14px] text-white" type="blank" href={item.socHref}>
                  {item.socTitle}
                </AtomLink>
              </AtomLi>
            ))}
            <MoleculesBackgroundAudio />
          </AtomList>
        </AtomList>
      </div>
    </>
  );
};
