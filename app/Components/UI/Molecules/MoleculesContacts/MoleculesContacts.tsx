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
  const contactsCardSectionRef = useRef<HTMLDivElement | null>(null);

  // ======= Fetch данных контактов =======
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContactsDB(data)); // сохраняем полученные контакты в state
  }, []);

  // ======= GSAP анимации =======
  useLayoutEffect(() => {
    const heading = headingRef.current;
    const card = cardRefs.current.slice(2); // все карточки, кроме первых двух
    const contactCardsHeight = contactsCardSectionRef.current?.offsetHeight;
    const firstTwoElements = cardRefs.current.slice(0, 2); // первые две карточки
    // Если заголовок или карточки ещё не загружены или данных нет — выходим
    if (!heading || !card.length || !contactCardsHeight || !contactsDB.length) return;

    // Создаём контекст GSAP, чтобы безопасно чистить анимации при размонтировании
    const ctx = gsap.context(() => {
      // ======= Анимация заголовка =======
      // Заголовок появляется слева, с увеличением масштаба и плавным появлением
      gsap.fromTo(
        heading,
        {
          x: -400,
          scale: 0.5,
          duration: 2,
          autoAlpha: 0
        },
        { x: 0, scale: 1, duration: 2, delay: 0.2, autoAlpha: 1, ease: "power4.inOut" }
      );

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

      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return;
          const { desktop, tablet, mobile } = context.conditions;
          // ======= Анимация всех остальных карточек через ScrollTrigger =======
          const tl = gsap.timeline({
            defaults: { duration: 2, ease: "power4.inOut" },
            scrollTrigger: {
              trigger: contactsCardSectionRef.current, // триггер для всех карточек кроме первых двух
              start: "top 15%", // когда верх карточки доходит до низа окна
              end: () =>
                desktop || mobile
                  ? contactCardsHeight * 0.6
                  : tablet
                    ? contactCardsHeight * 0.2
                    : window.innerHeight * 2,
              scrub: true // анимация привязана к скроллу
            }
          });

          if (desktop || tablet || mobile) {
            // Карточки выезжают слева, появляется плавно, с небольшим задержкой между ними
            tl.from(card, { x: gsap.utils.random([-900, 900], true), scale: 0.1, autoAlpha: 0, stagger: 0.3 });
          }
        }
      );
    });

    // ======= Очистка анимаций при размонтировании =======
    return () => ctx.revert();
  }, [contactsDB]);

  return (
    <>
      <div ref={contactsCardSectionRef} className="contacts_cards global-space-main-elements flex flex-col gap-[30px]">
        <AtomHeading children="Contacts" level={1} headingRef={headingRef} className="text-white opacity-0" />
        {contactsDB.map((contact, contIndex) => (
          <AtomContactCards
            // ======= Добавление рефа каждой карточки в массив =======
            cardRef={(el) => setRefs(el, cardRefs)}
            key={contIndex}
            heading={
              <AtomHeading
                children={contact.socTitle}
                level={3}
                className=" text-center text-[100px] max-md:text-[60px] max-lg:text-[70px]"
              />
            }
            imgSRC={contact.socIcon}
            link={contact.socHref}
          />
        ))}
      </div>
    </>
  );
}
