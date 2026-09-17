"use client";

import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);

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
          href="/"
          className="wordmark"
          aria-label="Eyal Taieb home"
          onClick={() => setOpen(false)}
        >
          <span className="monogram">
            et<span>.</span>
          </span>
          <span>EYAL TAIEB</span>
        </Link>
        <button
          ref={toggle}
          className="menu-toggle icon-button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          aria-controls="main-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={open ? "navigation is-open" : "navigation"}
          aria-label="Main navigation"
        >
          <Link href="/#projects" onClick={() => setOpen(false)}>
            Work
          </Link>
          <Link href="/#about" onClick={() => setOpen(false)}>
            About
          </Link>
          <a
            href="mailto:eyal.growth@gmail.com"
            className="nav-contact"
            onClick={() => setOpen(false)}
          >
            Let’s talk <ArrowUpRight size={16} />
          </a>
        </nav>
      </div>
    </header>
  );
}
