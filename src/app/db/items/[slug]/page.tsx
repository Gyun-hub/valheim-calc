import { notFound } from "next/navigation";

import { CategoryBadge } from "@/components/items/CategoryBadge";
import { DropSourceList } from "@/components/items/DropSourceList";
import { damageTypeRows, stationLabel, yesNo } from "@/components/items/labels";
import { MaterialList, UsedInList } from "@/components/items/MaterialList";
import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { MissingDataNote, StatTable, statRows } from "@/components/ui/StatTable";
import {
  dropSourcesOfItem,
  isPortalRestricted,
  items,
  itemsBySlug,
  recipeOf,
  usedInRecipes,
} from "@/lib/data";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(items);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = itemsBySlug.get(slug);
  if (!item) return {};

  const title = `${item.nameKo} (${item.nameEn})`;
  const description = `발헤임 ${item.nameKo}(${item.nameEn}) 스탯, 제작법, 획득처, 포탈 반입 가능 여부를 한글로 확인하세요.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/items/${slug}/` },
    openGraph: {
      title,
      description,
      images: item.imageSourceUrl ? [item.imageSourceUrl] : undefined,
    },
  };
}

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = itemsBySlug.get(slug);
  if (!item) notFound();

  const stats = item.stats;
  const rows = statRows([
    ...damageTypeRows(stats.damageTypes),
    ["방어력", stats.armor],
    ["막기력", stats.blockPower],
    ["내구도", stats.durability],
    ["스택 크기", stats.stackSize],
    ["무기 종류", stats.weaponType],
    ["이동속도 페널티", stats.movementPenalty],
    ["이동속도 보너스", stats.movementBonus],
    ["패링 보너스", stats.parryBonus],
    ["패링 포스", stats.parryForce],
    ["세트 효과", stats.setBonus],
    ["냉기 저항", yesNo(stats.coldResistance)],
    ["독 저항", yesNo(stats.poisonResistance)],
    ["채집 대상", stats.harvest],
    ["투척 가능", yesNo(stats.throwable)],
  ]);

  const recipe = recipeOf(item.nameEn);
  const dropSources = dropSourcesOfItem(item.nameEn);
  const usedIn = usedInRecipes(item.nameEn);
  const portalRestricted = isPortalRestricted(item.nameEn);

  return (
    <>
      <PageHeader title={item.nameKo} titleEn={item.nameEn} imageSrc={item.imageSourceUrl}>
        <CategoryBadge category={item.category} />
        {portalRestricted && <Badge tone="danger">포탈 반입 불가</Badge>}
      </PageHeader>

      <Section title="스탯">
        <StatTable rows={rows} />
        <MissingDataNote>무게 데이터는 아직 수집되지 않았습니다.</MissingDataNote>
      </Section>

      {recipe && (
        <Section title="제작법">
          <p className="text-sm text-text-muted mb-2">
            {stationLabel(recipe.station.name, recipe.station.level)}
          </p>
          <MaterialList materials={recipe.materials} />
        </Section>
      )}

      {dropSources.length > 0 && (
        <Section title="획득처">
          <DropSourceList drops={dropSources} />
        </Section>
      )}

      {usedIn.length > 0 && (
        <Section title="쓰임새">
          <UsedInList recipes={usedIn} materialNameEn={item.nameEn} />
        </Section>
      )}

      <Section title="포탈 반입">
        {portalRestricted ? (
          <Badge tone="danger">반입 불가</Badge>
        ) : (
          <Badge tone="success">반입 가능</Badge>
        )}
      </Section>
    </>
  );
}
