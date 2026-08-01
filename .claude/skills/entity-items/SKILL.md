---
name: entity-items
description: 발헤임 계산기의 아이템 도감(/db/items) 작업 시 사용. 아이템 목록·상세 페이지, 제작법·획득처·쓰임새 표시, 카테고리 필터, 포탈 반입 판정을 수정하거나 추가할 때 호출한다. items.json 스키마와 알려진 결측·함정을 함께 로드한다.
---

# 아이템 엔티티 작업

## 시작 전 읽기

1. `docs/entities/items.md` — 이 엔티티의 데이터 함정과 파일 위치
2. `docs/DEV-CONVENTIONS.md` — 전역 규약 (금지사항, 페이지 골격)

## 담당 파일

```
src/app/db/items/page.tsx
src/app/db/items/[slug]/page.tsx
src/components/items/*.tsx
```

`src/lib/` 과 `src/components/ui/` 는 공용이다. 여기를 고쳐야 할 것 같으면
먼저 다른 엔티티에 영향이 없는지 확인할 것.

## 반드시 지킬 것

- **무게는 74개 전부 `null`.** `MissingDataNote` 안내를 지울 것
- **`statRows()` 가 null 행을 자동으로 걸러낸다.** 직접 `if` 분기하지 말 것
- **제작법은 `recipeOf()` 만 호출.** `items[].crafting` 과 `recipes[]` 중복은 이 함수가 처리
- **아이템 이름으로 링크할 땐 `EntityRef` / `EntityChip`.**
  드롭 아이템 44종 중 33종이 `items[]` 에 없어 직접 링크하면 404 가 생긴다
- **`description` 은 영문 원문.** 화면에 그대로 내보내지 말 것 (docs/LEGAL.md 1-2)
- 확률을 표시하면 `ConfidenceBadge` 필수 (docs/LEGAL.md 1-4)
- 색은 `globals.css` 토큰만. 수치는 `Num` 으로 감쌀 것
- 이미지 렌더 금지 (`image_source_url` 은 참고용)

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
