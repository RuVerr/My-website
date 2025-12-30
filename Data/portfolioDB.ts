export interface portfolioDBProp {
  id: number;
  heading: string;
  img: string;
  technologies: string[];
  paragraph: string;
  link: string;
}

export const portfolioDB: portfolioDBProp[] = [
  {
    id: 1,
    heading: "AI Investing Platform",
    link: "https://ruverr.github.io/AI-Investing-Platform/",
    img: "/Images-and-video/Projects/proj_img_1.jpg",
    technologies: ["React", "Redux Toolkit", "Formik", "Swiper", "SCSS"],
    paragraph:
      "A React-based web app simulating AI-driven investment experience. Users can register, explore AI stock cards, add them to a portfolio, and interact with the interface on both desktop and mobile. Local storage is used for user data. Designed for educational purposes to showcase interactive UI, Redux Toolkit state management, Formik forms, and Swiper carousels."
  },
  {
    id: 2,
    heading: "Library WithStylo, built with SCSS",
    link: "https://with-stylo.dev/",

    img: "/Images-and-video/Projects/proj_img_2.jpg",
    technologies: ["React", "Zustand", "SCSS", "WithStylo", "Netlify"],
    paragraph:
      "I created WithStylo out of curiosity to learn how front-end libraries are built. The idea was to make SCSS mixins universal and easy to use for different design tasks. Unlike Tailwind, WithStylo keeps HTML clean by storing all logic inside SCSS, providing faster and more readable styling. I also developed WithStylo Snippets for VS Code to speed up writing styles. The documentation website was built with React, Zustand, and WithStylo, fully designed and animated by me from scratch. The project is fully deployed and running smoothly on Netlify."
  },
  {
    id: 3,
    heading: "A restaurant website developed according to SOLID principles.",
    link: "https://nostalgia-rest.netlify.app/",

    img: "/Images-and-video/Projects/proj_img_3.jpg",
    technologies: ["React", "Zustand", "SCSS", "WithStylo", "Netlify"],
    paragraph:
      "I developed a real restaurant website (no live link yet) following SOLID principles using Vanilla JS classes. All animations, interactions, layout, and design were created by me from scratch without any libraries. The project focuses on clean architecture and proper SOLID methodology. The site is fully translated into English, Russian, and Armenian and features a dynamic menu system."
  }
];
