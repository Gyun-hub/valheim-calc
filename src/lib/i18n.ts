/**
 * 영어 UI 토글용 사전. 화면 문구(네비·푸터)만 대상이고 엔티티 데이터는
 * 번역하지 않는다 — 800종 넘는 도감 콘텐츠 번역은 별도 작업 범위.
 */
export type Locale = "ko" | "en";

export const dictionary = {
  ko: {
    brand: "발헤임 계산기",
    nav: {
      items: "아이템",
      creatures: "몬스터",
      bosses: "보스",
      food: "음식",
      mead: "미드",
      biomes: "바이옴",
    },
    footer: {
      disclaimer1:
        "본 사이트는 비공식 팬 프로젝트입니다. Iron Gate AB 및 Coffee Stain Publishing과 아무런 관련이 없습니다.",
      disclaimer2:
        "Valheim은 Iron Gate AB의 상표입니다. 게임 내 수치는 참고용이며 패치에 따라 달라질 수 있습니다.",
      about: "사이트 소개 · 출처 표기",
    },
    localeToggle: "EN",
  },
  en: {
    brand: "Valheim Calculator",
    nav: {
      items: "Items",
      creatures: "Creatures",
      bosses: "Bosses",
      food: "Food",
      mead: "Mead",
      biomes: "Biomes",
    },
    footer: {
      disclaimer1:
        "This is an unofficial fan project. Not affiliated with Iron Gate AB or Coffee Stain Publishing.",
      disclaimer2:
        "Valheim is a trademark of Iron Gate AB. In-game values are for reference and may change with game patches.",
      about: "About · Sources",
    },
    localeToggle: "한국어",
  },
} as const;

export type Dictionary = (typeof dictionary)[Locale];
