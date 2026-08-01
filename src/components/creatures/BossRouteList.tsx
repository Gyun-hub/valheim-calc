import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { BiomeBadge } from "@/components/ui/BiomeBadge";
import type { BiomeName } from "@/lib/types";

export interface BossRouteItem {
  slug: string;
  nameKo: string;
  nameEn: string;
  biome: BiomeName;
  hp: number | null;
  order: number;
  imageSrc?: string | null;
}

/**
 * 보스 목록 — 진행 순서(1~7)가 카드 배열보다 눈에 띄는 세로 루트 레이아웃.
 * 원형 순번 + 연결선으로 진행 경로처럼 보이게 한다.
 */
export function BossRouteList({ bosses }: { bosses: BossRouteItem[] }) {
  return (
    <ol className="relative space-y-3 before:absolute before:left-[1.15rem] before:top-3 before:bottom-3 before:w-px before:bg-border before:content-['']">
      {bosses.map((b) => (
        <li key={b.slug} className="relative">
          <Link
            href={`/db/bosses/${b.slug}/`}
            className="flex items-center gap-4 rounded-lg border border-border bg-surface p-3 hover:border-border-strong hover:bg-surface-raised transition-colors"
          >
            <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/40 bg-surface text-accent font-bold">
              {b.order}
            </span>
            {b.imageSrc && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.imageSrc}
                alt=""
                loading="lazy"
                className="h-9 w-9 shrink-0 rounded border border-border bg-surface-raised object-contain p-0.5"
              />
            )}
            <span className="min-w-0 flex-1">
              <span className="block font-medium">{b.nameKo}</span>
              <span className="block text-xs text-text-faint">{b.nameEn}</span>
            </span>
            <span className="flex flex-wrap items-center justify-end gap-1.5">
              <BiomeBadge biome={b.biome} />
              {b.hp !== null && <Badge tone="neutral">체력 {b.hp}</Badge>}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
