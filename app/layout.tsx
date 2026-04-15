import "./globals.css";
import NavigationMenuDesk from "./Components/Navigation/NavigationMenuDesk/NavigationMenuDesk";
import TemplateCustomCursor from "./Components/UI/Templates/TemplateCustomCursor/TemplateCustomCursor";
import MoleculesBackgroundAudio from "./Components/UI/Molecules/MoleculesBackgroundAudio/MoleculesBackgroundAudio";
import TemplateNavigation from "./Components/UI/Templates/TemplateNavigation/TemplateNavigation";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TemplateCustomCursor />
        {/* <MoleculesBackgroundAudio /> */}
        <TemplateNavigation />
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
