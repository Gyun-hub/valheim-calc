/**
 * name_en ↔ URL slug 변환.
 *
 * 조인 키는 어디까지나 `name_en`. slug 는 URL 표기용 파생값이다.
 * 역변환(`slugToNameEn`)은 원본 목록이 있어야 안전하므로 룩업 방식만 제공한다.
 * (`"Fish n Bread"` → `fish-n-bread` 처럼 되돌릴 때 대소문자·공백을 복원할 수 없음)
 */

/**
 * 영문명을 URL 세그먼트로 변환.
 *
 * `"Bronze Sword"` → `"bronze-sword"`
 * `"Fish n' Bread"` → `"fish-n-bread"`
 * `"Draugr Elite"` → `"draugr-elite"`
 */
export function toSlug(nameEn: string): string {
  return nameEn
    .normalize("NFKD")
    // 발음 구별 기호 제거 (예: Yagluth 계열 표기 흔들림 대비)
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    // 영숫자가 아닌 것은 전부 하이픈으로
    .replace(/[^a-z0-9]+/g, "-")
    // 앞뒤 하이픈 정리
    .replace(/^-+|-+$/g, "");
}

/**
 * slug → 원본 엔티티 룩업 맵을 만든다.
 *
 * slug 충돌이 생기면 개발 중에 바로 알 수 있도록 예외를 던진다.
 * 정적 빌드 시점에 터지므로 프로덕션에는 영향 없음.
 */
export function buildSlugMap<T extends { nameEn: string }>(
  entities: T[],
  label: string,
): Map<string, T> {
  const map = new Map<string, T>();
  for (const entity of entities) {
    const slug = toSlug(entity.nameEn);
    const existing = map.get(slug);
    if (existing) {
      throw new Error(
        `[slug] ${label} 에서 slug 충돌: "${existing.nameEn}" 와 "${entity.nameEn}" 가 둘 다 "${slug}" 로 변환됨`,
      );
    }
    map.set(slug, entity);
  }
  return map;
}

/** `generateStaticParams` 에 바로 넘길 수 있는 형태 */
export function toStaticParams(entities: { slug: string }[]): { slug: string }[] {
  return entities.map((e) => ({ slug: e.slug }));
}
