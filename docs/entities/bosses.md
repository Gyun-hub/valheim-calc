# 보스 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 보스 | `data/creatures.json` → `bosses[]` | 7 | `Boss` |

`bosses` 는 `lib/data.ts` 에서 이미 `order` 순으로 정렬돼 있다.

```ts
import { bosses, bossesBySlug } from "@/lib/data";
```

진행 순서: 에이크쉬르 → 엘더 → 본매스 → 모더 → 야글루스 → 여왕 → 파더

## 파일 위치

```
src/app/db/bosses/page.tsx           목록 (Server)
src/app/db/bosses/[slug]/page.tsx    상세 (Server)
src/components/creatures/
  BossRouteList.tsx   진행 순서 루트 레이아웃
  BossNav.tsx         이전/다음 보스 네비게이션
  bossText.ts         가호 한국어 문장, 소환 아이템·장소 표기 가공
  damageLabels.ts     몬스터와 공유
```

## 데이터 함정

### ⚠ `summon_qty` 가 숫자가 아닌 경우가 있다
여왕은 `"9 + 1"` **문자열**이다 (제물 9개 + 봉인 해제기 1개).

→ `Boss` 타입이 두 필드로 나뉜다.

| 필드 | 용도 |
|---|---|
| `summonQty: number \| null` | 산술용. 숫자로 환원되는 것만 들어감. **여왕은 null** |
| `summonQtyLabel: string \| null` | **표시용. 화면에는 항상 이걸 쓴다** |

`summonQty ?? 1` 같은 코드를 쓰면 여왕이 "1개"로 잘못 표시된다. 실제로 한 번 발생했던 버그.

### `guaranteed_drops` 는 파싱된 상태로 온다
원본은 `["Hard Antler (3)"]` 문자열이지만 `parseGuaranteedDrops()` 가
`[{itemNameEn: "Hard Antler", qty: 3}]` 로 바꿔 놓는다. 다시 파싱하지 말 것.
괄호가 없으면 `qty: 1` (여왕의 `"Majestic Carapace"`). 파더는 빈 배열.

### `summon_item` 에 `+` 결합이 있다
여왕은 `"Giant King's Hair + Sealbreaker"`. `bossText.ts` 의 `formatSummonItem()` 이
조각별로 한글화한 뒤 다시 합친다.

### `forsaken_power` 는 영문 자유 텍스트
그대로 노출 금지 (docs/LEGAL.md 1-2). `bossText.ts` 의 `FORSAKEN_POWER_KO` 에
보스별 한국어 문장을 직접 써 두었다. 매핑에 없으면 표시하지 않는다.

### 트로피·보상 아이템이 `items[]` 에 없다
7종 트로피 전부와 Hard Antler · Yagluth Drop · Sealbreaker 등 보스 전용
아이템이 목록에 없어 이름이 영문으로 나온다. `EntityRef` 가 링크는 막아 준다.

### 진행 순서를 상수로 박지 말 것
`{boss.order}/7` 처럼 쓰면 안 된다. `bosses.length` 를 쓴다.
(파생 수치 하드코딩 금지 — docs/DATA-SCHEMA.md)

## 표시 규칙

- 체력은 **솔로 기준**임을 명시. 멀티 스케일링은 Phase 2
- `trophyDrop100pct` 는 7종 전부 `true`
- 소환법 문장은 `formatSummonItem` · `formatSummonLocation` 경유
- 상세 하단에 이전/다음 보스 네비게이션 유지

## 수정 시 확인할 것

- [ ] 소환 개수에 `summonQtyLabel` 을 썼는지 (`summonQty` 아님)
- [ ] 진행 순서 분모가 `bosses.length` 인지
- [ ] 가호 문장이 영문 원문이 아닌지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
