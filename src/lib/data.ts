/**
 * 데이터 레이어 — data/*.json 을 읽어 정규화된 도메인 객체로 바꾼다.
 *
 * 페이지·계산기는 **반드시 이 모듈만 통해서** 데이터에 접근할 것.
 * JSON 을 직접 import 하면 게임 패치로 필드가 바뀌었을 때 감지되지 않고,
 * 클라이언트 번들에 140KB 가 통째로 실릴 수 있다 (docs/ARCHITECTURE.md 참고).
 *
 * 모든 export 는 빌드타임에 한 번 평가되는 상수다.
 * Server Component 에서 읽고, 클라이언트에는 필요한 조각만 props 로 내려보낼 것.
 */

import rawCreaturesFile from "../../data/creatures.json";
import rawFoodBiomesFile from "../../data/food-biomes.json";
import rawItemsFile from "../../data/items.json";
import rawModsFile from "../../data/mods.json";

import { parseDamage, parseGuaranteedDrops, parseRegen } from "./parse";
import { buildSlugMap, toSlug } from "./slug";
import type {
  Biome,
  BiomeName,
  Boss,
  BuildingPiece,
  Creature,
  CreatureBehavior,
  DamageType,
  DropConfidence,
  DropEntry,
  Food,
  Item,
  ItemCategory,
  ItemStats,
  MagicItem,
  Material,
  MeadPotion,
  Mod,
  RawBiome,
  RawBoss,
  RawBuildingPiece,
  RawCreature,
  RawCreaturesFile,
  RawDropEntry,
  RawFood,
  RawFoodBiomesFile,
  RawItem,
  RawItemsFile,
  RawMagic,
  RawMaterial,
  RawMead,
  RawMod,
  RawModsFile,
  RawRecipe,
  RawShip,
  RawTaming,
  Recipe,
  Ship,
  Station,
  TamingInfo,
} from "./types";

const itemsFile = rawItemsFile as unknown as RawItemsFile;
const creaturesFile = rawCreaturesFile as unknown as RawCreaturesFile;
const foodBiomesFile = rawFoodBiomesFile as unknown as RawFoodBiomesFile;
const modsFile = rawModsFile as unknown as RawModsFile;

// ─────────────────────────────────────────────────────────────
// 정규화 헬퍼
// ─────────────────────────────────────────────────────────────

const ITEM_CATEGORIES: ItemCategory[] = ["weapon", "armor", "shield", "tool", "resource"];

function toItemCategory(raw: string | null | undefined): ItemCategory {
  const value = (raw ?? "").toLowerCase() as ItemCategory;
  return ITEM_CATEGORIES.includes(value) ? value : "resource";
}

/**
 * 재료 배열 정규화.
 *
 * ⚠ 원본 스키마가 통일돼 있지 않다. items·recipes·building_pieces 는
 * `{name_en, qty}` 인데 ships 만 `{name, quantity}` 를 쓴다.
 * 여기서 한 모양으로 흡수하므로 호출부는 신경 쓸 필요 없음.
 */
function toMaterials(raw: RawMaterial[] | null | undefined): Material[] {
  return (raw ?? [])
    .map((m) => ({
      nameEn: (m.name_en ?? m.name ?? "").trim(),
      qty: m.qty ?? m.quantity ?? 0,
    }))
    .filter((m) => m.nameEn.length > 0);
}

function toStation(name: string | null | undefined, level: number | null | undefined): Station {
  return { name: (name ?? "Inventory").trim(), level: level ?? 0 };
}

/**
 * 바이옴 이름 표기 흔들림 흡수.
 *
 * ⚠ 파일마다 표기가 다르다. `biomes[]` 는 `"Mountains"` 복수형인데
 * `creatures[]`·`bosses[]`·`food[]` 는 `"Mountain"` 단수형을 쓴다.
 * 그대로 두면 산 바이옴에서 서식 몬스터 조인이 조용히 실패하고,
 * 한글명 룩업도 빗나가 화면에 영문이 노출된다.
 *
 * 단수형을 표준으로 삼는다.
 */
const BIOME_ALIASES: Record<string, BiomeName> = {
  Mountains: "Mountain",
  Meadow: "Meadows",
  Mistland: "Mistlands",
  Ashland: "Ashlands",
};

function toBiomeName(raw: string | null | undefined): BiomeName {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "Meadows";
  return BIOME_ALIASES[trimmed] ?? (trimmed as BiomeName);
}

function toBiomeNames(raw: string[] | null | undefined): BiomeName[] {
  return (raw ?? []).map(toBiomeName);
}

/** 원본 stats 는 키 구성이 항목마다 다름. 알려진 키만 뽑고 나머지는 null 로 채운다 */
function toItemStats(raw: Record<string, unknown> | null | undefined): ItemStats {
  const s = raw ?? {};
  const num = (key: string): number | null =>
    typeof s[key] === "number" ? (s[key] as number) : null;
  const str = (key: string): string | null =>
    typeof s[key] === "string" ? (s[key] as string) : null;
  const bool = (key: string): boolean | null =>
    typeof s[key] === "boolean" ? (s[key] as boolean) : null;

  const damageTypes =
    s.damage_types && typeof s.damage_types === "object"
      ? (s.damage_types as ItemStats["damageTypes"])
      : null;

  return {
    damageTypes,
    weight: num("weight"),
    durability: num("durability"),
    stackSize: num("stack_size"),
    armor: num("armor"),
    blockPower: num("block_power"),
    setBonus: str("set_bonus"),
    weaponType: str("weapon_type"),
    movementPenalty: str("movement_penalty"),
    movementBonus: str("movement_bonus"),
    parryBonus: num("parry_bonus"),
    parryForce: num("parry_force"),
    coldResistance: bool("cold_resistance"),
    poisonResistance: bool("poison_resistance"),
    harvest: str("harvest"),
    throwable: bool("throwable"),
    portalRestricted: bool("portal_restricted"),
  };
}

function toRecipe(
  itemNameEn: string,
  itemCategory: ItemCategory | null,
  station: string | null | undefined,
  stationLevel: number | null | undefined,
  materials: RawMaterial[] | null | undefined,
): Recipe {
  return {
    itemNameEn,
    itemCategory,
    station: toStation(station, stationLevel),
    materials: toMaterials(materials),
  };
}

// ─────────────────────────────────────────────────────────────
// items.json
// ─────────────────────────────────────────────────────────────

function normalizeItem(raw: RawItem): Item {
  const category = toItemCategory(raw.category);
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    category,
    stats: toItemStats(raw.stats),
    description: raw.description ?? null,
    crafting: raw.crafting
      ? toRecipe(
          raw.name_en,
          category,
          raw.crafting.station,
          raw.crafting.station_level,
          raw.crafting.materials,
        )
      : null,
  };
}

function normalizeRecipe(raw: RawRecipe): Recipe {
  return toRecipe(
    raw.item_name_en,
    raw.item_category ? toItemCategory(raw.item_category) : null,
    raw.station,
    raw.station_level,
    raw.materials,
  );
}

function normalizeBuildingPiece(raw: RawBuildingPiece): BuildingPiece {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    category: raw.category ?? "misc",
    materials: toMaterials(raw.materials),
    hp: raw.hp ?? null,
    durabilityNotes: raw.durability_notes ?? null,
    requirement: raw.requirement ?? null,
    craftingStation: raw.crafting_station ?? null,
  };
}

export const items: Item[] = itemsFile.items.map(normalizeItem);
export const recipes: Recipe[] = itemsFile.recipes.map(normalizeRecipe);
export const buildingPieces: BuildingPiece[] = itemsFile.building_pieces.map(normalizeBuildingPiece);

/** 포탈 통과 불가 아이템의 `nameEn` 집합 */
export const portalRestrictedItems: ReadonlySet<string> = new Set(
  itemsFile.portal_restricted_items,
);

// ─────────────────────────────────────────────────────────────
// creatures.json
// ─────────────────────────────────────────────────────────────

function normalizeCreature(raw: RawCreature): Creature {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    biomes: toBiomeNames(raw.biomes),
    hp: raw.hp ?? null,
    damage: parseDamage(raw.damage),
    resistances: (raw.resistances ?? {}) as Partial<Record<DamageType, number>>,
    behavior: (raw.behavior === "passive" ? "passive" : "aggressive") as CreatureBehavior,
  };
}

function normalizeDropEntry(raw: RawDropEntry): DropEntry {
  return {
    creatureNameEn: raw.creature_name_en,
    itemNameEn: raw.item_name_en,
    chancePercent: raw.chance_percent,
    qtyMin: raw.qty_min,
    qtyMax: raw.qty_max,
    confidence: (raw.confidence === "community" ? "community" : "datamined") as DropConfidence,
  };
}

function normalizeBoss(raw: RawBoss): Boss {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    hp: raw.hp ?? null,
    biome: toBiomeName(raw.biome),
    summonItem: raw.summon_item ?? null,
    // 원본에 `"9 + 1"` 같은 문자열이 섞여 있다. 숫자로 환원되는 것만 summonQty 에 넣는다
    summonQty: typeof raw.summon_qty === "number" ? raw.summon_qty : null,
    summonQtyLabel: raw.summon_qty == null ? null : String(raw.summon_qty),
    summonLocation: raw.summon_location ?? null,
    trophyDrop: raw.trophy_drop ?? null,
    trophyDrop100pct: raw.trophy_drop_100pct ?? false,
    guaranteedDrops: parseGuaranteedDrops(raw.guaranteed_drops),
    forsakenPower: raw.forsaken_power ?? null,
    order: raw.order ?? 0,
    resistances: (raw.resistances ?? {}) as Partial<Record<DamageType, number>>,
  };
}

function normalizeTaming(raw: RawTaming): TamingInfo {
  return {
    creatureNameEn: raw.creature_name_en,
    creatureNameKo: raw.creature_name_ko,
    slug: toSlug(raw.creature_name_en),
    tameable: raw.tameable ?? false,
    tamingFood: raw.taming_food ?? [],
    tamingTimeMin: raw.taming_time_min ?? null,
    tamingBrewMin: raw.taming_brew_min ?? null,
    breedingFood: raw.breeding_food ?? [],
    breedingCooldownHours: raw.breeding_cooldown_hours ?? null,
    starInheritance: raw.star_inheritance ?? null,
  };
}

export const creatures: Creature[] = creaturesFile.creatures.map(normalizeCreature);
export const dropTables: DropEntry[] = creaturesFile.drop_tables.map(normalizeDropEntry);
export const bosses: Boss[] = creaturesFile.bosses
  .map(normalizeBoss)
  .sort((a, b) => a.order - b.order);
export const tamingInfo: TamingInfo[] = creaturesFile.taming_breeding.map(normalizeTaming);

// ─────────────────────────────────────────────────────────────
// food-biomes.json
// ─────────────────────────────────────────────────────────────

function normalizeFood(raw: RawFood): Food {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    health: raw.health ?? 0,
    stamina: raw.stamina ?? 0,
    eitr: raw.eitr ?? 0,
    durationSec: raw.duration_sec ?? 0,
    regenHpPerSec: parseRegen(raw.regen),
    regenRaw: raw.regen ?? null,
    ingredients: raw.ingredients ?? [],
    tier: raw.tier ?? 1,
    biome: toBiomeName(raw.biome),
  };
}

function normalizeMead(raw: RawMead): MeadPotion {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    effect: raw.effect ?? "",
    magnitude: raw.magnitude ?? "",
    durationSec: raw.duration_sec ?? null,
    cooldownSec: raw.cooldown_sec ?? null,
    brewIngredients: raw.brew_ingredients ?? [],
    brewTime: raw.brew_time ?? null,
    // ⚠ 원본이 문자열("6 bottles per batch"). 문서에는 숫자로 적혀 있으나 실제는 문자열
    brewYield: raw.brew_yield == null ? null : String(raw.brew_yield),
  };
}

/**
 * `boss_name` 이 없음을 null 이 아니라 문장으로 적어둔 곳이 있다.
 * (바다는 `"None"`, 극북은 `"Unknown (Final Boss)"`)
 * 그대로 두면 화면에 "None" 이 보스 이름으로 찍힌다.
 */
const BOSS_NAME_SENTINELS = new Set(["None", "none", "N/A", "Unknown (Final Boss)", "TBD"]);

function normalizeBiome(raw: RawBiome): Biome {
  const bossName = raw.boss_name?.trim() ?? "";
  return {
    // ⚠ 원본이 "Mountains" 복수형이라 여기서 표준형으로 맞춘다.
    // slug 도 정규화된 이름에서 뽑아야 다른 페이지의 링크와 맞는다
    nameEn: toBiomeName(raw.name_en),
    nameKo: raw.name_ko,
    slug: toSlug(toBiomeName(raw.name_en)),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    progressionOrder: raw.progression_order ?? 0,
    bossName: bossName && !BOSS_NAME_SENTINELS.has(bossName) ? bossName : null,
    // 미출시 콘텐츠 표시. 원본의 `status` 필드가 있으면 미출시로 본다
    released: !raw.status,
    keyResources: raw.key_resources ?? [],
    keyCreatures: raw.key_creatures ?? [],
    notableStructures: raw.notable_structures ?? [],
    specialMechanics: raw.special_mechanics ?? null,
  };
}

function normalizeShip(raw: RawShip): Ship {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    nameKoAlt: raw.name_ko_alt ?? null,
    materials: toMaterials(raw.materials),
    cargoSlots: raw.cargo_slots ?? 0,
    speedMinMs: raw.speed_min_ms ?? null,
    speedMaxMs: raw.speed_max_ms ?? null,
    speedNotes: raw.speed_notes ?? null,
    hp: raw.hp ?? null,
  };
}

function normalizeMagic(raw: RawMagic): MagicItem {
  return {
    nameEn: raw.name_en,
    nameKo: raw.name_ko,
    slug: toSlug(raw.name_en),
    imageSourceUrl: raw.image_source_url ?? null,
    imageLocalPath: raw.image_local_path ?? null,
    nameKoAlt: raw.name_ko_alt ?? null,
    type: raw.type ?? "staff",
    magicType: raw.magic_type ?? null,
    spellEffect: raw.spell_effect ?? null,
    // ⚠ 원본이 문자열("Moderate per cast"). 수치가 아니므로 계산에 쓸 수 없음
    eitrCost: raw.eitr_cost == null ? null : String(raw.eitr_cost),
    castingSpeed: raw.casting_speed ?? null,
    damageType: raw.damage_type ?? null,
    notes: raw.notes ?? null,
  };
}

export const food: Food[] = foodBiomesFile.food.map(normalizeFood);
export const meadPotions: MeadPotion[] = foodBiomesFile.mead_potions.map(normalizeMead);
export const biomes: Biome[] = foodBiomesFile.biomes
  .map(normalizeBiome)
  .sort((a, b) => a.progressionOrder - b.progressionOrder);
export const ships: Ship[] = foodBiomesFile.ships.map(normalizeShip);
export const magicItems: MagicItem[] = foodBiomesFile.magic.map(normalizeMagic);

// ─────────────────────────────────────────────────────────────
// mods.json — 서드파티 모드 카탈로그
// ─────────────────────────────────────────────────────────────

function normalizeMod(raw: RawMod): Mod {
  return {
    slug: raw.slug,
    name: raw.name,
    author: raw.author,
    platform: raw.platform,
    url: raw.url,
    requires: raw.requires ?? [],
    category: raw.category,
    summaryKo: raw.summary_ko,
    beginnerReasonKo: raw.beginner_reason_ko,
    installDifficulty: raw.install_difficulty,
    gameplayImpact: raw.gameplay_impact,
    lastVerified: raw.last_verified,
  };
}

export const mods: Mod[] = modsFile.mods.map(normalizeMod);

/** slug 는 데이터에 이미 확정돼 있어 buildSlugMap(toSlug 재계산) 을 쓰지 않는다 */
export const modsBySlug: ReadonlyMap<string, Mod> = new Map(mods.map((m) => [m.slug, m]));

// ─────────────────────────────────────────────────────────────
// 조회 인덱스
// ─────────────────────────────────────────────────────────────
// slug 충돌은 buildSlugMap 이 빌드타임에 예외로 잡는다.

export const itemsBySlug = buildSlugMap(items, "items");
export const creaturesBySlug = buildSlugMap(creatures, "creatures");
export const bossesBySlug = buildSlugMap(bosses, "bosses");
export const foodBySlug = buildSlugMap(food, "food");
export const meadBySlug = buildSlugMap(meadPotions, "mead_potions");
export const biomesBySlug = buildSlugMap(biomes, "biomes");

/** nameEn → Item. 재료 이름으로 아이템을 되찾을 때 쓴다 */
export const itemsByNameEn: ReadonlyMap<string, Item> = new Map(items.map((i) => [i.nameEn, i]));

/**
 * 아이템/몬스터로 별도 등록되지 않은 이름의 번역 전용 사전.
 *
 * `data/food-biomes.json` 의 `biomes[].key_resources`/`key_creatures` 는
 * items.json·creatures.json 에 없는 이름을 다수 참조한다(예: 바이옴 개요용
 * 대표 자원 "Berries" 는 실제 아이템으로 등록되지 않고 이름만 언급됨).
 * 새 아이템/몬스터 엔티티를 만들지 않고 표시용 한글명만 보충하기 위한 사전.
 *
 * 번역 출처는 `data/food-biomes.json` `meta.notes` 방침과 동일
 * (나무위키, 스팀 한국 커뮤니티, KoreanTranslationFix 모드 등의 통용 표기).
 * 이미 items/creatures/bosses 등에 등록된 이름은 절대 포함하지 말 것
 * (중복 시 `nameKoByNameEn` 조합 순서상 이 사전이 덮어쓴다).
 */
const EXTRA_NAME_KO: Record<string, string> = {
  // 자원 (key_resources)
  Berries: "베리류",
  Mushrooms: "버섯",
  "Surtling Cores": "서틀링 코어",
  "Greydwarf Eyes": "회색 난쟁이의 눈",
  Thistle: "엉겅퀴",
  Ectoplasm: "엑토플라즘",
  Chitin: "키틴",
  "Serpent Meat": "바다뱀 고기",
  "Serpent Scales": "바다뱀 비늘",
  "Ocean Fish": "바다 물고기",
  "Withered Bone": "시든 뼈",
  "Turnip Seeds": "순무 씨앗",
  Ooze: "점액",
  Obsidian: "흑요석",
  "Onion Seeds": "양파 씨앗",
  "Freeze Gland": "냉기샘",
  Crystal: "수정",
  Barley: "보리",
  Flax: "아마",
  Cloudberries: "클라우드베리",
  "Lox Meat": "록스 고기",
  Needle: "바늘",
  Tar: "타르",
  "Black Core": "검은 코어",
  Sap: "수액",
  "Soft Tissue": "연조직",
  "Black Marble": "검은 대리석",
  "Yggdrasil Wood": "이그드라실 나무",
  Ashwood: "애쉬우드",
  Askvin: "애스크빈",
  "Bell Fragment": "종 파편",
  Iolite: "아이올라이트",
  Jade: "옥",
  Bloodstone: "블러드스톤",
  // 몬스터 (key_creatures)
  Bee: "꿀벌",
  Ghost: "유령",
  Serpent: "바다뱀",
  Leviathan: "레비아탄",
  Oozer: "우저",
  Cultist: "광신자",
  Bat: "박쥐",
  "Fuling Shaman": "풀링 주술사",
  "Fuling Berserker": "풀링 광전사",
  Growth: "그로쓰",
  "Seeker Soldier": "추적자 병사",
  Brood: "브루드",
  Charred: "카르드",
  "Fire Hazards": "화재 위험 요소",
  Gammeltroll: "감멜트롤",
  "Elakingar (Underground)": "엘라킹가르 (지하)",
  "Viking Ghost": "바이킹 유령",
};

/** nameEn → 한글명. 재료·드롭 표시에 공통으로 쓰는 룩업 */
export const nameKoByNameEn: ReadonlyMap<string, string> = new Map([
  ...items.map((e) => [e.nameEn, e.nameKo] as const),
  ...creatures.map((e) => [e.nameEn, e.nameKo] as const),
  ...bosses.map((e) => [e.nameEn, e.nameKo] as const),
  ...food.map((e) => [e.nameEn, e.nameKo] as const),
  ...meadPotions.map((e) => [e.nameEn, e.nameKo] as const),
  ...buildingPieces.map((e) => [e.nameEn, e.nameKo] as const),
  ...biomes.map((e) => [e.nameEn, e.nameKo] as const),
  ...ships.map((e) => [e.nameEn, e.nameKo] as const),
  ...magicItems.map((e) => [e.nameEn, e.nameKo] as const),
  ...Object.entries(EXTRA_NAME_KO),
]);

/**
 * nameEn → 위키 원본 이미지 URL. 로컬 개발용 임시 조치 (docs/LEGAL.md 1-1 참고).
 * 직접 제작 아이콘(`imageLocalPath`)이 채워지면 이 룩업을 걷어낼 것.
 */
export const imageByNameEn: ReadonlyMap<string, string> = new Map(
  [...items, ...creatures, ...bosses, ...food, ...meadPotions, ...biomes]
    .filter((e) => e.imageSourceUrl)
    .map((e) => [e.nameEn, e.imageSourceUrl as string]),
);

/** 영문명에 대응하는 위키 이미지 URL. 없으면 null */
export function imageSrc(nameEn: string): string | null {
  return imageByNameEn.get(nameEn) ?? null;
}

// ─────────────────────────────────────────────────────────────
// 공통 조회 함수
// ─────────────────────────────────────────────────────────────

/**
 * 영문명에 대응하는 한글명. 없으면 영문명을 그대로 돌려준다.
 * 재료·드롭 목록처럼 이름만 있는 참조를 표시할 때 쓸 것.
 */
export function koName(nameEn: string): string {
  return nameKoByNameEn.get(nameEn) ?? nameEn;
}

/** 포탈로 옮길 수 없는 아이템인지. 전용 목록이 stats 플래그보다 우선 */
export function isPortalRestricted(nameEn: string): boolean {
  if (portalRestrictedItems.has(nameEn)) return true;
  return itemsByNameEn.get(nameEn)?.stats.portalRestricted === true;
}

/** 해당 몬스터가 떨구는 것들 */
export function dropsByCreature(creatureNameEn: string): DropEntry[] {
  return dropTables.filter((d) => d.creatureNameEn === creatureNameEn);
}

/** 해당 아이템을 떨구는 몬스터들 — 아이템 상세의 "획득처" 섹션용 */
export function dropSourcesOfItem(itemNameEn: string): DropEntry[] {
  return dropTables.filter((d) => d.itemNameEn === itemNameEn);
}

/** 해당 아이템의 제작법. `items[].crafting` 을 우선하고 없으면 recipes 에서 찾는다 */
export function recipeOf(itemNameEn: string): Recipe | null {
  const item = itemsByNameEn.get(itemNameEn);
  if (item?.crafting) return item.crafting;
  return recipes.find((r) => r.itemNameEn === itemNameEn) ?? null;
}

/**
 * 해당 영문명으로 실제 상세 페이지가 생성되는지 판정한다.
 *
 * **다른 엔티티로 링크를 걸기 전에 반드시 통과시킬 것.**
 *
 * 데이터셋이 여러 번에 나눠 수집돼서 참조 무결성이 깨져 있다. 드롭 아이템
 * 44종 중 33종, 음식 재료 17종 중 16종이 `items[]` 에 없다. 이름만 보고
 * `/db/items/<slug>/` 로 링크하면 그 대부분이 404 가 된다.
 * 검색 유입이 유일한 트래픽 소스라 끊어진 링크는 그대로 손해다.
 *
 * 목록은 docs/DATA-SCHEMA.md "파일 간 참조 무결성" 참고.
 */
export function hasItemPage(nameEn: string): boolean {
  return itemsByNameEn.has(nameEn);
}

const creatureNames: ReadonlySet<string> = new Set(creatures.map((c) => c.nameEn));
const bossNames: ReadonlySet<string> = new Set(bosses.map((b) => b.nameEn));
const foodNames: ReadonlySet<string> = new Set(food.map((f) => f.nameEn));
const meadNames: ReadonlySet<string> = new Set(meadPotions.map((m) => m.nameEn));

export function hasCreaturePage(nameEn: string): boolean {
  return creatureNames.has(nameEn);
}

export function hasBossPage(nameEn: string): boolean {
  return bossNames.has(nameEn);
}

export function hasFoodPage(nameEn: string): boolean {
  return foodNames.has(nameEn);
}

export function hasMeadPage(nameEn: string): boolean {
  return meadNames.has(nameEn);
}

/**
 * 영문명에 대응하는 상세 페이지 경로. 페이지가 없으면 null.
 *
 * 아이템 → 몬스터 → 보스 → 음식 → 미드 순으로 찾는다. 엔티티 종류 간
 * 이름 충돌이 없음을 확인했으므로 순서는 결과에 영향을 주지 않는다.
 *
 * 링크를 걸 때는 반환값이 null 인지 먼저 확인하고, null 이면 텍스트로만 표시할 것.
 */
export function detailHref(nameEn: string): string | null {
  if (hasItemPage(nameEn)) return `/db/items/${toSlug(nameEn)}/`;
  if (hasCreaturePage(nameEn)) return `/db/creatures/${toSlug(nameEn)}/`;
  if (hasBossPage(nameEn)) return `/db/bosses/${toSlug(nameEn)}/`;
  if (hasFoodPage(nameEn)) return `/db/food/${toSlug(nameEn)}/`;
  if (hasMeadPage(nameEn)) return `/db/mead/${toSlug(nameEn)}/`;
  return null;
}

/** 이 아이템을 재료로 쓰는 제작법들 — 아이템 상세의 "쓰임새" 섹션용 */
export function usedInRecipes(itemNameEn: string): Recipe[] {
  return recipes.filter((r) => r.materials.some((m) => m.nameEn === itemNameEn));
}

/** 길들이기 정보 (없으면 null) */
export function tamingOf(creatureNameEn: string): TamingInfo | null {
  return tamingInfo.find((t) => t.creatureNameEn === creatureNameEn) ?? null;
}

/** 한글·영문 양쪽으로 검색. 도감 필터·통합 검색이 공통으로 쓴다 */
export function matchesQuery(entity: { nameEn: string; nameKo: string }, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return entity.nameEn.toLowerCase().includes(q) || entity.nameKo.toLowerCase().includes(q);
}

/** 데이터 수집 시점 — /about 출처 표기에 쓴다 */
export const dataCollectedAt: string = itemsFile.meta.collected_at;
