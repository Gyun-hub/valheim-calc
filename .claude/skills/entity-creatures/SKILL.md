---
name: entity-creatures
description: 발헤임 계산기의 몬스터 도감(/db/creatures) 작업 시 사용. 몬스터 목록·상세, 공격력 표시, 저항 해석, 드롭 테이블, 길들이기 정보를 수정하거나 추가할 때 호출한다. damage 문자열 파싱 실패 케이스와 저항 배율 해석 규칙을 함께 로드한다.
---

# 몬스터 엔티티 작업

## 시작 전 읽기

1. `docs/entities/creatures.md` — 데이터 함정, 특히 damage 파싱
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/creatures/page.tsx
src/app/db/creatures/[slug]/page.tsx
src/components/creatures/*.tsx   (보스와 공유 — damageLabels.ts 주의)
```

## 반드시 지킬 것

### `damage` 는 `ParsedDamage` 객체다
`parseDamage()` 가 문자열을 정규화하지만 **27종 중 7종은 수치가 없다**
(Blob · Surtling · Fuling · Seeker · Drake · Morgen · Lava Blob).

- `damage.parsed === false` 분기를 반드시 유지
- 그 경우 `DamageStat` 의 `UNQUANTIFIED_KO` 사전에서 한국어 설명을 꺼낸다
- **"파싱 실패" 같은 내부 용어를 화면에 노출하지 말 것.** 플레이어는 우리 구현을 모른다

### `resistances` 는 배율이다
`0.75` = **25% 감소** (75% 가 아님). `0` = 완전 면역.
`interpretResistances()` 로 해석해서 표시. 배율을 그대로 보여주면 반대로 읽힌다.

### 그 외
- 드롭 아이템 링크는 `EntityRef` — 대상 페이지가 없는 경우가 많다
- 확률 옆에 `ConfidenceBadge` 필수 (docs/LEGAL.md 1-4)
- 드롭 데이터 없는 몬스터 6종 → `MissingDataNote`
- 길들이기는 `tamingOf()` 가 null 을 돌려줄 수 있음 (5건 중 2건은 고아 데이터)
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
