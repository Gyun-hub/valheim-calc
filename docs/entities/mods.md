# 모드 엔티티

## 데이터 출처

| 항목 | 위치 | 개수 | 타입 |
|---|---|---|---|
| 모드 | `data/mods.json` → `mods[]` | 16 | `Mod` |

```ts
import { mods, modsBySlug } from "@/lib/data";
```

`meta.sources` · `meta.collected_at` 도 같은 파일에 있다.

## 파일 위치

```
src/app/db/mods/page.tsx           목록 (Server)
src/app/db/mods/[slug]/page.tsx    상세 (Server)
src/components/mods/
  ModList.tsx    검색·카테고리 필터 ("use client")
  labels.tsx     install_difficulty · gameplay_impact → Badge tone 매핑
```

## 데이터 함정

### `name` 은 번역하지 않는다 — 다른 엔티티와 가장 다른 점
다른 모든 엔티티는 게임 자체 공식 수치라 `name_en` / `name_ko` 조인이 표준이다.
모드는 **서드파티 창작물**이고 `name` 은 제작자가 붙인 고유명사(모드 이름)다.
`name_ko` 필드 자체가 없다 — 억지로 한글명을 만들어 붙이지 말 것.

카드·상세 헤더에서는 `EntityCard`/`PageHeader` 의 `nameKo`/`nameEn` 슬롯에
각각 `mod.name`(원문 그대로) · `mod.author`(제작자)를 넣어 재사용한다 —
"한/영 병기" 자리를 "모드명/제작자" 자리로 치환한 것.

### `slug` 는 데이터에 이미 확정돼 있다
다른 엔티티처럼 `toSlug(nameEn)` 으로 파생시키지 않는다. `buildSlugMap` 대신
`new Map(mods.map(m => [m.slug, m]))` 로 직접 만든다 (`lib/data.ts` 참고).

### `requires` 를 빠뜨리면 초보자가 설치에 실패한다
BepInEx 등 선행 설치가 필요한 모드가 대부분이다(16개 전부 `BepInExPack Valheim`
필요, 4개는 Jötunn 추가 필요). `requires` 배열이 비어 있지 않은 이상 **항상**
눈에 띄게 표시해야 한다 — 목록 카드에도 "BepInEx 필요" 배지로 노출 중.

### `summary_ko` / `beginner_reason_ko` 는 자체 작성, 원문 복사 금지
모드 설명(Thunderstore 페이지 텍스트)을 그대로 옮기면 안 된다. 다른 엔티티의
"위키 텍스트 복사 금지" 규칙과 동일한 취지지만 여기선 출처가 위키가 아니라
모드 배포 페이지라는 점이 다르다.

### 모드 파일·스크린샷 재배포 금지, 링크만
`url` 로 원본 페이지(전부 Thunderstore)를 가리키기만 한다. 발헤임은 공식
Steam Workshop을 지원하지 않는다 — "창작마당" 이 아니라 Thunderstore/BepInEx가
사실상 표준 배포 경로다 (`data/mods.json` meta.notes 참고).

### `last_verified` 가 실제로 오래됐을 수 있다
모드는 게임 패치나 모드 자체 업데이트로 호환성이 쉽게 깨진다. "확인 시점"이
데이터 신뢰도에 직접 영향을 준다. 값이 오래됐다고 임의로 지우거나 갱신하지
말 것 — 실제로 재검증했을 때만 갱신.

### `platform` / `category` 는 자유 텍스트에 가깝다
현재 `platform` 은 16개 전부 `"Thunderstore"`. `category` 는 7종
("인벤토리/창고" · "건축 편의" · "기타" · "지도/탐사" · "성능 최적화" ·
"UI 개선" · "멀티플레이 편의")으로 이미 한글이라 별도 라벨 매핑이 필요 없다.
`install_difficulty`/`gameplay_impact` 는 `labels.tsx` 의 톤 매핑에 없는
새 값이 들어오면 자동으로 `neutral` 톤으로 떨어진다 — 새 값 추가 시
`DIFFICULTY_TONE`/`IMPACT_TONE` 도 같이 갱신할 것.

### `EntityRef`/`EntityChip` 적용 대상 아님
이 컴포넌트들은 도감 엔티티 간 내부 참조용이다. 모드는 게임 데이터 엔티티를
참조하지 않으므로(외부 링크만 가짐) 적용하지 않는다. `requires` 는 정적
`Badge` 나열로, `url` 은 일반 `<a target="_blank">` 로 처리한다.

## 표시 규칙

- **`last_verified` 를 UI에 반드시 노출한다.** 목록 카드(작게)와 상세 페이지
  ("정보 확인 시점" 섹션) 둘 다에 있다 — 못 박아 둔 규칙이니 없애지 말 것.
- `name` 은 원문 그대로, 한글 의역 금지.
- `requires` 는 배지로. 목록에서도 "BepInEx 필요" 최소 배지 하나는 표시.
- `install_difficulty` · `gameplay_impact` 는 `Badge` (`difficultyTone`/`impactTone`)로 구분.
- `url` 은 외부 링크. `EntityRef`/`EntityChip` 대상이 아님.
- 색은 `globals.css` 토큰만, 파생 수치 하드코딩 금지 (전역 규칙, 예외 없음).
- 이미지 렌더 금지 (다른 엔티티와 달리 애초에 `image_source_url` 필드 자체가 없음).

## 수정 시 확인할 것

- [ ] `data/mods.json` 을 페이지에서 직접 import 하지 않았는지 (`@/lib/data` 경유)
- [ ] `name` 을 임의로 한글화하지 않았는지
- [ ] `requires` 가 비어있지 않은데 화면에서 누락되지 않았는지
- [ ] `summary_ko` / `beginner_reason_ko` 가 원문 복사가 아닌지
- [ ] 모드 파일·스크린샷을 재배포하지 않고 `url` 링크만 쓰는지
- [ ] `last_verified` 가 목록·상세 양쪽에 노출되는지
- [ ] `npx tsc --noEmit` · `npm run build` 통과
