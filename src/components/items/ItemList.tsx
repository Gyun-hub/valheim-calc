"use client";

/**
 * 아이템 목록의 검색 + 카테고리 필터 상태 관리.
 *
 * 부모 Server Component 가 `Item` 전체가 아니라 표시에 필요한 최소 필드만
 * 골라 넘긴다 (docs/DEV-CONVENTIONS.md 4절 목록 페이지 골격 참고).
 */

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { CardGrid, EntityCard } from "@/components/ui/Card";
import { EmptyResult, FilterBar, type FilterOption } from "@/components/ui/FilterBar";
import { matchesQuery } from "@/lib/data";
import type { ItemCategory } from "@/lib/types";

import { CategoryBadge } from "./CategoryBadge";
import { CATEGORY_KO } from "./labels";

export interface ItemListRow {
  slug: string;
  nameKo: string;
  nameEn: string;
  category: ItemCategory;
  /** isPortalRestricted() 결과. 카드에 danger 배지로 표시 */
  portalRestricted: boolean;
  imageSrc?: string | null;
}

const CATEGORY_OPTIONS: FilterOption[] = (Object.keys(CATEGORY_KO) as ItemCategory[]).map((c) => ({
  value: c,
  label: CATEGORY_KO[c],
}));

export function ItemList({ rows }: { rows: ItemListRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      return matchesQuery(row, query);
    });
  }, [rows, query, category]);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        options={CATEGORY_OPTIONS}
        active={category}
        onActiveChange={setCategory}
      />

      {filtered.length === 0 ? (
        <EmptyResult />
      ) : (
        <CardGrid>
          {filtered.map((item) => (
            <EntityCard
              key={item.slug}
              href={`/db/items/${item.slug}/`}
              nameKo={item.nameKo}
              nameEn={item.nameEn}
              imageSrc={item.imageSrc}
            >
              <CategoryBadge category={item.category} />
              {item.portalRestricted && <Badge tone="danger">포탈 반입 불가</Badge>}
            </EntityCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}
