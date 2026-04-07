"use client";

// ================= React Hooks ====================
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

// ================= Atomic Design — Atoms ====================
import AtomHeading from "../../Atoms/GROUP-AtomTypography/AtomHeading/AtomHeading";
import AtomParagraph from "../../Atoms/GROUP-AtomTypography/AtomParagraph/AtomParagraph";
import AtomAvatar from "../../Atoms/GROUP-AtomImages/AtomImages/AtomAvatar";
import AtomList from "../../Atoms/GROUP-AtomTypography/AtomList/AtomList";
import AtomLi from "../../Atoms/GROUP-AtomTypography/AtomLi/AtomLi";
import AtomSpan from "../../Atoms/GROUP-AtomTypography/AtomSpan/AtomSpan";

// ================= Types ====================
import { aboutMe } from "@/Data/aboutMeDB";

// ================= Utilities ====================
import { setRefs } from "@/app/utils/SetElements/setRefs";
import { animationActiveOverflowHidden } from "@/app/utils/WindowUtils/overflowHidden";
import { transitionPagesBackPage, transitionPagesInPage } from "@/app/utils/GsapSettings/transitionPagesInPage";
import { autoScrollTop } from "@/app/utils/WindowUtils/autoScrollTop";

// ================= GSAP Setup ====================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

// ================= Navigation ====================
import { useRouter } from "next/navigation";

// ================= Transition Layer ====================
import AtomTransitionDiv from "../../Atoms/GROUP-AtomCustomEffects/AtomTransitionDiv/AtomTransitionDiv";
import { fetchDataWithController } from "@/app/utils/FetchUtils/fetchDataWithController";

export default function MoleculesAboutMe() {
  // ================= Component State ====================
  const [aboutMeDB, setAboutMeDB] = useState<aboutMe | null>(null);

  // ================= Static UI Data ====================
  const aboutMeMainHeading = "About me".split("");

  // ================= Router Instance ====================
  const router = useRouter();

  // ================= DOM References ====================
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const mainHeadingSpans = useRef<HTMLSpanElement[]>([]);
  const spanRefs = useRef<HTMLSpanElement[]>([]);
  const percentagesRefs = useRef<HTMLSpanElement[]>([]);
  const aboutMeContentRef = useRef<HTMLDivElement | null>(null);
  const avatarAndSkillsRef = useRef<HTMLDivElement | null>(null);
  const everyAvatarHeadingLiRefs = useRef<HTMLElement[]>([]);
  const transitionDivRef = useRef<HTMLDivElement | null>(null);

  // ================= Memoized Derived Data ====================

  // Extract numeric percentage values from skills strings
  const percentagesOfExperience = useMemo(() => {
    return aboutMeDB?.categories.map((category) =>
      category.skills.map((skill) => {
        const match = skill.match(/\((\d+)%\)/);
        return match ? Number(match[1]) : 0;
      })
    );
  }, [aboutMeDB]);

  // Normalize description text into words array for animation usage
  const words = useMemo(() => {
    return aboutMeDB?.developerInfo[0].description.join("").replace(/\n+/g, " ").replace(/\s+/g, " ").split(" ");
  }, [aboutMeDB]);

  // ================= Page Navigation Handler =================
  const goPage = useCallback(
    (key: "GoNext" | "GoBack") => {
      if (!transitionDivRef.current) return;

      const config =
        key === "GoNext"
          ? { routerPushNext: "/portfolio", fn: transitionPagesInPage }
          : { routerPushBack: "/", fn: transitionPagesBackPage };

      config.fn({ transitionEl: transitionDivRef.current, router, ...config });
    },
    [router]
  );

  // ================= Data Fetching ====================
  useEffect(() => {
    return fetchDataWithController({
      fetchApi: "/api/aboutMe",
      setData: setAboutMeDB
    });
  }, []);

  // ================= GSAP Animation System ====================
  useLayoutEffect(() => {
    // Reset scroll position on page enter
    autoScrollTop();

    // Cache frequently accessed elements
    const profileInfo = everyAvatarHeadingLiRefs.current;
    const mainHeading = mainHeadingRef.current;
    const mainSpans = mainHeadingSpans.current;
    const spans = spanRefs.current;
    const transitionEl = transitionDivRef.current;

    // Prevent animation initialization until data is ready
    if (!aboutMeDB) return;

    // Scope GSAP animations to component lifecycle
    const ctx = gsap.context(() => {
      const scrollEl = aboutMeContentRef.current;
      const paragraphRefHeight = paragraphRef.current?.offsetHeight;
      const avatarAndSkillsRefHeight = avatarAndSkillsRef.current?.offsetHeight;

      if (!paragraphRefHeight || !scrollEl || !avatarAndSkillsRefHeight || !transitionEl) return;

      // ================= Animation Timing Constants ====================
      const FAST_DURATION = 0.5;
      const MIDDLE_DURATION = 2;
      const SLOW_DURATION = 5;

      // Calculate scrollable animation distance
      const maxScroll = scrollEl.scrollHeight - window.innerHeight;
      const endValue = Math.min(scrollEl.offsetHeight, maxScroll);

      // ================= Responsive Animation Context ====================
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

          // Initial transition layer state
          gsap.set(transitionEl, { scale: 0 });

          // ================= Scroll Timelines ====================

          const masterTL = gsap.timeline({
            defaults: { ease: "sine.inOut" },
            scrollTrigger: {
              trigger: scrollEl,
              start: "top top",
              end: desktop ? `+=${endValue + 100}` : tablet ? `+=${endValue}` : mobile ? `+=${endValue - 200}` : "",
              scrub: desktop ? 1 : tablet || mobile ? 1.2 : 1
            }
          });

          // Pin main heading during scroll
          ScrollTrigger.create({
            trigger: mainHeading,
            start: "top top",
            pin: true,
            anticipatePin: 1
          });

          // ================= Page Transition Trigger ====================
          ScrollTrigger.create({
            trigger: scrollEl,
            start: "top bottom",
            end: desktop
              ? `+=${endValue + window.innerHeight * 1.3}`
              : tablet || mobile
                ? `+=${endValue + window.innerHeight}`
                : `+=${endValue + window.innerHeight}`,
            onLeave: () => goPage("GoNext"),
            onLeaveBack: () => goPage("GoBack")
          });

          // ================= Desktop Animations ====================
          if (desktop) {
            gsap.from(mainSpans, {
              scale: () => gsap.utils.random(0.2, 1),
              y: () => gsap.utils.random(-200, 200),
              autoAlpha: 0,
              duration: FAST_DURATION,
              stagger: { each: 0.1, from: "random" },
              onStart: () => animationActiveOverflowHidden(true),
              onComplete: () => animationActiveOverflowHidden(false)
            });

            masterTL.addLabel("oneTime");

            masterTL.from(
              profileInfo,
              {
                x: -300,
                duration: SLOW_DURATION,
                autoAlpha: 0,
                stagger: 2,
                onStart: () => startCounter()
              },
              "oneTime"
            );

            masterTL.from(
              spans,
              {
                scale: () => gsap.utils.random([-4, 1]),
                autoAlpha: 0,
                duration: SLOW_DURATION,
                stagger: 0.2
              },
              "oneTime"
            );
          }

          // ================= Tablet Animations ====================
          if (tablet) {
            gsap.from(mainSpans, {
              y: gsap.utils.random([-100, 200], true),
              scale: gsap.utils.random([0.1, 2]),
              duration: FAST_DURATION,
              autoAlpha: 0,
              stagger: { each: 0.2, from: "random" },
              onStart: () => animationActiveOverflowHidden(true),
              onComplete: () => animationActiveOverflowHidden(false)
            });

            masterTL.from(profileInfo, {
              x: -200,
              autoAlpha: 0,
              duration: SLOW_DURATION,
              stagger: 0.2,
              onStart: () => startCounter()
            });

            gsap.set(spans, { autoAlpha: 1 });

            masterTL.from(
              spans,
              {
                scale: () => gsap.utils.random(-4, 1),
                autoAlpha: 0,
                stagger: 0.2,
                delay: 0.2,
                duration: SLOW_DURATION
              },
              ">"
            );
          }

          // ================= Mobile Animations ====================
          if (mobile) {
            gsap.from(mainSpans, {
              y: gsap.utils.random([-100, 200], true),
              scale: gsap.utils.random([0.1, 2]),
              duration: FAST_DURATION,
              autoAlpha: 0,
              stagger: { each: 0.2, from: "random" },
              onStart: () => animationActiveOverflowHidden(true),
              onComplete: () => animationActiveOverflowHidden(false)
            });

            masterTL.from(profileInfo, {
              x: -200,
              autoAlpha: 0,
              duration: MIDDLE_DURATION,
              stagger: 0.4,
              onStart: () => startCounter()
            });

            masterTL.from(
              spans,
              {
                scale: () => gsap.utils.random(-4, 1),
                autoAlpha: 0,
                stagger: 0.2,
                duration: MIDDLE_DURATION
              },
              ">"
            );
          }
        }
      );

      // ================= Skills Counter Animation ====================
      const endValues = percentagesOfExperience?.flat();

      function startCounter() {
        if (!percentagesRefs.current.length) return;

        percentagesRefs.current.forEach((el, index) => {
          const obj = { val: 0 };
          const endValue = endValues ? endValues[index] : 0;

          gsap.to(obj, {
            val: endValue,
            duration: MIDDLE_DURATION,
            delay: index * 0.4,
            onUpdate() {
              el.textContent = ` (${Math.floor(obj.val)}%)`;
            }
          });
        });
      }
    });

    // Cleanup GSAP context on unmount
    return () => ctx.revert();
  }, [aboutMeDB]);

  if (!aboutMeDB) return null;

  const dev = aboutMeDB.developerInfo[0];

  // ================= Component Markup ====================
  return (
    <div ref={aboutMeContentRef} className="about_me_content pb-[400px]">
      {/* ================= Main Heading ==================== */}
      <AtomHeading
        headingRef={(el) => setRefs(el, undefined, mainHeadingRef)}
        level={1}
        className="global-combining-classes-space-elements text-center text-white"
        children={aboutMeMainHeading.map((letter, letterIndex) => (
          <span
            key={letterIndex}
            ref={(el) => setRefs(el, mainHeadingSpans)}
            className="inline-block base-heading-combining-classes whitespace-break-spaces pt-[5%]"
          >
            {letter}
          </span>
        ))}
      />

      {/* ================= Content Layout ==================== */}
      <div className="avatar_and_paragraph global-space-elements flex gap-5 max-lg:flex-col">
        {/* ================= Avatar & Skills ==================== */}
        <div ref={avatarAndSkillsRef} className="avatar_and_skills_info">
          <div className="avatar_and_skill">
            {/* ================= Avatar Info ==================== */}
            <div className="avatar_and_info grid gap-2 pb-[20px] md: place-content-center">
              <div className="w-[300px] grayscale will-change-transform">
                <AtomAvatar
                  imgSRC="/Images-and-video/Avatar/Ruben.png"
                  avatarRef={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                />
              </div>

              {[dev.developerName, dev.rank, dev.location].map((devEl, devElIndex) => (
                <AtomHeading
                  key={devElIndex}
                  headingRef={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                  children={devEl}
                  level={(devElIndex + 2) as 3 | 4}
                  className="base-mini-heading-combining-classes max-lg:text-center"
                />
              ))}
            </div>

            {/* ================= Skills Categories ==================== */}
            <div className="title_and_info flex flex-col max-lg:flex-row justify-center max-sm:flex-col">
              {aboutMeDB.categories.map((cat, catIndex) => (
                <div key={catIndex} className="title_and_list">
                  <AtomHeading
                    headingRef={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                    children={cat.miniTitle}
                    level={2}
                    className="base-mini-heading-combining-classes global-combining-classes-space-elements text-start max-lg:text-center max-sm:text-start"
                  />
                  <AtomList
                    className="list w-[300px] grid gap-2"
                    children={cat.skills.map((skill, skillIndex) => (
                      <AtomLi
                        key={skillIndex}
                        className="w-full will-change-transform"
                        refLi={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                        children={
                          <>
                            {skill.replace(/\s*\(\d+%\)/, "")}{" "}
                            <AtomSpan
                              className="whitespace-pre-wrap text-red-700 will-change-transform"
                              refPercentages={(el) => setRefs(el, percentagesRefs)}
                              children={"  (0%)"}
                            />
                          </>
                        }
                      />
                    ))}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= Description Paragraph ==================== */}
        <AtomParagraph
          paragraphRef={(el) => setRefs(el, undefined, paragraphRef)}
          className="global-combining-classes-space-elements base-paragraph-combining-classes global-user-no-select whitespace-pre-line will-change-transform align-middle"
          children={words?.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
              <span ref={(el) => setRefs(el, spanRefs)} className="inline-block word_span will-change-transform mr-3">
                {word}
              </span>

              {word.endsWith(".") && (
                <>
                  <br />
                  <br />
                </>
              )}
            </React.Fragment>
          ))}
        />
      </div>

      {/* ================= Transition Layer ==================== */}
      <AtomTransitionDiv
        transitionDivRef={transitionDivRef}
        className="-translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 bg-white"
      />
    </div>
  );
}
