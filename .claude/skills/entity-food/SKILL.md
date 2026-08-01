---
name: entity-food
description: 발헤임 계산기의 음식 도감(/db/food) 작업 시 사용. 음식 목록·상세, 체력/스태미나/에이트르 표시, 정렬·필터, 재료 링크, 회복량 계산을 수정하거나 추가할 때 호출한다. regen 문자열 파싱과 재료 참조 결측을 함께 로드한다.
---

# 음식 엔티티 작업

## 시작 전 읽기

1. `docs/entities/food.md` — 데이터 함정
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/food/page.tsx
src/app/db/food/[slug]/page.tsx
src/components/food/FoodList.tsx
```

`src/components/food/` 는 미드·바이옴과 공유한다. 다른 파일 건드릴 때 주의.

## 반드시 지킬 것

- **`regen` 은 `"1 HP/s"` 문자열.** `regenHpPerSec` 에 숫자가, `regenRaw` 에 원본이 들어 있다.
  숫자가 null 이면 원본을 표시
- **티어 4 = Mountain** (2026-08부터). 예전엔 1·2·3·5·6·7 뿐이었으나 Mountain 음식이
  생기며 채워짐. 여전히 연속 범위라고 가정하지 말 것 (다른 갭이 있을 수 있음)
- **재료 17종 중 16종이 `items[]` 에 없다.** 재료 표시는 `EntityChipList` 필수
- 지속시간은 `formatDuration()` 재사용. 직접 구현하지 말 것
- 총 회복량은 계산값임을 명시
- 정렬 옵션(체력·스태미나·에이트르·티어)은 음식 계산기(Phase 1)의 전신 — 유지
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지

## 향후 확장 시

음식은 38/75+ 로 데이터 자체가 부족하다. 확장할 때
`tier` · `biome` 표기를 기존 값과 맞출 것 (바이옴은 단수형 표준).

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
