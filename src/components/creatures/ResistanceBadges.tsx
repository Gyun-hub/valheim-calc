import { Badge } from "@/components/ui/Badge";
import { MissingDataNote } from "@/components/ui/StatTable";
import type { DamageType } from "@/lib/types";
import { interpretResistances } from "./damageLabels";

/** 몬스터 저항/취약 배지 목록. 배율을 그대로 보여주지 않고 해석된 문구로 표시한다 */
export function ResistanceBadges({
  resistances,
}: {
  resistances: Partial<Record<DamageType, number>>;
}) {
  const items = interpretResistances(resistances);

  if (items.length === 0) {
    return <MissingDataNote>알려진 저항·취약 속성이 없습니다.</MissingDataNote>;
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((r) => (
        <Badge key={r.type} tone={r.tone}>
          {r.label}
        </Badge>
      ))}
    </div>
  );
}
