import { PageHeader } from "@/components/ui/PageHeader";
import { FoodList } from "@/components/food/FoodList";
import { food, imageSrc } from "@/lib/data";

export const metadata = {
  title: "음식 도감",
  description: "발헤임 음식 38종. 체력·스태미나·에이트르 회복량과 지속시간 비교.",
  alternates: { canonical: "/db/food/" },
};

export default function FoodPage() {
  // 클라이언트 컴포넌트에는 표시에 필요한 필드만 추려서 넘긴다
  const rows = food.map((f) => ({
    slug: f.slug,
    nameKo: f.nameKo,
    nameEn: f.nameEn,
    biome: f.biome,
    health: f.health,
    stamina: f.stamina,
    eitr: f.eitr,
    tier: f.tier,
    imageSrc: imageSrc(f.nameEn),
  }));

  return (
    <>
      <PageHeader
        title="음식 도감"
        subtitle="체력·스태미나·에이트르 회복량을 기준으로 비교해 보세요."
        count={food.length}
      />
      <FoodList rows={rows} />
    </>
  );
}
