/**
 * 아이템 상세의 "획득처" 섹션. 어떤 몬스터가 몇 % 확률로 이 아이템을 떨구는지.
 * 확률 데이터에는 ConfidenceBadge 표기가 법적으로 필수다 (docs/LEGAL.md 1-4).
 */

import { ConfidenceBadge } from "@/components/ui/Badge";
import { EntityRef } from "@/components/ui/EntityRef";
import { Num } from "@/components/ui/StatTable";
import type { DropEntry } from "@/lib/types";

export function DropSourceList({ drops }: { drops: DropEntry[] }) {
  if (drops.length === 0) return null;

  return (
    <ul className="space-y-2 text-sm">
      {drops.map((d) => (
        <li
          key={`${d.creatureNameEn}-${d.itemNameEn}`}
          className="flex flex-wrap items-center gap-x-2 gap-y-1"
        >
          <EntityRef nameEn={d.creatureNameEn} />
          <span className="text-text-muted">
            <Num unit="%">{d.chancePercent}</Num>
            {" · "}
            <Num unit="개">
              {d.qtyMin === d.qtyMax ? d.qtyMin : `${d.qtyMin}~${d.qtyMax}`}
            </Num>
          </span>
          <ConfidenceBadge confidence={d.confidence} />
        </li>
      ))}
    </ul>
  );
}
