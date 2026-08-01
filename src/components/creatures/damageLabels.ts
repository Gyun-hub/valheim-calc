/**
 * 데미지 타입 · 저항 한글 라벨 — 몬스터/보스 상세 페이지가 공유하는 유일한 정의.
 *
 * 순수 함수만 둔다 (JSX 없음). 렌더링은 DamageStat.tsx / ResistanceBadges.tsx 에서.
 */

import type { DamageType } from "@/lib/types";

export const DAMAGE_TYPE_KO: Record<DamageType, string> = {
  slash: "참격",
  pierce: "관통",
  blunt: "타격",
  fire: "화염",
  frost: "냉기",
  lightning: "번개",
  poison: "독",
  spirit: "정신",
  chop: "벌목",
};

export function damageTypeKo(type: DamageType | string): string {
  return DAMAGE_TYPE_KO[type as DamageType] ?? type;
}

/** `ParsedDamage.byType` 를 "참격 50 · 관통 50" 형태 항목 배열로 */
export function formatDamageEntries(byType: Partial<Record<DamageType, number>>): string[] {
  return (Object.entries(byType) as [DamageType, number][]).map(
    ([type, value]) => `${damageTypeKo(type)} ${value}`,
  );
}

export interface ResistanceInterpretation {
  type: DamageType;
  /** "독 25% 감소" / "정신 면역" / "냉기 50% 증가" */
  label: string;
  /** 저항(감소·면역) success, 취약(증가) danger */
  tone: "success" | "danger";
}

/**
 * `Creature.resistances` 배율 맵을 사람이 읽을 수 있는 문구로 해석한다.
 *
 * 배율 규칙 (docs/DATA-SCHEMA.md): 1 미만 = 저항, 1 초과 = 취약, 0 = 완전 면역, 1 = 평상시(표시 안 함).
 */
export function interpretResistances(
  resistances: Partial<Record<DamageType, number>>,
): ResistanceInterpretation[] {
  return (Object.entries(resistances) as [DamageType, number][])
    .filter(([, multiplier]) => multiplier !== 1)
    .map(([type, multiplier]) => {
      const typeKo = damageTypeKo(type);
      if (multiplier === 0) {
        return { type, label: `${typeKo} 면역`, tone: "success" as const };
      }
      if (multiplier < 1) {
        const pct = Math.round((1 - multiplier) * 100);
        return { type, label: `${typeKo} ${pct}% 감소`, tone: "success" as const };
      }
      const pct = Math.round((multiplier - 1) * 100);
      return { type, label: `${typeKo} ${pct}% 증가`, tone: "danger" as const };
    });
}
