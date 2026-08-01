import type { MetadataRoute } from "next";

import { biomes, bosses, creatures, food, items, meadPotions } from "@/lib/data";

export const dynamic = "force-static";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://valheim-calc.pages.dev";

const LIST_PAGES = ["/db/items/", "/db/creatures/", "/db/bosses/", "/db/food/", "/db/mead/", "/db/biomes/"];

export default function sitemap(): MetadataRoute.Sitemap {
  const detailUrls = [
    ...items.map((e) => `/db/items/${e.slug}/`),
    ...creatures.map((e) => `/db/creatures/${e.slug}/`),
    ...bosses.map((e) => `/db/bosses/${e.slug}/`),
    ...food.map((e) => `/db/food/${e.slug}/`),
    ...meadPotions.map((e) => `/db/mead/${e.slug}/`),
    ...biomes.map((e) => `/db/biomes/${e.slug}/`),
  ];

  const paths = ["/", "/about/", ...LIST_PAGES, ...detailUrls];

  return paths.map((path) => ({
    url: new URL(path, siteUrl).toString(),
  }));
}
