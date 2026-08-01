# 미드·포션 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 미드·포션 | `data/food-biomes.json` → `mead_potions[]` | 16 | `MeadPotion` |

```ts
import { meadPotions, meadBySlug } from "@/lib/data";
```

## 파일 위치

```
src/app/db/mead/page.tsx           목록 (Server)
src/app/db/mead/[slug]/page.tsx    상세 (Server)
src/components/food/
  MeadList.tsx      검색·효과 필터 ("use client")
  meadFormat.tsx    effectKo · describeMagnitude · describeBrewTime · describeBrewYield
```

## 데이터 함정

### 수치여야 할 필드가 전부 문자열
문서(DATA-SCHEMA.md 초판)에는 숫자로 적혀 있었으나 실제는 다르다.

| 필드 | 실제 값 | 비고 |
|---|---|---|
| `magnitude` | `"50 HP over 10 seconds"` | 자유 텍스트. **정규화 불가** |
| `brewYield` | `"6 bottles per batch"` | 16개 전부 문자열 |
| `brewTime` | `"2 in-game days (60 minutes real-time)"` | 16개 전부 동일 값 |

→ `meadFormat.tsx` 의 `describeMagnitude()` 등이 정규식으로 한국어 문장을 만든다.
**영문 원문을 그대로 화면에 내보내지 말 것** (docs/LEGAL.md 1-2).

새 미드가 추가되면 `describeMagnitude()` 의 패턴이 커버하는지 확인할 것.
현재는 16개 전부 커버 확인됨.

### `brew_ingredients` 에 수량이 이름에 붙어 있다
`["10x Honey", "5x Blueberries"]` 형태.
`parseQuantifiedIngredient()` 로 `{nameEn, qty}` 로 쪼갠 뒤
`EntityChipList` 에 그대로 넘긴다 (반환 모양이 맞음).

```tsx
<EntityChipList names={mead.brewIngredients.map(parseQuantifiedIngredient)} />
```

### 양조 재료도 대부분 `items[]` 에 없다
Honey · Blueberries · Dandelion 등. `EntityChip` 이 링크 여부를 알아서 판단한다.

### `effect` 13종
Health Restoration · Stamina Restoration · Eitr Restoration (각각 Lingering 변형 있음) ·
Fire/Frost/Poison Resistance · Carry Weight Buff · Combat Buff ·
Movement Speed Buff · Stamina Regeneration Buff.

한글 변환은 `effectKo()`.

## 표시 규칙

- 지속시간·쿨다운은 `formatDuration()`
- 효과 설명은 `describeMagnitude()` 로 한국어 자체 작성
- 목록은 효과별 필터 제공

## 수정 시 확인할 것

- [ ] 영문 자유 텍스트를 그대로 노출하지 않았는지
- [ ] `parseQuantifiedIngredient` 를 재구현하지 않았는지
- [ ] 새 미드 추가 시 `describeMagnitude()` 패턴이 커버하는지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
