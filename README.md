# valheim-calc

발헤임(Valheim) 한국어 계산기 · 데이터베이스 사이트.

> ⚠️ 비공식 팬 프로젝트. Iron Gate AB / Coffee Stain Publishing과 무관.

---

## 왜 만드나

- 영어권에는 발헤임 계산기가 이미 여럿 있음 (valheim.tools, Valculator 등) — 포화
- **한국어권에는 인터랙티브 계산기가 전무.** 나무위키 텍스트 공략만 존재
- 언어 장벽이 그대로 진입장벽 역할 → 한국어 시장은 사실상 블루오션

**타이밍**: 2026년 9월 9일 Valheim 1.0 정식 출시 + 신규 바이옴 Deep North.
PS5 / Switch 2 동시 출시로 신규 유저 유입 예상. 그 전에 MVP 완성이 목표.

---

## 핵심 기능

| 계산기 | 설명 | 경쟁 상황 |
|---|---|---|
| 제작·건축 자원 계산기 | 만들 것 담으면 총 재료 역산 | 검색 수요 1위 |
| 음식 조합 최적화 | 3슬롯 조합별 체력/스태미나/에이트르 | 검색 수요 2위 |
| 드롭률 확률 시뮬레이터 | "N마리 잡으면 나올 확률" 계산 | 영어권에도 없음 |
| 포탈 반입 체크 | 포탈 통과 가능/불가 자동 분류 | 공백 |
| 길들이기·번식 계산기 | 별등급 유전, 번식 계획 | 공백 |
| 멀티 난이도 계산기 | 인원수별 보스 실효 체력 | 공백 |

전체 목록과 우선순위는 [docs/ROADMAP.md](docs/ROADMAP.md) 참고.

---

## 기술 스택

**Next.js (App Router) + 정적 내보내기. 백엔드·DB 없음.**

| 레이어 | 선택 |
|---|---|
| 프레임워크 | Next.js App Router (`output: 'export'`) |
| 언어 | TypeScript |
| 스타일 | Tailwind CSS |
| 호스팅 | Cloudflare Pages |
| 데이터 | 리포 내 JSON (빌드 시 번들) |

- 데이터 전체 140KB (gzip 18.5KB) → 서버 없이 브라우저에서 계산
- 호스팅 비용 $0, 콜드스타트 없음, SEO 완벽

자세한 근거와 구조는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) 참고.

---

## 폴더 구조

```
valheim-calc/
├── README.md
├── data/                    게임 데이터 (JSON)
│   ├── items.json           아이템 74 · 레시피 49 · 건축 12 · 포탈제한 14
│   ├── creatures.json       몬스터 27 · 보스 7 · 드롭테이블 55 · 길들이기 5
│   └── food-biomes.json     음식 19 · 미드 16 · 바이옴 9 · 배 4 · 마법 5
└── docs/
    ├── ARCHITECTURE.md      기술 스택 · 폴더 구조 · 데이터 흐름
    ├── FEATURES.md          페이지별 기능 명세 (사이트맵 포함)
    ├── DATA-SCHEMA.md       JSON 스키마 정의 · 결측 데이터 목록
    ├── ROADMAP.md           Phase별 개발 계획
    ├── LEGAL.md             저작권 준수 체크리스트 (필독)
    ├── research-2026.md     사전 조사 보고서 (정책 · 경쟁 · 기능)
    ├── hosting-research-2026.md         호스팅 플랫폼 비교 조사
    ├── data-collection-report-2026.md   데이터 출처 18곳 · 수집 방법 · 품질 평가
    └── korean-localization-report-2026.md  한글 번역 방법론 · 용어 선택 근거
```

---

## 데이터 현황

| 파일 | 항목 수 | 한글명 | 이미지 URL |
|---|---|---|---|
| items.json | 74 | 100% | 67 (91%) |
| creatures.json | 34 | 100% | 34 (100%) |
| food-biomes.json | 53 | 100% | 47 (89%) |
| **합계** | **161** | **100%** | **148 (92%)** |

**이미지는 원본 URL만 보유. 파일 다운로드·재배포 안 함.**
실제 서비스 시 직접 제작 아이콘으로 대체 필요 — [docs/LEGAL.md](docs/LEGAL.md) 참고.

### 알려진 데이터 문제

| 문제 | 영향 |
|---|---|
| 아이템 무게 74개 전부 `null` | 포탈 계산기 · 배 적재량 계산 불가 |
| `items[]` 에 소비재·전리품 누락 | 드롭 아이템 75%, 음식 재료 94%가 영문으로 표시 |
| `magic[].eitr_cost` 가 서술 텍스트 | 마법 빌드 계산기 구현 불가 |
| 멀티 스케일링 · 바람 공식 없음 | 해당 계산기 구현 불가 |

전체 목록과 실측치는 [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) 참고.
링크는 `EntityRef` 가 존재 여부를 판정하므로 404는 발생하지 않는다.

---

## 현재 상태

**도감 6종 구현 완료. 계산기 미착수.**

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # out/ 에 정적 파일 생성
```

### 완료

| 항목 | 내용 |
|---|---|
| 데이터 레이어 | `src/lib/` — 타입 · 정규화 · slug · 자유 텍스트 파서 |
| 디자인 시스템 | 바이옴 색 = 난이도 티어. 토큰 기반 |
| 도감 | 아이템 74 · 몬스터 27 · 보스 7 · 음식 19 · 미드 16 · 바이옴 9 |
| `/about` | 애드센스 심사 필수 고지 |
| 정적 페이지 | **162개**, 내부 링크 447개 전부 유효 |

### 남은 것

- 계산기 6종 (`/calc/*`) — 착수 순서는 [docs/ROADMAP.md](docs/ROADMAP.md#착수-순서-확정)
- 개인정보처리방침 (애드센스 요구. 도메인·연락처 확정 후)
- 아이콘 직접 제작 ([docs/LEGAL.md](docs/LEGAL.md))
- 도메인 이름 · Cloudflare Pages 연결

### 문서

| 문서 | 용도 |
|---|---|
| [docs/DEV-CONVENTIONS.md](docs/DEV-CONVENTIONS.md) | 개발 규약 — 코드 건드리기 전 필독 |
| [docs/entities/](docs/entities/) | 엔티티별 데이터 함정 · 파일 위치 |
| [docs/DATA-SCHEMA.md](docs/DATA-SCHEMA.md) | JSON 스키마 · 결측 · 참조 무결성 |

`.claude/skills/entity-*` 에 엔티티별 스킬이 있다. `/entity-items` 처럼 호출하면
해당 엔티티의 규약과 함정이 한 번에 로드된다.
