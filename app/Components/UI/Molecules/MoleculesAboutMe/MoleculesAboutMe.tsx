import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import AtomHeading from "../../Atoms/AtomHeading/AtomHeading";
import AtomParagraph from "../../Atoms/AtomParagraph/AtomParagraph";
import AtomAvatar from "../../Atoms/AtomAvatar/AtomAvatar";
import AtomSkillsList from "../../Atoms/AtomInfoList/AtomSkillsList";
import { aboutMe } from "@/Data/aboutMeDB";

export default function MoleculesAboutMe() {
  // Храним данные о разработчике, которые придут с API
  const [aboutMeDB, setAboutMeDB] = useState<aboutMe | null>(null);

  // Рефы для работы с DOM напрямую и анимациями через GSAP
  const avatarRef = useRef<HTMLImageElement | null>(null); // реф аватара
  const paragraphRef = useRef<HTMLParagraphElement | null>(null); // параграф с описанием

  // Массивы рефов для множественных элементов
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

  useLayoutEffect(() => {
    // Если данных нет, ничего не делаем
    if (!aboutMeDB) return;

    const ctx = gsap.context(() => {
      // Создаем timeline GSAP, чтобы управлять анимациями и их последовательностью
      // Ставим defaults: каждая анимация длится 2 секунды, ease плавная, stagger для последовательного появления элементов
      const tl = gsap.timeline({ defaults: { duration: 1, visibility: "hidden", ease: "power4.out", stagger: 0.2 } });

      // ======= Анимация аватара =======
      if (avatarRef.current) {
        // Изначально аватар скрыт и поднят вверх, затем плавно появляется и опускается на место
        tl.fromTo(avatarRef.current, { y: -200, opacity: 0 }, { y: 0, opacity: 1, visibility: "visible" });
      }

      // ======= Анимация заголовков =======
      if (headingRefs.current.length) {
        // Все заголовки выезжают слева и появляются
        tl.fromTo(headingRefs.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1, visibility: "visible" });
      }

      // ======= Создаем label для синхронизации анимации параграфа и списка li =======
      // Это метка в timeline, чтобы можно было запускать разные анимации одновременно
      tl.addLabel("startLiAndParagraph");

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

        // Анимация слов: выезжают слева и постепенно появляются
        // "<startLiAndParagraph" = начинаем одновременно с li
        tl.fromTo(
          spans,
          { x: -500, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            visibility: "visible",
            stagger: 0.03
          },
          "startLiAndParagraph"
        )
          // После анимации span объединяем текст обратно в параграф
          .call(() => {
            if (paragraphRef.current) {
              const finalText = spans.map((el) => el.textContent).join("");
              paragraphRef.current!.textContent = finalText;
            }
          });
      }

      // ======= Анимация списка li =======
      if (liRefs.current.length) {
        // Элементы li появляются одновременно с параграфом (используем label)
        tl.fromTo(
          liRefs.current,
          { x: -200, opacity: 0 },
          { x: 0, opacity: 1, visibility: "visible" },
          "startLiAndParagraph"
        );
      }

      // ======= Анимация процентов навыков =======
      const endValues = percentagesOfExperience?.flat(); // упрощаем массив в один уровень
      if (percentagesRefs.current.length) {
        percentagesRefs.current.forEach((el, index) => {
          const endValue = endValues ? endValues[index] : 0;
          const obj = { val: 0 }; // объект для анимации числа
          tl.to(
            obj,
            {
              val: endValue, // конечное значение числа
              duration: 1, // длительность анимации числа
              onUpdate() {
                // Обновляем текст элемента на лету
                el.textContent = `  (${Math.floor(obj.val)}%)`;
              }
            },
            ">" // начинаем после li
          );
        });
      }
    });
    return () => ctx.revert();
  }, [aboutMeDB]);

  // ======= Fetch данных =======
  useEffect(() => {
    fetch("/api/aboutMe")
      .then((res) => res.json())
      .then((data) => setAboutMeDB(data)); // сохраняем в state
  }, []);

  if (!aboutMeDB) return; // пока данных нет — ничего не рендерим

  const dev = aboutMeDB.developerInfo[0];

  // ======= Функции для добавления рефов в массив =======
  const setHeading = (el: HTMLHeadingElement | null) => {
    if (el && !headingRefs.current.includes(el)) headingRefs.current.push(el);
  };

  const setPercentages = (el: HTMLSpanElement | null) => {
    if (el && !percentagesRefs.current.includes(el)) percentagesRefs.current.push(el);
  };

  const setLi = (el: HTMLLIElement | null) => {
    if (el && !liRefs.current.includes(el)) liRefs.current.push(el);
  };

  return (
    <>
      {/* Заголовок секции */}
      <AtomHeading
        headingRef={setHeading}
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
                headingRef={setHeading}
                children={dev.developerName}
                level={2}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
              <AtomHeading
                headingRef={setHeading}
                children={dev.rank}
                level={3}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
              <AtomHeading
                headingRef={setHeading}
                children={dev.location}
                level={4}
                className="base-mini-heading-combining-classes max-lg:text-center"
              />
            </div>

            {/* Категории навыков */}
            <div className="title_and_info flex flex-col border-t border-amber-50 max-lg:flex-row justify-center max-sm:flex-col">
              {aboutMeDB.categories.map((cat, catIndex) => (
                <div key={catIndex} className="title_and_list">
                  <AtomHeading
                    headingRef={setHeading}
                    children={cat.miniTitle}
                    level={2}
                    className="base-mini-heading-combining-classes global-combining-classes-space-elements text-start max-lg:text-center max-sm:text-start"
                  />
                  <ul className="list w-[300px] grid gap-2">
                    {cat.skills.map((skill, skillIndex) => (
                      <AtomSkillsList
                        key={skillIndex}
                        refPercentages={setPercentages}
                        refLi={setLi}
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
          paragraphRef={paragraphRef}
          className="global-combining-classes-space-elements max-lg: border-t border-amber-50"
        />
      </div>
    </>
  );
}
