"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";

import gsap from "gsap";
import AtomContactCards from "../../Atoms/AtomContactCards/AtomContactCards";
import { contactsDBProp } from "@/Data/contactsDB";

export default function MoleculesContacts() {
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);

  useEffect(() => {
    fetch("/api/contacts")
      .then((res) => res.json())
      .then((data) => setContactsDB(data));
  }, []);

  useLayoutEffect(() => {
    if (!headingRef.current && !contactsDB) return;
    const heading = headingRef.current;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 2, autoAlpha: 0, ease: "power4.out" } });

      tl.from(heading, { x: -400, scale: 0.5 });
    });

    return () => ctx.revert();
  }, [contactsDB]);
  return (
    <>
      <AtomHeading
        children="Contacts"
        level={1}
        headingRef={headingRef}
        className="global-combining-classes-space-elements text-white"
      />
      <div className="contacts_cards">
        {contactsDB.map((contact, contIndex) => (
          <AtomContactCards
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
