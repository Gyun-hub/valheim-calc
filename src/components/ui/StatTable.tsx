/**
 * 상세 페이지의 스탯 표. 값이 null 인 행은 자동으로 숨긴다.
 *
 * 결측 데이터가 많은 데이터셋이라 (아이템 무게 74개 전부 null 등)
 * 빈 행을 그대로 노출하면 표가 "-" 로 도배된다.
 */
export interface StatRow {
  label: string;
  value: React.ReactNode;
}

/** null·undefined·빈 문자열 행을 걸러 `StatRow[]` 로 만든다 */
export function statRows(
  entries: [label: string, value: React.ReactNode | null | undefined][],
): StatRow[] {
  return entries
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([label, value]) => ({ label, value }));
}

/**
 * 수치 표시. 계산기 사이트의 본체라 등폭 숫자로 고정한다.
 * 자릿수가 세로로 맞아야 값을 눈으로 비교할 수 있다.
 */
export function Num({ children, unit }: { children: React.ReactNode; unit?: string }) {
  return (
    <span className="num">
      {children}
      {unit && <span className="ml-0.5 text-xs text-text-faint">{unit}</span>}
    </span>
  );
}

export function StatTable({ rows }: { rows: StatRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-text-faint">표시할 수치 데이터가 없습니다.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b border-border last:border-0">
              <th
                scope="row"
                className="w-36 whitespace-nowrap py-2.5 pr-4 text-left align-top font-normal text-text-muted"
              >
                {row.label}
              </th>
              <td className="py-2.5 align-top">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** 결측 데이터 안내. 값이 없는 이유를 사용자에게 알린다 */
export function MissingDataNote({ children }: { children: React.ReactNode }) {
  return <p className="mt-2 text-xs text-text-faint">※ {children}</p>;
}
