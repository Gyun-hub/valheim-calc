# 몬스터 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 몬스터 | `data/creatures.json` → `creatures[]` | 27 | `Creature` |
| 드롭 테이블 | `creatures.json` → `drop_tables[]` | 55 | `DropEntry` |
| 길들이기 | `creatures.json` → `taming_breeding[]` | 5 | `TamingInfo` |

```ts
import { creatures, creaturesBySlug, dropsByCreature, tamingOf } from "@/lib/data";
```

## 파일 위치

```
src/app/db/creatures/page.tsx           목록 (Server)
src/app/db/creatures/[slug]/page.tsx    상세 (Server)
src/components/creatures/
  CreatureBrowser.tsx    검색·바이옴 필터 ("use client")
  DamageStat.tsx         ParsedDamage 렌더링 (파싱 실패 분기 포함)
  ResistanceBadges.tsx   저항 배율 → 해석된 배지
  damageLabels.ts        데미지 타입·저항 한글 라벨 (보스와 공유)
```

## 데이터 함정

### `damage` 가 자유 텍스트다
원본이 25가지 표기로 갈린다. `lib/parse.ts` 의 `parseDamage()` 가
`ParsedDamage` 객체로 정규화하지만 **전부 성공하지는 않는다.**

| 원본 모양 | 예시 | 결과 |
|---|---|---|
| 단일 | `"5 Slash"` | `{slash: 5}` |
| `+` 결합 | `"50 Blunt + 80 Fire"` | 두 타입 합산 |
| 범위 | `"85-95 Slash"` | `byType` 은 최대치, `minTotal` 에 최소치 |
| 타입 복수 | `"20-50 Slash/Pierce"` | 같은 수치가 두 타입에 |
| 수식어 | `"14 Slash + 10 Blunt (ranged)"` | `ranged: true` |
| 무해 | `"0"` | `total: 0`, `parsed: true` |
| **수치 없음** | `"Fire explosion"` · `"Varies"` | **`parsed: false`** |

**`parsed === false` 가 7종 있다**: Blob · Surtling · Fuling · Seeker · Drake · Morgen · Lava Blob.

→ `DamageStat` 이 이 경우 `UNQUANTIFIED_KO` 사전에서 한국어 설명을 꺼내 보여준다.
새 표기가 생기면 그 사전에 문장을 추가할 것. **"파싱 실패" 같은 내부 용어를
화면에 노출하지 말 것** — 플레이어는 우리 구현 사정을 모른다.

### `resistances` 는 배율이지 퍼센트가 아니다
`0.75` 는 "피해 75%" 가 아니라 **25% 감소**다. `0` 은 완전 면역.
배율을 그대로 보여주면 반대로 읽힌다 — `damageLabels.ts` 의
`interpretResistances()` 로 해석해서 표시한다.

### 드롭 데이터가 없는 몬스터 6종
Drake · Seeker · Gjall · Tick · Morgen · Lava Blob 은 `drop_tables` 에 항목이 없다.
`MissingDataNote` 로 처리.

### 길들이기 데이터 2건이 고아
`taming_breeding` 5건 중 Chicken · Asksvin 은 `creatures[]` 에 없는 몬스터를 가리킨다.
도달 가능한 건 멧돼지·늑대·록스뿐. (`Asksvin` / `Askvin` 표기 흔들림도 있음)

### 드롭 아이템 이름 대부분이 영문으로 표시된다
`drop_tables[].item_name_en` 44종 중 33종이 `items[]` 에 없어
`koName()` 이 영문명으로 폴백한다. 코드 문제가 아니라 데이터 결측.

## 표시 규칙

- `behavior`: `aggressive` 적대 / `passive` 비적대
- 바이옴은 `BiomeBadge`, 한글은 `biomeKo()`
- 확률을 표시하는 곳엔 **`ConfidenceBadge` 필수** (docs/LEGAL.md 1-4)
- 드롭 아이템 링크는 `EntityRef` — 대상 페이지가 없는 경우가 많다

## 수정 시 확인할 것

- [ ] `damage.parsed === false` 분기를 유지했는지
- [ ] 저항 배율을 해석해서 표시했는지 (그대로 노출 금지)
- [ ] 확률 옆에 `ConfidenceBadge` 가 있는지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
