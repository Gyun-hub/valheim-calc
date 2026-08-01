import { Badge, type BadgeTone } from "@/components/ui/Badge";
import type { ItemCategory } from "@/lib/types";

import { CATEGORY_KO } from "./labels";

const CATEGORY_TONE: Record<ItemCategory, BadgeTone> = {
  weapon: "danger",
  armor: "info",
  shield: "accent",
  tool: "warning",
  resource: "neutral",
};

/** 아이템 카테고리 배지 (무기·방어구·방패·도구·자원) */
export function CategoryBadge({ category }: { category: ItemCategory }) {
  return <Badge tone={CATEGORY_TONE[category]}>{CATEGORY_KO[category]}</Badge>;
}
