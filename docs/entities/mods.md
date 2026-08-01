# 모드 엔티티

> **미구현.** 데이터 파일(`data/mods.json`)만 존재하거나 작업 중이고, `lib/data.ts` ·
> `lib/types.ts` · `src/app/db/*` 어디에도 아직 연결돼 있지 않다. 이 문서는 구현 전
> 데이터 함정과, 나중에 실제로 만들 때 지킬 규칙을 미리 적어 둔 것이다.

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 모드 | `data/mods.json` → `mods[]` | `data/mods.json` 직접 확인 (미구현이라 `lib/data.ts` 집계 없음) | `Mod` (미정의) |

`meta.sources` · `meta.collected_at` 도 같은 파일에 있다. 다른 엔티티처럼
`@/lib/data` 경유 배열·slug 맵이 아직 없으므로, 지금은 이 파일 자체를 읽는 것 외에
확인할 방법이 없다.

```ts
// 구현되면 이렇게 되어야 한다 (아직 존재하지 않음)
import { mods, modsBySlug } from "@/lib/data";
```

## 파일 위치

**미구현.** 예정 위치만 명시한다 (다른 엔티티 패턴을 그대로 따를 것).

```
src/app/db/mods/page.tsx           목록 (Server) — 미구현
src/app/db/mods/[slug]/page.tsx    상세 (Server) — 미구현
src/components/mods/
  ModList.tsx    검색·카테고리 필터·정렬 ("use client") — 미구현
```

### 구현 시 참고

- `docs/DEV-CONVENTIONS.md` 4절 "페이지 구조" 그대로 따를 것: 목록은
  Server Component + `PageHeader`, 상세는 `generateStaticParams` + `toStaticParams`
- slug 룩업 맵(`modsBySlug`)을 `itemsBySlug` · `foodBySlug` 와 같은 방식으로
  `lib/data.ts` 에 `buildSlugMap` 으로 생성할 것
- 목록 카드는 `CardGrid` / `EntityCard` 재사용
- **`EntityRef`/`EntityChip` 은 여기 적용하지 않는다.** 이건 도감 엔티티 간 내부
  참조용 컴포넌트다. 모드는 게임 데이터 엔티티를 참조하지 않으므로(외부 링크만
  가짐) 적용 대상이 아니라는 점을 헷갈리지 말 것 — `url` 은 일반 외부 링크로 처리
- `requires` 는 배열이라 `EntityChipList` 같은 정적 칩 나열 컴포넌트가 적합할 수
  있으나, 참조 대상이 게임 엔티티가 아니므로 링크는 걸지 않는다 (텍스트 칩만)

## 데이터 함정

### `name` 은 번역하지 않는다 — 다른 엔티티와 가장 다른 점
다른 모든 엔티티는 게임 자체 공식 수치라 `name_en` / `name_ko` 조인이 표준이다.
모드는 **서드파티 창작물**이고 `name` 은 제작자가 붙인 고유명사(모드 이름)다.
`name_ko` 필드 자체가 없다 — 억지로 한글명을 만들어 붙이지 말 것. 표시할 땐
원문 그대로 쓰고, 필요하면 `summary_ko` 로 보충 설명만 붙인다.

### `requires` 를 빠뜨리면 초보자가 설치에 실패한다
BepInEx 등 선행 설치가 필요한 모드가 대부분이다. `requires` 배열이 비어 있지
않은 이상 **항상** 눈에 띄게 표시해야 한다. 목록에서도 숨기지 말 것.

### `summary_ko` / `beginner_reason_ko` 는 자체 작성, 원문 복사 금지
모드 설명(Nexus/Thunderstore 페이지 텍스트)을 그대로 옮기면 안 된다. 반드시
직접 요약해서 쓴 필드다 — 다른 엔티티의 "위키 텍스트 복사 금지" 규칙과 동일한
취지지만 여기선 출처가 위키가 아니라 모드 배포 페이지라는 점이 다르다.

### 모드 파일·스크린샷 재배포 금지, 링크만
`url` 로 원본 페이지를 가리키기만 한다. 모드 파일 자체나 스크린샷을 이 저장소에
포함하거나 재호스팅하지 말 것.

### `last_verified` 가 실제로 오래됐을 수 있다
모드는 게임 패치나 모드 자체 업데이트로 호환성이 쉽게 깨진다. 다른 엔티티(공식
수치)와 달리 "확인 시점"이 데이터 신뢰도에 직접 영향을 준다. 값이 오래됐다고
임의로 지우거나 갱신하지 말 것 — 실제로 재검증했을 때만 갱신.

### `platform` / `category` 값이 자유 텍스트에 가깝다
스키마상 후보값이 정해져 있지만(Steam Workshop / Nexus Mods / Thunderstore,
카테고리 7종) 실제 수집 데이터가 그 외 값을 담고 있을 수 있다. 정규화 전에
`data/mods.json` 값 분포를 직접 확인할 것.

## 표시 규칙

**미구현이므로 아래는 "구현 시 지킬 규칙"이다.**

- **`last_verified` 를 UI에 반드시 노출한다.** 목록 카드든 상세 페이지든 최소
  한 곳에는 날짜가 보여야 한다 — 모드는 시간이 지나면 깨지는 정보라 다른
  엔티티보다 신선도 표시가 중요하다. 이 규칙은 못 박아 둔다.
- `name` 은 원문 그대로, 한글 의역 금지 (위 "데이터 함정" 참고)
- `requires` 는 배지나 별도 강조 블록으로. 목록에서도 최소 배지 하나로 표시
- `install_difficulty` · `gameplay_impact` 는 `Badge` (`tone`) 로 구분해서 표시
- `url` 은 외부 링크. `EntityRef`/`EntityChip` 대상이 아님 (위 "구현 시 참고" 참고)
- 색은 `globals.css` 토큰만, 파생 수치 하드코딩 금지 (전역 규칙, 예외 없음)

## 수정 시 확인할 것

- [ ] `data/mods.json` 을 페이지에서 직접 import 하지 않았는지 (구현 시)
- [ ] `name` 을 임의로 한글화하지 않았는지
- [ ] `requires` 가 비어있지 않은데 화면에서 누락되지 않았는지
- [ ] `summary_ko` / `beginner_reason_ko` 가 원문 복사가 아닌지
- [ ] 모드 파일·스크린샷을 재배포하지 않고 `url` 링크만 쓰는지
- [ ] `last_verified` 가 UI 어딘가에 노출되는지 (구현 시)
- [ ] `npx tsc --noEmit` · `npm run build` 통과 (구현 시)
