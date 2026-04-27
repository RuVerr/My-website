import "./globals.css";
import TemplateCustomCursor from "./Components/UI/Templates/TemplateCustomCursor/TemplateCustomCursor";
import TemplateNavigation from "./Components/UI/Templates/TemplateNavigation/TemplateNavigation";

export const metadata = {
  title: {
    default: "Ruver.dev",
    template: "%s | Ruver.dev"
  },

  description:
    "Frontend Developer Ruben (ruver). Portfolio with GSAP animations, modern UI and interactive web experiences.",

  keywords: ["Frontend Developer", "Next.js", "React", "GSAP", "Motion Design", "Web Animations"],

  authors: [{ name: "Ruben Vermishyan (ruver)" }],

  metadataBase: new URL("https://ruver.dev"),

  openGraph: {
    title: "Ruver.dev | Frontend Developer Portfolio",

    description: "Motion-driven frontend experience built with Next.js + GSAP",

    url: "https://ruver.dev",

    siteName: "ruver.dev",

    images: [
      {
        url: "/Images-and-video/Icon/soc-icon/og-image.png"
      }
    ],

    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/Images-and-video/Icon/soc-icon/favicon/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/Images-and-video/Icon/soc-icon/favicon/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/Images-and-video/Icon/soc-icon/favicon/favicon-16x16.png"
        />
        <link rel="manifest" href="/Images-and-video/Icon/soc-icon/favicon/site.webmanifest" />
      </head>
      <body>
        <TemplateCustomCursor />
        <TemplateNavigation />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
