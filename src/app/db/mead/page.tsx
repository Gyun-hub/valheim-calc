import { PageHeader } from "@/components/ui/PageHeader";
import { MeadList } from "@/components/food/MeadList";
import { imageSrc, meadPotions } from "@/lib/data";

export const metadata = {
  title: "미드·포션 도감",
  description: "발헤임 미드 16종. 효과별로 찾아보고 지속시간을 확인하세요.",
  alternates: { canonical: "/db/mead/" },
};

export default function MeadPage() {
  const rows = meadPotions.map((m) => ({
    slug: m.slug,
    nameKo: m.nameKo,
    nameEn: m.nameEn,
    effect: m.effect,
    durationSec: m.durationSec,
    imageSrc: imageSrc(m.nameEn),
  }));

  return (
    <>
      <PageHeader
        title="미드·포션 도감"
        subtitle="효과별로 필터링해 원하는 미드를 찾아보세요."
        count={meadPotions.length}
      />
      <MeadList rows={rows} />
    </>
  );
}
