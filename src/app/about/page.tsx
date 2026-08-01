import type { Metadata } from "next";

import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  biomes,
  bosses,
  buildingPieces,
  creatures,
  dataCollectedAt,
  food,
  items,
  meadPotions,
  recipes,
  ships,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "사이트 소개",
  description:
    "발헤임 한국어 계산기·데이터베이스 소개. 비공식 팬 프로젝트 고지와 데이터 출처, 수치 신뢰도 안내.",
  alternates: { canonical: "/about/" },
};

/**
 * 애드센스 심사 필수 페이지 (docs/LEGAL.md 1-3, 2장).
 * 고지 문구를 임의로 줄이거나 빼지 말 것.
 */
export default function AboutPage() {
  // 항목 수는 배열 길이로만 센다 (docs/DATA-SCHEMA.md)
  const totalEntries =
    items.length +
    creatures.length +
    bosses.length +
    food.length +
    meadPotions.length +
    biomes.length +
    ships.length;

  return (
    <>
      <PageHeader
        title="사이트 소개"
        subtitle="발헤임 한국어 계산기 · 데이터베이스에 대한 안내입니다."
      />

      <Section title="비공식 팬 프로젝트 고지">
        <div className="space-y-2 text-sm leading-relaxed">
          <p>이 사이트는 비공식 팬 프로젝트입니다.</p>
          <p>Iron Gate AB 및 Coffee Stain Publishing과 아무런 관련이 없습니다.</p>
          <p>Valheim은 Iron Gate AB의 상표입니다.</p>
        </div>
      </Section>

      <Section title="무엇을 하는 사이트인가">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            발헤임 플레이에 필요한 수치를 한국어로 정리하고, 직접 계산해 주는 도구를 만듭니다.
            영어권에는 계산기가 여럿 있지만 한국어로 된 인터랙티브 도구는 거의 없어서 시작했습니다.
          </p>
          <p>
            현재 도감 {totalEntries}종을 공개했고, 제작 자원 역산 · 음식 조합 · 드롭률 확률 계산기를
            순차적으로 붙여 나갈 예정입니다.
          </p>
        </div>
      </Section>

      <Section title="수록 데이터">
        <ul className="text-sm text-text-muted grid gap-1 grid-cols-[repeat(auto-fill,minmax(200px,1fr))]">
          <li>아이템 {items.length}종</li>
          <li>제작법 {recipes.length}종</li>
          <li>건축 자재 {buildingPieces.length}종</li>
          <li>몬스터 {creatures.length}종</li>
          <li>보스 {bosses.length}종</li>
          <li>음식 {food.length}종</li>
          <li>미드 · 포션 {meadPotions.length}종</li>
          <li>바이옴 {biomes.length}종</li>
          <li>배 {ships.length}종</li>
        </ul>
        <p className="mt-3 text-xs text-text-faint">데이터 수집일: {dataCollectedAt}</p>
      </Section>

      <Section title="수치의 신뢰도">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            게임 내 수치는 사실 정보이며, 커뮤니티 위키와 게임 파일 분석 자료를 대조해
            정리했습니다. 설명문은 전부 자체 작성한 것으로, 위키 문서를 옮겨 오지 않았습니다.
          </p>
          <p>
            드롭 확률은 게임 파일에서 추출된 커뮤니티 데이터마이닝 기반 추정치입니다. Iron Gate가
            공식 발표한 수치가 아니며, 패치에 따라 실제 값과 달라질 수 있습니다. 확률이 표시되는
            곳에는 출처 구분을 함께 적어 두었습니다.
          </p>
          <p>
            수치가 실제 게임과 다르다면 최신 패치가 반영되지 않았을 가능성이 큽니다. 계산 결과는
            참고용으로 봐 주세요.
          </p>
        </div>
      </Section>

      <Section title="이미지에 대해">
        <p className="text-sm leading-relaxed text-text-muted">
          게임 에셋(아이콘 · 모델 · 아트워크)은 이 사이트에 올리지 않습니다. 아이콘이 필요한
          곳에는 직접 제작한 것만 사용합니다.
        </p>
      </Section>

      <Section title="문의">
        <p className="text-sm leading-relaxed text-text-muted">
          수치 오류나 누락을 발견하셨다면 알려 주세요. 확인 후 반영하겠습니다.
        </p>
      </Section>
    </>
  );
}
