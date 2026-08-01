/**
 * 아이템 도감 전용 한글 라벨 모음.
 *
 * `lib/` 은 데이터 정규화만 담당하므로, 화면 표시용 한글 매핑은
 * 이 엔티티 컴포넌트 쪽에 둔다.
 */

import type { DamageType, ItemCategory } from "@/lib/types";

export const CATEGORY_KO: Record<ItemCategory, string> = {
  weapon: "무기",
  armor: "방어구",
  shield: "방패",
  tool: "도구",
  resource: "자원",
};

export function categoryLabel(category: ItemCategory): string {
  return CATEGORY_KO[category];
}

/** 제작 스테이션 영문명 → 한글. 데이터에 등장하는 값은 이 4종뿐 */
const STATION_KO: Record<string, string> = {
  Inventory: "인벤토리",
  Workbench: "작업대",
  Forge: "대장간",
  Smelter: "제련로",
};

/** `station.name` + `station.level` 을 "작업대 Lv.2" 형태로 */
export function stationLabel(name: string, level: number): string {
  const ko = STATION_KO[name] ?? name;
  return level > 0 ? `${ko} Lv.${level}` : ko;
}

export const DAMAGE_TYPE_KO: Record<DamageType | "total", string> = {
  slash: "참격",
  pierce: "관통",
  blunt: "타격",
  fire: "화염",
  frost: "냉기",
  lightning: "번개",
  poison: "독",
  spirit: "영혼",
  chop: "벌목",
  total: "합계",
};

/** boolean 스탯을 표시용 문자열로. null 이면 statRows 가 행을 걸러내도록 null 유지 */
export function yesNo(value: boolean | null): string | null {
  if (value === null) return null;
  return value ? "있음" : "없음";
}

/**
 * `stats.damageTypes` 를 StatTable 행으로 쓸 수 있는 [라벨, 값] 목록으로 변환.
 * `total` 은 맨 뒤로 보낸다.
 */
export function damageTypeRows(
  damageTypes: Partial<Record<DamageType | "total", number>> | null,
): [string, number][] {
  if (!damageTypes) return [];
  return Object.entries(damageTypes)
    .filter((entry): entry is [DamageType | "total", number] => typeof entry[1] === "number")
    .sort(([a], [b]) => {
      if (a === "total") return 1;
      if (b === "total") return -1;
      return 0;
    })
    .map(([type, value]) => [`${DAMAGE_TYPE_KO[type] ?? type} 데미지`, value]);
}
