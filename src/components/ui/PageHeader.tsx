import { biomeStyle } from "./BiomeBadge";
import type { BiomeName } from "@/lib/types";

/**
 * 도감·계산기 페이지 상단 공통 헤더.
 *
 * `biome` 을 넘기면 제목 위에 티어 색 띠가 붙어 상세 페이지에서도
 * 진행 단계가 한눈에 보인다.
 */
export function PageHeader({
  title,
  titleEn,
  subtitle,
  count,
  imageSrc,
  biome,
  children,
}: {
  title: string;
  /** 한/영 병기용 영문명. 상세 페이지에서 쓴다 */
  titleEn?: string;
  subtitle?: string;
  /** 목록 페이지의 항목 수. 파생 수치는 호출부에서 `arr.length` 로 넘길 것 */
  count?: number;
  /** 위키 원본 이미지 URL. 상세 페이지 전용, 로컬 개발용 (docs/LEGAL.md 1-1) */
  imageSrc?: string | null;
  biome?: BiomeName | null;
  /** 제목 아래에 붙일 배지 등 */
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8" style={biome ? biomeStyle(biome) : undefined}>
      {biome && (
        <span
          aria-hidden
          className="mb-3 block h-1 w-12"
          style={{ backgroundColor: "var(--biome-current)" }}
        />
      )}

      <div className="flex items-start gap-4">
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt=""
            loading="lazy"
            className="h-16 w-16 shrink-0 rounded border border-border bg-surface-raised object-contain p-1"
          />
        )}
        <div className="min-w-0">
          <h1 className="font-display flex flex-wrap items-baseline gap-x-3 gap-y-1 text-3xl font-bold">
            {title}
            {titleEn && (
              <span className="num text-base font-normal text-text-faint">{titleEn}</span>
            )}
            {count !== undefined && (
              <span className="num text-sm font-normal text-text-faint">{count}종</span>
            )}
          </h1>

          {subtitle && <p className="mt-2 text-sm text-text-muted">{subtitle}</p>}
          {children && <div className="mt-3 flex flex-wrap items-center gap-1.5">{children}</div>}
        </div>
      </div>
    </header>
  );
}
