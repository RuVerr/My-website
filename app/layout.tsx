import "./globals.css";
import StartPage from "./Components/StartPage/StartPage";
import AudioBackground from "./Components/AudioBackground/AudioBackground";
import NavigationMenuDesk from "./Components/Navigation/NavigationMenuDesk/NavigationMenuDesk";
import Footer from "./Components/Footer/Footer";
import Provider from "./Redux/Providers/provider";
import TemplateCustomCursor from "./Components/UI/Templates/TemplateCustomCursor/TemplateCustomCursor";

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
          <StartPage />
          <AudioBackground />
          <NavigationMenuDesk />
          <main className="main">{children}</main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
