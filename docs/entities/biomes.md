# 바이옴 엔티티

바이옴은 이 사이트의 **구조 축**이다. 색이 난이도 티어를 인코딩하고,
그 색이 전 페이지의 카드·헤더에 나타난다. 단순한 도감 하나가 아니다.

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 바이옴 | `data/food-biomes.json` → `biomes[]` | 9 | `Biome` |

```ts
import { biomes, biomesBySlug } from "@/lib/data";
import { BiomeBadge, BiomeRail, biomeKo, biomeStyle, BIOME_KO, BIOME_ORDER } from "@/components/ui/BiomeBadge";
```

`biomes` 는 `progressionOrder` 순으로 정렬돼 있다.

## 파일 위치

```
src/app/db/biomes/page.tsx           목록 (Server)
src/app/db/biomes/[slug]/page.tsx    상세 (Server)
src/components/food/
  BiomeTimeline.tsx   1→9 진행 루트 레이아웃
  biomeFormat.tsx     structureKo · specialMechanicsKo (한국어 자체 작성)
src/components/ui/
  BiomeBadge.tsx      색 시스템 · 배지 · BiomeRail (시그니처 요소)
```

## 색 시스템

`globals.css` 에 바이옴별 CSS 변수가 있다. 채도를 낮춘 9색이며
**면을 채우지 않고 3px 마커·작은 점으로만** 쓴다 (9색이 동시에 보이면 무지개가 됨).

```tsx
<div style={biomeStyle(biome)}>
  <span style={{ backgroundColor: "var(--biome-current)" }} />
</div>
```

`EntityCard` · `PageHeader` 는 `biome` prop 을 받으면 알아서 마커를 붙인다.
**넘길 수 있으면 반드시 넘길 것** — 색이 곧 난이도 정보다.

## 데이터 함정

### ⚠ `name_en` 표기가 파일마다 다르다
`biomes[]` 는 **`"Mountains"` 복수형**인데 `creatures[]`·`bosses[]`·`food[]` 는
`"Mountain"` 단수형이다.

→ `lib/data.ts` 의 `BIOME_ALIASES` 가 단수형으로 통일한다.
이걸 안 거치면 산 바이옴에서 서식 몬스터 조인이 조용히 실패하고
한글명 룩업도 빗나가 화면에 "Mountains" 영문이 노출된다. 실제로 발생했던 버그.

**새 바이옴이 추가되면 표기가 다른 파일과 맞는지 먼저 확인할 것.**

### `progression_order` 가 정수가 아니다
바다는 **2.5**다 (검은 숲 직후에 열리므로).

→ 정렬에만 쓰고 **화면에 "N단계"로 찍지 말 것.** 표시용 순서는 배열 인덱스를 쓴다.

`BIOME_ORDER` 상수는 같은 순서를 정수로 재표현한 것 (바다 = 3).

### `boss_name` 에 sentinel 문자열이 들어 있다
바다는 `"None"`, 극북은 `"Unknown (Final Boss)"`.
그대로 두면 화면에 "None" 이 보스 이름으로 찍힌다.

→ `lib/data.ts` 의 `BOSS_NAME_SENTINELS` 가 걸러서 `null` 로 바꾼다.
**`bossName` 은 이미 정규화된 값이므로 추가 특수 처리 불필요.**

### 극북은 미출시 콘텐츠
원본에 `status: "Upcoming - Valheim 1.0 Release September 2026"` 필드가 붙어 있다.
`Biome.released` 로 노출되므로 이 플래그로 판단한다.
2026-09-09 출시 당일 데이터 수집 대상 (docs/ROADMAP.md Phase 2).

### `key_creatures` 44종 중 19종이 `creatures[]` 에 없다
Serpent · Bee · Fuling Shaman · Abomination 등. `key_resources` 도 55종 중 37종 결측.
→ `EntityChipList` 사용 필수.

### 영문 서술 필드가 많다
`special_mechanics`, `notable_structures` 는 영문 자유 텍스트.
`biomeFormat.tsx` 에 바이옴별 한국어 문장을 직접 작성해 두었다.
위키 번역이 아니라 데이터의 사실에서 자체 서술한 것 (docs/LEGAL.md 1-2).

## 표시 규칙

- 한글명은 `BIOME_KO` 가 단일 진실 공급원. 다른 데 중복 정의하지 말 것
- 상세 페이지 상단에 `BiomeRail` 로 현재 위치 표시
- 진행 순서 분모는 `biomes.length`

## 수정 시 확인할 것

- [ ] 새 바이옴의 `name_en` 표기가 다른 파일과 일치하는지
- [ ] `progressionOrder` 를 화면에 직접 찍지 않았는지
- [ ] `BIOME_KO` · `BIOME_ORDER` · `globals.css` 색 변수 세 곳을 함께 갱신했는지
- [ ] `EntityChipList` 로 자원·몬스터를 표시했는지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
