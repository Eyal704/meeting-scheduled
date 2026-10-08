import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ui, type Locale } from "@/lib/i18n";

// The root layout owns <html lang="en">; Hebrew pages set language and
// direction on this wrapper so the whole page, header and footer included, is RTL.
export function SiteShell({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`site-shell locale-${locale}`}
      lang={locale}
      dir={locale === "he" ? "rtl" : "ltr"}
    >
      <a className="skip-link" href="#main-content">
        {ui[locale].skip}
      </a>
      <Header />
      {children}
      <Footer locale={locale} />
    </div>
  );
}
