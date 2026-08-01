/**
 * 원본 JSON 의 자유 텍스트 필드를 구조화된 값으로 바꾸는 파서 모음.
 *
 * 순수 함수만 둔다. 파싱에 실패하면 예외를 던지지 말고 원본을 보존한 채
 * `parsed: false` 같은 플래그로 알린다 — 데이터가 게임 패치마다 흔들리므로
 * 한 항목이 빌드 전체를 깨뜨리면 안 된다.
 *
 * 대상 필드 목록은 docs/DATA-SCHEMA.md "파싱 필요한 문자열 필드" 참고.
 */

import type { DamageType, GuaranteedDrop, ParsedDamage } from "./types";

/** 데미지 문자열에 등장하는 타입 표기 → 내부 키 */
const DAMAGE_TYPE_ALIASES: Record<string, DamageType> = {
  slash: "slash",
  pierce: "pierce",
  blunt: "blunt",
  fire: "fire",
  frost: "frost",
  lightning: "lightning",
  poison: "poison",
  spirit: "spirit",
  chop: "chop",
};

/**
 * `creatures[].damage` 파싱.
 *
 * 실제로 등장하는 모양들:
 *   `"5 Slash"`                      → 단일
 *   `"14 Slash + 10 Blunt (ranged)"` → `+` 결합 + 수식어
 *   `"20-50 Slash/Pierce"`           → 범위 + 타입 복수 (같은 수치가 두 타입에 적용)
 *   `"50 Pierce per 0.5s"`           → 지속 피해 표기
 *   `"0"`                            → 무해 개체
 *   `"Fire explosion"` / `"Varies"`  → 숫자 없음. 파싱 불가
 *
 * 범위(`20-50`)는 `byType` 에 최대치를 넣고 최소치는 `minTotal` 에 따로 담는다.
 * 계산기에서 기대값이 필요하면 두 값의 중앙을 쓰면 된다.
 */
export function parseDamage(raw: string | null | undefined): ParsedDamage {
  const source = (raw ?? "").trim();
  const empty: ParsedDamage = {
    raw: source,
    byType: {},
    minTotal: null,
    total: null,
    ranged: false,
    parsed: false,
  };

  if (!source) return empty;

  const ranged = /\(\s*ranged\s*\)/i.test(source);

  // "0" 은 무해 개체 — 파싱 성공으로 친다
  if (/^0$/.test(source)) {
    return { ...empty, total: 0, minTotal: 0, ranged, parsed: true };
  }

  const byType: Partial<Record<DamageType, number>> = {};
  let minSum = 0;
  let maxSum = 0;
  let matched = false;

  // `+` 로 나눈 각 절을 독립적으로 해석
  for (const segment of source.split("+")) {
    // 예: "20-50 Slash/Pierce", "50 Pierce per 0.5s"
    const match = segment.match(/(\d+(?:\.\d+)?)\s*(?:-\s*(\d+(?:\.\d+)?))?\s*([A-Za-z/]+)/);
    if (!match) continue;

    const [, minRaw, maxRaw, typesRaw] = match;
    const min = Number(minRaw);
    const max = maxRaw !== undefined ? Number(maxRaw) : min;

    // "Slash/Pierce" → 두 타입에 같은 수치가 붙는다
    const types = typesRaw
      .split("/")
      .map((t) => DAMAGE_TYPE_ALIASES[t.trim().toLowerCase()])
      .filter((t): t is DamageType => Boolean(t));

    if (types.length === 0) continue;

    for (const type of types) {
      byType[type] = (byType[type] ?? 0) + max;
    }
    // 복수 타입은 택일 판정이므로 합계에는 한 번만 반영
    minSum += min;
    maxSum += max;
    matched = true;
  }

  if (!matched) return { ...empty, ranged };

  return {
    raw: source,
    byType,
    minTotal: minSum,
    total: maxSum,
    ranged,
    parsed: true,
  };
}

/**
 * `bosses[].guaranteed_drops` 항목 파싱.
 *
 * `"Hard Antler (3)"`      → `{ itemNameEn: "Hard Antler", qty: 3 }`
 * `"Majestic Carapace"`    → `{ itemNameEn: "Majestic Carapace", qty: 1 }`  (괄호 없으면 1)
 */
export function parseGuaranteedDrop(raw: string): GuaranteedDrop {
  const match = raw.match(/^(.*?)\s*\((\d+)\)\s*$/);
  if (!match) {
    return { itemNameEn: raw.trim(), qty: 1 };
  }
  return { itemNameEn: match[1].trim(), qty: Number(match[2]) };
}

export function parseGuaranteedDrops(raw: string[] | null | undefined): GuaranteedDrop[] {
  return (raw ?? []).map(parseGuaranteedDrop);
}

/**
 * `food[].regen` 파싱. `"1 HP/s"` → `1`
 *
 * 숫자를 못 찾으면 null. 호출부는 원본 문자열을 따로 보관해 표시에 쓴다.
 */
export function parseRegen(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const match = raw.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : null;
}

/**
 * `"10x Honey"`, `"5x Blueberries"` 같은 양조 재료 표기에서 수량과 이름을 분리.
 * 미드 도감·계산기가 공통으로 쓴다.
 */
export function parseQuantifiedIngredient(raw: string): { nameEn: string; qty: number } {
  const match = raw.match(/^\s*(\d+)\s*x\s*(.+?)\s*$/i);
  if (!match) return { nameEn: raw.trim(), qty: 1 };
  return { nameEn: match[2].trim(), qty: Number(match[1]) };
}

/** 초 단위를 한국어로 (예: 600 → "10분", 90 → "1분 30초") */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || Number.isNaN(seconds)) return "-";
  if (seconds < 60) return `${seconds}초`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return rest === 0 ? `${minutes}분` : `${minutes}분 ${rest}초`;
}
