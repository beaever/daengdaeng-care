import { Logo } from './Logo';

// 개인정보처리방침·지원 같은 문서형 페이지 공통 틀 — 헤더(홈 링크) + 본문.
export function DocPage({ title, updated, children }: { title: string; updated?: string; children: React.ReactNode }) {
  return (
    <>
      <header className="header">
        <div className="wrap header__inner">
          <a href="/" aria-label="댕댕케어 홈">
            <Logo />
          </a>
        </div>
      </header>
      <main className="wrap doc">
        <h1>{title}</h1>
        {updated && <p className="doc__updated">시행일: {updated}</p>}
        {children}
      </main>
    </>
  );
}
