import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/Badge";
import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";
import { mods, modsBySlug } from "@/lib/data";
import { toStaticParams } from "@/lib/slug";

import { difficultyTone, impactTone } from "@/components/mods/labels";

export function generateStaticParams() {
  return toStaticParams(mods);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const mod = modsBySlug.get(slug);
  if (!mod) return {};

  return {
    title: mod.name,
    description: mod.summaryKo,
    alternates: { canonical: `/db/mods/${slug}/` },
  };
}

export default async function ModDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mod = modsBySlug.get(slug);
  if (!mod) notFound();

  return (
    <>
      <PageHeader title={mod.name} titleEn={mod.author}>
        <Badge tone="neutral">{mod.category}</Badge>
        <Badge tone={difficultyTone(mod.installDifficulty)}>설치 {mod.installDifficulty}</Badge>
        <Badge tone={impactTone(mod.gameplayImpact)}>밸런스 영향 {mod.gameplayImpact}</Badge>
      </PageHeader>

      <Section title="이 모드는">
        <p className="text-sm leading-relaxed">{mod.summaryKo}</p>
      </Section>

      <Section title="초보자에게 추천하는 이유">
        <p className="text-sm leading-relaxed">{mod.beginnerReasonKo}</p>
      </Section>

      <Section title="선행 설치 요구사항">
        {mod.requires.length === 0 ? (
          <p className="text-sm text-text-faint">별도 요구사항 없음</p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {mod.requires.map((req) => (
              <li key={req}>
                <Badge tone="accent">{req}</Badge>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="배포처">
        <p className="text-sm">
          {mod.platform} ·{" "}
          <a
            href={mod.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:text-accent-hover"
          >
            원본 페이지 바로가기
          </a>
        </p>
        <p className="mt-2 text-xs text-text-faint">
          모드 파일은 이 사이트에서 재배포하지 않습니다. 위 링크에서 직접 받으세요.
        </p>
      </Section>

      <Section title="정보 확인 시점">
        <p className="text-sm">
          <span className="num">{mod.lastVerified}</span> 기준. 게임·모드 패치로 호환성이 바뀔 수
          있으니, 오래됐다면 설치 전 배포 페이지에서 최신 상태를 다시 확인하세요.
        </p>
      </Section>
    </>
  );
}
