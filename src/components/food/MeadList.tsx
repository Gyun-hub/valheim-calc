"use client";

/** 미드·포션 도감 목록 — 검색 + 효과별 필터. */

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { CardGrid, EntityCard } from "@/components/ui/Card";
import { EmptyResult, FilterBar } from "@/components/ui/FilterBar";
import { matchesQuery } from "@/lib/data";
import { formatDuration } from "@/lib/parse";
import { effectKo } from "@/components/food/meadFormat";

export interface MeadRow {
  slug: string;
  nameKo: string;
  nameEn: string;
  effect: string;
  durationSec: number | null;
  imageSrc?: string | null;
}

export function MeadList({ rows }: { rows: MeadRow[] }) {
  const [query, setQuery] = useState("");
  const [effect, setEffect] = useState<string | null>(null);

  const effectOptions = useMemo(() => {
    const set = new Set(rows.map((r) => r.effect));
    return Array.from(set).map((e) => ({ value: e, label: effectKo(e) }));
  }, [rows]);

  const filtered = useMemo(() => {
    return rows
      .filter((r) => matchesQuery(r, query))
      .filter((r) => !effect || r.effect === effect);
  }, [rows, query, effect]);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        options={effectOptions}
        active={effect}
        onActiveChange={setEffect}
      />

      {filtered.length === 0 ? (
        <EmptyResult />
      ) : (
        <CardGrid>
          {filtered.map((m) => (
            <EntityCard
              key={m.slug}
              href={`/db/mead/${m.slug}/`}
              nameKo={m.nameKo}
              nameEn={m.nameEn}
              imageSrc={m.imageSrc}
            >
              <Badge tone="info">{effectKo(m.effect)}</Badge>
              <Badge tone="neutral">
                {m.durationSec === 0 || m.durationSec === null
                  ? "즉시 효과"
                  : formatDuration(m.durationSec)}
              </Badge>
            </EntityCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}
