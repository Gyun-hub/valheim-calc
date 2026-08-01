/**
 * 보스 상세 페이지 전용 텍스트 가공.
 *
 * `forsaken_power` 는 영문 자유 텍스트라 그대로 노출하지 않고
 * 한국어 문장으로 자체 작성한다 (docs/LEGAL.md 1-2, CLAUDE.md "위키 텍스트 복사 금지").
 */

import { koName } from "@/lib/data";

/** 보스 nameEn → 가호 효과 한국어 설명 (자체 작성) */
const FORSAKEN_POWER_KO: Record<string, string> = {
  Eikthyr: "스태미나 소모량을 60% 줄여준다.",
  "The Elder": "나무를 벨 때 벌목 효율을 60% 높여준다.",
  Bonemass: "물리 피해 저항을 50%p 추가로 올려준다.",
  Moder: "배의 이동 속도를 50% 높여준다.",
  Yagluth: "원소 피해 저항을 25%p 추가로 올려준다.",
  "The Queen": "에이트르(마력) 재생 속도를 높여준다.",
  Fader: "화염 피해 저항을 30%p 추가로 올려준다.",
};

/** 없으면 null — 원문을 그대로 보여주지 않기 위해 매핑에 없는 값은 숨긴다 */
export function forsakenPowerKo(bossNameEn: string): string | null {
  return FORSAKEN_POWER_KO[bossNameEn] ?? null;
}

/**
 * `summon_item` 표시용 가공.
 *
 * "Giant King's Hair + Sealbreaker" 처럼 두 아이템이 "+" 로 합쳐진 경우가 있어
 * (여왕 소환) 각 조각을 개별적으로 한글화한 뒤 다시 합친다.
 */
export function formatSummonItem(raw: string): string {
  return raw
    .split("+")
    .map((part) => koName(part.trim()))
    .join(" + ");
}

/**
 * `summon_location` 표시용 가공. 원본이 대부분 "{보스 영문명} Altar" 형태라
 * 접미사를 "제단"으로 바꾸고 보스 이름 부분을 한글화한다.
 * 패턴에 맞지 않으면 원본을 그대로 반환한다.
 */
export function formatSummonLocation(raw: string): string {
  const match = raw.match(/^(.*)\s+Altar$/);
  if (!match) return raw;
  return `${koName(match[1].trim())} 제단`;
}
