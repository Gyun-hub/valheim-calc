"use client";

/**
 * 몬스터 목록의 검색 + 바이옴 필터. 이 파일이 몬스터 도감 쪽 유일한 클라이언트 컴포넌트다.
 * 부모 Server Component 에서 표시에 필요한 최소 필드만 추려 넘긴다.
 */

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { BiomeBadge } from "@/components/ui/BiomeBadge";
import { CardGrid, EntityCard } from "@/components/ui/Card";
import { EmptyResult, FilterBar, type FilterOption } from "@/components/ui/FilterBar";
import { matchesQuery } from "@/lib/data";
import type { BiomeName, CreatureBehavior } from "@/lib/types";

export interface CreatureListItem {
  slug: string;
  nameKo: string;
  nameEn: string;
  biomes: BiomeName[];
  hp: number | null;
  behavior: CreatureBehavior;
  imageSrc?: string | null;
}

export function CreatureBrowser({
  creatures,
  biomeOptions,
}: {
  creatures: CreatureListItem[];
  biomeOptions: FilterOption[];
}) {
  const [query, setQuery] = useState("");
  const [biome, setBiome] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return creatures.filter((c) => {
      if (biome && !c.biomes.includes(biome as BiomeName)) return false;
      return matchesQuery(c, query);
    });
  }, [creatures, query, biome]);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        options={biomeOptions}
        active={biome}
        onActiveChange={setBiome}
      />

      {filtered.length === 0 ? (
        <EmptyResult />
      ) : (
        <CardGrid>
          {filtered.map((c) => (
            <EntityCard
              key={c.slug}
              href={`/db/creatures/${c.slug}/`}
              nameKo={c.nameKo}
              nameEn={c.nameEn}
              imageSrc={c.imageSrc}
            >
              {c.biomes.map((b) => (
                <BiomeBadge key={b} biome={b} />
              ))}
              {c.hp !== null && <Badge tone="neutral">체력 {c.hp}</Badge>}
            </EntityCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}
