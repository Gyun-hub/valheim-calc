import type { BiomeName } from "@/lib/types";

/**
 * 바이옴 한글 표기 — 사이트 전역에서 이 표를 쓴다.
 * 용어 선택 근거는 docs/korean-localization-report-2026.md 참고.
 */
export const BIOME_KO: Record<BiomeName, string> = {
  Meadows: "초원",
  "Black Forest": "검은 숲",
  Swamp: "늪",
  Mountain: "산",
  Plains: "평원",
  Ocean: "바다",
  Mistlands: "안개 지대",
  Ashlands: "잿불 지대",
  "Deep North": "극북",
};

/**
 * 진행 순서. 정렬 기준이자 난이도 티어.
 *
 * 데이터의 `biomes[].progression_order` 와 같은 순서를 유지한다.
 * 바다는 검은 숲 직후에 열리므로 원본에 2.5 로 적혀 있다 — 여기서는
 * 정수 자리를 밀어 표현한다. 화면에 이 숫자를 그대로 찍지 말 것.
 */
export const BIOME_ORDER: Record<BiomeName, number> = {
  Meadows: 1,
  "Black Forest": 2,
  Ocean: 3,
  Swamp: 4,
  Mountain: 5,
  Plains: 6,
  Mistlands: 7,
  Ashlands: 8,
  "Deep North": 9,
};

/** globals.css 의 바이옴 CSS 변수 이름 */
const BIOME_VAR: Record<BiomeName, string> = {
  Meadows: "--biome-meadows",
  "Black Forest": "--biome-black-forest",
  Swamp: "--biome-swamp",
  Mountain: "--biome-mountain",
  Plains: "--biome-plains",
  Ocean: "--biome-ocean",
  Mistlands: "--biome-mistlands",
  Ashlands: "--biome-ashlands",
  "Deep North": "--biome-deep-north",
};

export function biomeKo(name: BiomeName | string): string {
  return BIOME_KO[name as BiomeName] ?? name;
}

export function biomeOrder(name: BiomeName | string): number {
  return BIOME_ORDER[name as BiomeName] ?? 99;
}

/** 바이옴 색을 `--biome-current` 슬롯에 주입하는 style 객체 */
export function biomeStyle(name: BiomeName | string): React.CSSProperties {
  const cssVar = BIOME_VAR[name as BiomeName];
  return {
    "--biome-current": cssVar ? `var(${cssVar})` : "var(--color-border-strong)",
  } as React.CSSProperties;
}

/**
 * 바이옴 배지 — 색 점 + 한글명.
 *
 * 면을 색으로 채우지 않는다. 9개 바이옴 색이 한 화면에 동시에 나오므로
 * 점 크기로만 쓰고 나머지는 조용히 둔다.
 */
export function BiomeBadge({ biome }: { biome: BiomeName }) {
  return (
    <span
      style={biomeStyle(biome)}
      className="inline-flex items-center gap-1.5 rounded border border-border bg-surface-raised px-1.5 py-0.5 text-xs text-text-muted"
    >
      <span
        aria-hidden
        className="size-1.5 rounded-full"
        style={{ backgroundColor: "var(--biome-current)" }}
      />
      {biomeKo(biome)}
    </span>
  );
}

/**
 * 진행 티어 레일 — 이 사이트의 시그니처.
 *
 * 발헤임의 실제 축은 바이옴 진행도다. 초원에서 시작해 한 바이옴씩 뚫는 게
 * 게임 전체의 구조이고, 플레이어는 "이걸 지금 상대할 수 있나"를 늘 묻는다.
 * 그래서 순서를 장식이 아니라 정보로 노출한다.
 *
 * 목록 페이지 상단에 두고, 선택된 바이옴을 강조해 현재 위치를 보여준다.
 */
export function BiomeRail({
  biomes,
  active,
  onSelect,
}: {
  biomes: BiomeName[];
  active?: BiomeName | null;
  /** 넘기면 클릭 가능한 필터가 된다. 없으면 순수 표시용 */
  onSelect?: (biome: BiomeName | null) => void;
}) {
  const ordered = [...biomes].sort((a, b) => biomeOrder(a) - biomeOrder(b));

  return (
    <ol className="flex items-stretch gap-px overflow-x-auto rounded border border-border bg-surface">
      {ordered.map((biome, index) => {
        const selected = active === biome;
        const dimmed = Boolean(active) && !selected;

        const content = (
          <>
            <span
              aria-hidden
              className="block h-1 w-full"
              style={{ backgroundColor: "var(--biome-current)" }}
            />
            <span className="block px-2.5 pt-1.5 pb-2 text-xs whitespace-nowrap">
              <span className="num block text-[10px] text-text-faint">{index + 1}</span>
              <span className={selected ? "text-text" : "text-text-muted"}>{biomeKo(biome)}</span>
            </span>
          </>
        );

        return (
          <li
            key={biome}
            style={biomeStyle(biome)}
            className={`flex-1 min-w-fit bg-surface transition-opacity ${dimmed ? "opacity-40" : ""}`}
          >
            {onSelect ? (
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => onSelect(selected ? null : biome)}
                className="block w-full text-left hover:bg-surface-raised"
              >
                {content}
              </button>
            ) : (
              content
            )}
          </li>
        );
      })}
    </ol>
  );
}
