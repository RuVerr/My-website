import React, { useLayoutEffect, useRef, useState } from "react";
import MoleculesAboutMe from "../../Molecules/MoleculesAboutMe/MoleculesAboutMe";
import MoleculesBackground from "../../Molecules/MoleculesBackground/MoleculesBackground";
import HiddenScreen from "@/app/Components/Hooks/HiddenScreen/HiddenScreen";

export default function OrganismsAboutMe() {
  const scrollAboutMeRef = useRef<HTMLDivElement | null>(null);
  const [activeHidden, setActiveHidden] = useState<boolean>(true);

  useLayoutEffect(() => {
    let hiddenTimeout: ReturnType<typeof setTimeout>;

    hiddenTimeout = setTimeout(() => {
      setActiveHidden(false);
    }, 1000);

    return () => clearInterval(hiddenTimeout);
  }, []);

  return (
    <section ref={scrollAboutMeRef} className="about_me mt-[100vh]">
      <HiddenScreen active={activeHidden} />
      <MoleculesBackground
        className="backdrop: blur-[30px]"
        backgroundSRC="/Images-and-video/Background/Video/rotating-riangles.mp4"
        //@ts-ignore
        scrollRef={scrollAboutMeRef}
      />
      <div className="container mx-auto">
        <div className="about_me_content relative z-[2] w-full global-space-main-elements">
          <MoleculesAboutMe />
        </div>
      </div>
    </section>
  );
}
