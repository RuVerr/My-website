"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomContactCards from "../../Atoms/AtomContactCards/AtomContactCards";

import { contactsDBProp } from "@/Data/contactsDB";
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
import { transitionPagesBackPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { useRouter } from "next/navigation";

// Регистрируем GSAP плагин
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesContacts() {
  // =================================
  // Hooks
  // =================================
  const router = useRouter();
  // =================================
  // State
  // =================================
  // Контакты, получаемые с API
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);

  // =================================
  // Refs (DOM + GSAP)
  // =================================
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const contactsCardSectionRef = useRef<HTMLDivElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);
  // =================================
  // Fetch contacts data
  // =================================
  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContactsDB(data));
  }, []);

  // =================================
  // GSAP animations
  // =================================
  useLayoutEffect(() => {
    const heading = headingRef.current;
    // Первые две карточки (анимируются сразу)
    const firstTwoCards = cardRefs.current.slice(0, 2);
    // Остальные карточки (анимация по скроллу)
    const restCards = cardRefs.current.slice(2);
    const sectionHeight = contactsCardSectionRef.current?.offsetHeight;
    // Ссылка на Div переход
    const transitionEl = transitionDivRef.current;
    // Если данных или DOM нет — выходим
    if (
      !heading ||
      !firstTwoCards.length ||
      !restCards.length ||
      !sectionHeight ||
      !contactsDB.length ||
      !transitionEl
    ) {
      return;
    }

    // GSAP context — безопасная очистка анимаций
    const ctx = gsap.context(() => {
      // ===============================
      // Heading animation
      // ===============================
      gsap.fromTo(
        heading,
        {
          x: -400,
          scale: 0.5,
          autoAlpha: 0
        },
        {
          x: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 2,
          delay: 0.2,
          ease: "power4.inOut"
        }
      );

      // ===============================
      // First two cards animation
      // ===============================
      gsap.from(firstTwoCards, {
        x: -500,
        scale: 0.1,
        autoAlpha: 0,
        duration: 2,
        stagger: 0.2,
        ease: "power4.inOut",
        onStart: () => {
          animationActiveOverflowHidden(true);
        },
        onComplete: () => {
          animationActiveOverflowHidden(false);
        }
      });

      // ===============================
      // Scroll animations (rest cards)
      // ===============================
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

          const tl = gsap.timeline({
            defaults: {
              duration: 2,
              ease: "power4.inOut"
            },
            scrollTrigger: {
              trigger: contactsCardSectionRef.current,
              start: "top top",
              markers: true,
              end: () =>
                desktop || mobile ? sectionHeight * 0.6 : tablet ? sectionHeight * 0.2 : window.innerHeight * 2,
              scrub: true,
              onLeaveBack: () => {
                transitionPagesBackPage({ transitionEl, router, routerPushBack: "/portfolio" });
              }
            }
          });

          // Универсальная анимация для всех устройств
          if (desktop || tablet || mobile) {
            tl.from(restCards, {
              x: gsap.utils.random([-900, 900], true),
              scale: 0.1,
              autoAlpha: 0,
              stagger: 0.3
            });
          }
        }
      );
    });

    // Очистка при размонтировании
    return () => ctx.revert();
  }, [contactsDB]);

  // =================================
  // Render
  // =================================
  return (
    <div
      ref={contactsCardSectionRef}
      className="
        contacts_cards
        global-space-main-elements
        flex flex-col
        gap-[30px]
      "
    >
      <AtomHeading headingRef={headingRef} level={1} className="text-white opacity-0">
        Contacts
      </AtomHeading>

      {contactsDB.map((contact, index) => (
        <AtomContactCards
          key={index}
          // Добавляем ref карточки в массив
          cardRef={(el) => setRefs(el, cardRefs)}
          heading={
            <AtomHeading
              level={3}
              className="
                text-center
                text-[100px]
                max-md:text-[60px]
                max-lg:text-[70px]
              "
            >
              {contact.socTitle}
            </AtomHeading>
          }
          imgSRC={contact.socIcon}
          link={contact.socHref}
        />
      ))}
      <div
        ref={transitionDivRef}
        className="transitionDiv pointer-events-auto w-[200px] h-[200px] fixed z-50
                   bottom-0 left-0 -translate-x-2/1 -translate-y-1/2
                   rounded-full bg-[#cdcdcd]"
      />
    </div>
  );
}
