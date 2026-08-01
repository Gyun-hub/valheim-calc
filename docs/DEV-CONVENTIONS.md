# 개발 규약

공통 기반은 이미 구축돼 있다. 엔티티 작업자는 **이 규약을 지켜 페이지만 추가**한다.

---

## 1. 절대 하지 말 것

| 금지 | 이유 |
|---|---|
| `data/*.json` 을 페이지에서 직접 import | 번들에 140KB 통째로 실림. 반드시 `@/lib/data` 경유 |
| `data/*.json` 파일 수정 | 데이터 수집 단계 산출물. 코드로 정규화할 것 |
| `image_source_url` 을 `<img src>` 로 렌더 | 원본 위키 이미지 재배포 금지 ([LEGAL.md](LEGAL.md) 1-1) |
| 위키 설명문 복사 | 도감 설명은 자체 작성 ([LEGAL.md](LEGAL.md) 1-2) |
| 색상 하드코딩 (`text-zinc-400` 등) | `globals.css` 토큰만 사용 |
| 페이지 전체에 `"use client"` | 도감은 Server Component 기본. 상호작용 부분만 분리 |
| 항목 수를 상수로 박기 | `arr.length` 로 계산 ([DATA-SCHEMA.md](DATA-SCHEMA.md) 참고) |
| 새 npm 패키지 추가 | 승인 없이 의존성 늘리지 말 것 |

---

## 2. 데이터 접근

전부 `@/lib/data` 에서 가져온다. JSON 은 이미 camelCase 도메인 객체로 정규화돼 있다.

```ts
import { items, itemsBySlug, koName, recipeOf } from "@/lib/data";
import type { Item } from "@/lib/types";
```

### 배열
`items` · `recipes` · `buildingPieces` · `creatures` · `dropTables` · `bosses` ·
`tamingInfo` · `food` · `meadPotions` · `biomes` · `ships` · `magicItems`

`bosses` 는 `order`, `biomes` 는 `progressionOrder` 로 이미 정렬돼 있다.

### slug 룩업 맵
`itemsBySlug` · `creaturesBySlug` · `bossesBySlug` · `foodBySlug` · `meadBySlug` · `biomesBySlug`

### 조회 함수
| 함수 | 용도 |
|---|---|
| `koName(nameEn)` | 영문명 → 한글명. 없으면 영문명 그대로 |
| `recipeOf(nameEn)` | 제작법 조회 |
| `usedInRecipes(nameEn)` | 이 아이템을 재료로 쓰는 제작법들 ("쓰임새" 섹션) |
| `dropsByCreature(nameEn)` | 이 몬스터가 떨구는 것 |
| `dropSourcesOfItem(nameEn)` | 이 아이템을 떨구는 몬스터 ("획득처" 섹션) |
| `tamingOf(nameEn)` | 길들이기 정보 (없으면 null) |
| `isPortalRestricted(nameEn)` | 포탈 반입 가능 여부 |
| `matchesQuery(entity, q)` | 한/영 동시 검색 |

---

## 3. 공용 컴포넌트

전부 `@/components/ui` 아래. **새로 만들기 전에 여기 있는지 먼저 확인.**

| 컴포넌트 | 용도 |
|---|---|
| `PageHeader` | 페이지 제목 + 부제 + 항목 수 |
| `CardGrid` / `EntityCard` | 도감 목록 격자와 카드 |
| `Section` | 상세 페이지 구획 |
| `StatTable` / `statRows` | 스탯 표. `statRows` 가 null 행을 자동으로 걸러냄 |
| `MissingDataNote` | 결측 데이터 안내 |
| `Badge` | 배지. `tone`: neutral·accent·danger·warning·success·info |
| `ConfidenceBadge` | 드롭률 신뢰도. 확률 표시 시 **필수** ([LEGAL.md](LEGAL.md) 1-4) |
| `BiomeBadge` / `biomeKo` | 바이옴 배지와 한글 변환 |
| `FilterBar` / `EmptyResult` | 검색·필터 UI (클라이언트) |

### `statRows` 사용법
값이 null 인 행은 자동으로 사라진다. 결측이 많은 데이터셋이라 이걸 꼭 쓸 것.

```tsx
<StatTable rows={statRows([
  ["체력", item.stats.armor],
  ["무게", item.stats.weight],   // null 이면 이 행 자체가 안 나옴
])} />
```

---

## 4. 페이지 구조

```
src/app/db/<entity>/page.tsx           목록 (Server Component)
src/app/db/<entity>/[slug]/page.tsx    상세 (Server Component + generateStaticParams)
src/components/<entity>/*.tsx          해당 엔티티 전용 컴포넌트
```

### 목록 페이지 골격
```tsx
import { PageHeader } from "@/components/ui/PageHeader";
import { items } from "@/lib/data";

export const metadata = { title: "아이템 도감", description: "..." };

export default function ItemsPage() {
  // 클라이언트 컴포넌트에는 표시에 필요한 필드만 추려서 넘긴다
  const rows = items.map((i) => ({
    slug: i.slug, nameKo: i.nameKo, nameEn: i.nameEn, category: i.category,
  }));
  return (
    <>
      <PageHeader title="아이템 도감" count={items.length} />
      <ItemList rows={rows} />
    </>
  );
}
```

### 상세 페이지 골격
```tsx
import { notFound } from "next/navigation";
import { items, itemsBySlug } from "@/lib/data";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(items);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = itemsBySlug.get(slug);
  if (!item) return {};
  return { title: `${item.nameKo} (${item.nameEn})`, description: "..." };
}

export default async function ItemDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = itemsBySlug.get(slug);
  if (!item) notFound();
  // ...
}
```

> Next 16 에서 `params` 는 Promise 다. 반드시 `await` 할 것.

---

## 5. 표기 규칙

- **한/영 병기**: 한국인도 영문명으로 검색한다. 제목·카드에 둘 다 노출
- **결측 값**: 행을 숨기거나 `MissingDataNote` 로 이유를 알림. `undefined` 를 그대로 렌더하지 말 것
- **파싱 실패**: `damage.parsed === false` 면 `damage.raw` 를 그대로 표시
- **링크 경로**: `trailingSlash: true` 라서 `/db/items/` 처럼 끝에 슬래시를 붙인다

---

## 6. 완료 기준

```bash
npx tsc --noEmit    # 에러 0
npm run build       # 정적 export 성공
```

둘 다 통과해야 작업 완료다.
