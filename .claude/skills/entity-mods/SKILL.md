---
name: entity-mods
description: 발헤임 계산기의 모드 카탈로그(미구현, data/mods.json) 작업 시 사용. 모드 데이터 스키마 확인, name 비번역 규칙, requires/last_verified 표시 규칙, 향후 /db/mods 페이지 구현을 시작할 때 호출한다. 다른 엔티티와 달리 name_ko 조인이 없고 서드파티 창작물이라는 점을 함께 로드한다.
---

# 모드 엔티티 작업

## 시작 전 읽기

1. `docs/entities/mods.md` — 데이터 함정, 구현 시 지킬 규칙
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

**현재 `data/mods.json` 만 존재 (또는 작업 중). UI 미구현.**

```
data/mods.json                     데이터 (있음/작업 중)
src/app/db/mods/page.tsx           목록 — 미구현
src/app/db/mods/[slug]/page.tsx    상세 — 미구현
src/components/mods/ModList.tsx    — 미구현
```

`lib/data.ts` · `lib/types.ts` 에도 아직 `mods` / `modsBySlug` / `Mod` 타입이
없다. 새로 만들 때 `docs/DEV-CONVENTIONS.md` 2절 패턴(`buildSlugMap` 등)을
그대로 따를 것.

## 반드시 지킬 것

- **`name` 은 번역하지 않는다.** 다른 엔티티는 `name_en`/`name_ko` 조인이지만
  모드는 서드파티 창작물이라 `name_ko` 필드 자체가 없다. 억지로 한글명을
  만들지 말 것
- **`requires`(BepInEx 등 선행 설치)를 빠뜨리지 말 것.** 초보자가 설치에
  실패하는 가장 흔한 원인. 목록·상세 어디서든 숨기면 안 됨
- **`last_verified` 를 UI에 반드시 노출.** 모드는 게임 패치·모드 업데이트로
  호환성이 쉽게 깨진다 — 신선도 표시가 다른 엔티티보다 중요
- `summary_ko` / `beginner_reason_ko` 는 자체 작성 필드. 모드 배포 페이지
  설명을 그대로 옮기지 말 것 (위키 복사 금지 규칙과 같은 취지)
- 모드 파일·스크린샷 재배포 금지. `url` 링크만
- `EntityRef`/`EntityChip` 은 게임 엔티티 간 참조용. 모드의 `url` 은 일반
  외부 링크로 처리 (적용 대상 아님)
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지 (전역 규칙)

## 향후 확장 시

아직 `lib/data.ts` · `lib/types.ts` · `src/app/db/*` 어디에도 연결되지
않은 상태. 실제로 페이지를 만들 때는 기존 엔티티 패턴을 그대로 따를 것:
`buildSlugMap` 으로 slug 룩업 맵 생성, `EntityCard`/`CardGrid` 로 목록 카드,
`PageHeader` 로 제목·항목 수, list + `[slug]` 상세 페이지 구조
(`generateStaticParams` + `toStaticParams`). `platform` · `category` 값이
스키마 후보값 밖일 수 있으니 정규화 전 `data/mods.json` 실제 분포부터 확인.

## 완료 기준

구현 전(현재)에는 해당 없음. 페이지 구현 후에는:

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
