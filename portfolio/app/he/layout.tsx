import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: {
    absolute: "אייל טייב | AI Deployment & GTM",
    template: "%s | אייל טייב",
  },
  description:
    "אייל טייב מתכנן, בונה ומטמיע מערכות AI שמחברות תהליכים עסקיים להכנסות: פנייה יזומה, סוכנים קוליים, מערכות חיוג ותהליכי CRM.",
  openGraph: {
    title: "אייל טייב | AI Deployment & GTM",
    description: "מערכות AI בסביבת ייצור, עם קשר ברור לתוצאות עסקיות.",
    type: "website",
    locale: "he_IL",
  },
};

export default function HebrewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="he">{children}</SiteShell>;
}
