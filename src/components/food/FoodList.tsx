"use client";

/**
 * 음식 도감 목록 — 검색 + 바이옴 필터 + 정렬.
 *
 * 음식 계산기(Phase 1)의 전신 역할이라 체력·스태미나·에이트르·티어 기준으로
 * 서로 비교하기 쉬워야 한다. 정렬은 항상 내림차순(수치가 큰 음식이 위로).
 */

import { useMemo, useState } from "react";

import { CardGrid, EntityCard } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BiomeBadge, biomeKo, BIOME_ORDER } from "@/components/ui/BiomeBadge";
import { EmptyResult, FilterBar } from "@/components/ui/FilterBar";
import { matchesQuery } from "@/lib/data";
import type { BiomeName } from "@/lib/types";

export interface FoodRow {
  slug: string;
  nameKo: string;
  nameEn: string;
  biome: BiomeName;
  health: number;
  stamina: number;
  eitr: number;
  tier: number;
  imageSrc?: string | null;
}

type SortKey = "health" | "stamina" | "eitr" | "tier";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "health", label: "체력순" },
  { value: "stamina", label: "스태미나순" },
  { value: "eitr", label: "에이트르순" },
  { value: "tier", label: "티어순" },
];

export function FoodList({ rows }: { rows: FoodRow[] }) {
  const [query, setQuery] = useState("");
  const [biome, setBiome] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("health");

  const biomeOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.biome));
    return Array.from(set)
      .sort((a, b) => BIOME_ORDER[a] - BIOME_ORDER[b])
      .map((b) => ({ value: b, label: biomeKo(b) }));
  }, [rows]);

  const filtered = useMemo(() => {
    return rows
      .filter((r) => matchesQuery(r, query))
      .filter((r) => !biome || r.biome === biome)
      .sort((a, b) => b[sort] - a[sort]);
  }, [rows, query, biome, sort]);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        options={biomeOptions}
        active={biome}
        onActiveChange={setBiome}
      />

      <div className="mb-4 flex items-center gap-2 text-sm">
        <span className="text-text-muted">정렬</span>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm focus:border-accent focus:outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <EmptyResult />
      ) : (
        <CardGrid>
          {filtered.map((f) => (
            <EntityCard
              key={f.slug}
              href={`/db/food/${f.slug}/`}
              nameKo={f.nameKo}
              nameEn={f.nameEn}
              imageSrc={f.imageSrc}
            >
              <BiomeBadge biome={f.biome} />
              <Badge tone="neutral">티어 {f.tier}</Badge>
              <Badge tone="danger">체력 +{f.health}</Badge>
              <Badge tone="success">스태미나 +{f.stamina}</Badge>
              {f.eitr > 0 && <Badge tone="accent">에이트르 +{f.eitr} · 마법 빌드</Badge>}
            </EntityCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}
