"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomContactCards from "../../Atoms/AtomContactCards/AtomContactCards";

import { contactsDBProp } from "@/Data/contactsDB";
import { setRefs } from "@/app/utils/SetElements/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesContacts() {
  // ======= State для данных из API =======
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);

  // ======= Refs для работы с DOM =======
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLAnchorElement[]>([]);

  // ======= Fetch данных контактов =======
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContactsDB(data)); // сохраняем полученные контакты в state
  }, []);

  // ======= GSAP анимации =======
  useLayoutEffect(() => {
    // Если заголовок или карточки ещё не загружены или данных нет — выходим
    if ((!headingRef.current || !cardRefs.current.length) && !contactsDB.length) return;

    const heading = headingRef.current;
    const card = cardRefs.current.slice(2); // все карточки, кроме первых двух
    const firstTwoElements = cardRefs.current.slice(0, 2); // первые две карточки

    // Создаём контекст GSAP, чтобы безопасно чистить анимации при размонтировании
    const ctx = gsap.context(() => {
      // ======= Анимация заголовка =======
      // Заголовок появляется слева, с увеличением масштаба и плавным появлением
      gsap.from(heading, { x: -400, scale: 0.5, duration: 2, delay: 0.2, autoAlpha: 0, ease: "power4.inOut" });

      // ======= Анимация всех остальных карточек через ScrollTrigger =======
      const tl = gsap.timeline({
        defaults: { duration: 2, ease: "power4.inOut" },
        scrollTrigger: {
          trigger: card, // триггер для всех карточек кроме первых двух
          start: "top bottom", // когда верх карточки доходит до низа окна
          scrub: true // анимация привязана к скроллу
        }
      });

      // Карточки выезжают слева, появляется плавно, с небольшим задержкой между ними
      tl.from(card, { x: -900, autoAlpha: 0, stagger: 0.2 });

      // ======= Анимация первых двух карточек =======
      // Они появляются сразу, с увеличением масштаба и сдвигом слева
      gsap.from(firstTwoElements, {
        x: -500,
        scale: 0.1,
        autoAlpha: 0,
        duration: 2,
        stagger: 0.2,
        ease: "power4.inOut",
        onStart: () => {
          animationActiveOverflowHidden(true);
        },
        // Разблок документа после анимации
        onComplete: () => {
          animationActiveOverflowHidden(false);
        }
      });
    });

    // ======= Очистка анимаций при размонтировании =======
    return () => ctx.revert();
  }, [contactsDB]);

  return (
    <>
      <AtomHeading children="Contacts" level={1} headingRef={headingRef} className="text-white" />
      <div className="contacts_cards global-space-main-elements flex flex-col gap-[30px]">
        {contactsDB.map((contact, contIndex) => (
          <AtomContactCards
            // ======= Добавление рефа каждой карточки в массив =======
            cardRef={(el) => setRefs(el, cardRefs)}
            key={contIndex}
            heading={<AtomHeading children={contact.socTitle} level={3} className="w-full text-center" />}
            imgSRC={contact.socIcon}
            link={contact.socHref}
          />
        ))}
      </div>
    </>
  );
}
