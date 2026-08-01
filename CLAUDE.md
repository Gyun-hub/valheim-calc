# 규칙

- 게임 에셋 재배포 금지. 아이콘 직접 제작
- 위키 텍스트 복사 금지. 수치만 참고
- 백엔드 없음. static export 유지
- 조인키 name_en, 표시 name_ko
- 계산 로직 lib/ 순수 함수
- 데이터 접근은 `@/lib/data` 경유. JSON 직접 import 금지
- 엔티티 간 링크는 `EntityRef`/`EntityChip`. 직접 `<Link>` 금지 (참조 결측 많음)
- 색은 globals.css 토큰만. 파생 수치 하드코딩 금지

개발 규약 docs/DEV-CONVENTIONS.md
엔티티별 문서 docs/entities/ · 대응 스킬 `/entity-*`
상세 docs/
