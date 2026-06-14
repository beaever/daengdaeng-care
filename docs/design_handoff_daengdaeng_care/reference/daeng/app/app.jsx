/* DaengDaeng Care — Prototype harness: navigator + dual frames + toolbar + tweaks */
const { useState, useEffect, useRef, useCallback } = React;
const h = React.createElement;
const { IOSDevice, AndroidDevice } = window;
const { Screens, ScreenTab } = window;
const { useTweaks, TweaksPanel, TweakSection, TweakToggle, TweakRadio, TweakColor } = window;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": ["#F59E0B", "#DB8504", "#B56807", "#FFF8EC"],
  "dark": false,
  "corners": "둥글게",
  "tabLabels": true
}/*EDITMODE-END*/;

const JUMP = [
  ['splash', '스플래시'], ['onboarding', '온보딩'], ['profile', '프로필 등록'], ['home', '홈'],
  ['foodSearch', '음식 검색'], ['foodResult', '음식 결과(위험)'], ['scan', '사료 스캔'], ['scanResult', '사료 분석 결과'],
  ['symptomCats', '증상 카테고리'], ['symptomQ', '증상 질문'], ['symptomResult', '증상 결과'],
  ['hospitalList', '병원 목록'], ['hospitalDetail', '병원 상세'], ['records', '건강 기록'], ['addRecord', '기록 추가'], ['settings', '설정'],
];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [stack, setStack] = useState([{ name: 'splash' }]);
  const [ui, setUiState] = useState({});
  const [view, setView] = useState('both'); // both | ios | android
  const setUi = useCallback((partial) => setUiState(s => ({ ...s, ...partial })), []);

  // apply theme + tweaks to :root
  useEffect(() => {
    const r = document.documentElement;
    r.setAttribute('data-theme', t.dark ? 'dark' : 'light');
    const [b, press, text, soft] = t.accent;
    r.style.setProperty('--brand', b);
    r.style.setProperty('--brand-500', b);
    r.style.setProperty('--brand-press', press);
    r.style.setProperty('--brand-text', t.dark ? lighten(b) : text);
    r.style.setProperty('--brand-soft', t.dark ? darken(b) : soft);
    r.style.setProperty('--shadow-brand', `0 6px 18px ${hexA(b, t.dark ? .5 : .32)}`);
    if (t.corners === '각지게') {
      r.style.setProperty('--r-xs', '4px'); r.style.setProperty('--r-sm', '6px');
      r.style.setProperty('--r-md', '8px'); r.style.setProperty('--r-lg', '10px'); r.style.setProperty('--r-xl', '12px');
    } else {
      r.style.removeProperty('--r-xs'); r.style.removeProperty('--r-sm');
      r.style.removeProperty('--r-md'); r.style.removeProperty('--r-lg'); r.style.removeProperty('--r-xl');
    }
    document.body.classList.toggle('no-tablabels', !t.tabLabels);
  }, [t]);

  const current = stack[stack.length - 1];
  const nav = {
    canBack: stack.length > 1,
    push: (name) => setStack(s => [...s, { name }]),
    back: () => setStack(s => s.length > 1 ? s.slice(0, -1) : s),
    replace: (name) => setStack(s => [...s.slice(0, -1), { name }]),
    reset: (name) => setStack([{ name }]),
    tab: (name) => setStack([{ name }]),
  };

  const jump = (name) => {
    const seed = {};
    if (name === 'foodResult') seed.foodResult = '포도';
    if (name === 'symptomResult') seed.symptomVerdict = 'today';
    if (name === 'symptomQ') seed.symptomIdx = 0;
    if (name === 'hospitalDetail') seed.selectedHospital = 2;
    if (name === 'addRecord') seed.addType = 'vaccine';
    if (name === 'onboarding') seed.onbIdx = 0;
    setUi(seed); setStack([{ name }]);
  };

  const ScreenComp = Screens[current.name] || Screens.home;
  const state = { ui };
  const screenProps = { nav, state, setUi, platform: 'ios' };

  // scaling
  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  const contentW = view === 'both' ? (402 + 412 + 56) : (view === 'ios' ? 402 : 412);
  const contentH = 900;
  useEffect(() => {
    const calc = () => {
      const el = stageRef.current; if (!el) return;
      const s = Math.min((el.clientWidth - 40) / contentW, (el.clientHeight - 40) / contentH, 1.1);
      setScale(s);
    };
    calc(); window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [contentW]);

  const renderFrame = (platform) => {
    const Comp = Screens[current.name] || Screens.home;
    const inner = h('div', { className: 'dd-scope', style: { height: '100%' } },
      h(Comp, { nav, state, setUi, platform }));
    if (platform === 'ios')
      return h(IOSDevice, { dark: t.dark, bg: 'var(--bg)' }, inner);
    return h(AndroidDevice, { dark: t.dark, bg: 'var(--bg)' }, inner);
  };

  const labelFor = JUMP.find(j => j[0] === current.name);

  return h(React.Fragment, null,
    /* toolbar */
    h('div', { className: 'pt-toolbar' },
      h('div', { className: 'pt-brand' }, h(window.MarkA, { size: 22, c: 'var(--brand)' }), h('strong', null, '댕댕케어'), h('span', { className: 'pt-tag' }, 'Prototype')),
      h('div', { className: 'pt-seg' }, [['both', '둘 다'], ['ios', 'iPhone'], ['android', 'Android']].map(([v, l]) =>
        h('button', { key: v, className: view === v ? 'on' : '', onClick: () => setView(v) }, l))),
      h('label', { className: 'pt-jump' }, '화면',
        h('select', { value: current.name, onChange: e => jump(e.target.value) },
          JUMP.map(([n, l]) => h('option', { key: n, value: n }, l)))),
      h('button', { className: 'pt-theme', onClick: () => setTweak('dark', !t.dark) }, t.dark ? '☀️ 라이트' : '🌙 다크')),

    /* stage */
    h('div', { className: 'pt-stage', ref: stageRef },
      h('div', { className: 'pt-row', style: { transform: `scale(${scale})` } },
        (view === 'both' || view === 'ios') ? h('div', { className: 'pt-device' }, renderFrame('ios'), h('div', { className: 'pt-plat' }, 'iPhone · iOS')) : null,
        (view === 'both' || view === 'android') ? h('div', { className: 'pt-device' }, renderFrame('android'), h('div', { className: 'pt-plat' }, 'Galaxy · Android')) : null)),

    /* tweaks */
    h(TweaksPanel, null,
      h(TweakSection, { label: '브랜드' }),
      h(TweakColor, { label: '포인트 컬러', value: t.accent, options: [
        ['#F59E0B', '#DB8504', '#B56807', '#FFF8EC'],
        ['#16A34A', '#15803D', '#15803D', '#E7F6EC'],
        ['#0D9488', '#0B7268', '#0B7268', '#E0F2F0'],
        ['#E0413B', '#C32D2D', '#C32D2D', '#FCE9E7'],
      ], onChange: v => setTweak('accent', v) }),
      h(TweakSection, { label: '스타일' }),
      h(TweakRadio, { label: '모서리', value: t.corners, options: ['둥글게', '각지게'], onChange: v => setTweak('corners', v) }),
      h(TweakToggle, { label: '다크 모드', value: t.dark, onChange: v => setTweak('dark', v) }),
      h(TweakToggle, { label: '탭 라벨 표시', value: t.tabLabels, onChange: v => setTweak('tabLabels', v) })));
}

function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; }
function lighten(hex) { const n = parseInt(hex.slice(1), 16); const r = Math.min(255, (n >> 16 & 255) + 60), g = Math.min(255, (n >> 8 & 255) + 50), b = Math.min(255, (n & 255) + 30); return `rgb(${r},${g},${b})`; }
function darken(hex) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16 & 255) * .28 | 0, g = (n >> 8 & 255) * .28 | 0, b = (n & 255) * .28 | 0; return `rgb(${r + 20},${g + 16},${b + 8})`; }

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
