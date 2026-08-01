# 음식 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 음식 | `data/food-biomes.json` → `food[]` | 38 | `Food` |

```ts
import { food, foodBySlug } from "@/lib/data";
```

## 파일 위치

```
src/app/db/food/page.tsx           목록 (Server)
src/app/db/food/[slug]/page.tsx    상세 (Server)
src/components/food/
  FoodList.tsx    검색·바이옴 필터·정렬 ("use client")
```

## 데이터 함정

### `regen` 이 `"1 HP/s"` 문자열
`parseRegen()` 이 숫자로 뽑아 `regenHpPerSec` 에 넣는다. 원본은 `regenRaw` 에 남는다.
값 범위는 0.5 ~ 6 HP/s.

숫자를 못 뽑으면 `regenHpPerSec` 가 null 이므로 `regenRaw` 를 표시한다.

### 티어 4 = Mountain (2026-08 추가)
과거엔 1·2·3·5·6·7 만 있어 "4가 없다"고 적었으나, Mountain(산) 음식
6종(늑대 고기 꼬치·아이스크림 등)을 추가하며 티어 4가 채워졌다.
여전히 연속된 범위로 가정하지 말 것 — 다른 갭이 또 있을 수 있다.

### 재료 이름 17종 중 16종이 `items[]` 에 없다
가장 심한 참조 결측. Honey · Carrot · Barley · Mushroom · Thistle 등
기본 식재료가 아이템 목록에 통째로 빠져 있다.

→ 재료 표시는 반드시 `EntityChipList` 로. 링크 가능한 것만 링크되고
나머지는 정적 칩이 된다.

### 에이트르가 0인 음식이 11종
`eitr > 0` 인 8종만 마법 빌드에 의미가 있다. 목록에서 배지로 구분 중.

### 바이옴 값에 바다·극북이 없다
현재 음식은 Meadows · Black Forest · Swamp · Mountain · Plains · Mistlands · Ashlands 에 분포.
Ocean · Deep North 음식은 아직 없다.
`biome` 값은 `lib/data.ts` 에서 표준형으로 정규화된다 (`"Mountains"` → `"Mountain"`,
`food[]` 원본은 처음부터 단수형 `"Mountain"` 을 쓴다).

### 38/75+ — 데이터 자체가 부족
실제 게임에는 75종 이상 있다. MVP 에는 충분하지만 음식 계산기(Phase 1)의
정확도에 직접 영향. 확장 시 `tier` · `biome` 표기를 기존 값과 맞출 것.

## 표시 규칙

- 지속시간은 `formatDuration()` (초 → `"10분"`)
- 수치는 `Num` 으로 감싸 등폭 적용. 체력·스태미나 비교가 이 페이지의 핵심 기능
- 총 회복량(`regenHpPerSec × durationSec`)은 **계산값임을 명시**
- 정렬 옵션(체력·스태미나·에이트르·티어)은 음식 계산기의 전신. 유지할 것

## 수정 시 확인할 것

- [ ] 재료 링크에 `EntityChipList` 를 썼는지
- [ ] `regenHpPerSec` 가 null 인 경우를 처리했는지
- [ ] 티어를 연속 범위로 가정하지 않았는지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
