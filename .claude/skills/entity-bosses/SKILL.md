---
name: entity-bosses
description: 발헤임 계산기의 보스 도감(/db/bosses) 작업 시 사용. 보스 목록·상세, 소환법, 확정 드롭, 가호(Forsaken Power), 진행 순서 네비게이션을 수정하거나 추가할 때 호출한다. summonQty 문자열 함정과 가호 한국어 작성 규칙을 함께 로드한다.
---

# 보스 엔티티 작업

## 시작 전 읽기

1. `docs/entities/bosses.md` — 데이터 함정
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/bosses/page.tsx
src/app/db/bosses/[slug]/page.tsx
src/components/creatures/BossRouteList.tsx
src/components/creatures/BossNav.tsx
src/components/creatures/bossText.ts
```

`src/components/creatures/damageLabels.ts` 는 몬스터와 공유한다.

## 반드시 지킬 것

### ⚠ 소환 개수는 `summonQtyLabel` 을 쓴다
여왕의 `summon_qty` 는 `"9 + 1"` **문자열**이다.

| 필드 | 용도 |
|---|---|
| `summonQty` | 산술용. **여왕은 null** |
| `summonQtyLabel` | **화면 표시용. 항상 이걸 쓴다** |

`summonQty ?? 1` 을 쓰면 여왕이 "1개"로 잘못 표시된다. 실제로 발생했던 버그.

### `guaranteed_drops` 는 이미 파싱돼 있다
`{itemNameEn, qty}` 배열로 들어온다. 다시 파싱하지 말 것.
괄호가 없던 항목은 `qty: 1`, 파더는 빈 배열.

### `forsakenPower` 는 영문 원문이라 노출 금지
`bossText.ts` 의 `FORSAKEN_POWER_KO` 에 한국어 문장을 직접 쓴다 (docs/LEGAL.md 1-2).

### 그 외
- 진행 순서 분모는 `bosses.length`. **`/7` 하드코딩 금지**
- 체력은 솔로 기준임을 명시 (멀티 스케일링은 Phase 2)
- 트로피·보상 아이템은 `items[]` 에 없어 `EntityRef` 필수
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
