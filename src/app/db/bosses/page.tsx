import { BossRouteList, type BossRouteItem } from "@/components/creatures/BossRouteList";
import { PageHeader } from "@/components/ui/PageHeader";
import { bosses, imageSrc } from "@/lib/data";

export const metadata = {
  title: "보스 도감",
  description: "발헤임 보스 7종을 진행 순서(에이크쉬르 → 페이더)대로 정리했습니다.",
  alternates: { canonical: "/db/bosses/" },
};

export default function BossesPage() {
  const rows: BossRouteItem[] = bosses.map((b) => ({
    slug: b.slug,
    nameKo: b.nameKo,
    nameEn: b.nameEn,
    biome: b.biome,
    hp: b.hp,
    order: b.order,
    imageSrc: imageSrc(b.nameEn),
  }));

  return (
    <>
      <PageHeader
        title="보스 도감"
        count={bosses.length}
        subtitle="진행 순서대로 정리한 보스 목록. 각 보스를 눌러 소환법과 보상을 확인하세요."
      />
      <BossRouteList bosses={rows} />
    </>
  );
}
