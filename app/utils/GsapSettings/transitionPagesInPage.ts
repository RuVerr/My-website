import gsap from "gsap";
//@ts-ignore
import { Router } from "next/navigation";

export interface transitionPagesProp {
  transitionEl: HTMLDivElement;
  router: Router;
  routerPushNext?: string;
  routerPushBack?: string;
}

export function transitionPagesInPage({ transitionEl, router, routerPushNext }: transitionPagesProp) {
  if (!transitionEl) return;

  gsap.to(transitionEl, {
    scale: 20,
    duration: 1.5,
    ease: "power4.inOut",
    autoAlpha: 1,
    onComplete: () => {
      router.push(routerPushNext);
    }
  });
}

export function transitionPagesBackPage({ transitionEl, router, routerPushBack }: transitionPagesProp) {
  gsap.to(transitionEl, {
    scale: 20,
    duration: 1.5,
    ease: "power4.inOut",
    autoAlpha: 1,
    onComplete: () => {
      router.push(routerPushBack);
    }
  });
}

// export function transitionPagesInPage({
//   scrollEl,
//   transitionEl,
//   transitionFlag,
//   scrollHeight,
//   scrollProgress,
//   router,
//   routerPushNext,
//   routerPushBack,
//   tabletHeightMultiple = 1,
//   mobileHeightMultiple = 3
// }: transitionPagesInPageProp) {
//   const scrollValue = scrollProgress ? scrollProgress / 100 : 98;
//   const mm = gsap.matchMedia();
//   mm.add(
//     {
//       desktop: "(min-width: 1024px)",
//       tablet: "(min-width: 768px) and (max-width: 1023px)",
//       mobile: "(max-width: 767px)"
//     },
//     (context) => {
//       if (!context.conditions) return;
//       const { desktop, tablet, mobile } = context.conditions;
//       gsap.set(transitionEl, {
//         scale: 0.1,
//         autoAlpha: 0,
//         ease: "expo.inOut"
//       });
//       // ===== ScrollTrigger =====
//       const st = ScrollTrigger.create({
//         trigger: scrollEl,
//         start: "top 15%",
//         markers: true,
//         end: () =>
//           desktop
//             ? "+=" + scrollHeight * 2.9
//             : tablet
//               ? "+=" + scrollHeight * tabletHeightMultiple
//               : mobile
//                 ? "+=" + scrollHeight * mobileHeightMultiple
//                 : scrollHeight,
//         scrub: 1,

//         // ===== отслеживаем прогресс скролла =====
//         onUpdate: (self) => {
//           if (self.direction > 0 && self.progress >= scrollValue && transitionFlag.current && routerPushNext) {
//             transitionFlag.current = false;
//             // ===== финальная transition-анимация =====
//             handleTransitionEl(`${routerPushNext}`);
//           }
//           if (self.direction < 0 && self.progress < 0.2 && transitionFlag.current && routerPushBack) {
//             // ===== Обратный transition-анимация =====
//             transitionFlag.current = false;
//             handleTransitionEl(`${routerPushBack}`);
//           }
//         }
//       });

//       function handleTransitionEl(routerPush?: string) {
//         gsap.to(transitionEl, {
//           scale: 16,
//           autoAlpha: 1,
//           duration: 1,
//           onComplete: () => {
//             router.push(`${routerPush}`);
//             st.disable();
//           }
//         });
//       }
//     }
//   );
// }
