"use client";

/**
 * 도감 목록의 검색 + 카테고리 필터.
 *
 * 이 파일이 도감 쪽 유일한 클라이언트 컴포넌트다.
 * 데이터 전체를 넘기지 말고, 부모 Server Component 에서 표시에 필요한
 * 최소 필드만 추려 넘길 것 (docs/ARCHITECTURE.md 데이터 주입 원칙).
 */

export interface FilterOption {
  value: string;
  label: string;
}

export function FilterBar({
  query,
  onQueryChange,
  options,
  active,
  onActiveChange,
  placeholder = "한글 또는 영문명으로 검색",
}: {
  query: string;
  onQueryChange: (value: string) => void;
  /** 비어 있으면 필터 버튼줄을 숨긴다 */
  options?: FilterOption[];
  active?: string | null;
  onActiveChange?: (value: string | null) => void;
  placeholder?: string;
}) {
  return (
    <div className="mb-4 space-y-3">
      <input
        type="search"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder={placeholder}
        aria-label="검색"
        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm placeholder:text-text-faint focus:border-accent focus:outline-none"
      />

      {options && options.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label="전체"
            selected={!active}
            onClick={() => onActiveChange?.(null)}
          />
          {options.map((o) => (
            <FilterChip
              key={o.value}
              label={o.label}
              selected={active === o.value}
              onClick={() => onActiveChange?.(active === o.value ? null : o.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        selected
          ? "border-accent bg-accent text-accent-contrast font-medium"
          : "border-border bg-surface text-text-muted hover:border-border-strong hover:text-text"
      }`}
    >
      {label}
    </button>
  );
}

/** 필터 결과가 0건일 때 */
export function EmptyResult({ children = "검색 결과가 없습니다." }: { children?: React.ReactNode }) {
  return <p className="py-12 text-center text-text-muted text-sm">{children}</p>;
}
