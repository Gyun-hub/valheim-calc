import { notFound } from "next/navigation";

import { Badge, ConfidenceBadge } from "@/components/ui/Badge";
import { BiomeBadge } from "@/components/ui/BiomeBadge";
import { Section } from "@/components/ui/Card";
import { EntityRef } from "@/components/ui/EntityRef";
import { PageHeader } from "@/components/ui/PageHeader";
import { MissingDataNote, Num, StatTable, statRows } from "@/components/ui/StatTable";
import { DamageStat } from "@/components/creatures/DamageStat";
import { ResistanceBadges } from "@/components/creatures/ResistanceBadges";
import { creatures, creaturesBySlug, dropsByCreature, koName, tamingOf } from "@/lib/data";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(creatures);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const creature = creaturesBySlug.get(slug);
  if (!creature) return {};

  const title = `${creature.nameKo} (${creature.nameEn})`;
  const description = `발헤임 ${creature.nameKo}(${creature.nameEn}) 정보. 체력, 공격력, 저항, 드롭 아이템, 길들이기 정보.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/creatures/${slug}/` },
    openGraph: {
      title,
      description,
      images: creature.imageSourceUrl ? [creature.imageSourceUrl] : undefined,
    },
  };
}

export default async function CreatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const creature = creaturesBySlug.get(slug);
  if (!creature) notFound();

  const drops = dropsByCreature(creature.nameEn);
  const taming = tamingOf(creature.nameEn);

  return (
    <>
      <PageHeader
        title={creature.nameKo}
        titleEn={creature.nameEn}
        imageSrc={creature.imageSourceUrl}
        biome={creature.biomes[0] ?? null}
      >
        {creature.biomes.map((b) => (
          <BiomeBadge key={b} biome={b} />
        ))}
        <Badge tone={creature.behavior === "aggressive" ? "danger" : "success"}>
          {creature.behavior === "aggressive" ? "적대" : "비적대"}
        </Badge>
      </PageHeader>

      <Section title="기본 스탯">
        <StatTable
          rows={statRows([
            ["체력", creature.hp],
            ["공격력", <DamageStat key="damage" damage={creature.damage} />],
            [
              "서식 바이옴",
              <span key="biomes" className="flex flex-wrap gap-1.5">
                {creature.biomes.map((b) => (
                  <BiomeBadge key={b} biome={b} />
                ))}
              </span>,
            ],
          ])}
        />
      </Section>

      <Section title="저항">
        <ResistanceBadges resistances={creature.resistances} />
      </Section>

      <Section title="드롭">
        {drops.length === 0 ? (
          <MissingDataNote>확인된 드롭 데이터가 없습니다.</MissingDataNote>
        ) : (
          <ul className="space-y-2 text-sm">
            {drops.map((d) => (
              <li
                key={d.itemNameEn}
                className="flex flex-wrap items-center gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <EntityRef nameEn={d.itemNameEn} />
                <span className="text-text-muted">
                  확률 <Num unit="%">{d.chancePercent}</Num>
                </span>
                <span className="text-text-muted">
                  <Num unit="개">
                    {d.qtyMin === d.qtyMax ? d.qtyMin : `${d.qtyMin}~${d.qtyMax}`}
                  </Num>
                </span>
                <ConfidenceBadge confidence={d.confidence} />
              </li>
            ))}
          </ul>
        )}
      </Section>

      {taming && (
        <Section title="길들이기">
          <StatTable
            rows={statRows([
              [
                "먹이",
                taming.tamingFood.length > 0 ? taming.tamingFood.map(koName).join(", ") : null,
              ],
              [
                "길들이기 소요 시간",
                taming.tamingTimeMin !== null ? `${taming.tamingTimeMin}분` : null,
              ],
              [
                "양조통 소요 시간",
                taming.tamingBrewMin !== null ? `${taming.tamingBrewMin}분` : null,
              ],
              [
                "번식 먹이",
                taming.breedingFood.length > 0 ? taming.breedingFood.map(koName).join(", ") : null,
              ],
              [
                "번식 대기시간",
                taming.breedingCooldownHours !== null
                  ? `${taming.breedingCooldownHours}시간`
                  : null,
              ],
              ["별등급 유전", taming.starInheritance],
            ])}
          />
        </Section>
      )}
    </>
  );
}
