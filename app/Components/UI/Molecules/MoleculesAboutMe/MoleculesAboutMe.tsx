import React, { useEffect, useLayoutEffect, useRef, useState, MutableRefObject } from "react";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";
import AtomAvatar from "../../Atoms/AtomAvatar/AtomAvatar";
import AtomSkillsList from "../../Atoms/AtomInfoList/AtomSkillsList";
import { aboutMe } from "@/Data/aboutMeDB";

// ======= Функция для добавления рефов в массив =
import { setRefs } from "@/app/utils/setRefs";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function MoleculesAboutMe() {
  // Храним данные о разработчике, которые придут с API
  const [aboutMeDB, setAboutMeDB] = useState<aboutMe | null>(null);

  // Рефы для работы с DOM напрямую и анимациями через GSAP
  const avatarRef = useRef<HTMLImageElement | null>(null); // реф аватара
  const paragraphRef = useRef<HTMLParagraphElement | null>(null); // параграф с описанием
  const headingRefs = useRef<HTMLHeadingElement[]>([]); // все заголовки
  const percentagesRefs = useRef<HTMLSpanElement[]>([]); // span для процентов навыков
  const liRefs = useRef<HTMLLIElement[]>([]); // li для списка навыков

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

  // ======= Fetch данных =======
  useEffect(() => {
    fetch("/api/aboutMe")
      .then((res) => res.json())
      .then((data) => setAboutMeDB(data)); // сохраняем в state
  }, []);

  // ======= GSAP анимации =======
  useLayoutEffect(() => {
    // Если данных нет, ничего не делаем точнее вылетаем
    if (!aboutMeDB) return;

    const ctx = gsap.context(() => {
      //FIXME - Временно
      const scrollEl = document.querySelector(".about_me");
      // Создаем timeline GSAP, чтобы управлять анимациями и их последовательностью
      // Ставим defaults: каждая анимация длится 2 секунды, ease плавная, stagger для последовательного появления элементов
      const tl = gsap.timeline({
        defaults: { duration: 100, ease: "power4.inOut" },
        scrollTrigger: {
          trigger: scrollEl,
          start: "top center",
          end: "bottom top+=1000",
          scrub: 1.2
        }
      });

      // ======= Анимация заголовков =======
      if (headingRefs.current.length) {
        // Все заголовки выезжают слева и появляются
        tl.from(headingRefs.current, { x: -200, autoAlpha: 0, stagger: 4 });
      }

      // ======= Анимация аватара =======
      if (avatarRef.current) {
        // Изначально аватар скрыт и поднят вверх, затем плавно появляется и опускается на место
        tl.from(avatarRef.current, { y: -180, autoAlpha: 0 });
      }

      // ======= Создаем label для синхронизации анимации параграфа и списка li =======
      // Это метка в timeline, чтобы можно было запускать разные анимации одновременно
      // tl.addLabel("startLiAndParagraph");

      const words = aboutMeDB?.developerInfo[0].description
        .join("")
        .replace(/\n+/g, " ") // заменяем переносы строк на пробелы
        .replace(/\s+/g, " ") // убираем лишние пробелы
        .split(" "); // разбиваем на отдельные слова

      if (paragraphRef.current && words) {
        // Очищаем параграф перед вставкой span
        paragraphRef.current.innerHTML = "";

        const spans: HTMLSpanElement[] = []; // массив span, чтобы анимировать слова отдельно

        words.forEach((word) => {
          // Создаем span для каждого слова
          const span = document.createElement("span");
          // Добавляем слово и перенос строки после точки
          span.textContent += word + (word.endsWith(".") ? "\n\n" : " ");
          // Класс для стилей
          span.className = "word_span mr-1 base-paragraph-combining-classes will-change-transform";
          // Вставляем span в параграф
          paragraphRef.current?.appendChild(span);
          // Добавляем span в массив для анимации
          spans.push(span);
        });

        tl.addLabel("startSpansAndLi");
        // tl.addLabel("x");
        // Анимация слов: выезжают слева и постепенно появляются
        // "<startLiAndParagraph" = начинаем одновременно с li
        tl.from(
          spans,
          {
            autoAlpha: 0,
            stagger: 1
          },
          "startSpansAndLi"
        );
      }

      // ======= Анимация списка li =======
      if (liRefs.current.length) {
        //REVIEW -  Элементы li появляются одновременно с параграфом (используем label)
        tl.from(
          liRefs.current,
          {
            x: -400,
            stagger: 2,
            delay: 100
          },
          "startSpansAndLi"
        ).add(() => startCounter());
      }

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
              onUpdate() {
                // Обновляем текст элемента на лету
                el.textContent = `  (${Math.floor(obj.val)}%)`;
              }
            });
          });
        }
      }
    });
    return () => ctx.revert();
  }, [aboutMeDB]);

  if (!aboutMeDB) return; // пока данных нет — ничего не рендерим

  const dev = aboutMeDB.developerInfo[0];

  return (
    <>
      {/* Заголовок секции */}
      <AtomHeading
        headingRef={(el) => setRefs(el, headingRefs)}
        children={"About Me"}
        level={1}
        className="global-combining-classes-space-elements text-red-800 "
      />

      <div className="avatar_and_paragraph global-space-elements flex gap-5 max-lg:flex-col">
        <div className="avatar_and_skills_info">
          <div className="avatar_and_skill">
            <div className="avatar_and_info grid gap-2 pb-[20px] md: place-content-center">
              {/* Аватар */}
              <AtomAvatar imgSRC="/Images-and-video/Avatar/Ruben.png" avatarRef={avatarRef} />
              {/* Имя, ранг и локация */}
              <AtomHeading
                headingRef={(el) => setRefs(el, headingRefs)}
                children={dev.developerName}
                level={2}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
              <AtomHeading
                headingRef={(el) => setRefs(el, headingRefs)}
                children={dev.rank}
                level={3}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
              <AtomHeading
                headingRef={(el) => setRefs(el, headingRefs)}
                children={dev.location}
                level={4}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
            </div>

            {/* Категории навыков */}
            <div className="title_and_info flex flex-col max-lg:flex-row justify-center max-sm:flex-col">
              {aboutMeDB.categories.map((cat, catIndex) => (
                <div key={catIndex} className="title_and_list">
                  <AtomHeading
                    headingRef={(el) => setRefs(el, headingRefs)}
                    children={cat.miniTitle}
                    level={2}
                    className="base-mini-heading-combining-classes global-combining-classes-space-elements text-start max-lg:text-center max-sm:text-start"
                  />
                  <ul className="list w-[300px] grid gap-2">
                    {cat.skills.map((skill, skillIndex) => (
                      <AtomSkillsList
                        key={skillIndex}
                        refPercentages={(el) => setRefs(el, percentagesRefs)}
                        refLi={(el) => setRefs(el, liRefs)}
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
        />
      </div>
    </>
  );
}
