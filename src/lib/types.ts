/**
 * 데이터 타입 정의 — data/*.json 의 단일 진실 공급원.
 *
 * 두 층으로 나뉜다.
 *  - `Raw*`  : JSON 파일에 실제로 들어있는 모양 그대로. 문자열 필드가 섞여 있음
 *  - 그 외    : `lib/data.ts` 가 정규화한 뒤의 모양. 페이지·계산기는 이쪽만 쓴다
 *
 * 스키마 상세는 docs/DATA-SCHEMA.md 참고.
 */

// ─────────────────────────────────────────────────────────────
// 공통
// ─────────────────────────────────────────────────────────────

/** 모든 엔티티의 공통 필드. `nameEn` 이 엔티티 간 조인 키 */
export interface NamedEntity {
  nameEn: string;
  nameKo: string;
  /** name_en 에서 파생된 URL 세그먼트. `lib/slug.ts` 참고 */
  slug: string;
  /** 원본 위키 이미지 URL. 참고용이며 프로덕션 노출 금지 (docs/LEGAL.md) */
  imageSourceUrl: string | null;
  /** 직접 제작한 아이콘 경로. 현재 전부 null */
  imageLocalPath: string | null;
}

/** 제작 재료 한 줄. 원본은 `{name_en, qty}` 또는 `{name, quantity}` 로 섞여 있음 */
export interface Material {
  nameEn: string;
  qty: number;
}

/** 게임 내 데미지 종류 */
export type DamageType =
  | "slash"
  | "pierce"
  | "blunt"
  | "fire"
  | "frost"
  | "lightning"
  | "poison"
  | "spirit"
  | "chop";

/** 바이옴 이름 (영문). 진행 순서는 `biomes[].progressionOrder` 참고 */
export type BiomeName =
  | "Meadows"
  | "Black Forest"
  | "Swamp"
  | "Mountain"
  | "Plains"
  | "Mistlands"
  | "Ashlands"
  | "Deep North"
  | "Ocean";

/** 제작 스테이션 */
export interface Station {
  name: string;
  /** 요구 레벨. `Inventory`·`Smelter` 는 0 */
  level: number;
}

// ─────────────────────────────────────────────────────────────
// items.json
// ─────────────────────────────────────────────────────────────

export type ItemCategory = "weapon" | "armor" | "shield" | "tool" | "resource";

/**
 * 아이템 스탯. 필드 대부분이 optional — 카테고리마다 있는 게 다름.
 * `weight` 는 74개 전부 null (docs/DATA-SCHEMA.md 결측 표 참고).
 */
export interface ItemStats {
  damageTypes: Partial<Record<DamageType | "total", number>> | null;
  weight: number | null;
  durability: number | null;
  stackSize: number | null;
  armor: number | null;
  blockPower: number | null;
  /** 원본은 자유 텍스트 (예: "Reduces stamina use") */
  setBonus: string | null;
  weaponType: string | null;
  movementPenalty: string | null;
  movementBonus: string | null;
  parryBonus: number | null;
  parryForce: number | null;
  coldResistance: boolean | null;
  poisonResistance: boolean | null;
  harvest: string | null;
  throwable: boolean | null;
  /** JSON 에 직접 박힌 값. 실제 판정은 `isPortalRestricted()` 를 쓸 것 */
  portalRestricted: boolean | null;
}

export interface Item extends NamedEntity {
  category: ItemCategory;
  stats: ItemStats;
  description: string | null;
  /** 원자재는 없음 (74개 중 44개 존재) */
  crafting: Recipe | null;
}

export interface Recipe {
  /** 결과물 아이템의 `nameEn` */
  itemNameEn: string;
  itemCategory: ItemCategory | null;
  station: Station;
  materials: Material[];
}

export interface BuildingPiece extends Omit<NamedEntity, "imageSourceUrl" | "imageLocalPath"> {
  category: string;
  materials: Material[];
  hp: number | null;
  durabilityNotes: string | null;
  /** 필요한 도구 (예: "Hammer") */
  requirement: string | null;
  craftingStation: string | null;
}

// ─────────────────────────────────────────────────────────────
// creatures.json
// ─────────────────────────────────────────────────────────────

export type CreatureBehavior = "aggressive" | "passive";

/**
 * `creatures[].damage` 문자열을 파싱한 결과.
 * 원본이 `"14 Slash + 10 Blunt (ranged)"`, `"Fire explosion"` 등으로 제각각이라
 * 숫자 추출에 실패할 수 있음. 그 경우 `parsed: false` 이고 `raw` 를 그대로 표시할 것.
 */
export interface ParsedDamage {
  /** 원본 문자열. 파싱 실패 시 이걸 표시 */
  raw: string;
  /** 데미지 타입별 수치. 범위값은 최대치를 취함 */
  byType: Partial<Record<DamageType, number>>;
  /** 범위 표기(`20-50`)가 있었으면 최소치 */
  minTotal: number | null;
  /** 전 타입 합계. 파싱 실패 시 null */
  total: number | null;
  /** 원거리 공격 여부 — `(ranged)` 수식어 */
  ranged: boolean;
  /** 숫자를 하나라도 뽑아냈는지 */
  parsed: boolean;
}

export interface Creature extends NamedEntity {
  biomes: BiomeName[];
  hp: number | null;
  damage: ParsedDamage;
  /** 배율. 1 미만이면 저항, 초과면 취약 */
  resistances: Partial<Record<DamageType, number>>;
  behavior: CreatureBehavior;
}

/** 드롭률 데이터 신뢰도. 현재 55개 전부 `datamined` (docs/LEGAL.md 표기 의무) */
export type DropConfidence = "datamined" | "community";

export interface DropEntry {
  creatureNameEn: string;
  itemNameEn: string;
  /** 0~100 */
  chancePercent: number;
  qtyMin: number;
  qtyMax: number;
  confidence: DropConfidence;
}

/** `bosses[].guaranteed_drops` 의 `"Hard Antler (3)"` 를 파싱한 결과 */
export interface GuaranteedDrop {
  itemNameEn: string;
  /** 괄호 수량이 없으면 1 로 간주 */
  qty: number;
}

export interface Boss extends NamedEntity {
  /** 솔로 기준. 멀티 스케일링은 별도 (Phase 2) */
  hp: number | null;
  biome: BiomeName;
  summonItem: string | null;
  /**
   * 소환 제물 개수.
   *
   * ⚠ 원본이 숫자가 아닌 경우가 있다 — 여왕은 `"9 + 1"` 문자열이다
   * (다른 제물 9개 + 봉인 해제기 1개). 그래서 표시용 문자열과 계산용 숫자를
   * 분리한다. 산술이 필요하면 `summonQty` 를, 화면 표시는 `summonQtyLabel` 을 쓸 것.
   */
  summonQty: number | null;
  /** 원본 표기 그대로. 숫자로 환원되지 않는 값도 여기엔 남는다 */
  summonQtyLabel: string | null;
  summonLocation: string | null;
  trophyDrop: string | null;
  trophyDrop100pct: boolean;
  guaranteedDrops: GuaranteedDrop[];
  /** 처치 보상 능력 설명 */
  forsakenPower: string | null;
  /** 진행 순서 1~7 */
  order: number;
  /** 배율. 1 미만이면 저항, 초과면 취약. 2026-08 추가 — 과거 데이터엔 없을 수 있음 */
  resistances: Partial<Record<DamageType, number>>;
}

export interface TamingInfo {
  creatureNameEn: string;
  creatureNameKo: string;
  slug: string;
  tameable: boolean;
  tamingFood: string[];
  tamingTimeMin: number | null;
  tamingBrewMin: number | null;
  breedingFood: string[];
  breedingCooldownHours: number | null;
  starInheritance: string | null;
}

// ─────────────────────────────────────────────────────────────
// food-biomes.json
// ─────────────────────────────────────────────────────────────

export interface Food extends NamedEntity {
  health: number;
  stamina: number;
  /** 마법 자원. 0 이면 마법 빌드에 무의미 */
  eitr: number;
  durationSec: number;
  /** `"1 HP/s"` 를 숫자로 뽑은 값 */
  regenHpPerSec: number | null;
  /** 원본 regen 문자열 */
  regenRaw: string | null;
  /** 재료 이름 목록. 원자재 음식은 빈 배열 */
  ingredients: string[];
  /** 1~7. 4는 데이터에 없음 */
  tier: number;
  biome: BiomeName;
}

export interface MeadPotion extends NamedEntity {
  effect: string;
  /** 자유 텍스트 (예: "50 HP over 10 seconds"). 정규화 불가 — 그대로 표시 */
  magnitude: string;
  durationSec: number | null;
  cooldownSec: number | null;
  brewIngredients: string[];
  brewTime: string | null;
  /** 원본이 `"6 bottles per batch"` 같은 문자열 */
  brewYield: string | null;
}

export interface Biome extends NamedEntity {
  /** 진행 순서. ⚠ 정수가 아니다 — 바다는 2.5 다. 정렬에만 쓰고 화면에 찍지 말 것 */
  progressionOrder: number;
  /** 보스가 없거나 미정이면 null. 원본의 `"None"` 같은 문장은 걸러진다 */
  bossName: string | null;
  /** 출시된 콘텐츠인지. 극북은 2026-09-09 출시 예정이라 false */
  released: boolean;
  keyResources: string[];
  keyCreatures: string[];
  notableStructures: string[];
  specialMechanics: string | null;
}

export interface Ship extends NamedEntity {
  /** 다른 한글 표기 (예: 롱십 / 장선) */
  nameKoAlt: string | null;
  materials: Material[];
  cargoSlots: number;
  speedMinMs: number | null;
  speedMaxMs: number | null;
  speedNotes: string | null;
  hp: number | null;
}

export interface MagicItem extends NamedEntity {
  nameKoAlt: string | null;
  type: string;
  magicType: string | null;
  spellEffect: string | null;
  /** 원본이 `"Moderate per cast"` 같은 문자열 — 수치 아님 */
  eitrCost: string | null;
  castingSpeed: string | null;
  damageType: string | null;
  notes: string | null;
}

// ─────────────────────────────────────────────────────────────
// 원본 JSON 모양 (Raw*)
// ─────────────────────────────────────────────────────────────

export interface RawMaterial {
  name_en?: string;
  name?: string;
  qty?: number;
  quantity?: number;
}

export interface RawMeta {
  collected_at: string;
  sources: unknown[];
  notes?: string;
}

export interface RawItem {
  name_en: string;
  name_ko: string;
  category: string;
  stats: Record<string, unknown>;
  description?: string | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
  crafting?: {
    station?: string | null;
    station_level?: number | null;
    materials?: RawMaterial[];
  } | null;
}

export interface RawRecipe {
  item_name_en: string;
  item_category?: string | null;
  station?: string | null;
  station_level?: number | null;
  materials?: RawMaterial[];
}

export interface RawBuildingPiece {
  name_en: string;
  name_ko: string;
  category?: string | null;
  materials?: RawMaterial[];
  hp?: number | null;
  durability_notes?: string | null;
  requirement?: string | null;
  crafting_station?: string | null;
}

export interface RawItemsFile {
  meta: RawMeta;
  items: RawItem[];
  recipes: RawRecipe[];
  building_pieces: RawBuildingPiece[];
  portal_restricted_items: string[];
}

export interface RawCreature {
  name_en: string;
  name_ko: string;
  biomes?: string[];
  hp?: number | null;
  damage?: string | null;
  resistances?: Record<string, number> | null;
  behavior?: string | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawDropEntry {
  creature_name_en: string;
  item_name_en: string;
  chance_percent: number;
  qty_min: number;
  qty_max: number;
  confidence?: string | null;
}

export interface RawBoss {
  name_en: string;
  name_ko: string;
  hp?: number | null;
  biome?: string | null;
  summon_item?: string | null;
  /** ⚠ 여왕은 `"9 + 1"` 문자열. 숫자로 단정하지 말 것 */
  summon_qty?: number | string | null;
  summon_location?: string | null;
  trophy_drop?: string | null;
  trophy_drop_100pct?: boolean | null;
  guaranteed_drops?: string[];
  forsaken_power?: string | null;
  order?: number | null;
  resistances?: Record<string, number> | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawTaming {
  creature_name_en: string;
  creature_name_ko: string;
  tameable?: boolean;
  taming_food?: string[];
  taming_time_min?: number | null;
  taming_brew_min?: number | null;
  breeding_food?: string[];
  breeding_cooldown_hours?: number | null;
  star_inheritance?: string | null;
}

export interface RawCreaturesFile {
  meta: RawMeta;
  creatures: RawCreature[];
  drop_tables: RawDropEntry[];
  bosses: RawBoss[];
  taming_breeding: RawTaming[];
}

export interface RawFood {
  name_en: string;
  name_ko: string;
  health?: number;
  stamina?: number;
  eitr?: number;
  duration_sec?: number;
  regen?: string | null;
  ingredients?: string[];
  tier?: number;
  biome?: string | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawMead {
  name_en: string;
  name_ko: string;
  effect?: string | null;
  magnitude?: string | null;
  duration_sec?: number | null;
  cooldown_sec?: number | null;
  brew_ingredients?: string[];
  brew_time?: string | null;
  brew_yield?: string | number | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawBiome {
  name_en: string;
  name_ko: string;
  progression_order?: number;
  boss_name?: string | null;
  key_resources?: string[];
  key_creatures?: string[];
  notable_structures?: string[];
  special_mechanics?: string | null;
  /** 미출시 콘텐츠에만 붙어 있다 (극북) */
  status?: string | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawShip {
  name_en: string;
  name_ko: string;
  name_ko_alt?: string | null;
  materials?: RawMaterial[];
  cargo_slots?: number;
  speed_min_ms?: number | null;
  speed_max_ms?: number | null;
  speed_notes?: string | null;
  hp?: number | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawMagic {
  name_en: string;
  name_ko: string;
  name_ko_alt?: string | null;
  type?: string | null;
  magic_type?: string | null;
  spell_effect?: string | null;
  eitr_cost?: string | number | null;
  casting_speed?: string | null;
  damage_type?: string | null;
  notes?: string | null;
  image_source_url?: string | null;
  image_local_path?: string | null;
}

export interface RawFoodBiomesFile {
  meta: RawMeta;
  food: RawFood[];
  mead_potions: RawMead[];
  biomes: RawBiome[];
  ships: RawShip[];
  magic: RawMagic[];
  eitr_system: Record<string, unknown>;
  data_gaps_and_notes: Record<string, unknown>;
}

// ─────────────────────────────────────────────────────────────
// mods.json — 서드파티 모드 카탈로그
// ─────────────────────────────────────────────────────────────

/**
 * 모드는 서드파티 창작물이라 다른 엔티티와 조인 방식이 다르다.
 * `name` 은 번역하지 않는 원문 고유명사이고 `name_ko` 자체가 없다
 * (docs/entities/mods.md 참고).
 */
export interface Mod {
  slug: string;
  name: string;
  author: string;
  platform: string;
  url: string;
  /** BepInEx 등 선행 설치 요구사항. 비어있지 않으면 UI에서 반드시 표시할 것 */
  requires: string[];
  category: string;
  summaryKo: string;
  beginnerReasonKo: string;
  installDifficulty: string;
  gameplayImpact: string;
  /** 마지막으로 실제 재검증한 날짜. UI에 반드시 노출할 것 */
  lastVerified: string;
}

export interface RawMod {
  slug: string;
  name: string;
  author: string;
  platform: string;
  url: string;
  requires?: string[];
  category: string;
  summary_ko: string;
  beginner_reason_ko: string;
  install_difficulty: string;
  gameplay_impact: string;
  last_verified: string;
}

export interface RawModsFile {
  meta: RawMeta;
  mods: RawMod[];
}
