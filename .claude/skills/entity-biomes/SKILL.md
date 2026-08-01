---
name: entity-biomes
description: 발헤임 계산기의 바이옴 도감(/db/biomes)과 바이옴 색 시스템 작업 시 사용. 바이옴 목록·상세, 진행 순서 레일(BiomeRail), 바이옴별 색 토큰, 주요 자원·몬스터 표시를 수정하거나 추가할 때 호출한다. Mountains/Mountain 표기 불일치와 sentinel 값 함정을 함께 로드한다.
---

# 바이옴 엔티티 작업

바이옴은 단순한 도감이 아니라 **사이트의 구조 축**이다.
색이 난이도 티어를 인코딩하고 그 색이 전 페이지의 카드·헤더에 나타난다.
여기를 고치면 사이트 전체가 영향을 받는다.

## 시작 전 읽기

1. `docs/entities/biomes.md` — 색 시스템과 데이터 함정
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/biomes/page.tsx
src/app/db/biomes/[slug]/page.tsx
src/components/food/BiomeTimeline.tsx
src/components/food/biomeFormat.tsx
src/components/ui/BiomeBadge.tsx    ← 공용. 전 엔티티가 쓴다
src/app/globals.css                 ← 바이옴 색 변수
```

## 반드시 지킬 것

### ⚠ `name_en` 표기가 파일마다 다르다
`biomes[]` 는 **`"Mountains"` 복수형**, `creatures[]`·`bosses[]`·`food[]` 는 **`"Mountain"` 단수형**.

`lib/data.ts` 의 `BIOME_ALIASES` 가 단수형으로 통일한다.
안 거치면 조인이 조용히 실패하고 화면에 영문이 노출된다. 실제로 발생했던 버그.

**새 바이옴 추가 시 다른 파일과 표기가 맞는지 먼저 확인.**

### `progressionOrder` 가 정수가 아니다
바다는 **2.5**. 정렬에만 쓰고 **화면에 "N단계"로 찍지 말 것.**
표시용 순서는 배열 인덱스를 쓴다.

### `bossName` 은 이미 정규화됐다
원본의 `"None"` · `"Unknown (Final Boss)"` sentinel 은 `lib/data.ts` 에서
`null` 로 걸러진다. 추가 특수 처리 불필요.

미출시 여부는 `biome.released` 로 판단 (극북은 false).

### 색을 추가·변경할 때는 세 곳을 함께
1. `globals.css` 의 `--biome-*` 변수
2. `BiomeBadge.tsx` 의 `BIOME_VAR`
3. `BIOME_KO` · `BIOME_ORDER`

채도를 낮게 유지할 것. 9색이 한 화면에 동시에 나오므로 원색을 쓰면 무지개가 된다.
**면을 채우지 말고 3px 마커·작은 점으로만** 쓴다.

### 그 외
- `key_creatures` 19/44, `key_resources` 37/55 가 참조 결측 → `EntityChipList` 필수
- `special_mechanics`·`notable_structures` 는 영문 원문. `biomeFormat.tsx` 에서 한국어 자체 작성
- 진행 순서 분모는 `biomes.length`
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```

바이옴 색·표기를 바꿨다면 다른 엔티티 페이지도 함께 확인할 것.
