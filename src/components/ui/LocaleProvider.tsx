"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { dictionary, type Dictionary, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "locale";

const LocaleContext = createContext<{
  locale: Locale;
  toggle: () => void;
  t: Dictionary;
} | null>(null);

/** 네비·푸터 문구용 영어 토글. 엔티티 콘텐츠는 그대로 한국어로 남는다 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ko");

  useEffect(() => {
    // 정적 export라 서버는 항상 "ko"로 렌더링됨. 하이드레이션 불일치를 피하려면
    // localStorage 값은 마운트 후 이펙트에서 반영해야 한다 (초기 렌더에서 읽으면 안 됨).
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "ko" || saved === "en") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocale(saved);
    }
  }, []);

  function toggle() {
    setLocale((prev) => {
      const next: Locale = prev === "ko" ? "en" : "ko";
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <LocaleContext.Provider value={{ locale, toggle, t: dictionary[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale은 LocaleProvider 안에서만 쓸 수 있다");
  return ctx;
}
