import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { koName } from "@/lib/data";

export interface BiomeRow {
  slug: string;
  nameKo: string;
  nameEn: string;
  bossName: string | null;
  imageSrc?: string | null;
}

/** 바이옴 진행 순서(1→9)를 세로 루트로 보여준다. 서버 컴포넌트 — 상호작용 없음 */
export function BiomeTimeline({ rows }: { rows: BiomeRow[] }) {
  return (
    <ol className="relative border-l border-border pl-6 space-y-4">
      {rows.map((b, i) => {
        const hasBoss = b.bossName && b.bossName !== "None" && !b.bossName.startsWith("Unknown");
        return (
          <li key={b.slug} className="relative">
            <span className="absolute -left-9 top-3 flex h-6 w-6 items-center justify-center rounded-full border border-accent bg-bg text-xs font-semibold text-accent">
              {i + 1}
            </span>
            <Link
              href={`/db/biomes/${b.slug}/`}
              className="block rounded-lg border border-border bg-surface p-3 hover:border-border-strong hover:bg-surface-raised transition-colors"
            >
              <div className="flex items-center gap-2.5">
                {b.imageSrc && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={b.imageSrc}
                    alt=""
                    loading="lazy"
                    className="h-8 w-8 shrink-0 rounded border border-border bg-bg object-contain p-0.5"
                  />
                )}
                <div className="font-medium flex items-baseline gap-2">
                  {b.nameKo}
                  <span className="text-xs font-normal text-text-faint">{b.nameEn}</span>
                </div>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {hasBoss ? (
                  <Badge tone="warning">보스: {koName(b.bossName as string)}</Badge>
                ) : (
                  <Badge tone="neutral">보스 없음</Badge>
                )}
              </div>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
