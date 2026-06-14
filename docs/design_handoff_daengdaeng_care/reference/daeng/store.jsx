/* Store screenshots */
const { useState, useEffect } = React;
const h = React.createElement;
const { IOSDevice, AndroidDevice, Screens } = window;

const STUB_NAV = { canBack: false, push() {}, back() {}, replace() {}, reset() {}, tab() {} };

const PANELS = [
  { screen: 'home', seed: {}, h: '우리 아이 건강,\n이 앱 하나로 안심', sub: '매일의 궁금증을 3초 만에',
    bg: 'linear-gradient(165deg, var(--brand-400), var(--brand-600))', fg: '#fff' },
  { screen: 'foodResult', seed: { foodResult: '포도' }, h: '이거 먹어도 돼?\n검색하면 바로 답', sub: '안전·주의·위험 한눈에',
    bg: 'var(--brand-50)', fg: 'var(--text)' },
  { screen: 'symptomResult', seed: { symptomVerdict: 'today' }, h: '병원 가야 할까?\n증상 넣으면 알려줘요', sub: '지금 필요한 행동까지',
    bg: 'var(--info-soft)', fg: 'var(--text)' },
  { screen: 'hospitalList', seed: { hospView: 'list' }, h: '급할 때, 가까운\n24시 병원을 한눈에', sub: '진료중·거리·전화까지',
    bg: 'var(--safe-soft)', fg: 'var(--text)' },
  { screen: 'records', seed: { recTab: 'all' }, h: '접종·체중·병원 기록\n한 곳에 차곡차곡', sub: '우리 아이 건강 다이어리',
    bg: 'var(--surface-2)', fg: 'var(--text)' },
];

function Panel({ p, platform, dark }) {
  const Comp = Screens[p.screen] || Screens.home;
  const state = { ui: p.seed };
  const scale = 0.6;
  const dev = platform === 'ios'
    ? h(IOSDevice, { dark, bg: 'var(--bg)' }, h('div', { className: 'dd-scope', style: { height: '100%' } }, h(Comp, { nav: STUB_NAV, state, setUi: () => {}, platform })))
    : h(AndroidDevice, { dark, bg: 'var(--bg)' }, h('div', { className: 'dd-scope', style: { height: '100%' } }, h(Comp, { nav: STUB_NAV, state, setUi: () => {}, platform })));
  return h('div', { className: 'st-panel', style: { background: p.bg } },
    h('div', { className: 'st-panel__blob', style: { width: 160, height: 160, top: -40, right: -40, background: 'rgba(255,255,255,.25)' } }),
    h('div', { className: 'st-panel__cap', style: { color: p.fg } },
      h('div', { className: 'st-panel__h' }, p.h),
      h('div', { className: 'st-panel__sub' }, p.sub)),
    h('div', { className: 'st-panel__phone', style: { transform: `translateX(-50%) scale(${scale})` } }, dev));
}

function App() {
  const [platform, setPlatform] = useState('ios');
  const [dark, setDark] = useState(false);
  useEffect(() => { document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light'); }, [dark]);
  return h(React.Fragment, null,
    h('div', { className: 'st-top' },
      h(window.MarkA, { size: 24, c: 'var(--brand)' }),
      h('strong', { style: { fontSize: 16, letterSpacing: '-.02em' } }, '댕댕케어'),
      h('span', { className: 'ver' }, 'Store v1.0'),
      h('div', { className: 'st-seg' },
        [['ios', 'App Store'], ['android', 'Play 스토어']].map(([v, l]) =>
          h('button', { key: v, className: platform === v ? 'on' : '', onClick: () => setPlatform(v) }, l)),
        h('button', { className: dark ? 'on' : '', onClick: () => setDark(d => !d) }, dark ? '☀️' : '🌙'))),
    h('div', { className: 'st-wrap' },
      h('div', { className: 'st-intro' },
        h('h1', null, '스토어 릴리즈 스크린샷'),
        h('p', null, platform === 'ios' ? 'App Store · 6.7" (1290 × 2796) 기준 · 가로 스크롤로 넘겨보세요' : 'Google Play · 9:19.5 기준 · 가로 스크롤로 넘겨보세요')),
      h('div', { className: 'st-rail' }, PANELS.map((p, i) => h(Panel, { key: i, p, platform, dark }))),
      h('div', { className: 'st-note' }, '※ 실제 제출 시 텍스트 없는 풀블리드 버전도 함께 준비하세요. 동일 컴포넌트라 라이트·다크, iOS·Android 모두 자동 대응됩니다.')));
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
