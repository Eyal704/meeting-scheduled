export type Locale = "en" | "he";

// Hebrew pages mirror the English routes under /he.
export function localePath(locale: Locale, path: string) {
  if (locale === "en") return path;
  return path === "/"
    ? "/he"
    : `/he${path.startsWith("/#") ? path.slice(1) : path}`;
}

export function localeFromPath(pathname: string | null): Locale {
  return pathname === "/he" || pathname?.startsWith("/he/") ? "he" : "en";
}

// The same page in the other language. Watch pages exist only in English.
export function alternatePath(pathname: string | null) {
  const path = pathname || "/";
  if (localeFromPath(path) === "he") return path.replace(/^\/he/, "") || "/";
  return path.startsWith("/projects/") ? `/he${path}` : "/he";
}

// Strings used by client components, which read the locale from the URL.
export const ui = {
  en: {
    skip: "Skip to content",
    home: "Eyal Taieb home",
    openNav: "Open navigation",
    closeNav: "Close navigation",
    mainNav: "Main navigation",
    projects: "Projects",
    about: "About",
    contact: "Contact",
    switchLabel: "עברית",
    switchAria: "הצגת הדף בעברית",
    watch: "Watch",
    viewEvidence: "View evidence:",
    watchDemo: "Watch demo",
    walkthrough: "PRODUCT WALKTHROUGH",
    evidence: "COMMERCIAL EVIDENCE",
    closeDialog: "Close dialog",
    playFailed:
      "This browser could not play the demo. Open the video directly using the link.",
    playerHelp:
      "Full product recording. Use the player controls to pause, seek or enter full screen.",
    openVideo: "Open video",
    openImage: "Open image",
    noVideo: "Your browser does not support embedded video.",
    openDemo: "Open the demo.",
    playWithSound: "Play video with sound",
    soundOn: "Turn sound on",
    needsTap: "Your browser needs a tap to start playback.",
    playingMuted: "Playing muted. Your browser needs a tap to enable sound.",
    showLess: "Show less evidence",
    showAll: (count: number) => `View all ${count} evidence images`,
  },
  he: {
    skip: "דילוג לתוכן",
    home: "אייל טייב, דף הבית",
    openNav: "פתיחת התפריט",
    closeNav: "סגירת התפריט",
    mainNav: "ניווט ראשי",
    projects: "פרויקטים",
    about: "אודות",
    contact: "יצירת קשר",
    switchLabel: "English",
    switchAria: "View this page in English",
    watch: "צפייה:",
    viewEvidence: "הצגת התיעוד:",
    watchDemo: "צפייה בהדגמה",
    walkthrough: "הדגמת מוצר",
    evidence: "תיעוד מסחרי",
    closeDialog: "סגירת החלון",
    playFailed:
      "הדפדפן לא הצליח להפעיל את הסרטון. ניתן לפתוח אותו ישירות בקישור.",
    playerHelp:
      "הקלטת מוצר מלאה, עם כתוביות באנגלית. ניתן לעצור, לדלג ולעבור למסך מלא.",
    openVideo: "פתיחת הסרטון",
    openImage: "פתיחת התמונה",
    noVideo: "הדפדפן אינו תומך בהצגת וידאו.",
    openDemo: "פתיחת ההדגמה.",
    playWithSound: "הפעלת הסרטון עם קול",
    soundOn: "הפעלת קול",
    needsTap: "יש להקיש כדי להתחיל את ההפעלה.",
    playingMuted: "הסרטון פועל ללא קול. יש להקיש כדי להפעיל קול.",
    showLess: "הצגת פחות",
    showAll: (count: number) => `הצגת כל ${count} התמונות`,
  },
};
