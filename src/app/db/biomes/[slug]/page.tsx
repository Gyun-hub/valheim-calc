import { notFound } from "next/navigation";

import { specialMechanicsKo, structureKo } from "@/components/food/biomeFormat";
import { Badge } from "@/components/ui/Badge";
import { BiomeRail } from "@/components/ui/BiomeBadge";
import { Section } from "@/components/ui/Card";
import { EntityChip, EntityChipList } from "@/components/ui/EntityRef";
import { PageHeader } from "@/components/ui/PageHeader";
import { MissingDataNote } from "@/components/ui/StatTable";
import { biomes, biomesBySlug, food } from "@/lib/data";
import { toStaticParams } from "@/lib/slug";
import type { BiomeName } from "@/lib/types";

export function generateStaticParams() {
  return toStaticParams(biomes);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const biome = biomesBySlug.get(slug);
  if (!biome) return {};

  const title = `${biome.nameKo} (${biome.nameEn})`;
  const description = `발헤임 ${biome.nameKo} 바이옴 — 주요 자원, 서식 몬스터, 구조물, 얻을 수 있는 음식.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/biomes/${slug}/` },
    openGraph: {
      title,
      description,
      images: biome.imageSourceUrl ? [biome.imageSourceUrl] : undefined,
    },
  };
}

export default async function BiomeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const biome = biomesBySlug.get(slug);
  if (!biome) notFound();

  // progressionOrder 는 정수가 아니다 (바다는 2.5). 표시용 순서는 배열 위치로 센다
  const order = biomes.findIndex((b) => b.slug === biome.slug) + 1;
  const biomeFood = food.filter((f) => f.biome === biome.nameEn);
  const railBiomes = biomes.map((b) => b.nameEn as BiomeName);

  return (
    <>
      <PageHeader
        title={biome.nameKo}
        titleEn={biome.nameEn}
        imageSrc={biome.imageSourceUrl}
        biome={biome.nameEn as BiomeName}
      >
        <Badge tone="accent">
          진행 순서 {order} / {biomes.length}
        </Badge>
        {!biome.released && <Badge tone="warning">미출시 콘텐츠</Badge>}
      </PageHeader>

      <div className="mb-8">
        <BiomeRail biomes={railBiomes} active={biome.nameEn as BiomeName} />
      </div>

      <Section title="보스">
        {biome.bossName ? (
          <EntityChip nameEn={biome.bossName} />
        ) : biome.released ? (
          <MissingDataNote>이 바이옴에는 지역 보스가 없습니다.</MissingDataNote>
        ) : (
          <MissingDataNote>아직 공개되지 않았습니다.</MissingDataNote>
        )}
      </Section>

      <Section title="주요 자원">
        {biome.keyResources.length === 0 ? (
          <MissingDataNote>등록된 자원 정보가 없습니다.</MissingDataNote>
        ) : (
          <EntityChipList names={biome.keyResources.map((nameEn) => ({ nameEn }))} />
        )}
      </Section>

      <Section title="주요 몬스터">
        {biome.keyCreatures.length === 0 ? (
          <MissingDataNote>등록된 몬스터 정보가 없습니다.</MissingDataNote>
        ) : (
          <EntityChipList names={biome.keyCreatures.map((nameEn) => ({ nameEn }))} />
        )}
      </Section>

      <Section title="주요 구조물">
        {biome.notableStructures.length === 0 ? (
          <MissingDataNote>등록된 구조물 정보가 없습니다.</MissingDataNote>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {biome.notableStructures.map((name) => (
              <li key={name}>
                <Badge tone="neutral">{structureKo(name)}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="특수 환경">
        <p className="text-sm leading-relaxed">{specialMechanicsKo(biome.nameEn)}</p>
      </Section>

      <Section title="이 바이옴의 음식">
        {biomeFood.length === 0 ? (
          <MissingDataNote>이 바이옴에서 얻는 음식 데이터가 없습니다.</MissingDataNote>
        ) : (
          <EntityChipList names={biomeFood.map((f) => ({ nameEn: f.nameEn }))} />
        )}
      </Section>
    </>
  );
}
