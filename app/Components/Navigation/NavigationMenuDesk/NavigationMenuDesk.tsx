"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useAppSelector } from "@/app/Redux/Store/hooks";

export default function NavigationMenuDesk() {
  //Заголовки ссылок
  const navTitle = ["Home", "About me", "Portfolio", "Contacts"];
  //Состояние для заголовок ссылок для манипуляций анимации
  const [linkTexts, setLinkTexts] = useState(navTitle);
  //Состояние для отслеживания активной ссылки для того что бы задать эффект сияния
  const [activeLink, setActiveLink] = useState(0);
  //Состояние когда таймер работает выключить text-transform: uppercase;
  interface TSdisableUppercase {
    index: number | null;
    active: boolean;
  }
  const [disableUppercase, setDisableUppercase] = useState<TSdisableUppercase>({ index: null, active: true });
  const gsapLiRef = useRef<(HTMLLIElement | null)[]>([]);
  //Флажок анимации
  const [isAnimate, setIsAnimate] = useState(false);

  const activeStartPage = useAppSelector((state) => state.StartPage.active);

  //Получаем текущий путь для проверки и изменения стилей
  const location = usePathname();
  const isHome = location === "/";
  const isPortfolio = location === "/portfolio";

  //Функция которая перешивает буквы (в будущем он может стать хуком)
  function shuffArray(arr: string[]) {
    return arr
      .map((value) => ({
        value: Math.random() > 0.6 ? value.toLowerCase() : value.toUpperCase(),
        sort: Math.random()
      }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  }

  function randomTimeInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  //Функция активной кнопки
  const handleNavLinkActive = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    //Если анимация есть то блокируем клик
    if (isAnimate) return;
    //Ставим анимации true
    setIsAnimate(true);
    // Передаем индекс данной ссылки в актив для активации блеска
    setActiveLink(index);
    //Копия оригинально текста в навигации
    const originalNavText = [...linkTexts][index];
    //Выключаем верхний регистр
    setDisableUppercase({ index: index, active: false });

    //Счетчик для интервала
    let currentInterval = 0;
    //Интервал
    const intervalID = window.setInterval(() => {
      //Делаем больше при каждой итерации
      currentInterval++;
      // Состояние куда мы передали наши заголовки
      setLinkTexts((prev) => {
        //Копируем содержимое в newText
        const newText = [...prev];
        //Перемешиваем тот текст который получили по клику из originalNavText и передаем в newText
        newText[index] = shuffArray(originalNavText.split("")).join("");
        return newText;
      });

      // Рандомный стоп для интервала
      if (currentInterval >= randomTimeInterval(5, 9)) {
        //Очищаем интервал после своей работы
        window.clearInterval(intervalID);
        //Выключаем верхний регистр
        setDisableUppercase({ index: index, active: true });
        //Возвращаем буквы на место после кроткой анимации
        setLinkTexts((prev) => {
          //Получаем что есть на данный момент в состоянии
          const newText = [...prev];
          //Перезаписываем и вернем оригинал
          newText[index] = originalNavText;
          //После завершения всей анимации ставим false что бы сработало снова
          setIsAnimate(false);
          //Исходный текст
          return newText;
        });
      }
    }, randomTimeInterval(100, 150));
  };

  //Эффект для тогоч то бы каждый раз когда мы телепортируемся срабатывала анимация тосковки и была активной все в одном эффекте так как у них одна задача
  useEffect(() => {
    //Получаем данный элемент который должен быть активной
    const index = navTitle.findIndex((item) => {
      //Если в URL "Home" то / если нет берем айтем убираем пробелы,делаем низкую отладку и убераем пробелы если они есть
      const href = item === "Home" ? "/" : `/${item.replace(/\s+/g, "").toLowerCase().trim()}`;

      //Если href ровно тому что на данный момент где мы возвращаем его
      return href === location;
    });

    //Если стартовая страница true то анимация блокируется
    if (activeStartPage) return;

    //Если Если стартовая страниц false то запускается анимация навигации
    if (index !== -1) {
      setActiveLink(index);
      //Костыль для того что бы просто вызывалась функция так как первый аргумент не нужен а тап скрипт говорит нужно вот так и я его обошел
      handleNavLinkActive({} as any, index);
      gsap.fromTo(
        gsapLiRef.current,
        {
          y: -50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2
        }
      );
    }
  }, [location, activeStartPage]);

  return (
    <nav className="nav sticky top-0 z-[100]">
      <div className="container mx-auto">
        <ul className="nav_list hidden sm:flex justify-evenly px-4 py-5">
          {navTitle.map((item, index) => {
            //Links href to pages
            const href = item === "Home" ? "/" : `/${item.replace(" ", "").toLowerCase()}`;
            return (
              <li
                key={index}
                ref={(el: HTMLLIElement | null) => {
                  if (el) gsapLiRef.current[index] = el;
                }}
                className="list_item will-change-transform"
              >
                <Link
                  href={href}
                  onClick={(e) => handleNavLinkActive(e, index)}
                  className={`global-links-fonts inline-block min-w-[10ch] global-text-shadow-hover transition duration-200 ease-in will-change-transform ${
                    activeLink === index ? "link-glow-active" : ""
                  } ${
                    disableUppercase.index === index && disableUppercase.active === false ? "normal-case" : "uppercase"
                  } ${isHome ? "text-gray-600" : isPortfolio ? "text-gray-600" : "text-white"}`}
                >
                  {linkTexts[index]}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
