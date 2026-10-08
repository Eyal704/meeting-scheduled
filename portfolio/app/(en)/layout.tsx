import { SiteShell } from "@/components/site-shell";

export default function EnglishLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
