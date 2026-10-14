// 구조화 데이터(schema.org JSON-LD) — 검색엔진 리치 결과·AI 답변 엔진이 사실을 정확히 인용하도록.
export function JsonLd({ data }: { data: object }) {
  // '<' 이스케이프 — 문자열 안의 </script> 로 스크립트가 끊기지 않게
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
