import Link from "next/link";

import { biomeStyle } from "./BiomeBadge";
import type { BiomeName } from "@/lib/types";

/** 도감 목록의 격자 컨테이너 */
export function CardGrid({ children }: { children: React.ReactNode }) {
  return <ul className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(190px,1fr))]">{children}</ul>;
}

/**
 * 도감 목록의 카드 한 장. 엔티티 종류와 무관하게 이걸 쓴다.
 *
 * `biome` 을 넘기면 왼쪽에 진행 티어 색 띠가 붙는다. 색은 장식이 아니라
 * 난이도 정보다 — 넘길 수 있으면 반드시 넘길 것.
 *
 * `imageSrc` 는 현재 위키 원본 URL(로컬 전용, docs/LEGAL.md 1-1). 서비스
 * 배포 전 직접 제작 아이콘으로 교체할 것.
 */
export function EntityCard({
  href,
  nameKo,
  nameEn,
  imageSrc,
  biome,
  children,
}: {
  href: string;
  nameKo: string;
  /** 한/영 병기 — 한국인도 영문명으로 검색한다 */
  nameEn: string;
  /** 위키 원본 이미지 URL. 없으면 자리만 비운다 */
  imageSrc?: string | null;
  /** 있으면 티어 색 띠를 붙인다 */
  biome?: BiomeName | null;
  /** 배지, 핵심 수치 등 */
  children?: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        style={biome ? biomeStyle(biome) : undefined}
        className={`flex h-full items-start gap-2.5 rounded-r border border-l-0 border-border bg-surface px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-surface-raised ${
          biome ? "biome-marked" : "border-l rounded-l"
        }`}
      >
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="h-9 w-9 shrink-0 rounded border border-border bg-surface-raised object-contain p-0.5"
          />
        )}
        <div className="min-w-0 flex-1">
          <div className="font-medium leading-snug">{nameKo}</div>
          <div className="num mt-0.5 text-[11px] text-text-faint">{nameEn}</div>
          {children && <div className="mt-2 flex flex-wrap items-center gap-1.5">{children}</div>}
        </div>
      </Link>
    </li>
  );
}

/** 상세 페이지의 구획 */
export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display mb-3 border-b border-border pb-2 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
