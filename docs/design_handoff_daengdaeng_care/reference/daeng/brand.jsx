/* Brand page — logo marks, lockup, app icon, splash */
const { useState } = React;
const h = React.createElement;

/* ---------------- LOGO MARKS (96 viewBox) ---------------- */
function MarkA({ size = 96, c = 'currentColor' }) {
  // Paw + Heart pad (filled, warm)
  return h('svg', { width: size, height: size, viewBox: '0 0 96 96', fill: c },
    h('ellipse', { cx: 24, cy: 43, rx: 7.5, ry: 9.5, transform: 'rotate(-20 24 43)' }),
    h('ellipse', { cx: 39, cy: 32, rx: 8, ry: 10.5 }),
    h('ellipse', { cx: 57, cy: 32, rx: 8, ry: 10.5 }),
    h('ellipse', { cx: 72, cy: 43, rx: 7.5, ry: 9.5, transform: 'rotate(20 72 43)' }),
    h('path', { d: 'M48 82 C 25 65 21 51 32 45 C 39 41 45 45 48 50 C 51 45 57 41 64 45 C 75 51 71 65 48 82 Z' }));
}
function MarkB({ size = 96, c = 'currentColor', c2 = '#fff' }) {
  // Paw + Check (verified / safe)
  return h('svg', { width: size, height: size, viewBox: '0 0 96 96' },
    h('g', { fill: c },
      h('ellipse', { cx: 33, cy: 33, rx: 8, ry: 10 }),
      h('ellipse', { cx: 48, cy: 27, rx: 8.5, ry: 11 }),
      h('ellipse', { cx: 63, cy: 33, rx: 8, ry: 10 }),
      h('ellipse', { cx: 48, cy: 61, rx: 23, ry: 20 })),
    h('path', { d: 'M38 61 l7.5 7.5 L60 53', fill: 'none', stroke: c2, strokeWidth: 6.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}
function MarkC({ size = 96, c = 'currentColor' }) {
  // Monoline paw + heartbeat pulse (medical / clean)
  const s = { fill: 'none', stroke: c, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' };
  return h('svg', { width: size, height: size, viewBox: '0 0 96 96' },
    h('ellipse', { cx: 26, cy: 41, rx: 6.5, ry: 8.5, transform: 'rotate(-18 26 41)', ...s }),
    h('ellipse', { cx: 40, cy: 31, rx: 7, ry: 9, ...s }),
    h('ellipse', { cx: 56, cy: 31, rx: 7, ry: 9, ...s }),
    h('ellipse', { cx: 70, cy: 41, rx: 6.5, ry: 8.5, transform: 'rotate(18 70 41)', ...s }),
    h('path', { d: 'M48 80 C 29 66 24 56 30 50 C 35 45 43 47 48 54 C 53 47 61 45 66 50 C 72 56 67 66 48 80 Z', ...s }),
    h('path', { d: 'M33 63 H41 l3.5 -8 l5 14 l3.5 -6 H63', fill: 'none', stroke: c, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }));
}
const MARKS = [
  { id: 'A', Comp: MarkA, name: '발바닥 ♥ 하트', desc: '메인 패드를 하트로. 따뜻하고 친근한 인상.' },
  { id: 'B', Comp: MarkB, name: '발바닥 ✓ 체크', desc: '발바닥에 체크. ‘안심하고 먹여요’의 신뢰감.' },
  { id: 'C', Comp: MarkC, name: '라인 + 펄스', desc: '모노라인 발바닥에 맥박선. 의료·건강 톤.' },
];

/* ---------------- App icon ---------------- */
function AppIcon({ Mark, size = 96, markScale = 0.62 }) {
  return h('div', { className: 'appicon', style: { width: size, height: size, borderRadius: size * 0.23 } },
    h(Mark, { size: size * markScale, c: '#fff' }));
}

/* ---------------- Wordmark / Lockup ---------------- */
function Wordmark({ size = 34, color = 'var(--text)' }) {
  return h('span', { className: 'lockup__word', style: { fontSize: size, color } }, '댕댕케어');
}
function Lockup({ Mark, stack, wordColor = 'var(--text)', markColor = 'var(--brand)', wordSize = 34, markSize = 44 }) {
  return h('div', { className: 'lockup' + (stack ? ' lockup--stack' : '') },
    h(Mark, { size: markSize, c: markColor }),
    h(Wordmark, { size: wordSize, color: wordColor }));
}

function App() {
  const [theme, setTheme] = useState('light');
  const [vi, setVi] = useState(0);
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);
  const Mark = MARKS[vi].Comp;

  return h(React.Fragment, null,
    h('div', { className: 'br-top' },
      h(AppIcon, { Mark, size: 30, markScale: 0.64 }),
      h('strong', { style: { fontSize: 17, letterSpacing: '-.02em' } }, '댕댕케어'),
      h('span', { className: 'ver' }, 'Brand v1.0'),
      h('button', { className: 'br-themetoggle', onClick: () => setTheme(t => t === 'light' ? 'dark' : 'light') },
        theme === 'light' ? '🌙' : '☀️', theme === 'light' ? '다크' : '라이트')),

    h('div', { className: 'br-wrap' },
      h('div', { className: 'br-hero' },
        h('div', { style: { display: 'flex', justifyContent: 'center' } }, h(AppIcon, { Mark, size: 104 })),
        h('h1', null, '댕댕케어 브랜드'),
        h('p', null, '발바닥에 건강·안심을 담은 마크. 아래에서 방향을 골라보면 아이콘·로고·스플래시에 바로 반영돼요.')),

      /* variation selector */
      h('section', { className: 'br-sec' },
        h('div', { className: 'br-sec__k' }, 'LOGO MARK'),
        h('h2', { className: 'br-sec__t' }, '로고 마크 — 3가지 방향'),
        h('p', { className: 'br-sec__d' }, '카드를 누르면 페이지 전체 프리뷰가 해당 마크로 바뀝니다. 세 방향 모두 같은 그리드·곡률로 그려 호환됩니다.'),
        h('div', { className: 'br-variants' }, MARKS.map((m, i) =>
          h('button', { key: m.id, className: 'br-vcard' + (i === vi ? ' br-vcard--active' : ''), onClick: () => setVi(i) },
            h(AppIcon, { Mark: m.Comp, size: 88 }),
            h('div', { className: 'br-vcard__name' }, m.name),
            h('div', { className: 'br-vcard__desc' }, m.desc),
            h('div', { className: 'br-vcard__tick' }, i === vi ? h('svg', { width: 13, height: 13, viewBox: '0 0 24 24', fill: 'none', stroke: '#fff', strokeWidth: 3.5, strokeLinecap: 'round', strokeLinejoin: 'round' }, h('path', { d: 'M5 12.5 10 17 19 7' })) : null)))),
        h('div', { style: { marginTop: 22, display: 'flex', gap: 14, alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' } },
          [40, 28, 18].map(sz => h('div', { key: sz, style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 } },
            h(AppIcon, { Mark, size: Math.round(sz * 2.2) }),
            h('span', { className: 'br-cap' }, sz + 'pt'))))),

      /* lockup */
      h('section', { className: 'br-sec' },
        h('div', { className: 'br-sec__k' }, 'LOGO'),
        h('h2', { className: 'br-sec__t' }, '로고 락업'),
        h('p', { className: 'br-sec__d' }, '마크 + 워드마크(SUIT 800). 가로형이 기본, 세로형은 스플래시·프로필 등 중앙 정렬에 사용.'),
        h('div', { className: 'br-grid2' },
          h('div', null, h('div', { className: 'br-specimen' }, h(Lockup, { Mark })), h('div', { className: 'br-cap' }, '가로형 · 기본')),
          h('div', null, h('div', { className: 'br-specimen' }, h(Lockup, { Mark, stack: true })), h('div', { className: 'br-cap' }, '세로형'))),
        h('div', { className: 'br-grid2', style: { marginTop: 18 } },
          h('div', null, h('div', { className: 'br-specimen br-specimen--dark' }, h(Lockup, { Mark, wordColor: '#fff', markColor: 'var(--brand-400)' })), h('div', { className: 'br-cap' }, '다크 배경')),
          h('div', null, h('div', { className: 'br-specimen br-specimen--brand' }, h(Lockup, { Mark, wordColor: '#fff', markColor: '#fff' })), h('div', { className: 'br-cap' }, '브랜드 배경 (반전)')))),

      /* app icon on springboard */
      h('section', { className: 'br-sec' },
        h('div', { className: 'br-sec__k' }, 'APP ICON'),
        h('h2', { className: 'br-sec__t' }, '앱 아이콘'),
        h('p', { className: 'br-sec__d' }, 'iOS 스퀘어클·Android 적응형 아이콘 모두 동일 마크. 홈 화면에서 한눈에 들어와요.'),
        h('div', { className: 'br-grid2' },
          h('div', null,
            h('div', { className: 'br-springboard', style: { background: 'linear-gradient(160deg,#8FB7E8,#6E93C9)' } },
              h('div', { className: 'br-springboard__row' },
                h('div', { className: 'br-appcell' }, h(AppIcon, { Mark, size: 60 }), h('span', { className: 'br-appcell__label' }, '댕댕케어')),
                h('div', { className: 'br-appcell' }, h('div', { style: { width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,.85)' } }), h('span', { className: 'br-appcell__label' }, '캘린더')),
                h('div', { className: 'br-appcell' }, h('div', { style: { width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,.5)' } }), h('span', { className: 'br-appcell__label' }, '메모')))),
            h('div', { className: 'br-cap' }, 'iOS 홈 화면')),
          h('div', null,
            h('div', { className: 'br-springboard', style: { background: 'linear-gradient(160deg,#243042,#11161f)' } },
              h('div', { className: 'br-springboard__row' },
                h('div', { className: 'br-appcell' }, h('div', { style: { width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.18)' } }), h('span', { className: 'br-appcell__label' }, '설정')),
                h('div', { className: 'br-appcell' }, h(AppIcon, { Mark, size: 56, markScale: 0.64 }), h('span', { className: 'br-appcell__label' }, '댕댕케어')),
                h('div', { className: 'br-appcell' }, h('div', { style: { width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.1)' } }), h('span', { className: 'br-appcell__label' }, '지도')))),
            h('div', { className: 'br-cap' }, 'Android 홈 화면 (적응형 원형)')))),

      /* splash */
      h('section', { className: 'br-sec' },
        h('div', { className: 'br-sec__k' }, 'SPLASH'),
        h('h2', { className: 'br-sec__t' }, '스플래시 스크린'),
        h('p', { className: 'br-sec__d' }, '실행 후 1.5초. 라이트·다크 모두 대응. 다이나믹 아일랜드·홈 인디케이터 안전 영역을 지킵니다.'),
        h('div', { style: { display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' } },
          h(SplashMock, { Mark, dark: false }),
          h(SplashMock, { Mark, dark: true }),
          h(SplashMock, { Mark, dark: false, brand: true, android: true }))),

      /* usage */
      h('section', { className: 'br-sec' },
        h('div', { className: 'br-sec__k' }, 'USAGE' ),
        h('h2', { className: 'br-sec__t' }, '사용 가이드'),
        h('div', { className: 'br-usage' },
          h('div', { className: 'br-do' },
            h('div', { className: 'br-do__h ok' }, '○ 권장'),
            h('ul', { style: { margin: 0, padding: 0 } },
              h('li', null, '여백은 마크 높이의 ½ 이상 확보'),
              h('li', null, '최소 크기 16pt 이상에서 사용'),
              h('li', null, '배경 대비가 충분한 곳에 배치'))),
          h('div', { className: 'br-dont' },
            h('div', { className: 'br-do__h no' }, '✕ 지양'),
            h('ul', { style: { margin: 0, padding: 0 } },
              h('li', null, '마크 비율 변형·기울이기'),
              h('li', null, '브랜드 외 색상으로 임의 변경'),
              h('li', null, '복잡한 사진 위에 직접 올리기'))))),
    ));
}

function SplashMock({ Mark, dark, brand, android }) {
  const bg = brand ? 'linear-gradient(160deg, var(--brand-400), var(--brand-600))'
    : dark ? '#16130D' : 'var(--stone-50)';
  const wordColor = (dark || brand) ? '#fff' : 'var(--text)';
  const tagColor = (dark || brand) ? 'rgba(255,255,255,.85)' : 'var(--text-2)';
  const markColor = brand ? '#fff' : (dark ? 'var(--brand-400)' : 'var(--brand)');
  return h('div', null,
    h('div', { className: 'phone-mock' + (android ? ' phone-mock--android' : '') },
      h('div', { className: 'phone-mock__island' }),
      h('div', { className: 'phone-mock__screen', style: { background: bg } },
        h(Mark, { size: 76, c: markColor }),
        h('div', { className: 'splash-word', style: { color: wordColor } }, '댕댕케어'),
        h('div', { className: 'splash-tag', style: { color: tagColor } }, '강아지와 함께하는 매일, 더 안심하게'),
        h('div', { className: 'phone-mock__home', style: { background: (dark || brand) ? 'rgba(255,255,255,.6)' : 'rgba(0,0,0,.35)' } }))),
    h('div', { className: 'br-cap' }, brand ? 'Android · 브랜드' : dark ? 'iOS · 다크' : 'iOS · 라이트'));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
