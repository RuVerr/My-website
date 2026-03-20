import React from "react";

interface AtomPortfolioCardProp {
  src?: string;
  heading: React.ReactNode;
  paragraph: React.ReactNode;
  technologies?: string[];
  cardRef: React.Ref<HTMLDivElement>;
  technologiesRef?: React.Ref<HTMLDivElement>;
  onlineLink?: React.ReactNode;
  cardImgRef: React.Ref<HTMLDivElement>;
  className?: string;
}

export default function AtomPortfolioCard({
  src,
  heading,
  onlineLink,
  paragraph,
  technologies = [],
  cardRef,
  cardImgRef,
  className = ""
}: AtomPortfolioCardProp) {
  return (
    <div className={`card ${className}`}>
      <div className="card_and_paragraph flex max-lg:flex-col items-start">
        <div ref={cardImgRef} className="card_img rounded-4xl overflow-hidden">
          <img src={src} alt="Projects" className="w-[600px]" />
        </div>
        <div ref={cardRef} className="paragraph_and_pre flex-1 pl-[20px] flex-col">
          {heading}
          {technologies.map((techText, techIndex) => (
            <pre key={techIndex} className="inline-block text-[14px] text-black">
              {techText}
              {techIndex !== technologies.length - 1 ? " | " : ""}
            </pre>
          ))}
          {paragraph}
          {onlineLink}
        </div>
      </div>
    </div>
  );
}
