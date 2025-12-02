"use client";
import "./globals.css";

import type { Metadata } from "next";
import StartPage from "./Components/StartPage/StartPage";
import AudioBackground from "./Components/AudioBackground/AudioBackground";
import NavigationMenuDesk from "./Components/Navigation/NavigationMenuDesk/NavigationMenuDesk";
import Footer from "./Components/Footer/Footer";
import { Provider } from "react-redux";
import { store } from "./Redux/Store/Store";

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="test">
        <Provider store={store}>
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
