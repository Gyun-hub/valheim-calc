# 웹 호스팅 스택 조사 보고서

> 조사일: 2026-07-29
> 범위: 프론트엔드 호스팅 / 백엔드 API 호스팅 / 관리형 DB
> 기준: 무료 티어 실효성, 국내(서울) 리전 유무, 요금 폭탄 위험

---

## 목차

1. [핵심 요약](#1-핵심-요약)
2. [추천 스택 3안](#2-추천-스택-3안)
3. [프론트엔드 호스팅](#3-프론트엔드-호스팅)
4. [백엔드 API 호스팅](#4-백엔드-api-호스팅)
5. [관리형 DB](#5-관리형-db)
6. [무료 티어 함정 총정리](#6-무료-티어-함정-총정리)
7. [요금 폭탄 위험도](#7-요금-폭탄-위험도)
8. [출처](#8-출처)

---

## 1. 핵심 요약

### 선택 기준 3개

| 기준 | 설명 |
|---|---|
| **서울 리전/엣지** | 국내 사용자 대상이면 최우선. 싱가포르 경유는 체감 지연 차이 큼 |
| **무료 티어 함정** | 대부분 조건 붙음 — 슬립, pause, 만료, 상업이용 금지 |
| **요금 폭탄 위험** | 종량제 서비스 중 사용량 상한 설정 불가한 곳 있음 (실제 $23,000 청구 사례) |

### 서울 리전 지원 현황

| 계층 | 서울 지원 O | 서울 지원 X (아시아 대체) |
|---|---|---|
| 프론트 | Vercel (ICN1), AWS Amplify / CloudFront | Cloudflare Pages (무료는 Enterprise만), Render, Netlify |
| API | Cloud Run (asia-northeast3), AWS Lambda (ap-northeast-2), Oracle VM, Cloudflare Workers | Railway·Render·Zeabur (싱가포르), Fly.io (도쿄) |
| DB | Supabase, Turso (icn1), Upstash, MongoDB Atlas, RDS, Cloud SQL | Neon·Railway·Render (싱가포르) |

> **주의**: Cloudflare는 조사 결과가 갈렸다. Pages 무료 플랜은 서울 엣지 미보장(Enterprise 전용)이라는 자료와, Workers는 서울 PoP 있다는 자료가 공존. 실사용 전 본인 회선에서 지연 측정 권장.

### 2026년 기준 무료 티어 폐지/축소된 곳

- **Heroku** — 2022년 무료 폐지, 현재도 없음
- **Fly.io** — 2024년 무료 티어 사실상 폐지 (트라이얼만)
- **PlanetScale** — 2024년 4월 Hobby 무료 폐지
- **Koyeb** — 2026년 2월 Mistral AI 인수 후 신규 무료 가입 중단
- **AWS App Runner** — 2026년 4월 30일 신규 가입 중단
- **Oracle Always Free** — 2026년 6월 ARM 스펙 반토막 (4 OCPU/24GB → 2 OCPU/12GB)
- **Netlify** — 2025년 9월 이후 신규 계정은 크레딧제 전환, 대역폭 단가 2배 인상
- **Render** — 2026년 4월 유료 플랜 대역폭 대폭 축소 (Pro 500GB → 25GB)

---

## 2. 추천 스택 3안

### A안 — 완전 무료, 국내 지연 최소

```
프론트   GitHub Pages 또는 Cloudflare Pages    $0
API      Cloudflare Workers (10만 req/일)      $0
DB       Turso (5GB, 서울 icn1, 만료 없음)     $0
캐시     Upstash Redis (256MB, 서울)           $0
────────────────────────────────────────────────
합계                                           $0/월
```

**장점**: pause·슬립·만료 전부 없음. 서울 리전. 카드 등록 불필요.
**한계**: Workers CPU 10ms/요청 제한 — 무거운 연산 불가. Node.js API 일부만 호환(`nodejs_compat` 필요). SSR 쓰려면 Workers Static Assets 학습 필요.

---

### B안 — 실전 서비스, 저비용

```
프론트   Vercel Hobby(개인) 또는 Cloudflare Pages   $0
API      Cloudflare Workers Paid                    $5/월
DB       Supabase Pro (서울, 백업 7일, pause 없음)  $25/월
────────────────────────────────────────────────────
합계                                                $30/월
```

**장점**: 상업 서비스 가능. Auth·Storage·Realtime 번들. 서울 리전.
**팁**: Supabase 무료로 시작 → 트래픽 붙으면 Pro 전환. 단 무료는 1주 비활성 시 pause되니 주의.

---

### C안 — 개발 편의 최우선 (Next.js 풀스택)

```
프론트+API   Vercel Pro (Next.js 네이티브, ICN1 서울)   $20/유저/월
DB           Supabase 또는 Neon                          $0~25/월
──────────────────────────────────────────────────────────
합계                                                     $20~45/월
```

**장점**: 설정 거의 없음. SSR/ISR/Edge 자동 처리. 배포 속도 압도적.
**필수 조치**: Vercel은 사용량 상한 설정이 불가하다. 반드시 사용량 알림(usage alert) 설정할 것 — DDoS나 트래픽 폭주 시 요금 폭탄 사례 다수 보고됨.

---

### 특수 케이스

| 상황 | 추천 |
|---|---|
| 돈 0원 + 상시 서버 필요 (WebSocket, 크론, 무거운 연산) | **Oracle Cloud Always Free** — 서울/춘천 리전, VM, 슬립 없음, 영구 무료. 단 서버 운영 직접 + ARM 인스턴스 생성 실패 잦음 |
| 트래픽 폭증 예상 정적 사이트 | **Cloudflare Pages** — 대역폭 무제한 |
| 모바일 앱 동반 | **Firebase** — Auth+Firestore+Hosting 통합. Blaze 전환 시 예산 알림 필수 |
| 국내 법인/스타트업 | **NHN Cloud / 네이버클라우드** 크레딧 프로그램 (심사형, 1000만원 규모) |
| 오픈소스 문서/포트폴리오 | **GitHub Pages** — 설정 최소, 완전 무료 |

---

## 3. 프론트엔드 호스팅

### 비교표

| 서비스 | 무료 대역폭 | 무료 빌드 | 상업 이용 | SSR | 서울 엣지(무료) | 첫 유료가 | 배포 방식 |
|---|---|---|---|---|---|---|---|
| Vercel | 100GB/월 | 무제한(큐 지연) | **불가** | 최상 | O (ICN1) | $20/월 | Git / CLI |
| Netlify | 크레딧제(구 100GB) | 300분(구계정) | 가능 | 양호(함수 기반) | O | $9/월 | Git / CLI / D&D |
| Cloudflare Pages | **무제한** | 500회/월 | 가능 | 양호(Workers 결합) | **X (Enterprise만)** | $20/월 | Git / CLI / D&D |
| GitHub Pages | ~100GB(소프트) | — | 가능 | **불가** | 보통(Fastly) | 없음 | Git push만 |
| Firebase Hosting | **360MB/일** | — | 가능 | App Hosting 별도 | 양호 | 종량제(Blaze) | CLI |
| AWS Amplify | 15GB/월 (12개월만) | 1000분(12개월) | 가능 | 최상 | O | 종량제 | Git / CLI |
| S3 + CloudFront | **1TB/월 (영구)** | 직접 구성 | 가능 | 별도 구성 필요 | O | 종량제 | 직접 구성 |
| Render | 무제한(공용 풀) | — | 가능 | Web Service 별도 | 불명확 | $7/월 | Git |
| Surge.sh | 사실상 무제한 | — | 가능 | 불가 | 불명확 | $30/월 | CLI만 |
| Deno Deploy | 20GB/월 | — | 가능 | 양호(Deno 중심) | 불명확 | $20/월 | Git / CLI |

### 주요 서비스 상세

#### Vercel
- **무료**: 전송 100GB/월, Edge 요청 100만/월, Function 호출 100만/월, Active CPU 4시간/월. 커스텀 도메인 무제한 + SSL
- **유료**: Pro $20/유저/월 — $20 사용량 크레딧 포함, 빌드 큐 없음, 팀 협업
- **SSR**: Next.js 자사 프레임워크. SSR/ISR/Edge 네이티브 지원 1등
- **서울**: ICN1 리전 정식 보유, 전 플랜 공통
- **함정**: Hobby는 **비상업적 전용**. Hobby는 한도 초과 시 정지(폭탄 없음)지만, Pro부터 종량 과금 전환되어 폭탄 가능
- **추천**: Next.js SaaS/랜딩, DX 최우선

#### Cloudflare Pages / Workers
- **무료**: **대역폭 무제한**(최대 강점). 빌드 500회/월(하루 ~16회), 타임아웃 20분, 프로젝트 100개
- **유료**: Pro $20/월(연간 결제 시) / $25(월간)
- **방향성**: Cloudflare는 Pages를 Workers(Static Assets)로 점진 통합 중. 신규 프로젝트는 공식적으로 **Workers 권장**
- **함정**: 무료/Pro 플랜은 서울 엣지 미보장 → 일본/홍콩/싱가포르 우회 라우팅 가능. 빌드 하루 16회 제한은 활발한 CI/CD에 부족할 수 있음
- **추천**: 트래픽 큰 정적 사이트, 대역폭 걱정 없이 무료로 오래

#### Netlify
- **무료**: 2025년 9월 이후 신규 계정은 크레딧제(월 300크레딧, 대역폭·빌드·함수 통합 소모). 레거시 계정은 대역폭 100GB + 빌드 300분 유지
- **유료**: Personal $9/월 — 크레딧 1,000개, 비밀정보 탐지
- **SSR**: Next.js Runtime 자체 어댑터. 서버리스 함수 기반이라 Vercel 대비 콜드스타트 있고 **WebSocket 미지원**
- **강점**: 드래그앤드롭 배포
- **함정**: 크레딧제 개편 후 대역폭 단가 20크레딧/GB로 2배 인상, 요금 예측 어려움

#### GitHub Pages
- **무료**: 대역폭 100GB/월(소프트 한도), 저장소 1GB, 빌드 시간당 10회 권장. 커스텀 도메인 + SSL 무료
- **제약**: 순수 정적만. **SSR 전혀 불가**. Git push 외 배포 수단 없음
- **함정**: 소프트 한도 초과 시 예고 없이 스로틀링/차단 가능. 비공개 리포는 유료 플랜 필요
- **추천**: 오픈소스 문서, 포트폴리오, 완전 정적 SPA

#### Firebase Hosting
- **무료(Spark)**: 저장 10GB, **전송 360MB/일** — 매우 작음
- **유료**: Blaze 종량제 — 저장 $0.026/GB, 전송 $0.15/GB
- **SSR**: 별도 상품 **Firebase App Hosting**(Cloud Run 기반). 결제수단 등록 필수, 아웃바운드 10GiB/월 무료
- **함정**: 일일 360MB 한도가 매우 작음. App Hosting은 Cloud Run/Cloud Build 요금이 별도로 붙어 예측 어려움

#### AWS Amplify / S3+CloudFront
- **Amplify 무료**: 신규 계정 **12개월간만** — 빌드 1,000분/월, 저장 5GB, 전송 15GB/월, SSR 요청 50만/월
- **Amplify 유료**: 정액 없이 바로 종량제 (빌드 $0.01/분, 전송 $0.15/GB)
- **S3+CloudFront**: CloudFront 아웃바운드 **1TB/월 영구 무료**(계정 나이 무관). 장기적으로 Amplify보다 저렴. 단 Git 연동 자동화 없음, CI/CD 직접 구축
- **서울**: CloudFront 서울 엣지 로케이션 보유, 체감 속도 좋음
- **함정**: Amplify 무료는 12개월 한정 → 이후 자동 과금 시작

#### 기타
- **Render**: 정적 사이트 완전 무료·무제한, 슬립 없음. SSR은 Web Service로 별도 배포. 미국/유럽 중심이라 국내 지연 불리
- **Surge.sh**: CLI 전용, 커스텀 도메인 무료. SLA 약함 → 데모/학습용
- **Deno Deploy**: 요청 100만/월, 아웃바운드 20GB, 카드 불필요, **상업 이용 허용**. Deno/Fresh 생태계 중심

#### 국내 서비스
카페24·가비아·NHN 등은 VPS/웹호스팅 중심으로, Vercel류의 "Git 연동 자동배포 + 무료 정적 호스팅" 개념 서비스가 **사실상 없다**. 네이버클라우드도 Object Storage + CDN 직접 조합 방식. 국내 개발자도 실무에선 글로벌 서비스를 그대로 쓰고 CDN만 국내로 보완하는 경우가 많음.

---

## 4. 백엔드 API 호스팅

### 비교표

| 서비스 | 무료 상시 가능? | 슬립 정책 | 콜드스타트 | 유료 최저가 | 한국/아시아 | 핵심 함정 |
|---|---|---|---|---|---|---|
| **Cloudflare Workers** | O | **없음** | <5ms | $5/월 | **서울 PoP** | CPU 10ms 제한, Node API 일부만 |
| **Cloud Run** | O | scale-to-zero | 0.3~1초 (Java는 5~15초) | 종량제 | **서울 정식** | 상시 실행 시 과금, 설정 복잡 |
| **AWS Lambda** | O | 서버리스 | 100~800ms | 종량제 | **서울 정식** | API Gateway 별도 과금, 러닝커브 |
| **Oracle Always Free** | **O (진짜)** | 없음 (VM) | 없음 | 무료 | **서울/춘천** | 용량 부족, 정책 축소 전례 |
| Vercel Functions | O (Hobby, 개인용) | 서버리스 | 수백ms~1초 | $20/유저/월 | 리전 선택형 | **상업 금지**, 요금 폭탄 사례 |
| Deno Deploy | O (제한적) | 거의 없음 | 낮음 | $20/월 | 불명확 | 생태계 작음 |
| Railway | X (트라이얼만) | 기본 안 잠듦 | 옵션 시만 | $5/월 | 싱가포르 | 종량제 예측 어려움 |
| Render | X | **15분 후 슬립** | 30~60초 | $7/월 | 싱가포르 | 무료 DB 30일 만료 |
| Fly.io | X (무료 폐지) | 설정형 | 수초~수백ms | ~$1.94/월 | 도쿄 | Docker 필수 |
| Zeabur | X (무료는 슬립) | auto-sleep | 발생 | $5/월 | 싱가포르 | 신생, 검증 사례 적음 |
| Supabase Edge Fn | O (Edge만) | DB는 1주 후 정지 | 낮음 | $25/월 | 도쿄(서울 불명) | BaaS 묶음 |
| Koyeb | X (강제 슬립) | 1시간 후 강제 | 발생 | 불명확 | 없음 | **신규 무료 중단** |
| Heroku | X | 30분 후 (Eco) | 발생 | $5~7/월 | **없음** | 아시아 리전 부재 |
| AWS App Runner | — | — | — | — | — | **신규 가입 중단(2026.4)** |

### 주요 서비스 상세

#### Cloudflare Workers
- **무료**: 10만 요청/일, CPU 10ms/요청, 메모리 128MB. KV 1GB, D1 5GB 부가 한도
- **유료**: $5/월 — 1000만 요청 포함, 초과 $0.50/백만. CPU 시간 최대 5분까지 상향
- **콜드스타트**: V8 isolate라 사실상 없음 (<5ms), 전 세계 300+ PoP 동일 수준
- **런타임**: JS/TS, Rust/C++(WASM), Python(베타)
- **함정**: 장시간/무거운 연산 부적합. 파일시스템 없음. Node.js API 일부만 호환. 진짜 REST 서버 대체하려면 KV/D1/Durable Objects 학습 필요
- **추천**: 초저지연 경량 API, 글로벌 엣지 서비스

#### Google Cloud Run
- **무료**: 요청 200만/월, 메모리 36만 GB-초, vCPU 18만 vCPU-초 — **영구 무료, 만료 없음**
- **유료**: 종량제, 무료 한도 초과분만 청구
- **콜드스타트**: 기본 scale-to-zero. 300ms~1초, Java는 최적화 없이 5~15초. `min-instances=1`로 상시 유지 가능(그만큼 과금)
- **런타임**: 모든 언어 / Docker 컨테이너
- **서울**: **asia-northeast3 정식 지원**
- **추천**: 한국 리전 필수 프로덕션 API, 트래픽 변동 큰 서비스

#### AWS Lambda
- **무료**: 요청 100만/월 + 40만 GB-초 — **영구 무료, 만료 없음**
- **유료**: $0.20/백만 요청 + $0.0000166667/GB-초 (ARM은 ~20% 저렴)
- **콜드스타트**: Node 200~800ms, Python 200~400ms, Go/Rust <100ms, Java(Spring) 5~15초. SnapStart 적용 시 90~140ms까지 단축(서울 리전 2025.6부터 지원)
- **서울**: **ap-northeast-2 정식 지원**, 최신 기능도 반영
- **함정**: API Gateway 별도 과금 + 지연 추가. VPC 연결 시 콜드스타트 증가. 설정 복잡

#### Oracle Cloud Always Free
- **무료**: ARM Ampere A1 2 OCPU/12GB (2026.6 기준, 기존 4/24에서 축소) + AMD 마이크로 인스턴스 2개. **영구 무료**(카드 등록 필요, 과금 없음)
- **슬립**: 없음. VM이라 직접 끄기 전까지 상시 실행
- **서울**: **서울/춘천 리전 보유** — 국내 지연 최저
- **함정**: ARM 용량 부족으로 인스턴스 생성 실패 빈번. 서버 운영(패치/보안) 직접. 예고 없이 무료 정책 축소된 전례
- **추천**: 완전 무료 상시 운영, 서버 운영 경험 있는 개발자

#### Vercel Serverless / Edge Functions
- **무료(Hobby)**: 함수 호출 100만/월, Edge 요청 100만/월, 전송 100GB, Active CPU 4시간, 최대 실행 300초
- **함정**: **Hobby 상업 이용 금지**. **사용량 상한 설정 불가** → DDoS/트래픽 폭주로 $23,000, $1,100 청구 등 실제 사례 다수. Hobby는 한도 초과 시 배포 정지(폭탄 없음)지만 Pro는 종량 과금

#### 기타
- **Railway**: 신규 $5 트라이얼(30일). Hobby $5/월부터 상시 실행. 싱가포르 리전. 완전 종량제라 예측 어려움
- **Render**: 무료 웹서비스 15분 후 슬립(첫 요청 30~60초). Starter $7/월부터 상시. 싱가포르
- **Fly.io**: 무료 폐지. 최소 인스턴스 상시 가동 시 ~$1.94/월. **도쿄(nrt) 리전**이라 국내 지연 낮음. Docker 필수
- **Deno Deploy**: 요청 100만/월, 이그레스 20GB, 앱 20개. Pro $20/월
- **Supabase Edge Functions**: 호출 50만/월. Deno 기반. 무료 프로젝트는 1주 비활성 시 DB pause 주의
- **Zeabur**: 아시아권 Railway 대안. Dev $5/월, Pro $19/월. 싱가포르 기반

#### 국내 클라우드
네이버클라우드 / NHN Cloud는 개인 무료 티어가 아니라 **법인·스타트업 대상 심사형 크레딧 프로그램**. NHN Cloud는 2026년 스타트업 지원으로 즉시 1000만원 크레딧(모집 6/22~7/12 마감). 국내 리전이라 지연 최소지만 개인 사이드프로젝트엔 부적합.

---

## 5. 관리형 DB

### 비교표

| 서비스 | 무료 스토리지 | 비활성 시 정책 | 유료 시작가 | 과금 모델 | 서버리스 궁합 | 한국/아시아 |
|---|---|---|---|---|---|---|
| **Turso** | 5GB | **없음 (만료 X)** | $4.99/월 | 정액+오버리지 | 매우 좋음 | **도쿄/서울** |
| **Supabase** | 500MB | 1주 후 pause | $25/월 | 정액+종량 | 좋음 (HTTP API) | **서울**/도쿄/싱가포르 |
| **Upstash Redis** | 256MB | 한도 초과 시 거부 | $10/월(정액 옵션) | 종량/정액 선택 | **최고 (HTTP)** | **서울**/도쿄/싱가포르 |
| Neon | 0.5GB | 5분 후 suspend | 사용량 기반 | **완전 종량** | 매우 좋음 (HTTP) | 싱가포르만 |
| Cloudflare D1 | 5GB | 일일 한도 리셋 | $5/월 (Workers) | 정액+종량 | 최고 (네이티브) | 엣지 전역 |
| Aiven | 1GB | 비활성 시 전원 OFF | $5/월 | 정액 | 보통 | 서울/도쿄/싱가포르(OCI) |
| Render Postgres | 1GB | **30일 후 삭제** | $6/월 | 정액 | 보통 | 싱가포르 |
| Railway Postgres | 없음 ($5 1회) | 크레딧 소진 시 정지 | $5/월 | 완전 종량 | 보통 | 싱가포르 |
| PlanetScale | **없음** | — | $5/월 | 정액+row 종량 | 좋음 | 제한적 |
| AWS RDS | 20GB (12개월) | 종료 시 즉시 과금 | ~$0.017/hr | 정액+종량 | 나쁨 (Proxy 필요) | **서울** |
| Cloud SQL | 없음 (체험만) | 체험 종료 시 과금 | ~$10/월 | 정액+종량 | 나쁨 (Proxy 필요) | **서울** |
| MongoDB Atlas | 512MB | 30일 후 pause | $9/월 | 정액 | 보통 | **서울** |
| Firestore | 1GB | 일일 한도만 | 종량제 | **완전 종량** | 최고 | **서울** |
| Cloudflare R2 | 10GB | 없음 | 종량제 | 종량 (egress 무료) | 최고 | 엣지 전역 |

### 관계형(SQL) 상세

#### Turso / libSQL (SQLite)
- **무료**: 스토리지 5GB, DB 100개, row read 5억/월. **카드 불필요, 만료 없음**
- **유료**: Developer $4.99/월, Scaler $24.92/월
- **연결**: libSQL HTTP/WS 네이티브. 임베디드 리플리카로 로컬급 읽기 속도
- **리전**: **도쿄(hnd1), 서울(icn1) 둘 다 지원** — 아시아 지연 최상급
- **함정**: 5GB를 DB 여러 개가 공유. 백업/PITR은 유료 전용 가능성
- **추천**: 엣지 저지연, 멀티테넌트(고객별 DB 다수)

#### Supabase (PostgreSQL)
- **무료**: DB 500MB, 스토리지 1GB, egress 5GB, MAU 5만, Edge Function 50만 회, 프로젝트 2개
- **유료**: Pro $25/월 — 디스크 8GB, egress 250GB, 백업 7일, pause 없음, 직접연결 60 / 풀러 200
- **연결**: PgBouncer 내장 풀링. PostgREST 기반 REST API + GraphQL
- **리전**: **서울(ap-northeast-2)**, 도쿄, 싱가포르
- **부가**: Auth, Storage, Realtime, Edge Functions, 대시보드
- **함정**: 무료는 **1주 비활성 시 자동 pause**(데이터 유지, 수동 재개). 백업 없음, SLA 없음
- **추천**: Firebase 대체제, Postgres+Auth+Storage 한 번에

#### Neon (PostgreSQL, serverless)
- **무료**: 스토리지 0.5GB, 컴퓨트 100 CU-hour/월, 오토스케일 최대 2CU, scale-to-zero
- **유료**: 완전 사용량 기반 — 컴퓨트 $0.106/CU-hour, 스토리지 $0.35/GB-월, 최소 과금 없음
- **연결**: 자체 풀러 + HTTP 드라이버(`@neondatabase/serverless`) → 서버리스/엣지 최적
- **리전**: 싱가포르만. **서울·도쿄 없음**
- **특징**: Git 같은 DB 브랜칭 — CI/CD에 강력
- **함정**: 5분 유휴 시 컴퓨트 suspend(콜드스타트). 완전 종량제라 트래픽 급증 시 청구 급증

#### Cloudflare D1 (SQLite, edge)
- **무료**: 스토리지 5GB, 읽기 500만 행/일, 쓰기 10만 행/일 (일일 리셋)
- **유료**: Workers Paid $5/월 — 읽기 250억 행, 쓰기 5천만 행. 초과 read $0.001/백만, write $1/백만
- **연결**: Workers 바인딩 네이티브 RPC (드라이버 불필요)
- **함정**: 일일 한도 초과 시 즉시 쿼리 실패. Workers 생태계 종속(단독 사용 불가). 프라이머리 리전 기본값 us-east-1
- **추천**: 이미 Cloudflare Workers로 개발 중인 초경량 프로젝트

#### PlanetScale (MySQL/Postgres)
- **무료**: **없음** (2024년 4월 폐지, 미부활). 카드 등록 필수
- **유료**: MySQL 단일노드 $5/월, HA(3노드) $15/월. Scaler $39/월
- **연결**: Vitess 기반 커넥션 풀링 내장 — 대량 커넥션에 강함
- **특징**: 스키마 브랜칭, 무중단 마이그레이션
- **함정**: row read/write 종량 혼합 → 고트래픽 시 폭탄 위험

#### 기타 SQL
- **Aiven**: 무료 1GB/1GB RAM/1 vCPU, 카드 불필요, **무료도 자동 백업 포함**. Developer $5/월. 비활성 시 전원 OFF. PG 외 Kafka/OpenSearch/Valkey 등 다수 제품
- **Render Postgres**: 무료 1GB지만 **생성 후 30일 만료**, grace 14일 후 데이터 삭제 → 사실상 임시 DB. Basic $6/월
- **Railway Postgres**: 사실상 무료 없음($5 1회성). 완전 종량제
- **AWS RDS**: 프리티어 db.t3.micro 750시간/월 + 20GB, **12개월 한정**(2025.7.15 이후 신규 계정은 $200 크레딧 최대 6개월). 서울 리전. 서버리스 궁합 나쁨(RDS Proxy 별도 유료 필요)
- **Cloud SQL**: **상시 무료 티어 없음**. 30일 체험 + $300 크레딧. 최소 인스턴스 월 $10~15

### NoSQL / 기타 상세

#### MongoDB Atlas
- **무료**: M0 클러스터 512MB, 최대 100 op/sec, 프로젝트당 1개
- **유료**: M2/M5 공유 $9~25/월, M10 전용 $57/월
- **리전**: 70+ 리전, **서울 포함** — free tier도 대부분 선택 가능
- **부가**: Atlas Search, **Vector Search**, Charts, 트리거 — AI 워크로드 결합 강점
- **함정**: 30일 비활성 시 pause(7일 전 이메일 경고), 백업 미제공, 단일 리전만

#### Firebase Firestore
- **무료(Spark)**: 읽기 5만/일, 쓰기·삭제 각 2만/일, 스토리지 1GB, Functions 200만 회/월
- **유료(Blaze)**: 읽기 $0.06/10만, 쓰기 $0.18/10만, 삭제 $0.02/10만
- **연결**: 네이티브 HTTP/gRPC SDK, 커넥션 개념 없음. 클라이언트 직접 접근(보안 규칙 기반)
- **리전**: **서울(asia-northeast3)** 포함
- **함정**: 일일 한도라 트래픽 몰리면 그날 서비스 중단. **Blaze 전환 시 무한 과금 위험** — 버그/악성 트래픽 요금 폭탄 사례 다수

#### Upstash Redis
- **무료**: 256MB, 월 50만 커맨드, 카드 불필요
- **유료**: 종량 $0.2/10만 커맨드 + $0.25/GB / 정액 $10/월(250MB)~
- **연결**: **REST/HTTP API 네이티브**(커넥션 개념 없음) + 일반 Redis 프로토콜
- **리전**: **서울**/도쿄/싱가포르
- **부가**: QStash(메시지큐), Vector DB
- **추천**: 서버리스 캐싱/세션/레이트리미팅

#### Cloudflare KV / R2
- **KV 무료**: 읽기 10만/일, 쓰기·삭제·리스트 각 1천/일, 저장 1GB
- **R2 무료**: 저장 10GB, Class A(쓰기) 100만/월, Class B(읽기) 1000만/월. **egress 무료**가 최대 장점
- **함정**: KV는 **최종 일관성** → DB 대체 부적합(캐시/설정용). 일일 한도 작음. KV 쓰기 단가 높음
- **추천**: 정적 자산/이미지(R2), 세션/설정/캐시(KV)

---

## 6. 무료 티어 함정 총정리

| 서비스 | 함정 |
|---|---|
| **Vercel Hobby** | 상업적 이용 금지. 수익 발생 시 Pro $20 강제. 사용량 상한 설정 불가 |
| **Cloudflare Pages 무료** | 빌드 500회/월, 서울 엣지 미보장(Enterprise 전용) |
| **Render 무료** | 웹서비스 15분 후 슬립(첫 요청 30~60초), 무료 DB 30일 후 삭제 |
| **Supabase 무료** | 1주 비활성 시 DB pause, 백업 없음, SLA 없음 |
| **Neon 무료** | 5분 유휴 시 컴퓨트 suspend, 서울 리전 없음 |
| **Firebase Spark** | 전송 360MB/일, Firestore 읽기 5만/일 — 매우 작음 |
| **AWS 프리티어** | 12개월 한정, 종료 시 경고 없이 과금 전환 |
| **Oracle Always Free** | 2026.6 스펙 반토막, ARM 용량 부족으로 생성 실패 잦음 |
| **MongoDB Atlas M0** | 30일 비활성 시 pause, 백업 없음 |
| **Cloudflare D1/KV** | 일일 한도 초과 시 즉시 쿼리/요청 실패 |
| **Railway** | $5 1회성 트라이얼(30일), 이후 월 $1 크레딧뿐 |
| **PlanetScale / Heroku / Fly.io** | 무료 티어 없음 (폐지) |
| **Koyeb** | Mistral 인수 후 신규 무료 가입 중단 |
| **AWS App Runner** | 2026.4 신규 가입 중단 |

---

## 7. 요금 폭탄 위험도

**위험 순위 (높음 → 낮음)**

1. **Firebase Blaze** — 완전 종량, 상한 없음. 버그/악성 트래픽 폭탄 사례 다수
2. **Vercel Pro** — 사용량 상한 설정 불가. $23,000 청구 사례 보고
3. **Railway** — 완전 종량(CPU/메모리/스토리지/네트워크)
4. **Neon** — 완전 종량, 고트래픽 시 급증
5. **Cloudflare D1 / KV** — 쓰기 단가 높음
6. **PlanetScale** — row read/write 기반 종량
7. **AWS RDS 프리티어** — 12개월 종료 후 방치 시

### 방어 조치 (필수)

```
□ 각 서비스 대시보드에서 사용량 알림(usage alert) 설정
□ AWS/GCP는 Budget Alert + 결제 알림 이메일 등록
□ Firebase Blaze 쓸 거면 Cloud Billing 예산 한도 + Cloud Function 자동 차단 스크립트
□ Cloudflare 앞단에 두고 Rate Limiting 걸기
□ 무료 티어로 시작 → 실사용량 측정 후 유료 전환
```

---

## 8. 출처

### 프론트엔드
- Vercel Pricing / Netlify Pricing / Cloudflare Pages Limits
- GitHub Pages Limits, Firebase Pricing
- AWS Amplify Pricing, Render Pricing, Deno Deploy Pricing

### 백엔드 API
- [Railway Pricing Plans](https://docs.railway.com/pricing/plans)
- [Render Free Tier 2026](https://render.com/articles/platforms-with-a-real-free-tier-for-developers-in-2026)
- [Fly.io Resource Pricing](https://fly.io/docs/about/pricing/)
- [Cloudflare Workers Pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [The $23,000 Vercel Bill](https://usagebox.com/articles/vercel-23000-dollar-bill-usage-based-platform-bill-shock-2026)
- [AWS Lambda Pricing 2026](https://dev.to/tomerbendavid/aws-lambda-pricing-2026-guide-5dnf)
- [Oracle Cloud Free Tier Limits Halved — InfoQ](https://www.infoq.com/news/2026/07/oracle-cloud-free-tier-limits/)
- [Koyeb Pricing FAQ](https://www.koyeb.com/docs/faqs/pricing)
- [Heroku Low-Cost Plans FAQ](https://help.heroku.com/KP5RQQVO/low-cost-plans-faq)

### DB
- [Supabase Pricing](https://supabase.com/pricing)
- [Neon Regions](https://neon.com/docs/introduction/regions)
- [PlanetScale Pricing](https://planetscale.com/pricing)
- [Turso Pricing](https://turso.tech/pricing)
- [Cloudflare D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Aiven Free Tier](https://aiven.io/free-tier)
- [Render Free PostgreSQL 30-day Changelog](https://render.com/changelog/free-postgresql-instances-now-expire-after-30-days-previously-90)
- [AWS Free Tier FAQs](https://aws.amazon.com/free/free-tier-faqs/)
- [Google Cloud SQL Pricing](https://cloud.google.com/sql/pricing)
- [MongoDB Atlas Free Cluster Limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/)
- [Firebase Pricing](https://firebase.google.com/pricing)
- [Upstash Redis Pricing](https://upstash.com/pricing/redis)

---

*주제 확정 시 이 문서 기준으로 스택 선정 + 초기 세팅 진행.*
