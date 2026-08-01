"use client";

/**
 * 모드 카탈로그 목록 — 검색 + 카테고리 필터.
 *
 * 부모 Server Component 가 표시에 필요한 최소 필드만 골라 넘긴다
 * (docs/DEV-CONVENTIONS.md 4절 목록 페이지 골격 참고).
 */

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { CardGrid, EntityCard } from "@/components/ui/Card";
import { EmptyResult, FilterBar, type FilterOption } from "@/components/ui/FilterBar";

import { difficultyTone } from "./labels";

export interface ModListRow {
  slug: string;
  name: string;
  author: string;
  category: string;
  requires: string[];
  installDifficulty: string;
  lastVerified: string;
}

export function ModList({ rows }: { rows: ModListRow[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const categoryOptions: FilterOption[] = useMemo(() => {
    const set = new Set(rows.map((r) => r.category));
    return Array.from(set).map((c) => ({ value: c, label: c }));
  }, [rows]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (category && row.category !== category) return false;
      if (!q) return true;
      return row.name.toLowerCase().includes(q) || row.author.toLowerCase().includes(q);
    });
  }, [rows, query, category]);

  return (
    <>
      <FilterBar
        query={query}
        onQueryChange={setQuery}
        options={categoryOptions}
        active={category}
        onActiveChange={setCategory}
      />

      {filtered.length === 0 ? (
        <EmptyResult />
      ) : (
        <CardGrid>
          {filtered.map((mod) => (
            <EntityCard
              key={mod.slug}
              href={`/db/mods/${mod.slug}/`}
              nameKo={mod.name}
              nameEn={mod.author}
            >
              <Badge tone={difficultyTone(mod.installDifficulty)}>
                설치 {mod.installDifficulty}
              </Badge>
              {mod.requires.length > 0 && <Badge tone="accent">BepInEx 필요</Badge>}
              <span className="num text-[11px] text-text-faint">확인 {mod.lastVerified}</span>
            </EntityCard>
          ))}
        </CardGrid>
      )}
    </>
  );
}
