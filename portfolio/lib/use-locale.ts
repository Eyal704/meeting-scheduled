"use client";

import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "@/lib/i18n";

export function useLocale(): Locale {
  return localeFromPath(usePathname());
}
