---
name: entity-mods
description: 발헤임 계산기의 모드 카탈로그(/db/mods) 작업 시 사용. 모드 목록·상세, 카테고리 필터, 선행 요구사항(requires) 표시, last_verified 신선도 표기를 수정하거나 추가할 때 호출한다. name 비번역 규칙과 서드파티 데이터 취급 규칙을 함께 로드한다.
---

# 모드 엔티티 작업

## 시작 전 읽기

1. `docs/entities/mods.md` — 데이터 함정
2. `docs/DEV-CONVENTIONS.md` — 전역 규약

## 담당 파일

```
src/app/db/mods/page.tsx           목록 (Server)
src/app/db/mods/[slug]/page.tsx    상세 (Server)
src/components/mods/ModList.tsx    검색·카테고리 필터 ("use client")
src/components/mods/labels.tsx     톤 매핑
```

## 반드시 지킬 것

- **`name` 은 번역하지 않는다.** 모드는 서드파티 창작물이라 `name_ko` 필드가
  없다. `EntityCard`/`PageHeader` 의 `nameKo`/`nameEn` 자리엔 각각
  `mod.name`/`mod.author` 를 넣는다 — 억지로 한글명 만들지 말 것
- **`requires`(BepInEx 등)를 목록·상세 어디서도 숨기지 말 것.** 초보자가
  설치에 실패하는 가장 흔한 원인
- **`last_verified` 를 항상 노출.** 모드는 패치로 쉽게 깨진다
- `summary_ko`/`beginner_reason_ko` 는 자체 작성 필드 — 모드 배포 페이지
  원문을 그대로 옮기지 말 것
- 모드 파일·스크린샷 재배포 금지. `url` 링크만
- `EntityRef`/`EntityChip` 적용 대상 아님 — 게임 엔티티 참조용 컴포넌트라
  모드에는 안 맞는다. `requires` 는 정적 `Badge`, `url` 은 일반 외부 링크
- `slug` 는 데이터에 이미 있다. `toSlug()` 로 재계산하지 말 것
- 색은 토큰만, 수치는 `Num`, 이미지 렌더 금지 (애초에 이미지 필드 자체가 없음)

## 향후 확장 시

`category`/`install_difficulty`/`gameplay_impact` 는 자유 텍스트에 가깝다.
새 값이 들어오면 `labels.tsx` 의 `DIFFICULTY_TONE`/`IMPACT_TONE` 맵도 같이
갱신할 것 — 안 하면 조용히 `neutral` 톤으로 떨어진다.

## 완료 기준

```bash
npx tsc --noEmit
npx eslint src --max-warnings 0
npm run build
```
