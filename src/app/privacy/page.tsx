import type { Metadata } from "next";

import { Section } from "@/components/ui/Card";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "발헤임 한국어 계산기의 개인정보처리방침. 수집 정보, 쿠키·광고, 문의 방법 안내.",
  alternates: { canonical: "/privacy/" },
};

/** 애드센스 심사 필수 페이지. 고지 문구를 임의로 줄이거나 빼지 말 것 (docs/LEGAL.md 2장) */
export default function PrivacyPage() {
  return (
    <>
      <PageHeader title="개인정보처리방침" subtitle="시행일: 2026-08-01" />

      <Section title="이 사이트가 수집하는 정보">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            이 사이트는 회원가입·로그인 기능이 없으며, 서버에 개인정보를 저장하지 않는 정적
            사이트입니다. 이용자가 직접 입력하는 개인정보(이름, 이메일 등)는 수집하지 않습니다.
          </p>
          <p>
            방문 통계를 위해 Google Analytics(GA4)를 사용합니다. 페이지 조회, 접속 기기·브라우저
            종류, 대략적인 지역(도시 단위 이하로는 특정하지 않음) 등 비식별 통계 정보가 자동으로
            수집됩니다.
          </p>
        </div>
      </Section>

      <Section title="쿠키와 광고">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            Google Analytics와 Google AdSense는 서비스 제공 및 광고 게재를 위해 쿠키를 사용할 수
            있습니다. 광고는 이용자의 이전 방문이나 다른 사이트 방문 이력을 바탕으로 게재될 수
            있습니다(맞춤 광고).
          </p>
          <p>
            브라우저 설정에서 쿠키를 차단하거나 삭제할 수 있습니다. Google 광고 개인 최적화는{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover"
            >
              Google 광고 설정
            </a>
            에서, Analytics 수집 거부는{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover"
            >
              Google Analytics 옵트아웃 부가기능
            </a>
            에서 각각 설정할 수 있습니다.
          </p>
        </div>
      </Section>

      <Section title="제3자 서비스">
        <div className="space-y-2 text-sm leading-relaxed text-text-muted">
          <p>
            이 사이트는 Google Analytics, Google AdSense, Cloudflare(호스팅)를 이용합니다. 각
            서비스가 처리하는 정보는 해당 업체의 개인정보처리방침을 따릅니다.
          </p>
        </div>
      </Section>

      <Section title="문의">
        <p className="text-sm leading-relaxed text-text-muted">
          개인정보 처리와 관련해 궁금한 점이 있으면 사이트 소개 페이지의 문의 안내를 통해
          연락해 주세요.
        </p>
      </Section>

      <Section title="변경 고지">
        <p className="text-sm leading-relaxed text-text-muted">
          이 방침은 사이트 운영 방식이 바뀌면(예: 새로운 제3자 서비스 도입) 예고 없이 갱신될 수
          있습니다. 중요한 변경은 이 페이지에 반영합니다.
        </p>
      </Section>
    </>
  );
}
