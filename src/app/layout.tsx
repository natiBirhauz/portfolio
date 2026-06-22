import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen scroll-smooth dark:bg-gray-950 dark:text-gray-100`}
      >
        <ThemeProvider>
          <LangProvider>
            <Navbar />
            <div className="pt-16 px-2 sm:px-0 w-full">
              {children}
            </div>
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
