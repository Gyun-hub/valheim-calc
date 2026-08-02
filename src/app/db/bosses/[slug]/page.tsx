import { notFound } from "next/navigation";

import { BossNav } from "@/components/creatures/BossNav";
import { formatSummonItem, formatSummonLocation, forsakenPowerKo } from "@/components/creatures/bossText";
import { ResistanceBadges } from "@/components/creatures/ResistanceBadges";
import { Badge } from "@/components/ui/Badge";
import { BiomeBadge } from "@/components/ui/BiomeBadge";
import { Section } from "@/components/ui/Card";
import { EntityRef } from "@/components/ui/EntityRef";
import { PageHeader } from "@/components/ui/PageHeader";
import { MissingDataNote, Num, StatTable, statRows } from "@/components/ui/StatTable";
import { bosses, bossesBySlug } from "@/lib/data";
import { toStaticParams } from "@/lib/slug";

export function generateStaticParams() {
  return toStaticParams(bosses);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boss = bossesBySlug.get(slug);
  if (!boss) return {};

  const title = `${boss.nameKo} (${boss.nameEn})`;
  const description = `발헤임 보스 ${boss.nameKo}(${boss.nameEn}) 공략 정보. 소환법, 보상, 가호.`;

  return {
    title,
    description,
    alternates: { canonical: `/db/bosses/${slug}/` },
    openGraph: {
      title,
      description,
      images: boss.imageSourceUrl ? [boss.imageSourceUrl] : undefined,
    },
  };
}

export default async function BossDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const boss = bossesBySlug.get(slug);
  if (!boss) notFound();

  const power = forsakenPowerKo(boss.nameEn);
  const hasRewardData = Boolean(boss.trophyDrop) || boss.guaranteedDrops.length > 0;

  return (
    <>
      <PageHeader
        title={boss.nameKo}
        titleEn={boss.nameEn}
        imageSrc={boss.imageSourceUrl}
        biome={boss.biome}
      >
        <Badge tone="accent">
          진행 순서 {boss.order}/{bosses.length}
        </Badge>
        <BiomeBadge biome={boss.biome} />
      </PageHeader>

      <Section title="스탯">
        <StatTable
          rows={statRows([
            ["체력", boss.hp === null ? null : <Num unit="솔로 기준">{boss.hp}</Num>],
            ["서식 바이옴", <BiomeBadge key="biome" biome={boss.biome} />],
          ])}
        />
      </Section>

      <Section title="저항">
        <ResistanceBadges resistances={boss.resistances} />
      </Section>

      <Section title="소환법">
        {boss.summonItem ? (
          <p className="text-sm">
            <span className="font-medium">{formatSummonItem(boss.summonItem)}</span>{" "}
            {/* 여왕은 개수가 "9 + 1" 이라 숫자로 환원되지 않는다. 표시는 항상 라벨을 쓴다 */}
            <span className="num">×{boss.summonQtyLabel ?? "1"}</span>개를{" "}
            <span className="font-medium">
              {boss.summonLocation ? formatSummonLocation(boss.summonLocation) : "제단"}
            </span>
            에 바친다.
          </p>
        ) : (
          <MissingDataNote>소환 정보가 없습니다.</MissingDataNote>
        )}
      </Section>

      <Section title="보상">
        {hasRewardData ? (
          <div className="space-y-3 text-sm">
            {boss.trophyDrop && (
              <p className="flex flex-wrap items-center gap-1.5">
                <span className="font-medium">트로피</span>
                <EntityRef nameEn={boss.trophyDrop} />
                {boss.trophyDrop100pct && <Badge tone="success">100% 확정</Badge>}
              </p>
            )}
            {boss.guaranteedDrops.length > 0 && (
              <div>
                <p className="mb-1 font-medium">확정 드롭</p>
                <ul className="list-inside list-disc space-y-0.5">
                  {boss.guaranteedDrops.map((d) => (
                    <li key={d.itemNameEn}>
                      <EntityRef nameEn={d.itemNameEn} qty={d.qty} />
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <MissingDataNote>확인된 보상 데이터가 없습니다.</MissingDataNote>
        )}
      </Section>

      <Section title="가호 (Forsaken Power)">
        {power ? (
          <p className="text-sm">{power}</p>
        ) : (
          <MissingDataNote>가호 정보가 없습니다.</MissingDataNote>
        )}
      </Section>

      <BossNav bosses={bosses} current={boss} />
    </>
  );
}
