import Link from "next/link";

import { assetPath } from "@/lib/paths";
import { copy } from "@/lib/copy";
import { localePath, type Locale } from "@/lib/i18n";
import { ArrowUpRight, Mail, Phone } from "lucide-react";

export function Footer({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <div className="contact-grid">
          <div>
            <span className="eyebrow">{t.contactEyebrow}</span>
            <h2>
              {t.contactTitle}
              <br />
              <span className="muted">{t.contactMuted}</span>
            </h2>
            <p>{t.contactText}</p>
          </div>
          <div className="contact-actions">
            <a
              className="button button-primary"
              href="mailto:eyal.growth@gmail.com"
            >
              <Mail size={17} /> {t.contactButton} <ArrowUpRight size={18} />
            </a>
            <a className="contact-email" href="mailto:eyal.growth@gmail.com">
              eyal.growth@gmail.com
            </a>
            <a
              className="text-link contact-phone"
              href="tel:+4367762921189"
              dir="ltr"
            >
              <Phone size={16} aria-hidden="true" /> +43 677 62921189
            </a>
            <a
              className="text-link"
              href="https://www.linkedin.com/in/eyalshoval/"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.linkedin} <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <Link href={localePath(locale, "/")} className="footer-name">
            EYAL TAIEB<span>{t.footerRole}</span>
          </Link>
          <p>
            © {new Date().getFullYear()} {t.owner}
          </p>
          <a
            href={assetPath("/documents/eyal-taieb-cv.pdf")}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.viewCvShort} <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
}
