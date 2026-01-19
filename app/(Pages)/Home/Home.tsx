//ANCHOR - Этот код в архиве

// "use client";
// import React, { useEffect, useRef, useState } from "react";

// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useRouter } from "next/navigation";

// import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

// import R from "../../../public/Images-and-video/Home-letters-svg/Home-letter-svg-r.svg";
// import U from "../../../public/Images-and-video/Home-letters-svg/Home-letter-svg-u.svg";
// import B from "../../../public/Images-and-video/Home-letters-svg/Home-letter-svg-b.svg";
// import O from "../../../public/Images-and-video/Home-letters-svg/Home-letter-svg-o.svg";
// import { useAppSelector } from "@/app/Redux/Store/hooks";
// gsap.registerPlugin(ScrollTrigger);

// export default function Home() {
//   const router = useRouter();
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const gsapLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
//   const scrollDivRef = useRef<HTMLDivElement | null>(null);
//   const mainTitleBoxRef = useRef<HTMLDivElement | null>(null);
//   const homeTitle = [R, U, B, O];
//   const [scrollHidden, setScrollHidden] = useState(true);
//   const isAnimateRef = useRef(false);
//   const activeStartPage = useAppSelector((state) => state.StartPage.active);

//   function waitImagesLoad(images: (HTMLImageElement | undefined | null)[]) {
//     return Promise.all(
//       images.map((img) => {
//         return new Promise<void>((resolve) => {
//           if (!img || img.complete) return resolve();
//           if (img.complete) return resolve();

//           img.onload = () => resolve();
//           img.onerror = () => resolve();
//         });
//       })
//     );
//   }

//   useEffect(() => {
//     const video = videoRef.current;
//     if (!video || !gsapLettersRef.current) return;

//     let currentSpeed = 0.1;
//     let targetSpeed = 1;

//     let animationFrame: number;
//     let mouseTimeout: NodeJS.Timeout;

//     const FAST = 4.5;
//     const SLOW = 0.7;
//     const SMOOTH = 0.1;

//     const updateSpeed = () => {
//       currentSpeed += (targetSpeed - currentSpeed) * SMOOTH;
//       video.playbackRate = currentSpeed;
//       animationFrame = requestAnimationFrame(updateSpeed);
//     };

//     const handleMouseMove = () => {
//       targetSpeed = FAST;

//       clearTimeout(mouseTimeout);
//       mouseTimeout = setTimeout(() => {
//         targetSpeed = SLOW;
//       }, 150);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     updateSpeed();

//     if (activeStartPage) return;
//     const image = gsapLettersRef.current.map((span) => span?.querySelector("img"));
//     waitImagesLoad(image).then(() => {
//       const lettersData = gsapLettersRef.current.map((letter, index) => {
//         const rect = letter?.getBoundingClientRect();
//         if (!rect) return null;
//         return {
//           index,
//           element: letter,
//           letterX: rect?.x,
//           letterWidth: rect?.width,
//           letterLeft: rect?.left
//         };
//       });

//       let randomLetterIndex = Math.floor(Math.random() * homeTitle.length);

//       let activeLetter = lettersData.find((letter) => letter?.index === randomLetterIndex);

//       if (activeLetter?.element && scrollDivRef.current && mainTitleBoxRef.current) {
//         const letterLeft = activeLetter.letterLeft;
//         const windowCenter = window.innerWidth / 2;
//         const offsetLeftX = windowCenter - letterLeft - 4;
//         if (!isAnimateRef.current && mainTitleBoxRef.current) {
//           isAnimateRef.current = true;
//           gsap.fromTo(
//             mainTitleBoxRef.current,
//             {
//               z: -200,
//               y: -100,
//               opacity: 0,
//               duration: 1
//             },
//             {
//               z: 0,
//               y: 0,
//               opacity: 1,
//               onComplete: () => {
//                 setScrollHidden(false);
//               }
//             }
//           );
//         }

//         if (activeLetter.element) {
//           gsap.to(activeLetter.element, {
//             z: 998,
//             x: offsetLeftX,
//             duration: 1,
//             ease: "power4.inOut",
//             scrollTrigger: {
//               trigger: scrollDivRef.current,
//               start: "top center",
//               end: "center +=200 top",
//               scrub: true,
//               markers: true,
//               onLeave: () => {
//                 router.push("/aboutme");
//               }
//             }
//           });
//         }
//       }
//     });

//     return () => {
//       window.removeEventListener("mousemove", handleMouseMove);
//       cancelAnimationFrame(animationFrame);
//       clearTimeout(mouseTimeout);
//       ScrollTrigger.getAll().forEach((t) => t.kill());
//     };
//   }, [activeStartPage]);
//   return (
//     <header className="homeContent">
//       <HiddenScreen active={scrollHidden} />;
//       <div className="home fixed inset-0 z-[1] overflow-hidden">
//         <video
//           ref={videoRef}
//           src="/Images-and-video/Background/Video/whistling-circles.mp4"
//           autoPlay
//           loop
//           muted
//           playsInline
//           className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
//         ></video>
//         <div className="container mx-auto">
//           <div className="title_box relative perspective-[2000px] h-[80vh] w-full grid place-content-center">
//             <h1
//               ref={mainTitleBoxRef}
//               className="home_title flex gap-[10px] pt-0 pr-10 pb-0 pl-10 perspective-[1000px] global-main-title global-user-no-select lg:text-[300px] sm:text-[150px] text-[100px] "
//             >
//               {homeTitle.map((el, index) => (
//                 <span
//                   ref={(el) => {
//                     gsapLettersRef.current[index] = el;
//                   }}
//                   key={index}
//                   className="letter inline-block [transform-style:preserve-3d]"
//                 >
//                   <img src={el.src} alt="" />
//                 </span>
//               ))}
//             </h1>
//           </div>
//         </div>
//       </div>
//       <div ref={scrollDivRef} className={`scroll h-[1000vh] relative z-[-1]`}></div>
//     </header>
//   );
// }
