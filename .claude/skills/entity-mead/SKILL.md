---
name: entity-mead
description: 발헤임 계산기의 미드·포션 도감(/db/mead) 작업 시 사용. 미드 목록·상세, 효과 설명, 양조법·양조 재료 표시를 수정하거나 추가할 때 호출한다. magnitude·brewYield 등 문자열로 들어온 수치 필드와 한국어 재작성 규칙을 함께 로드한다.
---

# 미드·포션 엔티티 작업

## 시작 전 읽기

1. `docs/entities/mead.md` — 데이터 함정
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/mead/page.tsx
src/app/db/mead/[slug]/page.tsx
src/components/food/MeadList.tsx
src/components/food/meadFormat.tsx
```

## 반드시 지킬 것

### 수치여야 할 필드가 전부 문자열
| 필드 | 실제 값 |
|---|---|
| `magnitude` | `"50 HP over 10 seconds"` — 정규화 불가 |
| `brewYield` | `"6 bottles per batch"` |
| `brewTime` | `"2 in-game days (60 minutes real-time)"` |

→ `meadFormat.tsx` 의 `describeMagnitude()` · `describeBrewTime()` · `describeBrewYield()` 로
한국어 문장을 만든다. **영문 원문을 그대로 노출하지 말 것** (docs/LEGAL.md 1-2).

새 미드를 추가하면 `describeMagnitude()` 패턴이 커버하는지 확인. 현재 16개 전부 커버됨.

### 양조 재료는 수량이 이름에 붙어 있다
`["10x Honey"]` 형태. `parseQuantifiedIngredient()` 로 쪼갠 뒤
반환값을 그대로 `EntityChipList` 에 넘기면 된다 (모양이 맞음).

```tsx
<EntityChipList names={mead.brewIngredients.map(parseQuantifiedIngredient)} />
```

파서를 재구현하지 말 것.

### 그 외
- 지속시간·쿨다운은 `formatDuration()`
- 효과 한글화는 `effectKo()` (13종)
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
