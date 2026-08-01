const TONES = {
  neutral: "border-border bg-surface-raised text-text-muted",
  accent: "border-accent/40 bg-accent/10 text-accent",
  danger: "border-danger/40 bg-danger/10 text-danger",
  warning: "border-warning/40 bg-warning/10 text-warning",
  success: "border-success/40 bg-success/10 text-success",
  info: "border-info/40 bg-info/10 text-info",
} as const;

export type BadgeTone = keyof typeof TONES;

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-xs ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * 드롭률 데이터의 신뢰도 표기.
 * 확률을 보여주는 곳에는 **반드시** 함께 노출할 것 (docs/LEGAL.md 1-4).
 */
export function ConfidenceBadge({ confidence }: { confidence: "datamined" | "community" }) {
  return confidence === "datamined" ? (
    <Badge tone="success">게임 파일 추출</Badge>
  ) : (
    <Badge tone="warning">커뮤니티 추정</Badge>
  );
}
