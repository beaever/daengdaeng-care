import { Logo, PawMark } from '../components/Logo';
import { features, stats } from '../lib/content';

// 댕댕케어 랜딩 페이지 — 헤더 · 히어로 · 통계 · 기능 · CTA · 푸터.
// 마케팅 페이지라 응급 화면 광고 규칙(RULES 1)은 해당 없음. 토큰 변수만 사용(RULES 2).
export default function Home() {
  return (
    <>
      <header className="header">
        <div className="wrap header__inner">
          <Logo />
          <nav className="nav">
            <a className="nav__link" href="#features">
              기능
            </a>
            <a className="nav__link" href="#download">
              다운로드
            </a>
            <a className="btn btn--brand" href="#download" style={{ height: 40, paddingInline: 'var(--space-5)' }}>
              앱 받기
            </a>
          </nav>
        </div>
      </header>

      <main>
        {/* 히어로 */}
        <section className="hero">
          <div className="wrap hero__grid">
            <div>
              <span className="eyebrow">🐾 반려견 건강 관리 앱</span>
              <h1 className="hero__title">
                우리 아이 건강,
                <br />
                <span className="accent">이 앱 하나로</span> 안심
              </h1>
              <p className="hero__sub">
                음식 판별·사료 분석·증상 체크·병원 찾기·건강 기록.
                <br />
                매일의 궁금증을 3초 만에 해결하세요.
              </p>
              <div className="hero__cta">
                <a className="btn btn--brand" href="#download">
                   App Store
                </a>
                <a className="btn btn--ghost" href="#download">
                  ▶ Google Play
                </a>
              </div>
              <p className="hero__note">무료 다운로드 · iOS 15 이상 · 광고 포함(응급 화면 제외)</p>
            </div>

            {/* 폰 목업 */}
            <div className="phone" aria-hidden="true">
              <div className="phone__screen">
                <span className="ph-mark">
                  <PawMark size={42} color="var(--on-brand)" />
                </span>
                <h3>{'우리 아이 건강,\n이 앱 하나로 안심'}</h3>
                <p>매일의 궁금증을 3초 만에</p>
              </div>
            </div>
          </div>

          <div className="wrap stats">
            {stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__v">{s.value}</div>
                <div className="stat__l">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 기능 */}
        <section className="section" id="features">
          <div className="wrap">
            <div className="section__head">
              <div className="section__k">Features</div>
              <h2 className="section__t">반려견 건강, 5가지로 끝</h2>
            </div>
            <div className="features">
              {features.map((f) => (
                <article className="feature" key={f.title}>
                  <div className="feature__icon" style={{ '--tint': f.tint } as React.CSSProperties}>
                    {f.emoji}
                  </div>
                  <h3 className="feature__t">{f.title}</h3>
                  <p className="feature__d">{f.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 최종 CTA */}
        <section className="cta" id="download">
          <div className="wrap">
            <div className="cta__card">
              <h2 className="cta__t">{'지금 댕댕케어와 함께\n안심 육견을 시작하세요'}</h2>
              <p className="cta__sub">설치하고 우리 아이 건강을 매일 챙겨주세요.</p>
              <div className="cta__btns">
                <a className="btn btn--onbrand" href="#">
                   App Store
                </a>
                <a className="btn btn--onbrand" href="#">
                  ▶ Google Play
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer__inner">
            <Logo size={24} />
            <nav className="footer__links">
              <a href="#features">기능</a>
              <a href="#download">다운로드</a>
              <a href="#">개인정보처리방침</a>
              <a href="#">이용약관</a>
            </nav>
            <span className="footer__copy">© 2026 댕댕케어</span>
          </div>
          <p className="footer__note">
            ※ 댕댕케어가 제공하는 정보는 참고용이며 수의사의 진단을 대신하지 않습니다. 응급 상황으로 의심되면 즉시
            동물병원에 방문하세요.
          </p>
        </div>
      </footer>
    </>
  );
}
