import Link from "next/link";

import { BiomeRail, biomeKo } from "@/components/ui/BiomeBadge";
import { biomes, bosses, creatures, food, items, meadPotions } from "@/lib/data";
import type { BiomeName } from "@/lib/types";

/**
 * 홈.
 *
 * 히어로는 바이옴 진행 레일이다. 발헤임에서 가장 특징적인 것은 개별 수치가
 * 아니라 "초원에서 시작해 한 바이옴씩 뚫는다"는 진행 구조이고, 플레이어가
 * 무언가를 찾아보는 이유도 대개 다음 바이옴을 준비하기 위해서다.
 *
 * 계산기 허브는 착수 순서상 마지막이라 (docs/ROADMAP.md) 지금은 도감만 연결한다.
 */

const DB_LINKS = [
  { href: "/db/items/", label: "아이템", count: items.length, desc: "무기 · 방어구 · 자원" },
  { href: "/db/creatures/", label: "몬스터", count: creatures.length, desc: "체력 · 저항 · 드롭" },
  { href: "/db/bosses/", label: "보스", count: bosses.length, desc: "소환법 · 가호" },
  { href: "/db/food/", label: "음식", count: food.length, desc: "체력 · 스태미나 · 에이트르" },
  { href: "/db/mead/", label: "미드 · 포션", count: meadPotions.length, desc: "효과 · 양조법" },
  { href: "/db/biomes/", label: "바이옴", count: biomes.length, desc: "자원 · 서식 몬스터" },
];

export default function HomePage() {
  const railBiomes = biomes.map((b) => b.nameEn as BiomeName);

  return (
    <>
      <section className="mb-12">
        <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl">
          발헤임을 숫자로 읽는다
        </h1>
        <p className="mt-3 max-w-xl text-text-muted">
          제작에 필요한 재료, 음식 조합, 드롭 확률. 게임을 멈추지 않고 찾을 수 있게 한국어로
          정리했습니다.
        </p>

        <div className="mt-8">
          <h2 className="mb-2 text-xs uppercase tracking-wider text-text-faint">진행 순서</h2>
          <BiomeRail biomes={railBiomes} />
          <p className="mt-2 text-xs text-text-faint">
            사이트 전체에서 이 색으로 난이도 단계를 표시합니다.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-display mb-3 border-b border-border pb-2 text-lg font-bold">도감</h2>
        <ul className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(230px,1fr))]">
          {DB_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block h-full rounded border border-border bg-surface px-4 py-3 transition-colors hover:border-border-strong hover:bg-surface-raised"
              >
                <div className="flex items-baseline gap-2 font-medium">
                  {link.label}
                  <span className="num text-xs font-normal text-text-faint">{link.count}종</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{link.desc}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="font-display mb-3 border-b border-border pb-2 text-lg font-bold">
          보스 공략 순서
        </h2>
        <ol className="grid gap-2 grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
          {bosses.map((boss, index) => (
            <li key={boss.slug}>
              <Link
                href={`/db/bosses/${boss.slug}/`}
                className="block h-full rounded border border-border bg-surface px-3 py-2.5 transition-colors hover:border-border-strong hover:bg-surface-raised"
              >
                <div className="num text-[10px] text-text-faint">{index + 1}</div>
                <div className="mt-0.5 font-medium leading-snug">{boss.nameKo}</div>
                <div className="mt-0.5 text-xs text-text-muted">{biomeKo(boss.biome)}</div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
