import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { BiomeBadge } from "@/components/ui/BiomeBadge";
import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityChipList } from "@/components/ui/EntityRef";
import { MissingDataNote, StatTable, statRows } from "@/components/ui/StatTable";
import { food, foodBySlug } from "@/lib/data";
import { formatDuration } from "@/lib/parse";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(food);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = foodBySlug.get(slug);
  if (!item) return {};

  const title = `${item.nameKo} (${item.nameEn})`;
  const description = `${item.nameKo} 음식 스탯 — 체력 +${item.health}, 스태미나 +${item.stamina}.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/food/${slug}/` },
    openGraph: {
      title,
      description,
      images: item.imageSourceUrl ? [item.imageSourceUrl] : undefined,
    },
  };
}

export default async function FoodDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = foodBySlug.get(slug);
  if (!item) notFound();

  const regenText =
    item.regenHpPerSec !== null ? `${item.regenHpPerSec} HP/초` : item.regenRaw ?? null;

  const totalRegen =
    item.regenHpPerSec !== null ? Math.round(item.regenHpPerSec * item.durationSec) : null;

  return (
    <>
      <PageHeader
        title={item.nameKo}
        titleEn={item.nameEn}
        imageSrc={item.imageSourceUrl}
        biome={item.biome}
      >
        <BiomeBadge biome={item.biome} />
        <Badge tone="neutral">티어 {item.tier}</Badge>
        {item.eitr > 0 && <Badge tone="accent">마법 빌드용</Badge>}
      </PageHeader>

      <Section title="스탯">
        <StatTable
          rows={statRows([
            ["체력", `+${item.health}`],
            ["스태미나", `+${item.stamina}`],
            ["에이트르", `+${item.eitr}`],
            ["지속시간", formatDuration(item.durationSec)],
            ["회복력", regenText],
          ])}
        />
      </Section>

      <Section title="재료">
        {item.ingredients.length === 0 ? (
          <MissingDataNote>원자재 음식입니다. 채집·사냥으로 직접 얻습니다.</MissingDataNote>
        ) : (
          <EntityChipList names={item.ingredients.map((nameEn) => ({ nameEn }))} />
        )}
      </Section>

      <Section title="총 회복량 (참고)">
        {totalRegen !== null ? (
          <>
            <p className="text-sm">
              지속시간 동안 회복력을 그대로 적용하면 약{" "}
              <span className="font-semibold text-accent">{totalRegen} HP</span> 를 회복합니다.
            </p>
            <MissingDataNote>
              회복력({item.regenHpPerSec} HP/초) × 지속시간({item.durationSec}초)으로 계산한
              참고용 수치이며, 실제로는 최대 체력을 넘겨 회복하지 않습니다.
            </MissingDataNote>
          </>
        ) : (
          <MissingDataNote>
            회복력 원본 표기({item.regenRaw ?? "정보 없음"})가 숫자로 환산되지 않아 총 회복량을
            계산할 수 없습니다.
          </MissingDataNote>
        )}
      </Section>
    </>
  );
}
