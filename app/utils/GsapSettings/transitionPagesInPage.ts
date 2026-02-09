import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
//@ts-ignore
import { Router } from "next/navigation";
import { MutableRefObject } from "react";

export interface transitionPagesInPageProp {
  scrollEl: HTMLDivElement;
  transitionEl: HTMLDivElement;
  transitionFlag: MutableRefObject<boolean>;
  scrollHeight: number;
  scrollProgress?: number;
  router: Router;
  routerPushNext?: string;
  routerPushBack?: string;
}

export function transitionPagesInPage({
  scrollEl,
  transitionEl,
  transitionFlag,
  scrollHeight,
  scrollProgress,
  router,
  routerPushNext,
  routerPushBack
}: transitionPagesInPageProp) {
  const scrollValue = scrollProgress ? scrollProgress / 100 : 98;
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
      gsap.set(transitionEl, {
        scale: 0.1,
        autoAlpha: 0,
        ease: "expo.inOut"
      });
      // ===== ScrollTrigger =====
      const st = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top 15%",
        end: () =>
          desktop
            ? "+=" + scrollHeight * 2.5
            : tablet
              ? "+=" + scrollHeight * 1.5
              : mobile
                ? "+=" + scrollHeight * 3
                : scrollHeight,
        scrub: 1,

        // ===== отслеживаем прогресс скролла =====
        onUpdate: (self) => {
          if (self.direction > 0 && self.progress >= scrollValue && transitionFlag.current && routerPushNext) {
            transitionFlag.current = false;
            // ===== финальная transition-анимация =====
            handleTransitionEl(`${routerPushNext}`);
          }
          if (self.direction < 0 && self.progress < 0.5 && transitionFlag.current && routerPushBack) {
            // ===== Обратный transition-анимация =====
            transitionFlag.current = false;
            handleTransitionEl(`${routerPushBack}`);
          }
        }
      });

      function handleTransitionEl(routerPush?: string) {
        gsap.to(transitionEl, {
          scale: 16,
          autoAlpha: 1,
          duration: 1,
          onComplete: () => {
            router.push(`${routerPush}`);
            st.disable();
          }
        });
      }
    }
  );
}
