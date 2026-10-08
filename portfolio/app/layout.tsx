import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "@fontsource-variable/heebo";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Eyal Taieb — AI Deployment & GTM Builder",
    template: "%s | Eyal Taieb",
  },
  description:
    "I design, build and deploy AI systems that connect business workflows to revenue. Explore Eyal Taieb’s outbound platforms, voice agents, calling systems and CRM workflows.",
  applicationName: "Eyal Taieb Portfolio",
  authors: [{ name: "Eyal Taieb" }],
  openGraph: {
    title: "Eyal Taieb — AI Deployment & GTM Builder",
    description:
      "Production AI systems with a clear link to commercial outcomes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Eyal Taieb — AI Deployment & GTM Builder",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
