import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Card";
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

      <Section title="안락함과 휴식 버프">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            화로·침대·의자·왕좌 같은 가구를 10m 이내에 두고 앉거나 자면 &ldquo;안락함&rdquo;
            수치가 쌓입니다. 같은 종류의 가구를 여러 개 둬도 중복 적용되지 않고 가장 높은 값
            하나만 반영되므로, 안락함을 높이려면 화로·침대·좌석·탁자·배너처럼 서로 다른 종류의
            가구를 골고루 갖추는 편이 유리합니다.
          </p>
          <p>
            안락함이 쌓인 상태로 잠시 머무르면 &ldquo;휴식&rdquo; 버프가 붙습니다. 체력 회복
            속도가 50%, 스태미나 회복 속도가 100% 늘어나 전투와 채집 사이 회복이 훨씬
            빨라집니다. 지속시간은 &ldquo;안락함 수치 + 7분&rdquo;으로 계산되며, 예컨대 안락함
            10을 채웠다면 휴식 버프는 17분간 유지됩니다.
          </p>
          <p>
            안락함은 바이옴 고유의 속성이 아니라 그 시점까지 해금한 가구로 정해집니다. 아래
            진행 순서를 따라 바이옴을 하나씩 넘어가며 새 제작대와 재료를 얻을 때마다 거점에
            놓을 수 있는 가구도 늘어나므로, 안락함 역시 자연스럽게 함께 높아집니다.
          </p>
        </div>
      </Section>

      <BiomeTimeline rows={rows} />
    </>
  );
}
