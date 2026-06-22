"use client";
import { createContext, useContext, useState } from "react";

type Lang = "en" | "he";
type Translations = typeof en;

const en = {
  nav: { about: "About", projects: "Projects", skills: "Skills", contact: "Contact", github: "GitHub", linkedin: "LinkedIn" },
  hero: { title: "Netanel Birhauz", subtitle: "Programmer & A.I Specialist" },
  bio: {
    greeting: "Hi, I'm Nati!",
    line1: "Welcome to my portfolio — a place where code meets creativity.",
    line2a: "My main focus is", line2b: "AI", line2c: "and", line2d: "networks",
    line3a: "I've been building software since I was", line3b: "15 years old",
    line4a: "M.Sc. Software Engineering", line4b: "— specialization in A.I.",
  },
  skillsSection: {
    heading: "What I Do",
    intro: "An agile and analytical Software Engineer specializing in Artificial Intelligence. Sharp, analytical, and adaptable — ready to tackle anything.",
    items: [
      { title: "AI Architecture & Model Training", body: "End-to-end development of custom AI agents and RAG frameworks. Highly skilled in training, fine-tuning, and deploying Large Language Models." },
      { title: "Full-Stack Web Development", body: "Architecting responsive, data-rich web applications that translate complex backend logic into highly reactive user interfaces." },
      { title: "Network Infrastructure", body: "Deep expertise in network architecture and routing (TCP/IP). Analysis, deployment, and security protocols for RF systems and cellular networks, including Cisco, Juniper, and Check Point." },
      { title: "Visual Design & Engineering", body: "Delivering advanced visual engineering and UI/UX design for sophisticated web platforms and printed media." },
    ],
  },
  projects: { heading: "Projects", viewProject: "View Project", github: "GitHub", play: "Play on itch.io" },
  contact: { heading: "Where to find me", email: "Email me" },
  skills: { heading: "Skills", tools: "Tools I Use", languages: "Languages" },
};

const he: Translations = {
  nav: { about: "אודות", projects: "פרויקטים", skills: "כישורים", contact: "צור קשר", github: "GitHub", linkedin: "LinkedIn" },
  hero: { title: "נתנאל בירהאוז", subtitle: "מתכנת ומומחה בינה מלאכותית" },
  bio: {
    greeting: "היי, אני נתי!",
    line1: "ברוכים הבאים לפורטפוליו שלי — מקום שבו קוד פוגש יצירתיות.",
    line2a: "ההתמחות העיקרית שלי היא", line2b: "בינה מלאכותית", line2c: "ו", line2d: "רשתות",
    line3a: "אני מפתח תוכנה מגיל", line3b: "15",
    line4a: "תואר שני בהנדסת תוכנה", line4b: "— התמחות בבינה מלאכותית",
  },
  skillsSection: {
    heading: "מה אני עושה",
    intro: "מהנדס תוכנה זריז ואנליטי המתמחה בבינה מלאכותית. חד, אנליטי וגמיש — מוכן להתמודד עם כל אתגר.",
    items: [
      { title: "ארכיטקטורת AI ואימון מודלים", body: "פיתוח מקצה לקצה של סוכני AI מותאמים ומסגרות RAG. מיומן מאוד באימון, כיוונון עדין ופריסת מודלי שפה גדולים." },
      { title: "פיתוח Full-Stack", body: "תכנון אפליקציות ווב רספונסיביות ועשירות נתונים המתרגמות לוגיקת Backend מורכבת לממשקי משתמש תגובתיים." },
      { title: "תשתיות רשת", body: "מומחיות עמוקה בארכיטקטורת רשת וניתוב (TCP/IP), פריסה ופרוטוקולי אבטחה למערכות RF ורשתות סלולריות, כולל Cisco, Juniper ו-Check Point." },
      { title: "עיצוב ויזואלי והנדסה", body: "מסירת הנדסה ויזואלית מתקדמת ועיצוב UI/UX לפלטפורמות ווב מתוחכמות ומדיה מודפסת." },
    ],
  },
  projects: { heading: "פרויקטים", viewProject: "צפה בפרויקט", github: "GitHub", play: "שחק ב-itch.io" },
  contact: { heading: "איפה למצוא אותי", email: "שלח לי מייל" },
  skills: { heading: "כישורים", tools: "כלים בשימוש", languages: "שפות תכנות" },
};

const translations = { en, he };

const LangContext = createContext<{ lang: Lang; t: Translations; toggle: () => void }>({
  lang: "en", t: en, toggle: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const toggle = () => setLang(l => l === "en" ? "he" : "en");
  return (
    <LangContext.Provider value={{ lang, t: translations[lang], toggle }}>
      <div dir={lang === "he" ? "rtl" : "ltr"}>{children}</div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
