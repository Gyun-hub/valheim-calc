import { BIOME_ORDER, biomeKo } from "@/components/ui/BiomeBadge";
import { PageHeader } from "@/components/ui/PageHeader";
import { CreatureBrowser, type CreatureListItem } from "@/components/creatures/CreatureBrowser";
import { creatures, imageSrc } from "@/lib/data";
import type { BiomeName } from "@/lib/types";

export const metadata = {
  title: "몬스터 도감",
  description: "발헤임 몬스터 27종 목록. 서식 바이옴, 체력, 공격성 정보를 검색·필터로 찾아보세요.",
  alternates: { canonical: "/db/creatures/" },
};

export default function CreaturesPage() {
  const rows: CreatureListItem[] = creatures.map((c) => ({
    slug: c.slug,
    nameKo: c.nameKo,
    nameEn: c.nameEn,
    biomes: c.biomes,
    hp: c.hp,
    behavior: c.behavior,
    imageSrc: imageSrc(c.nameEn),
  }));

  const biomeSet = new Set<BiomeName>();
  for (const c of creatures) {
    for (const b of c.biomes) biomeSet.add(b);
  }
  const biomeOptions = Array.from(biomeSet)
    .sort((a, b) => BIOME_ORDER[a] - BIOME_ORDER[b])
    .map((b) => ({ value: b, label: biomeKo(b) }));

  return (
    <>
      <PageHeader
        title="몬스터 도감"
        count={creatures.length}
        subtitle="발헤임에 등장하는 몬스터 정보. 서식 바이옴과 체력을 확인하세요."
      />
      <CreatureBrowser creatures={rows} biomeOptions={biomeOptions} />
    </>
  );
}
