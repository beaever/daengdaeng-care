/* DaengDaeng Care — 16 screens. Exported to window.Screens */
(function () {
  const h = React.createElement;
  const { useState, useEffect, useRef } = React;
  const {
    Icon, Button, IconButton, Chip, Avatar, Field, Input, Textarea, PillGroup, Segment, Option,
    Card, Row, Divider, SectionHeading, AdBanner, NativeAd, Note, EmptyState, Verdict, Bullets,
    PetProfileCard, QuickMenu, HealthSummaryCard, FoodResult, FoodAnalysisResult,
    SymptomChecker, SymptomResult, HospitalCard, HospitalList, HealthRecord, DD,
  } = window;
  const { Header, AppScreen } = window.AppShell;

  const pad = (...kids) => h('div', { className: 'app-pad' }, React.Children.toArray(kids));
  const gap = (g, ...kids) => h('div', { style: { display: 'flex', flexDirection: 'column', gap: g } }, React.Children.toArray(kids));

  /* ---------------- SCR-001 Splash ---------------- */
  function Splash({ nav, platform }) {
    useEffect(() => { const t = setTimeout(() => nav.reset('onboarding'), 1700); return () => clearTimeout(t); }, []);
    return h('div', { className: 'splash' },
      h('div', { className: 'splash__mark' }, h(window.MarkA, { size: 92, c: '#fff' })),
      h('div', { className: 'splash__word' }, '댕댕케어'),
      h('div', { className: 'splash__tag' }, '강아지와 함께하는 매일, 더 안심하게'));
  }

  /* ---------------- SCR-002 Onboarding ---------------- */
  const ONB = [
    { emoji: '🥦', bg: 'var(--safe-soft)', title: '뭘 먹여도 되는지\n헷갈리세요?', sub: '검색 한 번으로 우리 아이가 먹어도 되는 음식인지 바로 확인해요.' },
    { emoji: '🩺', bg: 'var(--info-soft)', title: '병원에 가야 할지\n고민될 때', sub: '증상을 입력하면 지금 병원에 가야 하는지 알려드려요.' },
    { emoji: '📋', bg: 'var(--brand-soft)', title: '접종·체중·병원 기록\n한 곳에서', sub: '우리 아이 건강 기록을 깔끔하게 모아 관리해요.' },
  ];
  function Onboarding({ nav, state, setUi, platform }) {
    const i = state.ui.onbIdx || 0;
    const slide = ONB[i];
    const last = i === ONB.length - 1;
    const ins = window.ddInsets(platform);
    return h('div', { className: 'onb', style: { paddingTop: ins.top } },
      h('button', { className: 'onb__skip', style: { visibility: last ? 'hidden' : 'visible' }, onClick: () => nav.reset('profile') }, '건너뛰기'),
      h('div', { className: 'onb__art' }, h('div', { className: 'onb__illu', style: { background: slide.bg } }, slide.emoji)),
      h('div', { className: 'onb__body' },
        h('h2', { className: 'onb__title', style: { whiteSpace: 'pre-line' } }, slide.title),
        h('p', { className: 'onb__sub' }, slide.sub)),
      h('div', { className: 'onb__dots' }, ONB.map((_, j) => h('span', { key: j, className: 'onb__dot' + (j === i ? ' onb__dot--on' : '') }))),
      h('div', { className: 'onb__foot' },
        h(Button, { block: true, size: 'lg', onClick: () => last ? nav.reset('profile') : setUi({ onbIdx: i + 1 }) }, last ? '시작하기' : '다음')));
  }

  /* ---------------- SCR-003 Profile ---------------- */
  function Profile({ nav, state, setUi, platform }) {
    const u = state.ui;
    const header = h(Header, { title: '우리 아이를 알려주세요', platform, large: true });
    return h(AppScreen, { header, platform },
      pad(gap(18,
        h('div', { className: 'pf-avatar' }, h(Icon, { name: 'camera', size: 26 }), h('span', null, '사진 추가')),
        h(Field, { label: '이름', required: true }, h(Input, { placeholder: '예) 뭉치', value: u.pfName || '', onChange: e => setUi({ pfName: e.target.value }) })),
        h(Field, { label: '품종' }, h(Input, { icon: 'search', placeholder: '검색하거나 입력', value: u.pfBreed || '', onChange: e => setUi({ pfBreed: e.target.value }) })),
        h(Field, { label: '생년월일' }, h('div', { className: 'sel-input' }, h('span', { className: 'ph' }, '날짜 선택'), h('span', { className: 'ic' }, h(Icon, { name: 'chevD', size: 18 })))),
        h(Field, { label: '성별' }, h(PillGroup, { options: ['남아', '여아'], value: u.pfSex || '남아', onChange: v => setUi({ pfSex: v }) })),
        h(Field, { label: '중성화' }, h(PillGroup, { options: ['했어요', '안 했어요', '몰라요'], value: u.pfNeu || '했어요', onChange: v => setUi({ pfNeu: v }) })),
        h('div', { style: { height: 4 } }),
        h(Button, { block: true, size: 'lg', onClick: () => nav.reset('home') }, '시작하기'))));
  }

  /* ---------------- SCR-004 Home ---------------- */
  function Home({ nav, platform }) {
    const ins = window.ddInsets(platform);
    const header = h('div', { className: 'app-header', style: { paddingTop: ins.top } },
      h('div', { className: 'app-header__bar', style: { paddingBottom: 0 } },
        h('div', { style: { flex: 1, paddingLeft: 6 } },
          h('div', { className: 'home-greet' }, '안녕하세요 👋'),
          h('div', { className: 'home-hi' }, DD.pet.name + ' 보호자님')),
        h('button', { className: 'app-header__back', onClick: () => nav.push('settings') }, h(Icon, { name: 'gear', size: 22 })),
        h('button', { className: 'app-header__back', onClick: () => {} }, h(Icon, { name: 'bell', size: 22 }))));
    return h(AppScreen, { header, tab: 'home', nav, platform },
      pad(gap(22,
        h(PetProfileCard, { pet: DD.pet, onClick: () => nav.push('settings') }),
        h('div', null,
          h(SectionHeading, null, '바로가기'),
          h(QuickMenu, null,
            h(QuickMenu.Item, { icon: 'bone', label: '음식 판별', sub: '먹어도 될까?', onClick: () => nav.tab('foodSearch', 'food') }),
            h(QuickMenu.Item, { icon: 'barcode', label: '사료 분석', sub: '성분 위험도', onClick: () => nav.push('scan') }),
            h(QuickMenu.Item, { icon: 'stethoscope', label: '증상 체크', sub: '병원 가야 하나?', onClick: () => nav.tab('symptomCats', 'symptom') }),
            h(QuickMenu.Item, { icon: 'hospital', label: '병원 찾기', sub: '24시 동물병원', onClick: () => nav.tab('hospitalList', 'hospital') }))),
        h('div', null,
          h(SectionHeading, null, '건강 요약'),
          h(HealthSummaryCard, { pet: DD.pet })))));
  }

  /* ---------------- SCR-005 Food search ---------------- */
  function FoodSearch({ nav, state, setUi, platform }) {
    const q = state.ui.foodQuery || '';
    const names = Object.keys(DD.foods);
    const matches = q ? names.filter(n => n.includes(q)) : [];
    const header = h(Header, { title: '이거 먹어도 될까요?', platform, onBack: nav.canBack ? nav.back : null });
    const go = (name) => { setUi({ foodResult: name, foodQuery: '' }); nav.push('foodResult'); };
    return h(AppScreen, { header, tab: 'food', nav, platform },
      pad(gap(22,
        h('div', { className: 'dd-searchbar' }, h(Icon, { name: 'search', size: 20, color: 'var(--text-3)' }),
          h('input', { autoFocus: false, placeholder: '음식 이름을 검색하세요', value: q, onChange: e => setUi({ foodQuery: e.target.value }),
            style: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontFamily: 'var(--font)', fontSize: 16, color: 'var(--text)' } })),
        q ? h('div', null, matches.length ? matches.map(n => h('button', { key: n, className: 'fs-auto', onClick: () => go(n) },
            h('span', { className: 'fs-auto__ic' }, h(Icon, { name: 'search', size: 18 })), h('span', { style: { fontWeight: 600 } }, n)))
          : h(EmptyState, { icon: '🔍', title: '검색 결과가 없어요', desc: '아직 확인되지 않은 음식이에요.' }))
        : gap(22,
          h('div', null, h(SectionHeading, null, '많이 찾는 음식'),
            h('div', { className: 'fs-tagwrap' }, DD.popularFoods.map(n => h(Chip, { key: n, variant: 'brand', onClick: () => go(n) }, n)))),
          h('div', null, h(SectionHeading, null, '최근 검색'),
            DD.recentFoods.map(n => h('div', { key: n, className: 'fs-recent' },
              h('button', { onClick: () => go(n), style: { background: 'none', border: 'none', font: 'inherit', fontWeight: 600, color: 'var(--text)', cursor: 'pointer', padding: 0 } }, n),
              h('button', { className: 'fs-recent__x' }, h(Icon, { name: 'close', size: 16 })))))))));
  }

  /* ---------------- SCR-006 Food result ---------------- */
  function FoodResultScreen({ nav, state, platform }) {
    const food = DD.foods[state.ui.foodResult] || DD.foods['포도'];
    const header = h(Header, { title: '이거 먹어도 될까요?', platform, onBack: nav.back });
    return h(AppScreen, { header, tab: 'food', nav, platform, ad: h(AdBanner) }, pad(h(FoodResult, { food })));
  }

  /* ---------------- SCR-007 Scan ---------------- */
  function Scan({ nav, platform }) {
    const header = h(Header, { title: '사료 성분 분석', platform, onBack: nav.canBack ? nav.back : null });
    return h(AppScreen, { header, tab: 'food', nav, platform },
      h('div', null,
        h('div', { className: 'scan-cam', onClick: () => nav.push('scanResult') },
          h('div', { className: 'scan-frame' },
            h('div', { className: 'scan-corner', style: { top: 0, left: 0, borderRight: 'none', borderBottom: 'none', borderTopLeftRadius: 8 } }),
            h('div', { className: 'scan-corner', style: { top: 0, right: 0, borderLeft: 'none', borderBottom: 'none', borderTopRightRadius: 8 } }),
            h('div', { className: 'scan-corner', style: { bottom: 0, left: 0, borderRight: 'none', borderTop: 'none', borderBottomLeftRadius: 8 } }),
            h('div', { className: 'scan-corner', style: { bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none', borderBottomRightRadius: 8 } }),
            h('div', { className: 'scan-laser' })),
          h('div', { className: 'scan-hint' }, '바코드를 사각형 안에 맞춰주세요  ·  탭하여 데모')),
        h('div', { className: 'scan-or' }, '또는'),
        h('div', { style: { padding: '0 20px' } }, h(Button, { variant: 'secondary', block: true, leftIcon: 'search', onClick: () => nav.push('scanResult') }, '제품명으로 검색'))));
  }

  /* ---------------- SCR-008 Scan result ---------------- */
  function ScanResult({ nav, platform }) {
    const header = h(Header, { title: '사료 성분 분석', platform, onBack: nav.back });
    return h(AppScreen, { header, tab: 'food', nav, platform, ad: h(AdBanner, { title: '우리 아이 맞춤 사료 추천받기', sub: 'AD · 펫푸드랩' }) },
      pad(h(FoodAnalysisResult, { product: DD.product })));
  }

  /* ---------------- SCR-009 Symptom categories ---------------- */
  function SymptomCats({ nav, setUi, platform }) {
    const header = h(Header, { title: '어디가 안 좋아 보이나요?', platform, onBack: nav.canBack ? nav.back : null });
    const start = (cat) => { setUi({ symptomIdx: 0, symptomVerdict: null }); nav.push('symptomQ'); };
    return h(AppScreen, { header, tab: 'symptom', nav, platform },
      pad(gap(14,
        h('div', { className: 'sy-grid' }, DD.symptomCats.map(c =>
          h('button', { key: c.id, className: 'sy-cat', onClick: () => start(c) },
            h('span', { className: 'sy-cat__emoji' }, c.emoji),
            h('span', { className: 'sy-cat__label' }, c.label),
            h('span', { className: 'sy-cat__sub' }, c.sub)))),
        h('button', { className: 'sy-emergency', onClick: () => { setUi({ symptomVerdict: 'emergency' }); nav.push('symptomResult'); } },
          h('span', { style: { fontSize: 26 } }, '🚨'),
          h('div', { style: { flex: 1 } },
            h('div', { className: 'sy-emergency__t' }, '응급 증상'),
            h('div', { className: 'sy-emergency__s' }, '발작 · 의식 없음 · 호흡 곤란')),
          h(Icon, { name: 'chevR', size: 20, color: 'var(--danger-strong)' })))));
  }

  /* ---------------- SCR-010 Symptom questions ---------------- */
  function SymptomQ({ nav, state, setUi, platform }) {
    const idx = state.ui.symptomIdx || 0;
    const total = DD.symptomQuestions.length;
    const qq = DD.symptomQuestions[idx];
    const onSelect = (opt) => {
      if (opt.verdict) { setUi({ symptomVerdict: opt.verdict }); if (opt.verdict === 'emergency') nav.push('symptomResult'); else nav.push('interstitial'); }
      else if (typeof opt.next === 'number') setUi({ symptomIdx: opt.next });
    };
    const back = () => { if (idx > 0) setUi({ symptomIdx: idx - 1 }); else nav.back(); };
    const header = h(Header, { title: '증상 체크', platform, onBack: back });
    return h(AppScreen, { header, tab: 'symptom', nav, platform },
      pad(h(SymptomChecker, { current: idx + 1, total, question: qq.q, options: qq.options, onSelect })));
  }

  /* ---------------- Interstitial ad (before non-emergency result) ---------------- */
  function Interstitial({ nav, platform }) {
    const [sec, setSec] = useState(5);
    useEffect(() => { if (sec <= 0) return; const t = setTimeout(() => setSec(sec - 1), 1000); return () => clearTimeout(t); }, [sec]);
    const close = () => nav.replace('symptomResult');
    const header = h(Header, { platform, title: ' ' });
    return h(AppScreen, { header, tab: 'symptom', nav, platform },
      h('div', { className: 'intersti' },
        h('div', { className: 'intersti__card', style: { position: 'relative' } },
          sec <= 0 ? h('button', { className: 'intersti__close', onClick: close }, h(Icon, { name: 'close', size: 16 })) : null,
          h('div', { className: 'intersti__art' }, '🦴'),
          h('div', { className: 'intersti__body' },
            h('div', { style: { fontSize: 11, fontWeight: 800, color: 'var(--text-3)', letterSpacing: '.04em' } }, 'AD · 광고'),
            h('div', { className: 't-h2', style: { margin: '8px 0 6px' } }, '튼튼한 관절을 위한\n관절 영양제'),
            h('div', { className: 't-sub text-2' }, '수의사 추천 · 첫 구매 40% 할인'),
            h(Button, { block: true, size: 'lg', style: { marginTop: 16 }, onClick: close }, '자세히 보기'),
            h('div', { className: 'intersti__skip' }, sec > 0 ? `${sec}초 후 결과를 볼 수 있어요` : '닫고 결과 보기')))));
  }

  /* ---------------- SCR-011 Symptom result ---------------- */
  function SymptomResultScreen({ nav, state, platform }) {
    const v = state.ui.symptomVerdict || 'watch';
    const result = DD.symptomResults[v];
    const header = h(Header, { title: '증상 체크 결과', platform, onBack: nav.back });
    const ad = v !== 'emergency' ? h(AdBanner, { title: v === 'watch' ? '소화가 편한 처방 사료' : '우리 아이 맞춤 건강검진', sub: 'AD · 벳다이어트' }) : null;
    return h(AppScreen, { header, tab: 'symptom', nav, platform, ad },
      pad(h(SymptomResult, { result, onFindHospital: () => nav.tab('hospitalList', 'hospital') })));
  }

  /* ---------------- SCR-012 Hospital list ---------------- */
  function HospitalListScreen({ nav, state, setUi, platform }) {
    const view = state.ui.hospView || 'list';
    const header = h(Header, { title: '근처 동물병원', platform, onBack: nav.canBack ? nav.back : null });
    const open = (hh) => { setUi({ selectedHospital: hh.id }); nav.push('hospitalDetail'); };
    return h(AppScreen, { header, tab: 'hospital', nav, platform },
      h('div', null,
        h('div', { className: 'hosp-toolbar' },
          h('div', { style: { width: 150 } }, h(HospitalList.ViewToggle, { value: view, onChange: v => setUi({ hospView: v }) })),
          h('div', { style: { flex: 1 } }),
          h(HospitalList.RadiusSelector, { value: '1km' })),
        pad(gap(12,
          h(HospitalList.Map),
          h(HospitalList.ResultCount, { count: DD.hospitals.length }),
          DD.hospitals.map((hh, i) => h(React.Fragment, { key: hh.id },
            i === 2 ? h(NativeAd) : null,
            h(HospitalCard, { h: hh, onClick: () => open(hh) })))))));
  }

  /* ---------------- SCR-013 Hospital detail ---------------- */
  function HospitalDetail({ nav, state, platform }) {
    const hosp = DD.hospitals.find(x => x.id === state.ui.selectedHospital) || DD.hospitals[1];
    const header = h(Header, { title: '병원 정보', platform, onBack: nav.back });
    const row = (icon, label, value) => h('div', { className: 'hosp-info-row' },
      h('span', { className: 'ic' }, h(Icon, { name: icon, size: 20 })),
      h('div', null, h('div', { className: 'hosp-info-row__label' }, label), h('div', { className: 'hosp-info-row__value' }, value)));
    return h(AppScreen, { header, tab: 'hospital', nav, platform },
      pad(
        h('div', { className: 'hosp-detail-map' }, h(HospitalList.Map)),
        h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 } },
          h('span', { className: 't-h1' }, hosp.name)),
        h('div', { style: { marginBottom: 8 } }, h(window.StatusBadge, { isOpen: hosp.open, is24h: hosp.is24h })),
        row('pin', '주소', hosp.addr),
        row('clipboard', '진료 시간', hosp.hours),
        row('phone', '전화', hosp.phone),
        h('div', { className: 'hosp-cta' },
          h(Button, { variant: 'secondary', block: true, leftIcon: 'phone' }, '전화'),
          h(Button, { block: true, leftIcon: 'directions' }, '길찾기'))));
  }

  /* ---------------- SCR-014 Records ---------------- */
  function Records({ nav, state, setUi, platform }) {
    const tab = state.ui.recTab || 'all';
    const ins = window.ddInsets(platform);
    const header = h(Header, { title: '건강 기록', platform, large: true,
      right: h('button', { className: 'app-header__back', onClick: () => nav.push('addRecord') }, h(Icon, { name: 'plus', size: 24 })) });
    return h('div', { className: 'app-screen rec-fab-wrap' },
      header,
      h('div', { className: 'app-scroll' }, pad(h(HealthRecord, { pet: DD.pet, records: DD.records, tab, onTab: v => setUi({ recTab: v }) }))),
      h('button', { className: 'app-fab', style: { bottom: 84 + ins.bottom }, onClick: () => nav.push('addRecord') }, h(Icon, { name: 'plus', size: 26, stroke: 2.4 })),
      h(AdBanner),
      h(window.AppShell.TabBar, { active: 'records', nav, platform }));
  }

  /* ---------------- SCR-015 Add record (sheet) ---------------- */
  const REC_TYPES = [{ id: 'vaccine', emoji: '💉', label: '예방접종' }, { id: 'weight', emoji: '⚖️', label: '체중' }, { id: 'vet', emoji: '🏥', label: '병원 방문' }];
  function AddRecord({ nav, state, setUi, platform }) {
    const t = state.ui.addType || 'vaccine';
    const header = h(Header, { title: '기록 추가', platform, onBack: nav.back, large: false });
    const selField = (label, value, ph) => h(Field, { label }, h('div', { className: 'sel-input' }, h('span', value ? null : { className: 'ph' }, value || ph), h('span', { className: 'ic' }, h(Icon, { name: 'chevD', size: 18 }))));
    return h(AppScreen, { header, platform },
      pad(gap(18,
        h(Field, { label: '기록 종류' }, h('div', { className: 'rt-grid' }, REC_TYPES.map(rt =>
          h('button', { key: rt.id, className: 'rt-chip' + (t === rt.id ? ' rt-chip--on' : ''), onClick: () => setUi({ addType: rt.id }) },
            h('span', { style: { fontSize: 22 } }, rt.emoji), h('span', null, rt.label))))),
        t === 'vaccine' ? gap(18,
          selField('백신 종류', 'DHPPL'),
          selField('접종일', '2026.06.12'),
          selField('다음 예정일', '2027.06.12 (자동)'),
          h(Field, { label: '메모 (선택)' }, h(Textarea, { placeholder: '특이사항을 적어주세요' }))) : null,
        t === 'weight' ? gap(18,
          selField('날짜', '2026.06.12'),
          h(Field, { label: '체중 (kg)' }, h(Input, { placeholder: '예) 3.2', inputMode: 'decimal' })),
          h(Field, { label: '메모 (선택)' }, h(Textarea, { placeholder: '특이사항을 적어주세요' }))) : null,
        t === 'vet' ? gap(18,
          selField('방문일', '2026.06.12'),
          h(Field, { label: '병원 이름' }, h(Input, { placeholder: '예) 행복동물병원' })),
          h(Field, { label: '방문 사유' }, h(Input, { placeholder: '예) 피부 발진 검진' })),
          h(Field, { label: '메모 (선택)' }, h(Textarea, { placeholder: '진단·처방 내용을 적어주세요' }))) : null,
        h(Button, { block: true, size: 'lg', onClick: nav.back }, '저장하기'))));
  }

  /* ---------------- SCR-016 Settings ---------------- */
  function Settings({ nav, platform }) {
    const header = h(Header, { title: '설정', platform, onBack: nav.back, large: true });
    return h(AppScreen, { header, platform },
      pad(gap(24,
        h('div', null, h(SectionHeading, null, '반려견 프로필'),
          h(Card, { style: { overflow: 'hidden' } },
            h(Row, { emoji: '🐶', title: DD.pet.name, sub: `${DD.pet.breed} · ${DD.pet.age}` }))),
        h('div', null, h(SectionHeading, null, '앱 설정'),
          h(Card, { style: { overflow: 'hidden' } },
            h(Row, { icon: 'bell', title: '알림', chevron: true }),
            h(Divider, { inset: true }),
            h(Row, { icon: 'weight', title: '단위', right: h('span', { className: 't-sub text-2', style: { display: 'flex', alignItems: 'center', gap: 4 } }, 'kg', h(Icon, { name: 'chevR', size: 16, color: 'var(--text-3)' })) }))),
        h('div', null, h(SectionHeading, null, '약관'),
          h(Card, { style: { overflow: 'hidden' } },
            h(Row, { icon: 'info', title: '개인정보 처리방침' }),
            h(Divider, { inset: true }),
            h(Row, { icon: 'clipboard', title: '이용약관' }))),
        h('div', { className: 'set-version' }, '댕댕케어 v1.0.0'))));
  }

  window.Screens = {
    splash: Splash, onboarding: Onboarding, profile: Profile, home: Home,
    foodSearch: FoodSearch, foodResult: FoodResultScreen, scan: Scan, scanResult: ScanResult,
    symptomCats: SymptomCats, symptomQ: SymptomQ, interstitial: Interstitial, symptomResult: SymptomResultScreen,
    hospitalList: HospitalListScreen, hospitalDetail: HospitalDetail,
    records: Records, addRecord: AddRecord, settings: Settings,
  };
  // tab group for each screen
  window.ScreenTab = {
    foodSearch: 'food', foodResult: 'food', scan: 'food', scanResult: 'food',
    symptomCats: 'symptom', symptomQ: 'symptom', interstitial: 'symptom', symptomResult: 'symptom',
    hospitalList: 'hospital', hospitalDetail: 'hospital',
    home: 'home', records: 'records',
  };
})();
