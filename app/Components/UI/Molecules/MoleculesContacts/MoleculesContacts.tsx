"use client";

// ================= React ====================
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

// ================= Navigation ====================
import { useRouter } from "next/navigation";

// ================= GSAP ====================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fetchDataWithController } from "@/app/utils/FetchUtils/fetchDataWithController";
gsap.registerPlugin(ScrollTrigger);

// ================= Atomic Components ====================
import AtomHeading from "../../Atoms/GROUP-AtomTypography/AtomHeading/AtomHeading";
import AtomContactCards from "../../Atoms/GROUP-AtomCards/AtomContactCards/AtomContactCards";
import AtomTransitionDiv from "../../Atoms/GROUP-AtomCustomEffects/AtomTransitionDiv/AtomTransitionDiv";
import AtomLink from "../../Atoms/GROUP-AtomTypography/AtomLink/AtomLink";

// ================= Utils ====================
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/WindowUtils/overflowHidden";
import { transitionPagesBackPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { autoScrollTop } from "@/app/utils/WindowUtils/autoScrollTop";

// ================= Types ====================
import { contactsDBProp } from "@/Data/contactsDB";

export default function MoleculesContacts() {
  // ================= Router ====================
  const router = useRouter();

  // ================= State ====================
  const [contactsDB, setContactsDB] = useState<contactsDBProp[]>([]);

  // ================= Refs ====================
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const cardRefs = useRef<HTMLAnchorElement[]>([]);
  const contactsContentRef = useRef<HTMLDivElement | null>(null);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);

  // ================= Fetch contacts data ====================
  useEffect(() => {
    return fetchDataWithController({
      fetchApi: "/api/contacts",
      setData: setContactsDB
    });
  }, []);

  // ================= GSAP Animations ====================
  useLayoutEffect(() => {
    autoScrollTop();

    const heading = headingRef.current;
    const firstTwoCards = cardRefs.current.slice(0, 2);
    const restCards = cardRefs.current.slice(2);
    const scrollEl = contactsContentRef.current;
    const transitionEl = transitionDivRef.current;

    // ================= Guard ====================
    if (!heading || !firstTwoCards.length || !scrollEl || !restCards.length || !transitionEl || !contactsDB.length)
      return;

    // ================= Animation Constants ====================
    const FAST_DURATION = 1;
    const MIDDLE_DURATION = 2;

    const maxScroll = scrollEl.scrollHeight - window.innerHeight;
    const endValue = Math.min(scrollEl.scrollHeight, maxScroll);

    console.log(endValue, scrollEl.scrollHeight);

    // ================= GSAP Context ====================
    const ctx = gsap.context(() => {
      // ================= Transition Element ====================
      gsap.set(transitionEl, { scale: 0 });

      // ================= Heading Animation ====================
      gsap.fromTo(
        heading,
        { x: -400, scale: 0.5, autoAlpha: 0 },
        { x: 0, scale: 1, autoAlpha: 1, duration: FAST_DURATION, ease: "power4.inOut" }
      );

      // ================= First Two Cards Animation ====================
      gsap.from(firstTwoCards, {
        x: -500,
        scale: 0.1,
        autoAlpha: 0,
        duration: FAST_DURATION,
        stagger: 0.2,
        ease: "power4.inOut",
        onStart: () => animationActiveOverflowHidden(true),
        onComplete: () => animationActiveOverflowHidden(false)
      });

      // ================= Scroll Animations (rest cards) ====================
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
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: scrollEl,
              start: "top top",
              end: () => (desktop || tablet ? `+=${endValue}` : mobile ? `+=${endValue + 533}` : `+=${endValue}`),
              scrub: 1.5,
              onLeaveBack: () => transitionPagesBackPage({ transitionEl, router, routerPushBack: "/portfolio" })
            }
          });

          // ================= Universal Animation ====================
          if (desktop || tablet || mobile) {
            tl.from(restCards, {
              x: gsap.utils.random([-900, 900], true),
              scale: 0.1,
              autoAlpha: 0,
              stagger: 1,
              duration: MIDDLE_DURATION
            });
          }
        }
      );
    });

    // ================= Cleanup ====================
    return () => ctx.revert();
  }, [contactsDB]);

  // ================= JSX ====================
  return (
    <div ref={contactsContentRef} className="contacts_content">
      {/* ================= Heading ==================== */}
      <AtomHeading headingRef={headingRef} children={"Contacts"} level={1} className="text-white opacity-0" />

      {/* ================= Contact Cards ==================== */}
      {contactsDB.map((contact, index) => (
        <AtomContactCards
          key={index}
          cardRef={(el) => setRefs(el, cardRefs)}
          heading={
            <AtomHeading level={3} className="text-center text-[100px] max-md:text-[60px] max-lg:text-[70px]">
              {contact.socTitle}
            </AtomHeading>
          }
          imgSRC={contact.socIcon}
          link={contact.socHref}
        />
      ))}

      {/* ================= Transition Div ==================== */}
      <AtomTransitionDiv
        transitionDivRef={transitionDivRef}
        className="-translate-x-1/2 -translate-y-1/2 top-1/2 left-10 bg-white"
      />
    </div>
  );
}
