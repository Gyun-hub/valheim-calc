import { PageHeader } from "@/components/ui/PageHeader";
import { imageSrc, isPortalRestricted, items } from "@/lib/data";

import { ItemList, type ItemListRow } from "@/components/items/ItemList";

export const metadata = {
  title: "아이템 도감",
  description:
    "발헤임(Valheim) 아이템 전체 목록. 무기·방어구·방패·도구·자원 스탯과 제작법을 한글로 확인하세요.",
  alternates: { canonical: "/db/items/" },
};

export default function ItemsPage() {
  // 클라이언트 컴포넌트에는 표시에 필요한 최소 필드만 추려서 넘긴다
  const rows: ItemListRow[] = items.map((i) => ({
    slug: i.slug,
    nameKo: i.nameKo,
    nameEn: i.nameEn,
    category: i.category,
    portalRestricted: isPortalRestricted(i.nameEn),
    imageSrc: imageSrc(i.nameEn),
  }));

  return (
    <>
      <PageHeader title="아이템 도감" subtitle="무기 · 방어구 · 방패 · 도구 · 자원" count={items.length} />
      <ItemList rows={rows} />
    </>
  );
}
