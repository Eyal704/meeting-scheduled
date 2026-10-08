"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Languages, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { alternatePath, localeFromPath, localePath, ui } from "@/lib/i18n";

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const t = ui[locale];

  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    const clickOutside = (event: PointerEvent) => {
      if (!header.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", close);
    document.addEventListener("pointerdown", clickOutside);
    return () => {
      document.removeEventListener("keydown", close);
      document.removeEventListener("pointerdown", clickOutside);
    };
  }, [open]);

  return (
    <header className="site-header" ref={header}>
      <div className="container nav-inner">
        <Link
          href={localePath(locale, "/")}
          className="wordmark"
          aria-label={t.home}
          onClick={() => setOpen(false)}
        >
          <span>EYAL TAIEB</span>
        </Link>
        <Link
          href={alternatePath(pathname)}
          className="language-switch"
          lang={locale === "he" ? "en" : "he"}
          hrefLang={locale === "he" ? "en" : "he"}
          aria-label={t.switchAria}
          onClick={() => setOpen(false)}
        >
          <Languages size={16} aria-hidden="true" /> {t.switchLabel}
        </Link>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-label={open ? t.closeNav : t.openNav}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label={t.mainNav}
        >
          <Link
            href={localePath(locale, "/#projects")}
            onClick={() => setOpen(false)}
          >
            {t.projects}
          </Link>
          <Link
            href={localePath(locale, "/#about")}
            onClick={() => setOpen(false)}
          >
            {t.about}
          </Link>
          <a
            href="mailto:eyal.growth@gmail.com"
            className="nav-contact"
            onClick={() => setOpen(false)}
          >
            {t.contact} <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
