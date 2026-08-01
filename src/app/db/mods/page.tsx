import { PageHeader } from "@/components/ui/PageHeader";
import { mods } from "@/lib/data";

import { ModList, type ModListRow } from "@/components/mods/ModList";

export const metadata = {
  title: "모드 카탈로그",
  description: "발헤임 초보자에게 추천하는 유틸·QoL 모드 목록. 설치 난이도와 선행 요구사항을 확인하세요.",
  alternates: { canonical: "/db/mods/" },
};

export default function ModsPage() {
  const rows: ModListRow[] = mods.map((m) => ({
    slug: m.slug,
    name: m.name,
    author: m.author,
    category: m.category,
    requires: m.requires,
    installDifficulty: m.installDifficulty,
    lastVerified: m.lastVerified,
  }));

  return (
    <>
      <PageHeader
        title="모드 카탈로그"
        count={mods.length}
        subtitle="초보자에게 추천하는 유틸·QoL 모드. 전부 서드파티 배포물이며 링크만 제공합니다."
      />
      <ModList rows={rows} />
    </>
  );
}
