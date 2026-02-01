import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";
import AtomAvatar from "../../Atoms/AtomAvatar/AtomAvatar";
import AtomSkillsList from "../../Atoms/AtomInfoList/AtomSkillsList";
import { aboutMe } from "@/Data/aboutMeDB";

// ======= Функция для добавления рефов в массив =
import { setRefs } from "@/app/utils/SetElements/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animationActiveOverflowHidden } from "@/app/utils/GsapSettings/overflowHidden";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesAboutMe() {
  // Храним данные о разработчике, которые придут с API
  const [aboutMeDB, setAboutMeDB] = useState<aboutMe | null>(null);
  //Заголовок
  const aboutMeMainHeading = "About me".split("");

  // ========== Для работы с DOM напрямую и анимациями через GSAP ==========
  const paragraphRef = useRef<HTMLParagraphElement | null>(null);
  const mainHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const mainHeadingSpans = useRef<HTMLSpanElement[]>([]);
  const spanRefs = useRef<HTMLSpanElement[]>([]);
  const percentagesRefs = useRef<HTMLSpanElement[]>([]);
  const fakeScrollRef = useRef<HTMLDivElement | null>(null);
  const avatarAndSkillsRef = useRef<HTMLDivElement | null>(null);
  const everyAvatarHeadingLiRefs = useRef<HTMLElement[]>([]);

  let animationFlagRef = useRef<boolean>(false);

  // ========== Извлекаем числа процентов навыков ==========
  // Например: "JavaScript (80%)" -> 80
  // Используем как конечную точку для анимации GSAP
  const percentagesOfExperience = aboutMeDB?.categories.map((category) => {
    return category.skills.map((skill) => {
      // Ищем числа в скобках с помощью регулярки
      const match = skill.match(/\((\d+)%\)/);
      // Возвращаем число или 0, если нет процента
      return match ? Number(match[1]) : 0;
    });
  });

  const words = aboutMeDB?.developerInfo[0].description
    .join("")
    .replace(/\n+/g, " ") // заменяем переносы строк на пробелы
    .replace(/\s+/g, " ") // убираем лишние пробелы
    .split(" "); // разбиваем на отдельные слова

  // ======= Fetch данных =======
  useEffect(() => {
    fetch("/api/aboutMe")
      .then((res) => res.json())
      .then((data) => setAboutMeDB(data)); // сохраняем в state
  }, []);

  // ======= useLayoutEffect GSAP анимации =======
  useLayoutEffect(() => {
    const every = everyAvatarHeadingLiRefs.current;
    const mainHeading = mainHeadingRef.current;
    const mainSpans = mainHeadingSpans.current;
    const spans = spanRefs.current;
    // Если данных нет, ничего не делаем точнее вылетаем
    if (!aboutMeDB) return;

    // ==============
    // GSAP context
    // ==============
    const ctx = gsap.context(() => {
      const scrollEl = fakeScrollRef.current;
      const paragraphRefHeight = paragraphRef.current?.offsetHeight;
      const avatarAndSkillsRefHeight = avatarAndSkillsRef.current?.offsetHeight;
      if (!paragraphRefHeight || !avatarAndSkillsRefHeight || !spans) return;
      //gsap MatchMedia
      const mm = gsap.matchMedia();
      mm.add(
        {
          // Определяем медиа-запросы для разных устройств
          desktop: "(min-width: 1024px)",
          tablet: "(min-width: 768px) and (max-width: 1023px)",
          mobile: "(max-width: 767px)"
        },
        (context) => {
          if (!context.conditions) return; // если условия медиа-запроса не определены, выходим
          const { desktop, tablet, mobile } = context.conditions; // достаем булевы значения текущего устройства

          ScrollTrigger.refresh(); // обновляем ScrollTrigger, чтобы корректно учитывалась высота элементов и скролл

          // ===================================
          // Создаем GSAP timeline для анимаций
          // ===================================
          const tl = gsap.timeline({
            defaults: { ease: "sine.inOut" }, // плавное easing для всех анимаций в timeline по умолчанию
            scrollTrigger: {
              trigger: scrollEl, // элемент, относительно которого будет запускаться анимация при скролле
              start: `top 10%`, // когда верхняя граница триггера достигнет 10% от высоты viewport, анимация стартует
              end: () =>
                // вычисляем конец анимации в зависимости от устройства
                desktop
                  ? paragraphRefHeight // на десктопе — высота параграфа
                  : tablet
                    ? paragraphRefHeight + avatarAndSkillsRefHeight // на планшете — параграф + аватар с навыками
                    : mobile
                      ? avatarAndSkillsRefHeight + paragraphRefHeight // на мобильных аналогично
                      : paragraphRefHeight + avatarAndSkillsRefHeight + 2 * window.innerHeight, // запас на прочие случаи
              scrub: 1, // синхронизируем timeline с прокруткой, 1.2 = плавная синхронизация
              anticipatePin: 1, // чуть раньше учитывает пины, чтобы скролл был более плавным
              markers: true, // включаем визуальные маркеры start/end для отладки
              onUpdate: (self) => {
                // вызываем функцию только один раз при прогрессе скролла между 0.51 и 0.61
                if (self.progress >= 0.51 && self.progress <= 0.61 && animationFlagRef.current === false) {
                  animationFlagRef.current = true; // ставим флаг, чтобы не запускать повторно
                  startCounter(); // запускаем анимацию процентов навыков
                }
              }
            }
          });
          const mainHeadingTL = gsap.timeline({
            defaults: { duration: 5, ease: "sine.inOut" },
            scrollTrigger: {
              trigger: mainHeading,
              start: "top top",
              pin: true,
              scrub: 1.2,
              anticipatePin: 1,
              onLeave: () => {
                gsap.to(mainHeading, { x: -350 });
              },
              onLeaveBack: () => {
                gsap.to(mainHeading, { x: 0 });
              }
            }
          });

          // =================================
          // Desktop Desktop Desktop Desktop
          // =================================
          if (desktop) {
            gsap.from(mainSpans, {
              scale: () => gsap.utils.random(0.2, 1),
              y: () => gsap.utils.random(-200, 200),
              autoAlpha: 0,
              stagger: { each: 0.3, from: "random" },
              // Блок документа при анимации
              onStart: () => {
                animationActiveOverflowHidden(true);
              },
              // Разблок документа после анимации
              onComplete: () => {
                animationActiveOverflowHidden(false);
              }
            });
            tl.addLabel("oneTime");
            tl.from(every, { x: -500, duration: 10, autoAlpha: 0, stagger: 0.3 }, "oneTime");
            tl.from(
              spans,
              {
                scale: () => gsap.utils.random(-4, 1),
                duration: 2,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "sine.inOut"
              },
              "oneTime"
            );
          }
          // ===========================
          // Tablet Tablet Tablet Tablet
          // ===========================
          if (tablet) {
            tl.from(every, { x: -200, duration: 20, delay: 2, autoAlpha: 0, stagger: 2 }).from(spans, {
              scale: () => gsap.utils.random(-4, 1),
              duration: 10,
              autoAlpha: 0,
              stagger: 0.3,
              ease: "sine.inOut"
            });
          }
          // ===========================
          // Mobile Mobile Mobile Mobile
          // ===========================
          if (mobile) {
            tl.from(every, { x: -500, duration: 1.5, autoAlpha: 0, stagger: 0.5 }).from(
              spans,
              {
                scale: () => gsap.utils.random(-4, 1),
                duration: 1,
                autoAlpha: 0,
                stagger: 0.1,
                ease: "sine.inOut"
              },
              ">"
            );
          }
        }
      );

      // ======= Анимация процентов навыков =======
      const endValues = percentagesOfExperience?.flat(); // упрощаем массив в один уровень
      function startCounter() {
        if (percentagesRefs.current.length) {
          percentagesRefs.current.forEach((el, index) => {
            const endValue = endValues ? endValues[index] : 0;
            const obj = { val: 0 }; // объект для анимации числа
            gsap.to(obj, {
              val: endValue, // конечное значение числа
              duration: 2,
              delay: index * 0.2,
              onUpdate() {
                // Обновляем текст элемента на лету
                el.textContent = `  (${Math.floor(obj.val)}%)`;
              }
            });
          });
        }
      }
    });
    return () => {
      ctx.revert();
    };
  }, [aboutMeDB]);

  if (!aboutMeDB) return; // пока данных нет — ничего не рендерим

  const dev = aboutMeDB.developerInfo[0];

  return (
    <>
      {/* Фейк скролл для gsap crub */}
      <div ref={fakeScrollRef} className="fakeScroll absolute inset-0 h-[400vh]"></div>
      {/* Заголовок секции */}
      <AtomHeading
        headingRef={(el) => setRefs(el, undefined, mainHeadingRef)}
        children={aboutMeMainHeading.map((letter, letterIndex) => (
          <span
            key={letterIndex}
            ref={(el) => setRefs(el, mainHeadingSpans)}
            className="inline-block whitespace-break-spaces pt-[5%]"
          >
            {letter}
          </span>
        ))}
        level={1}
        className="global-combining-classes-space-elements text-center text-white "
      />

      <div className="avatar_and_paragraph global-space-elements flex gap-5 max-lg:flex-col">
        <div ref={avatarAndSkillsRef} className="avatar_and_skills_info">
          <div className="avatar_and_skill">
            <div className="avatar_and_info grid gap-2 pb-[20px] md: place-content-center">
              {/* Аватар */}
              <AtomAvatar
                imgSRC="/Images-and-video/Avatar/Ruben.png"
                avatarRef={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
              />
              {/* Имя, ранг и локация */}
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

            {/* Категории навыков */}
            <div className="title_and_info flex flex-col max-lg:flex-row justify-center max-sm:flex-col">
              {aboutMeDB.categories.map((cat, catIndex) => (
                <div key={catIndex} className="title_and_list">
                  <AtomHeading
                    headingRef={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                    children={cat.miniTitle}
                    level={2}
                    className="base-mini-heading-combining-classes global-combining-classes-space-elements text-start max-lg:text-center max-sm:text-start"
                  />
                  <ul className="list w-[300px] grid gap-2">
                    {cat.skills.map((skill, skillIndex) => (
                      <AtomSkillsList
                        key={skillIndex}
                        refPercentages={(el) => setRefs(el, percentagesRefs)}
                        refLi={(el) => setRefs(el, everyAvatarHeadingLiRefs)}
                        children={skill.replace(/\s*\(\d+%\)/, "")} // убираем процент для текста li
                        classNameLI="max-lg:text-center max-sm:text-start"
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Основной параграф */}
        <AtomParagraph
          paragraphRef={(el) => setRefs(el, undefined, paragraphRef)}
          className="global-combining-classes-space-elements"
          children={words?.map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
              <span
                ref={(el) => setRefs(el, spanRefs)}
                key={wordIndex}
                className="inline-block word_span will-change-transform mr-3"
              >
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
    </>
  );
}
