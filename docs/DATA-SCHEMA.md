# 데이터 스키마

`data/` 하위 JSON 3개. 전부 UTF-8, 한글명(`name_ko`) 100% 채워짐.

수집일: 2026-07-30 / 총 140KB (gzip 18.5KB)

---

## 공통 규칙

- 모든 엔트리에 `name_en`(영문명) + `name_ko`(한글명) 존재
- 영문명이 **엔트리 간 조인 키**. 레시피의 `materials[].name_en` ↔ 아이템의 `name_en` 매칭
- `image_source_url`: 원본 위키 이미지 URL (`static.wikia.nocookie.net/...`). **파일은 다운로드 안 함** ([LEGAL.md](LEGAL.md) 참고)
- `image_local_path`: 전부 `null`. 직접 제작 아이콘 넣을 자리
- `meta`: 수집일 · 출처 목록 · 주의사항

### 개수는 배열 길이로만 셀 것

`items.json`에 `summary` 블록이 있었으나 **제거함.** 수집 초반에 쓰인 뒤 갱신이 안 돼서
아이템 76 / 레시피 51 / 한글명 미수집 / 이미지 0% 라고 주장하고 있었음 — 전부 사실과 다름.
문서에 잘못된 수치가 퍼진 뿌리가 여기였음.

파생 수치는 JSON에 박아두지 말 것. 게임 패치마다 어긋남. 필요하면 `arr.length`로 계산.

---

## 1. `items.json` (72KB)

### `items[]` — 74개
```jsonc
{
  "name_en": "Bronze Sword",
  "name_ko": "청동검",
  "category": "weapon",          // weapon | tool | armor | resource | shield
  "stats": {
    "damage_types": { "slash": 20, "total": 20 },
    "weight": null,              // ⚠ 74개 전부 null
    "durability": null,          // ⚠ 14개만 존재
    "stack_size": 1              // 60개 존재
  },
  "description": "Early game sword crafted from bronze at the forge",
  "image_source_url": "https://static.wikia.nocookie.net/...",
  "image_local_path": null,
  "crafting": {                  // 44개 존재 (원자재는 없음)
    "station": "Forge",
    "station_level": 1,
    "materials": [{ "name_en": "Copper", "qty": 15 }]
  }
}
```

카테고리 분포: resource 35 · armor 14 · tool 11 · weapon 8 · shield 6

### `recipes[]` — 49개
```jsonc
{
  "item_name_en": "Bronze Sword",
  "item_category": "weapon",
  "station": "Forge",
  "station_level": 1,
  "materials": [{ "name_en": "Copper", "qty": 15 }]
}
```
`items[].crafting`과 내용 중복. 계산기에선 둘 중 하나만 쓰면 됨.

### `building_pieces[]` — 12개
```jsonc
{
  "name_en": "...", "name_ko": "...", "category": "...",
  "materials": [...], "hp": 0,
  "durability_notes": "...", "requirement": "...", "crafting_station": "..."
}
```

### `portal_restricted_items[]` — 14개
문자열 배열. 포탈 통과 불가 아이템 (구리·주석·철 등 광물류).

---

## 2. `creatures.json` (29KB)

### `creatures[]` — 27개
```jsonc
{
  "name_en": "Greyling",
  "name_ko": "그레이링",
  "biomes": ["Meadows"],
  "hp": 20,
  "damage": "5 Slash",           // ⚠ 문자열. 파싱 필요
  "resistances": { "poison": 0.75, "spirit": 0 },  // 배율
  "behavior": "aggressive"       // aggressive | passive
}
```

### `drop_tables[]` — 55개
```jsonc
{
  "creature_name_en": "Greyling",
  "item_name_en": "Resin",
  "chance_percent": 50,
  "qty_min": 1, "qty_max": 1,
  "confidence": "datamined"      // 55개 전부 datamined (게임 파일 추출)
}
```
**신뢰도 좋음** — 커뮤니티 추정치가 아니라 게임 파일에서 추출한 값.
단 출처가 2021년 자료 기반이라 최신 패치 반영 여부는 별도 검증 필요.

### `bosses[]` — 7개
```jsonc
{
  "name_en": "Eikthyr", "name_ko": "에이크쉬르",
  "hp": 500,                     // 솔로 기준
  "biome": "Meadows",
  "summon_item": "Deer Trophy", "summon_qty": 2,
  "summon_location": "Eikthyr Altar",
  "trophy_drop": "Eikthyr Trophy",
  "trophy_drop_100pct": true,    // 7개 전부 true
  "guaranteed_drops": ["Hard Antler (3)"],   // ⚠ 문자열. 파싱 필요
  "forsaken_power": "Reduce stamina cost by 60%",
  "order": 1                     // 진행 순서
}
```
순서: 에이크쉬르 → 엘더 → 본매스 → 모더 → 야글루스 → 여왕 → 파더

### `taming_breeding[]` — 5개
```jsonc
{
  "creature_name_en": "Boar", "creature_name_ko": "멧돼지",
  "tameable": true,
  "taming_food": [...], "taming_time_min": 0, "taming_brew_min": 0,
  "breeding_food": [...], "breeding_cooldown_hours": 0,
  "star_inheritance": "..."      // 별등급 유전 규칙
}
```

---

## 3. `food-biomes.json` (39KB)

### `food[]` — 19개
```jsonc
{
  "name_en": "Raspberry", "name_ko": "라즈베리",
  "health": 7, "stamina": 20, "eitr": 0,   // eitr>0인 것 8개
  "duration_sec": 600,
  "regen": "1 HP/s",             // ⚠ 문자열. 파싱 필요
  "ingredients": [],
  "tier": 1, "biome": "Meadows"
}
```

### `mead_potions[]` — 16개
```jsonc
{
  "name_en": "...", "name_ko": "...",
  "effect": "...", "magnitude": "...",     // ⚠ 문자열
  "duration_sec": 0, "cooldown_sec": 0,
  "brew_ingredients": ["10x Honey", ...],  // ⚠ 수량이 이름에 붙어 있음. 파싱 필요
  "brew_time": "...",
  "brew_yield": "6 bottles per batch"      // ⚠ 숫자 아님. 16개 전부 문자열
}
```

### `biomes[]` — 9개
```jsonc
{
  "name_en": "...", "name_ko": "...",
  "progression_order": 1,
  "boss_name": "...",
  "key_resources": [...], "key_creatures": [...],
  "notable_structures": [...], "special_mechanics": "..."
}
```

### `ships[]` — 4개
뗏목 · 카르베 · 롱십 · 드라카르
```jsonc
{
  "name_en": "...", "name_ko": "...", "name_ko_alt": "...",
  "materials": [{ "name": "Wood", "quantity": 20 }],  // ⚠ 키 이름이 다름 (아래 참고)
  "cargo_slots": 0,
  "speed_min_ms": 0, "speed_max_ms": 0, "speed_notes": "...",
  "hp": 0
}
```

### `magic[]` — 5개
```jsonc
{
  "name_en": "...", "name_ko": "...", "name_ko_alt": "...",
  "type": "staff", "magic_type": "...",
  "spell_effect": "...",
  "eitr_cost": "Moderate per cast",   // ⚠ 숫자 아님. 5개 전부 문자열
  "casting_speed": "...", "damage_type": "...", "notes": "..."
}
```

**마법 빌드 계산기가 막히는 지점.** `eitr_cost` 가 수치가 아니라 서술이라
"연속 시전 가능 횟수" 같은 계산이 불가능하다. 정확한 소모량 재수집 필요.

### `eitr_system` — 객체
마법 시스템 설명 텍스트 (`overview` · `eitr_sources` · `regen_mechanics` · `casting_system` · `crafting_stations` · `synergies`)

---

## 4. 결측 · 보강 필요

| 항목 | 현황 | 영향받는 기능 | 우선도 |
|---|---|---|---|
| **아이템 무게** | 74개 **전부 null** | 포탈 계산기 무게 합산, 배 적재량 | 높음 (Phase 2 전) |
| 아이템 내구도 | 14/74 | 없음 (표시용) | 낮음 |
| 이미지 URL | 148/161 (13개 누락) | 도감 표시 | 낮음 (사용자가 직접 채우기로 함) |
| 음식 데이터 | 19/75+ | 음식 계산기 정확도 | 중간 (MVP엔 충분) |
| 마법 아이템 | 5/8+ | 마법 빌드 계산기 | 중간 (Phase 3 전) |
| **바람·항해 공식** | **없음** | 항해 플래너 | Phase 3 전 필수 |
| **멀티 스케일링 공식** | **미검증** | 멀티 난이도 계산기 | Phase 2 전 필수 |
| Deep North 데이터 | 없음 (미출시) | 전 기능 | 2026-09-09 당일 수집 |

### 파싱 필요한 문자열 필드
타입 안전하게 쓰려면 `lib/data.ts`에서 정규화 필요:

| 필드 | 실제 값 예시 | 목표 형태 |
|---|---|---|
| `creatures[].damage` | `"5 Slash"` | `{ slash: 5 }` |
| " | `"14 Slash + 10 Blunt (ranged)"` | `{ slash: 14, blunt: 10, ranged: true }` |
| " | `"0"` | `{}` (무해 개체) |
| `bosses[].guaranteed_drops` | `["Hard Antler (3)"]` | `[{ item: "Hard Antler", qty: 3 }]` |
| `food[].regen` | `"1 HP/s"` | `1` |
| `mead_potions[].magnitude` | 자유 텍스트 | 정규화 불가. 그대로 표시 |

`damage`는 `+` 결합과 `(ranged)` 같은 괄호 수식어가 섞여 있음. 단순 `split(" ")`으로 안 됨.

### 파일 간 스키마 불일치

수집 에이전트가 여러 번에 나눠 만들어서 같은 개념인데 키 이름이 다른 곳이 있다.
`lib/data.ts` 가 흡수하므로 코드에서는 안 보이지만, **데이터를 다시 수집할 때는 통일할 것.**

| 위치 | 실제 모양 | 표준 (다수파) |
|---|---|---|
| `ships[].materials` | `{ name, quantity }` | `{ name_en, qty }` |
| `items[].crafting.materials` | `{ name_en, qty }` | ✅ |
| `recipes[].materials` | `{ name_en, qty }` | ✅ |
| `building_pieces[].materials` | `{ name_en, qty }` | ✅ |
| `mead_potions[].brew_ingredients` | `["10x Honey"]` 문자열 | 구조화 필요 |

수량 표기 방식도 셋으로 갈린다 — `qty` 숫자 / `quantity` 숫자 / 이름에 `10x` 접두.

**조인 무결성은 확인함**: `recipes[].materials[].name_en` 49개 전부 `items[].name_en` 에 존재.
`ships`·`mead_potions` 쪽은 키 이름이 달라 자동 검증에서 빠져 있었음.

### 파일 간 참조 무결성 — **깨져 있음**

이름으로 다른 엔티티를 참조하는 필드가 많은데, 대상이 실제로 존재하지 않는 경우가 대부분이다.
수집을 여러 번에 나눠 하면서 `items[]` 에 소비재·전리품·중간재가 거의 안 들어갔기 때문.

| 참조 | 끊긴 비율 | 예시 |
|---|---|---|
| `drop_tables[].item_name_en` → `items[]` | **33/44 (75%)** | Raw Meat · Bone Fragments · Coins · Wolf Fang · 트로피 전부 |
| `food[].ingredients` → `items[]` | **16/17 (94%)** | Honey · Carrot · Barley · Mushroom · Thistle |
| `biomes[].key_resources` → `items[]` | **37/55 (67%)** | |
| `biomes[].key_creatures` → `creatures[]` | **19/44 (43%)** | Serpent · Bee · Fuling Shaman · Abomination |
| `taming_breeding[].creature_name_en` → `creatures[]` | 2/5 | Chicken · Asksvin |
| `recipes[].materials[].name_en` → `items[]` | 0/49 ✅ | 유일하게 온전함 |

**코드에서의 대응**: `lib/data.ts` 의 `detailHref()` / `hasItemPage()` 로 존재 여부를 먼저 판정하고,
`components/ui/EntityRef.tsx` 가 페이지 있는 이름만 링크로 만든다.
엔티티 간 참조에 `<Link>` 를 직접 쓰면 404 가 대량으로 생기므로 금지.

또 `koName()` 이 한글명을 못 찾으면 영문명을 그대로 노출하므로,
**드롭 아이템 이름 대부분과 보스 트로피 전체가 현재 영문으로 표시된다.**

표기 흔들림도 있음: 길들이기는 `Asksvin`, 바이옴 목록은 `Askvin` 으로 적혀 있다.

→ 보강 우선순위: `items[]` 에 소비재·전리품·중간재 추가가 **아이템 무게 다음으로 시급**.
도감 품질과 SEO 양쪽에 직접 영향.

### 추가 결측 (수집 단계 기록)

수집 에이전트가 못 찾은 항목:
- 무기·방어구 정확한 무게
- 방어구 이동속도 페널티
- 넉백 · 백스탭 배율
- 건축 파츠 변형 (문 · 창 · 계단 등) — 현재 12종만
- 제작 소요 시간

보강 방법 후보: `valheim.tools` 대조, 게임 파일에서 직접 추출.

---

## 5. 이미지 누락 13개

**items.json (7)**
Stone Pickaxe · Root Armor Helmet · Spear · Padded Armor Helmet · Fenris Armor Hood · Carapace Armor Helmet · Antler

**food-biomes.json (6)**
Cooked Meat · Ashlands Feast · Fish n Bread · Fire Resistance Mead (Barley Wine) · Ratatosk Mead · Small Eitr Mead

전부 위키에 해당 이름의 독립 문서가 없음 (`404 both variants` — Title_Case·sentence case 둘 다 실패).
페이지명이 다르거나 상위 문서에 통합된 경우. 수동 확인 필요.

어차피 공개 시엔 직접 제작 아이콘으로 교체해야 함 ([LEGAL.md](LEGAL.md)) — 우선도 낮음.
