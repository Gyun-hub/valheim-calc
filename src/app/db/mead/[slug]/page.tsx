import { notFound } from "next/navigation";

import {
  describeBrewTime,
  describeBrewYield,
  describeMagnitude,
  effectKo,
} from "@/components/food/meadFormat";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { EntityChipList } from "@/components/ui/EntityRef";
import { StatTable, statRows } from "@/components/ui/StatTable";
import { meadBySlug, meadPotions } from "@/lib/data";
import { formatDuration, parseQuantifiedIngredient } from "@/lib/parse";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(meadPotions);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mead = meadBySlug.get(slug);
  if (!mead) return {};

  const title = `${mead.nameKo} (${mead.nameEn})`;
  const description = `${mead.nameKo} — ${effectKo(mead.effect)} 효과를 지닌 미드.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/mead/${slug}/` },
    openGraph: {
      title,
      description,
      images: mead.imageSourceUrl ? [mead.imageSourceUrl] : undefined,
    },
  };
}

export default async function MeadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mead = meadBySlug.get(slug);
  if (!mead) notFound();

  const durationText =
    mead.durationSec === 0 || mead.durationSec === null
      ? "즉시 효과 (지속시간 없음)"
      : formatDuration(mead.durationSec);

  const cooldownText =
    mead.cooldownSec === 0 || mead.cooldownSec === null
      ? "쿨다운 없음"
      : formatDuration(mead.cooldownSec);

  return (
    <>
      <PageHeader title={mead.nameKo} titleEn={mead.nameEn} imageSrc={mead.imageSourceUrl}>
        <Badge tone="info">{effectKo(mead.effect)}</Badge>
      </PageHeader>

      <Section title="효과">
        <p className="text-sm">{describeMagnitude(mead.magnitude)}</p>
        <StatTable
          rows={statRows([
            ["지속시간", durationText],
            ["쿨다운", cooldownText],
          ])}
        />
      </Section>

      <Section title="양조법">
        {mead.brewIngredients.length === 0 ? (
          <p className="text-sm text-text-faint">양조 재료 정보가 없습니다.</p>
        ) : (
          <EntityChipList names={mead.brewIngredients.map(parseQuantifiedIngredient)} />
        )}
      </Section>

      <Section title="양조 시간 · 산출량">
        <StatTable
          rows={statRows([
            ["양조 시간", describeBrewTime(mead.brewTime)],
            ["산출량", describeBrewYield(mead.brewYield)],
          ])}
        />
      </Section>
    </>
  );
}
