import "./globals.css";
// import StartPage from "./Components/StartPage/StartPage";
// import AudioBackground from "./Components/AudioBackground/AudioBackground";
import NavigationMenuDesk from "./Components/Navigation/NavigationMenuDesk/NavigationMenuDesk";
import Provider from "./Redux/Providers/provider";
import TemplateCustomCursor from "./Components/UI/Templates/TemplateCustomCursor/TemplateCustomCursor";
import MoleculesBackgroundAudio from "./Components/UI/Molecules/MoleculesBackgroundAudio/MoleculesBackgroundAudio";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <TemplateCustomCursor />
          {/* <StartPage /> */}
          {/* <AudioBackground /> */}
          <MoleculesBackgroundAudio />
          <NavigationMenuDesk />
          <main className="main">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
