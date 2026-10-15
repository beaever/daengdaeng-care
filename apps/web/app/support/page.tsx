import type { Metadata } from 'next';
import { DocPage } from '../../components/DocPage';
import { JsonLd } from '../../components/JsonLd';
import { contactEmail, faqs, siteUrl } from '../../lib/content';

const title = '고객 지원 — 댕댕케어';
const description =
  '댕댕케어 사용 중 궁금한 점과 자주 묻는 질문, 문의 이메일 안내.';

// openGraph 는 레이아웃 값을 통째로 덮어쓰므로 제목·설명도 함께 지정한다.
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/support' },
  openGraph: { title, description, url: '/support', siteName: '댕댕케어', locale: 'ko_KR', type: 'website', images: '/opengraph-image' },
};

// App Store 지원 URL.
export default function SupportPage() {
  return (
    <DocPage title="고객 지원">
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          url: `${siteUrl}/support`,
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }}
      />
      <p>
        궁금한 점이나 오류는 <a href={`mailto:${contactEmail}`}>{contactEmail}</a> 로 보내 주세요. 사용 중인 iPhone
        기종과 iOS 버전을 함께 적어 주시면 빠르게 확인할 수 있어요.
      </p>

      <h2>자주 묻는 질문</h2>
      {faqs.map((f) => (
        <section key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </section>
      ))}

      <p>
        <a href="/terms">이용약관</a> · <a href="/privacy">개인정보처리방침</a>
      </p>
    </DocPage>
  );
}
