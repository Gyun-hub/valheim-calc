/**
 * 재료·제작법 관련 링크 목록. "제작법"과 "쓰임새" 섹션이 공유한다.
 *
 * 링크 여부는 `EntityRef` 가 판단한다 — 데이터셋의 참조 무결성이 깨져 있어
 * 이름만 보고 링크를 걸면 404 가 생긴다 (docs/DATA-SCHEMA.md 참조 무결성 절).
 */

import { EntityRef } from "@/components/ui/EntityRef";
import { Num } from "@/components/ui/StatTable";
import type { Material, Recipe } from "@/lib/types";

/** 제작법의 재료 목록 */
export function MaterialList({ materials }: { materials: Material[] }) {
  if (materials.length === 0) return null;

  return (
    <ul className="space-y-1.5 text-sm">
      {materials.map((m) => (
        <li key={m.nameEn}>
          <EntityRef nameEn={m.nameEn} qty={m.qty} />
        </li>
      ))}
    </ul>
  );
}

/**
 * 이 아이템을 재료로 쓰는 제작법 목록. 결과물 상세로 링크한다.
 * `materialNameEn` 은 현재 보고 있는 아이템의 nameEn — 필요 수량 표시용.
 */
export function UsedInList({
  recipes,
  materialNameEn,
}: {
  recipes: Recipe[];
  materialNameEn: string;
}) {
  if (recipes.length === 0) return null;

  return (
    <ul className="space-y-1.5 text-sm">
      {recipes.map((r) => {
        const qty = r.materials.find((m) => m.nameEn === materialNameEn)?.qty;
        return (
          <li key={r.itemNameEn} className="flex flex-wrap items-baseline gap-x-1.5">
            <EntityRef nameEn={r.itemNameEn} />
            {qty !== undefined && (
              <span className="text-text-muted">
                <Num unit="개 필요">{qty}</Num>
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
