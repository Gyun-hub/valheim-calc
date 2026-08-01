"use client";

import Link from "next/link";

import { useLocale } from "./LocaleProvider";

const NAV_KEYS = ["items", "creatures", "bosses", "food", "mead", "biomes"] as const;

export function SiteHeader() {
  const { toggle, t } = useLocale();

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-3 sm:gap-6 sm:px-4">
        <Link
          href="/"
          className="font-display shrink-0 text-base font-bold text-text hover:text-accent sm:text-lg"
        >
          {t.brand}
        </Link>
        <nav className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto text-sm sm:gap-4">
          {NAV_KEYS.map((key) => (
            <Link
              key={key}
              href={`/db/${key}/`}
              className="whitespace-nowrap text-text-muted hover:text-text"
            >
              {t.nav[key]}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          onClick={toggle}
          aria-label="언어 전환"
          className="num shrink-0 rounded border border-border px-2 py-1 text-xs text-text-muted hover:border-border-strong hover:text-text"
        >
          {t.localeToggle}
        </button>
      </div>
    </header>
  );
}
