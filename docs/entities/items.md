# 아이템 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 아이템 | `data/items.json` → `items[]` | 74 | `Item` |
| 제작법 | `items.json` → `recipes[]` | 49 | `Recipe` |
| 건축 자재 | `items.json` → `building_pieces[]` | 12 | `BuildingPiece` |
| 포탈 제한 | `items.json` → `portal_restricted_items[]` | 14 | `Set<string>` |

접근은 전부 `@/lib/data` 경유. JSON 직접 import 금지.

```ts
import { items, itemsBySlug, recipeOf, usedInRecipes, dropSourcesOfItem, isPortalRestricted } from "@/lib/data";
```

## 파일 위치

```
src/app/db/items/page.tsx           목록 (Server)
src/app/db/items/[slug]/page.tsx    상세 (Server, generateStaticParams)
src/components/items/
  ItemList.tsx        검색·카테고리 필터 ("use client") — 유일한 클라이언트 컴포넌트
  CategoryBadge.tsx   카테고리 배지
  MaterialList.tsx    제작 재료 / 쓰임새 목록
  DropSourceList.tsx  획득처 (ConfidenceBadge 포함)
  labels.tsx          카테고리·데미지타입·작업대 한글 라벨
```

## 데이터 함정

### 무게가 74개 전부 `null`
가장 큰 결측. 포탈 계산기의 무게 합산과 배 적재량 계산이 여기서 막힌다.
상세 페이지는 `MissingDataNote` 로 안내 중. Phase 2 전 보강 필요.

### `stats` 키 구성이 항목마다 다름
`stats` 는 카테고리에 따라 있는 키가 전혀 다르다. 무기엔 `damage_types`,
방어구엔 `armor`, 도구엔 `harvest` 가 붙는 식.

→ `statRows()` 가 null 행을 자동으로 걸러내므로 **전부 나열해도 된다.**
직접 `if` 로 분기하지 말 것.

### 내구도는 14/74 에만 존재
표시용일 뿐 계산에 안 쓰인다.

### `items[].crafting` 과 `recipes[]` 가 중복
같은 내용이 두 군데 있다. `recipeOf()` 가 `crafting` 을 우선하고 없으면
`recipes` 에서 찾으므로 **둘 중 뭘 쓸지 고민하지 말고 `recipeOf()` 만 호출.**

### 작업대 이름은 `nameKoByNameEn` 에 없다
Forge·Workbench·Smelter·Inventory 는 아이템이 아니라 `koName()` 으로 한글화되지 않는다.
`components/items/labels.tsx` 의 `stationLabel()` 을 쓴다.

### ⚠ 다른 엔티티에서 참조하는 아이템 대부분이 `items[]` 에 없다
드롭 아이템 44종 중 33종, 음식 재료 17종 중 16종이 목록에 없다.
소비재(Raw Meat, Honey, Carrot)·전리품(Trophy, Wolf Fang)·중간재가 통째로 빠져 있음.

→ 그래서 **이름으로 아이템을 링크할 때 반드시 `EntityRef` / `EntityChip` 을 쓴다.**
`<Link href={\`/db/items/${slug}/\`}>` 를 직접 쓰면 404 가 생긴다.

## 표시 규칙

- 카테고리 5종: `weapon` 무기 · `armor` 방어구 · `shield` 방패 · `tool` 도구 · `resource` 자원
- 분포: resource 35 · armor 14 · tool 11 · weapon 8 · shield 6
- `description` 은 원본 영문이다. **화면에 그대로 내보내지 말 것** (docs/LEGAL.md 1-2)
- 수치는 `Num` 으로 감싸 등폭 숫자 적용
- 포탈 반입 여부는 `isPortalRestricted()` 로 판정. `stats.portalRestricted` 를 직접 보지 말 것

## 수정 시 확인할 것

- [ ] 새 필드를 표시한다면 `statRows()` 에 넣었는지 (null 자동 처리)
- [ ] 다른 엔티티 링크에 `EntityRef` / `EntityChip` 을 썼는지
- [ ] 영문 원문을 노출하지 않았는지
- [ ] 색을 토큰으로만 썼는지 (`text-zinc-*` 등 금지)
- [ ] `npx tsc --noEmit` · `npm run build` 통과
