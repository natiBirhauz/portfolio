import type { Metadata } from "next";
import { Geist, Geist_Mono, Heebo } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ThemeProvider } from "./context/ThemeContext";
import { LangProvider } from "./context/LangContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "Nati Birhauz | Portfolio",
  description: "my portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${heebo.variable} antialiased min-h-screen scroll-smooth`}
      >
        <ThemeProvider>
          <LangProvider>
            <Navbar />
            {/* md:pr-20 offsets content for the desktop sidebar only */}
            <div className="md:pr-20 w-full">
              {children}
            </div>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
