/**
 * 모드 카탈로그 전용 표시 헬퍼.
 *
 * `category` · `install_difficulty` · `gameplay_impact` 는 데이터 스키마상
 * 후보값이 있지만 자유 텍스트에 가깝다 (docs/entities/mods.md 데이터 함정 참고).
 * 알려진 값만 톤을 매핑하고 나머지는 중립으로 떨어뜨린다.
 */

import type { BadgeTone } from "@/components/ui/Badge";

const DIFFICULTY_TONE: Record<string, BadgeTone> = {
  쉬움: "success",
  보통: "warning",
  어려움: "danger",
};

export function difficultyTone(installDifficulty: string): BadgeTone {
  return DIFFICULTY_TONE[installDifficulty] ?? "neutral";
}

const IMPACT_TONE: Record<string, BadgeTone> = {
  미미함: "success",
  보통: "warning",
};

/** "큼 (밸런스 변화 있음)" 처럼 접두만 일치해도 잡아낸다 */
export function impactTone(gameplayImpact: string): BadgeTone {
  if (gameplayImpact.startsWith("큼")) return "danger";
  return IMPACT_TONE[gameplayImpact] ?? "neutral";
}
