# 아키텍처

---

## 1. 핵심 결정: 백엔드 없음

**Phase 1~3 전 기능이 정적 사이트로 구현 가능.**

근거:
- 게임 데이터 총 140KB (gzip 18.5KB). 이미지 한 장보다 작음
- 모든 계산이 순수 함수 — 서버가 할 일이 없음
- 데이터가 실시간으로 안 변함 (게임 패치 때만 갱신 → 빌드 다시 하면 됨)

| 기능 | 백엔드 필요? | 구현 방식 |
|---|---|---|
| 모든 계산기 | 아니오 | JSON 번들 + 클라이언트 계산 |
| 도감 페이지 | 아니오 | 빌드타임 정적 생성 |
| 통합 검색 | 아니오 | 161개뿐 → 클라이언트 필터링 |
| 진행도 체크리스트 | 아니오 | localStorage |
| 결과 공유 | 아니오 | URL 쿼리스트링 인코딩 |

**이점**
1. 호스팅 $0 (Cloudflare Pages 무료 티어로 충분)
2. 콜드스타트 없음 — 광고 수익형 사이트는 이탈률이 곧 매출
3. SEO 완벽 — 크롤러가 완성된 HTML 수신

### 백엔드가 필요해지는 시점 (Phase 4 이후, 선택)

| 기능 | 필요한 것 |
|---|---|
| 회원가입 · 기기 간 빌드 동기화 | Auth + DB |
| 댓글 · 평점 · 빌드 공유 게시판 | DB |
| 짧은 공유 링크 (`/s/abc123`) | KV 스토어 |
| 인기 아이템 랭킹 | DB 또는 Analytics |

그때는 Cloudflare Workers + D1 추가. 같은 플랫폼이라 이전 부담 없음.

---

## 2. 기술 스택 — 확정

| 레이어 | 선택 | 비고 |
|---|---|---|
| 프레임워크 | **Next.js (App Router)** | `output: 'export'` 정적 내보내기 |
| 언어 | TypeScript | 데이터 스키마를 타입으로 고정 → 게임 패치 시 누락 감지 |
| 스타일 | Tailwind CSS | 다크 테마 · 반응형 |
| 호스팅 | Cloudflare Pages | 무료, git push 자동 배포, 글로벌 CDN |
| 데이터 | 리포 내 JSON | 빌드 시 번들. 별도 스토리지 불필요 |

### Next.js 설정 방향

```js
// next.config.js
{
  output: 'export',        // 정적 HTML 내보내기 (서버 불필요)
  images: { unoptimized: true }   // Image Optimization은 서버 필요 → 끔
}
```

**주의점** — `output: 'export'` 사용 시 못 쓰는 기능:
- Route Handlers (API 라우트) — 어차피 백엔드 안 씀
- `next/image` 최적화 — 직접 제작 아이콘을 미리 최적화해서 넣을 것
- ISR / 동적 `revalidate` — 데이터가 빌드 시점에 고정이라 불필요
- Middleware — 불필요

**렌더링 전략**
- 도감 페이지: Server Component. `generateStaticParams`로 빌드 시 전 페이지 생성
- 계산기 페이지: 껍데기는 Server Component, 계산 UI만 `'use client'` 분리
- 목표: 도감 페이지에 계산기 JS가 딸려가지 않게 컴포넌트 경계 관리

### Astro를 안 쓴 이유
도감 페이지를 JS 0KB로 낼 수 있어 이론상 유리하나, Next.js 레퍼런스가 많고 익숙한 쪽을 택함.
Server / Client Component 경계만 잘 나누면 실사용 성능 차이는 크지 않음.

---

## 3. 폴더 구조 (예정)

```
valheim-calc/
├── data/                        게임 데이터 원본 (JSON)
├── docs/                        문서
├── public/
│   └── images/                  직접 제작한 아이콘 (원본 에셋 아님)
├── src/
│   ├── app/                     App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx             홈
│   │   ├── about/page.tsx
│   │   ├── calc/
│   │   │   ├── build/page.tsx
│   │   │   ├── food/page.tsx
│   │   │   └── drop/page.tsx
│   │   └── db/
│   │       ├── items/page.tsx
│   │       ├── items/[slug]/page.tsx      generateStaticParams
│   │       ├── creatures/page.tsx
│   │       ├── creatures/[slug]/page.tsx
│   │       ├── bosses/page.tsx
│   │       └── bosses/[slug]/page.tsx
│   ├── components/
│   │   ├── calc/                계산기 UI ('use client')
│   │   └── ui/                  공용 UI (Server Component 기본)
│   ├── lib/
│   │   ├── types.ts             데이터 타입 정의
│   │   ├── data.ts              JSON 로드 + 정규화
│   │   ├── slug.ts              name_en ↔ URL slug 변환
│   │   ├── recipe.ts            재귀 재료 전개 로직
│   │   ├── food.ts              음식 조합 최적화 로직
│   │   └── probability.ts       드롭률 계산 로직
│   └── styles/
├── next.config.js
└── tsconfig.json
```

**`lib/` 로직은 순수 함수로.** UI와 분리해두면 테스트도 쉽고, 나중에 백엔드 붙일 때 재사용 가능.

---

## 4. 데이터 흐름

```
data/*.json
    │
    │ 빌드타임 import
    ▼
src/lib/data.ts  ──  타입 검증 + 정규화
    │
    ├─▶ 도감 페이지 (Server Component)
    │     generateStaticParams로 빌드 시 전 페이지 HTML 생성
    │     클라이언트로 데이터 안 넘어감
    │
    └─▶ 계산기 ('use client')
          필요한 데이터만 props로 주입 → 브라우저에서 계산
```

**데이터 주입 원칙**: 계산기에 JSON 전체를 넘기지 말 것.
음식 계산기엔 `food[]`만, 드롭률 계산기엔 `creatures[]` + `drop_tables[]`만.
안 그러면 번들에 140KB 통째로 실림.

**게임 패치 대응 흐름**
```
게임 업데이트 → data/*.json 수정 → git push → Cloudflare Pages 자동 빌드·배포
```

DB 마이그레이션도, 서버 재시작도 없음. 이게 정적 구조의 실질적 이점.

---

## 5. 성능 목표

| 지표 | 목표 | 근거 |
|---|---|---|
| LCP | < 1.5s | 광고 수익형 = 이탈률이 매출 직결 |
| 도감 페이지 JS | 최소 (React 런타임만) | Server Component로 데이터 전달 차단 |
| 계산기 페이지 JS | < 150KB | 해당 계산기용 데이터만 주입 |
| Lighthouse SEO | 100 | 검색 유입이 유일한 트래픽 소스 |

---

## 6. 확정 안 된 것

1. 도메인 이름
2. 광고 배치 위치 (애드센스 승인 후 결정)
3. 다국어 확장 여부 (한국어 우선, 영어는 나중에 고려)
4. UI 라이브러리 도입 여부 (Tailwind만으로 갈지, shadcn/ui 등 얹을지)
