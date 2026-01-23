export type TitleWithSkill = {
  miniTitle: string;
  skills: string[];
};

export type developerInfo = {
  developerName: string;
  location: string;
  rank: string;
  description: string[];
};

export type aboutMe = {
  categories: TitleWithSkill[];
  developerInfo: developerInfo[];
};

export const aboutMeDB: aboutMe = {
  developerInfo: [
    {
      developerName: "Ruben Vermishyan",
      rank: "Frontend / Junior+",
      location: "Georgia, Armenia",
      description: [
        `I build complex projects from scratch, maintaining scalability and easily adding new features. 
        
        I like experimenting with modern tools and approaches to ensure that interfaces are not only visually appealing but also highly functional.

        I pay attention to details so that every part of the interface looks neat and harmonious.

        I focus on creating responsive designs that work seamlessly across all devices and screen sizes. 
        
        User experience is a priority, and I aim to make applications intuitive and enjoyable for end-users.

        Collaboration is important to me—I actively communicate with designers, developers, and stakeholders to deliver polished and efficient projects.

        I also prioritize performance optimization, ensuring that applications load quickly and run smoothly, even with complex animations or dynamic components.
        I enjoy learning and experimenting with new frontend techniques, constantly refining my skills to create innovative and maintainable solutions.

        My goal is to deliver applications that are visually compelling, technically robust, and provide a seamless experience for users.`
      ]
    }
  ],
  categories: [
    {
      miniTitle: "Skills",
      skills: [
        "HTML/CSS (97%)",
        "JavaScript (63%)",
        "React (62%)",
        "Next.js (48%)",
        "SOLID (79%) ",
        "Clean code (99%)",
        "Pixel Perfect (98%)"
      ]
    },
    {
      miniTitle: "Library Skill",
      skills: [
        "Redux Toolkit (72%) ",
        "Zustand (78%)",
        "GSAP (59%)",
        "Three.js (42%)",
        "Swiper (48%)",
        "Vanta (70%)",
        "Formik (44%)",
        "Tailwind (87%)",
        "WithStylo (99%)"
      ]
    }
  ]
};
