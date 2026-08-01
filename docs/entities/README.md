# 엔티티 문서

엔티티 하나를 고칠 때 여기 해당 문서만 읽으면 되도록 정리한 것.

전역 규약은 [../DEV-CONVENTIONS.md](../DEV-CONVENTIONS.md), 데이터 스키마 전체는
[../DATA-SCHEMA.md](../DATA-SCHEMA.md) 를 본다.

| 엔티티 | 문서 | 라우트 | 항목 |
|---|---|---|---|
| 아이템 | [items.md](items.md) | `/db/items` | 74 |
| 몬스터 | [creatures.md](creatures.md) | `/db/creatures` | 27 |
| 보스 | [bosses.md](bosses.md) | `/db/bosses` | 7 |
| 음식 | [food.md](food.md) | `/db/food` | 38 |
| 미드·포션 | [mead.md](mead.md) | `/db/mead` | 16 |
| 바이옴 | [biomes.md](biomes.md) | `/db/biomes` | 9 |
| 모드 | [mods.md](mods.md) | `/db/mods` | 16 |

## 대응 스킬

`.claude/skills/` 에 엔티티별 스킬이 있다. 작업 시작 전에 호출하면
해당 엔티티의 파일 위치·데이터 함정·주의사항이 한 번에 로드된다.

| 스킬 | 용도 |
|---|---|
| `/entity-items` | 아이템 도감 수정 |
| `/entity-creatures` | 몬스터 도감 수정 |
| `/entity-bosses` | 보스 도감 수정 |
| `/entity-food` | 음식 도감 수정 |
| `/entity-mead` | 미드 도감 수정 |
| `/entity-biomes` | 바이옴 도감 수정 |
| `/entity-mods` | 모드 카탈로그 수정 |

## 문서 공통 구조

각 엔티티 문서는 같은 순서로 적는다.

1. **데이터 출처** — 어느 JSON 의 어느 배열인지, 정규화 후 타입 이름
2. **파일 위치** — 페이지와 전용 컴포넌트
3. **데이터 함정** — 이 엔티티에서 실제로 밟은 지뢰. 가장 중요한 절
4. **표시 규칙** — 한국어 표기, 결측 처리
5. **수정 시 확인할 것** — 체크리스트
