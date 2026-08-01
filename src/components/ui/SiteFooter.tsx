"use client";

import Link from "next/link";

import { useLocale } from "./LocaleProvider";

/**
 * 비공식 고지는 전 페이지에 노출되어야 함 (docs/LEGAL.md 1-3).
 * 문구를 임의로 줄이지 말 것 — 애드센스 심사 대상이다.
 */
export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl space-y-2 px-4 py-8 text-xs leading-relaxed text-text-muted">
        <p>{t.footer.disclaimer1}</p>
        <p>{t.footer.disclaimer2}</p>
        <div className="flex flex-wrap gap-x-4 pt-1">
          <Link href="/about/" className="text-accent hover:text-accent-hover">
            {t.footer.about}
          </Link>
          <Link href="/privacy/" className="text-accent hover:text-accent-hover">
            {t.footer.privacy}
          </Link>
        </div>
      </div>
    </footer>
  );
}
