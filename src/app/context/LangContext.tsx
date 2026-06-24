"use client";
import { createContext, useContext, useState } from "react";

type Lang = "en" | "he";
type Translations = typeof en;

const en = {
  nav: { about: "About", aiBot: "Nati-Bot", skills: "Skills", projects: "Projects", contact: "Contact", github: "GitHub", linkedin: "LinkedIn" },
  hero: { title: "Netanel Birhauz", subtitle: "Programmer & A.I Specialist" },
  bio: {
    greeting: "Hi, I'm Nati!",
    line1: "Welcome to my portfolio!",
    line2a: "My main focus is", line2b: "AI", line2c: "and", line2d: "networks",
    line3a: "I've been building software since I was", line3b: "15 years old",
    line4a: "M.Sc. Software Engineering", line4b: "— specialization in A.I.",
  },
  skillsSection: {
    heading: "What I Do",
    intro: "An analytical Software Engineer specializing in Artificial Intelligence. Sharp, and adaptable — ready to tackle anything.",
    items: [
      { title: "AI Architecture & Model Training", body: "End-to-end development of custom AI agents and RAG frameworks. Highly skilled in training, fine-tuning, and deploying Large Language Models." },
      { title: "Full-Stack Web Development", body: "Architecting responsive, data-rich web applications that translate complex backend logic into highly reactive user interfaces." },
      { title: "Network Infrastructure", body: "Deep expertise in network architecture and routing (TCP/IP). Analysis, deployment, and security protocols for RF systems and cellular networks, including Cisco, Juniper, and Check Point." },
      { title: "Visual Design & Engineering", body: "Delivering advanced visual engineering and UI/UX design for sophisticated web platforms and printed media." },
    ],
  },
  projects: { heading: "Projects", viewProject: "View Project", github: "GitHub", play: "Play on itch.io" },
  projectList: [
    {
      title: "DataMap",
      description: "DataMap helps you map and understand data used for large language models. Python backend + web frontend for uploading, exploring, tagging, and visualizing prompt–response data.",
    },
    {
      title: "תמצא לי",
      description: "An AI tool to check the availability and prices for EVERYTHING — from a pen to a house. This demo is made with AI search prediction.",
    },
    {
      title: "BallStrike",
      description: "A fast-paced 3D arcade dodging game built with Unity as part of the Master's degree in Computer Science at Azrieli College of Engineering.",
    },
  ],
  contact: { heading: "Where to find me", email: "Email me" },
  skills: { heading: "Skills", tools: "Tools I Use", languages: "Languages" },
};

const he: Translations = {
  nav: { about: "אודות", aiBot: "נתי-בוט", skills: "כישורים", projects: "פרויקטים", contact: "צור קשר", github: "GitHub", linkedin: "LinkedIn" },
  hero: { title: "נתנאל בירהאוז", subtitle: "מתכנת ומומחה בינה מלאכותית" },
  bio: {
    greeting: "היי, אני נתי!",
    line1: "ברוכים הבאים לפורטפוליו שלי!",
    line2a: "ההתמחות העיקרית שלי היא", line2b: "בינה מלאכותית", line2c: "ו", line2d: "רשתות",
    line3a: "אני מפתח תוכנה מגיל", line3b: "15",
    line4a: "תואר שני בהנדסת תוכנה", line4b: "— התמחות בבינה מלאכותית",
  },
  skillsSection: {
    heading: "מה אני עושה",
    intro: "אני מהנדס תוכנה זריז המתמחה בבינה מלאכותית. חד, אנליטי וקפדן — מוכן להתמודד עם כל אתגר.",
    items: [
      { title: "ארכיטקטורת AI ואימון מודלים", body: "פיתוח מקצה לקצה של סוכני AI מותאמים לRAG. מיומן מאוד באימון, כיוונון עדין ופריסת מודלי שפה גדולים." },
      { title: "פיתוח Full-Stack", body: "תכנון אפליקציות ווב רספונסיביות עם לוגיקת Backend מורכבת לממשקי משתמש ." },
      { title: "תשתיות רשת", body: "מומחיות עמוקה בארכיטקטורת רשת וניתוב (TCP/IP), פריסה ופרוטוקולי אבטחה למערכות RF ורשתות סלולריות, כולל Cisco, Juniper ו-Check Point." },
      { title: "עיצוב ויזואלי והנדסה", body: "ויזואלית מתקדמת ועיצוב UI/UX לפלטפורמות WEB מתוחכמות ומדיה מודפסת." },
    ],
  },
  projects: { heading: "פרויקטים", viewProject: "צפה בפרויקט", github: "GitHub", play: "שחק ב-itch.io" },
  projectList: [
    {
      title: "DataMap",
      description: "DataMap עוזרת לך למפות ולהבין נתונים המשמשים למודלי שפה גדולים. Backend בפייתון ו-Frontend ווב להעלאה, חקירה, תיוג והדמיה של נתוני פרומפט-תשובה.",
    },
    {
      title: "תמצא לי",
      description: "כלי AI לבדיקת זמינות ומחירים של הכל — מקטן ועד גדול. הדמו נבנה עם חיזוי חיפוש מבוסס AI.",
    },
    {
      title: "BallStrike",
      description: "משחק ארקייד תלת-ממדי מהיר שנבנה עם Unity כחלק מהתואר השני במדעי המחשב במכללת עזריאלי להנדסה.",
    },
  ],
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
      <div dir={lang === "he" ? "rtl" : "ltr"} lang={lang}>{children}</div>
    </LangContext.Provider>
  );
}

export const useLang = () => useContext(LangContext);
