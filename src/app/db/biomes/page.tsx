import { PageHeader } from "@/components/ui/PageHeader";
import { BiomeTimeline } from "@/components/food/BiomeTimeline";
import { biomes, imageSrc } from "@/lib/data";

export const metadata = {
  title: "바이옴 도감",
  description: "발헤임 바이옴 9종을 진행 순서대로 확인하세요.",
  alternates: { canonical: "/db/biomes/" },
};

export default function BiomesPage() {
  // biomes 는 이미 progressionOrder 로 정렬돼 있다 (@/lib/data)
  const rows = biomes.map((b) => ({
    slug: b.slug,
    nameKo: b.nameKo,
    nameEn: b.nameEn,
    bossName: b.bossName,
    imageSrc: imageSrc(b.nameEn),
  }));

  return (
    <>
      <PageHeader
        title="바이옴 도감"
        subtitle="초원에서 극북까지, 발헤임 여정의 진행 순서입니다."
        count={biomes.length}
      />
      <BiomeTimeline rows={rows} />
    </>
  );
}
