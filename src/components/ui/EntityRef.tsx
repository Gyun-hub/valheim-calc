import Link from "next/link";

import { detailHref, koName } from "@/lib/data";

/**
 * 다른 엔티티를 이름으로 참조할 때 쓰는 링크.
 *
 * **엔티티 간 참조는 직접 `<Link>` 를 쓰지 말고 반드시 이걸 통할 것.**
 *
 * 데이터셋의 참조 무결성이 깨져 있어서 (드롭 아이템 44종 중 33종이
 * `items[]` 에 없음) 이름만 보고 링크를 걸면 대부분 404 가 된다.
 * 이 컴포넌트는 상세 페이지가 실제로 생성되는 이름만 링크로 만들고,
 * 나머지는 조용히 텍스트로 표시한다.
 *
 * 한글명이 없는 이름은 `koName` 이 영문명을 그대로 돌려준다 — 데이터가
 * 채워지는 대로 자동으로 한글로 바뀐다.
 */
export function EntityRef({
  nameEn,
  qty,
  className,
}: {
  nameEn: string;
  /** 있으면 이름 뒤에 수량을 붙인다 */
  qty?: number | null;
  className?: string;
}) {
  const label = koName(nameEn);
  const href = detailHref(nameEn);

  const body = (
    <>
      {label}
      {qty != null && <span className="num ml-1 text-text-muted">×{qty}</span>}
    </>
  );

  if (!href) {
    return <span className={className}>{body}</span>;
  }

  return (
    <Link href={href} className={`text-accent hover:text-accent-hover ${className ?? ""}`}>
      {body}
    </Link>
  );
}

const CHIP_BASE =
  "inline-flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors";

/**
 * 칩 모양 엔티티 참조. 재료 목록처럼 여러 개를 나열할 때 쓴다.
 * 링크 가능 여부에 따라 눌리는 칩과 정적 칩으로 갈린다.
 */
export function EntityChip({ nameEn, qty }: { nameEn: string; qty?: number | null }) {
  const label = koName(nameEn);
  const href = detailHref(nameEn);

  const body = (
    <>
      {label}
      {qty != null && <span className="num text-text-faint">×{qty}</span>}
    </>
  );

  if (!href) {
    return (
      <span className={`${CHIP_BASE} border-border bg-surface text-text-muted`}>{body}</span>
    );
  }

  return (
    <Link
      href={href}
      className={`${CHIP_BASE} border-border bg-surface hover:border-border-strong hover:bg-surface-raised`}
    >
      {body}
    </Link>
  );
}

/** 칩 목록 컨테이너 */
export function EntityChipList({
  names,
}: {
  /** `qty` 가 없으면 이름만 표시 */
  names: { nameEn: string; qty?: number | null }[];
}) {
  if (names.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {names.map((n) => (
        <li key={n.nameEn}>
          <EntityChip nameEn={n.nameEn} qty={n.qty} />
        </li>
      ))}
    </ul>
  );
}

/** 이름 목록을 쉼표로 이어 표시. 링크 가능한 것만 링크된다 */
export function EntityRefList({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  return (
    <span className="flex flex-wrap gap-x-1 gap-y-1">
      {names.map((name, index) => (
        <span key={name}>
          <EntityRef nameEn={name} />
          {index < names.length - 1 && <span className="text-text-faint">,</span>}
        </span>
      ))}
    </span>
  );
}
