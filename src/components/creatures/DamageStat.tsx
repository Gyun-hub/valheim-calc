import { Badge } from "@/components/ui/Badge";
import { Num } from "@/components/ui/StatTable";
import type { ParsedDamage } from "@/lib/types";
import { formatDamageEntries } from "./damageLabels";

/**
 * 몬스터 공격력 표시.
 *
 * 수치로 환원되지 않는 공격이 27종 중 7종 있다 ("Fire explosion", "Varies" 등).
 * 이 경우 공격 방식을 한국어로 설명한다 — 파싱 여부는 우리 사정이지
 * 플레이어가 알아야 할 정보가 아니다.
 */

/** 수치가 없는 공격의 한국어 설명 (자체 작성) */
const UNQUANTIFIED_KO: Record<string, string> = {
  "Poison (contact)": "접촉하면 독에 중독된다. 고정 수치 없음",
  "Fire explosion": "접근하면 폭발해 화염 피해를 준다. 고정 수치 없음",
  "Frost breath": "냉기를 뿜는다. 고정 수치 없음",
  "Multi-hit": "연속으로 여러 번 때린다. 고정 수치 없음",
  Varies: "공격 방식에 따라 피해량이 달라진다",
};

export function DamageStat({ damage }: { damage: ParsedDamage }) {
  if (!damage.parsed) {
    const explanation = UNQUANTIFIED_KO[damage.raw];
    return (
      <span className="text-text-muted">{explanation ?? "수치가 확인되지 않았습니다."}</span>
    );
  }

  const entries = formatDamageEntries(damage.byType);
  const hasRange = damage.minTotal !== null && damage.minTotal !== damage.total;

  return (
    <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">
      {entries.length > 0 && <span>{entries.join(" · ")}</span>}
      {damage.total !== null && (
        <span className="text-text-muted">
          총 <Num>{hasRange ? `${damage.minTotal}~${damage.total}` : damage.total}</Num>
        </span>
      )}
      {damage.ranged && <Badge tone="info">원거리</Badge>}
    </span>
  );
}
