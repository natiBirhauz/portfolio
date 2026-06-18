import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
  description: "Portfolio of Nati Birhauz - Designer & Programmer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-[#f8fafc] to-[#e0e7ef] dark:from-[#18181b] dark:to-[#23272f] min-h-screen scroll-smooth`}
      >
        <nav className="w-full flex justify-between items-center px-8 py-6 bg-white/80 dark:bg-black/60 shadow-md fixed top-0 left-0 z-50 backdrop-blur-md">
          <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">Nati Birhauz</span>
          <ul className="flex gap-6 text-base font-medium">
            <li><a href="#about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</a></li>
            <li><a href="#projects" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Projects</a></li>
            <li><a href="#contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</a></li>
            <li><a href="https://github.com/natibirhauz" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/nati-birhauz-296724159/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">LinkedIn</a></li>
          </ul>
        </nav>
        <div className="pt-24 px-2 sm:px-0 w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
