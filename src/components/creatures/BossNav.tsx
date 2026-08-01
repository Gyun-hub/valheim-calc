import Link from "next/link";

import type { Boss } from "@/lib/types";

/** 보스 상세 하단의 이전/다음 진행 순서 네비게이션 */
export function BossNav({ bosses, current }: { bosses: Boss[]; current: Boss }) {
  const idx = bosses.findIndex((b) => b.nameEn === current.nameEn);
  const prev = idx > 0 ? bosses[idx - 1] : null;
  const next = idx >= 0 && idx < bosses.length - 1 ? bosses[idx + 1] : null;

  if (!prev && !next) return null;

  return (
    <nav className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
      <span>
        {prev && (
          <Link href={`/db/bosses/${prev.slug}/`} className="text-accent hover:text-accent-hover">
            ← {prev.order}. {prev.nameKo}
          </Link>
        )}
      </span>
      <span>
        {next && (
          <Link href={`/db/bosses/${next.slug}/`} className="text-accent hover:text-accent-hover">
            {next.order}. {next.nameKo} →
          </Link>
        )}
      </span>
    </nav>
  );
}
