"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import AtomContactCards from "../../Atoms/AtomContactCards/AtomContactCards";
import { contactsDBProp } from "@/Data/contactsDB";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesContacts() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContactsDB(data));
  }, []);

  useLayoutEffect(() => {
    if ((!headingRef.current || !cardRefs.current.length) && !contactsDB) return;
    const heading = headingRef.current;
    const card = cardRefs.current.slice(2);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { duration: 2, autoAlpha: 0, ease: "power4.inOut" },
        scrollTrigger: {
          trigger: card,
          start: "top bottom+=900",
          scrub: 1.2
        }
      });

      tl.from(heading, { x: -400, scale: 0.5 });
      tl.from(card, { x: -500, stagger: 0.2 });
    });

    return () => ctx.revert();
  }, [contactsDB]);

  function setCard(el: HTMLAnchorElement | null) {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  }
  return (
    <>
      <AtomHeading
        children="Contacts"
        level={1}
        headingRef={headingRef}
        className="global-combining-classes-space-elements text-white"
      />
      <div className="contacts_cards global-space-main-elements flex flex-col gap-[30px]">
        {contactsDB.map((contact, contIndex) => (
          <AtomContactCards
            cardRef={setCard}
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
