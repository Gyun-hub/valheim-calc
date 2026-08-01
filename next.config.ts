import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 백엔드 없음. Cloudflare Pages에 정적 배포 (docs/ARCHITECTURE.md 참고)
  output: "export",
  // Image Optimization은 서버가 필요함. 아이콘은 직접 제작해 미리 최적화해서 넣을 것
  images: { unoptimized: true },
  // 정적 호스팅에서 /db/items → /db/items/index.html 로 해석되게
  trailingSlash: true,
};

export default nextConfig;
