import type { Metadata, Viewport } from "next";
import "@fontsource-variable/dm-sans";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "Eyal Taieb — AI Deployment & GTM Builder",
    template: "%s | Eyal Taieb",
  },
  description:
    "I build and deploy AI systems that turn business workflows into revenue. Explore Eyal Taieb’s outbound platforms, voice agents, calling systems and CRM workflows.",
  applicationName: "Eyal Taieb Portfolio",
  authors: [{ name: "Eyal Taieb" }],
  openGraph: {
    title: "Eyal Taieb — AI Deployment & GTM Builder",
    description:
      "Working systems, commercial context, real business value. Explore the work.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary",
    title: "Eyal Taieb — AI Deployment & GTM Builder",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a1018",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
