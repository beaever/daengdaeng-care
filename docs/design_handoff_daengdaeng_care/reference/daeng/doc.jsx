/* Design System documentation app */
const { useState } = React;
const h = React.createElement;
const {
  Icon, Button, IconButton, SafetyBadge, StatusBadge, GradeBadge, Chip, Avatar, ProgressBar,
  Field, Input, Textarea, Segment, Option, PillGroup,
  Card, Row, SectionHeading, Divider, AdBanner, NativeAd, Note, EmptyState, Verdict, IngredientItem, Bullets,
  PetProfileCard, QuickMenu, HealthSummaryCard, FoodResult, FoodAnalysisResult,
  SymptomChecker, SymptomResult, HospitalCard, HospitalList, HealthRecord, DD,
} = window;

/* ---------- doc helpers ---------- */
function Stage({ name, meta, col, center, code, children }) {
  return h('div', { className: 'ds-stage' },
    h('div', { className: 'ds-stage__view' + (col ? ' ds-stage__view--col' : '') + (center ? ' ds-stage__view--center' : '') }, children),
    (name || meta) ? h('div', { className: 'ds-stage__cap' },
      h('span', { className: 'ds-stage__name' }, name),
      meta ? h('span', { className: 'ds-stage__meta' }, meta) : null) : null,
    code ? h('pre', { className: 'ds-code', dangerouslySetInnerHTML: { __html: code } }) : null);
}
function Sec({ id, kicker, title, desc, children }) {
  return h('section', { className: 'ds-sec', id },
    h('div', { className: 'ds-sec__h' }, kicker),
    h('h2', { className: 'ds-sec__t' }, title),
    desc ? h('p', { className: 'ds-sec__d' }, desc) : null, children);
}
const Sub = (t) => h('h3', { className: 'ds-sub' }, t);
function ColorSwatch({ name, varName, hex, dark }) {
  return h('div', { className: 'ds-swatch' },
    h('div', { className: 'ds-swatch__chip', style: { background: `var(${varName})` } }),
    h('div', { className: 'ds-swatch__info' },
      h('div', { className: 'ds-swatch__name' }, name),
      h('div', { className: 'ds-swatch__hex' }, varName)));
}

/* ---------- nav data ---------- */
const NAV = [
  { group: '파운데이션', items: [['colors', '컬러'], ['type', '타이포그래피'], ['spacing', '스페이싱 · 라운드'], ['elevation', '엘리베이션'], ['icons', '아이콘']] },
  { group: '아톰', items: [['buttons', '버튼'], ['badges', '뱃지'], ['chips', '칩'], ['inputs', '입력 필드'], ['controls', '선택 컨트롤'], ['misc', '아바타 · 프로그레스']] },
  { group: '몰리큘', items: [['cards', '카드 · 리스트'], ['feedback', '결과 · 피드백'], ['ads', '광고 · 빈 상태']] },
  { group: '컴파운드', items: [['c-food', 'FoodResult'], ['c-analysis', 'FoodAnalysisResult'], ['c-symptom', 'SymptomChecker'], ['c-symptomR', 'SymptomResult'], ['c-hospital', 'HospitalList'], ['c-record', 'HealthRecord'], ['c-home', '홈 컴포넌트']] },
];

function App() {
  const [theme, setTheme] = useState('light');
  const [seg, setSeg] = useState('list');
  const [sex, setSex] = useState('남아');
  const [opt, setOpt] = useState(0);
  const [recTab, setRecTab] = useState('all');
  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); }, [theme]);

  return h(React.Fragment, null,
    /* top bar */
    h('div', { className: 'ds-top' },
      h('div', { className: 'ds-logo' },
        h('span', { className: 'mark' }, h(PawHeart, { size: 18, color: '#fff' })),
        '댕댕케어'),
      h('span', { className: 'ver' }, 'Design System v1.0'),
      h('button', { className: 'ds-themetoggle', onClick: () => setTheme(t => t === 'light' ? 'dark' : 'light') },
        theme === 'light' ? '🌙' : '☀️', theme === 'light' ? '다크' : '라이트')),

    h('div', { className: 'ds-shell' },
      /* sidebar */
      h('nav', { className: 'ds-nav' }, NAV.map(g =>
        h('div', { key: g.group },
          h('div', { className: 'ds-nav__group' }, g.group),
          g.items.map(([id, label]) => h('a', { key: id, href: '#' + id }, label))))),

      /* main */
      h('main', { className: 'ds-main' },
        h('div', { className: 'ds-hero' },
          h('h1', null, '댕댕케어 디자인 시스템'),
          h('p', null, '작은 단위(토큰·아톰)부터 조합형 컴파운드 컴포넌트까지. 모든 화면은 이 컴포넌트를 조립해 만듭니다. 라이트·다크, iOS·Android 안전 영역을 모두 고려했어요.')),

        /* ===== FOUNDATIONS ===== */
        Sec({ id: 'colors', kicker: 'FOUNDATION', title: '컬러', desc: '따뜻한 앰버를 브랜드로, 안전도는 의미색(그린·옐로우·레드) 3단계로 명확히 구분합니다. 모든 색은 라이트·다크 토큰으로 매핑돼요.', children: [
          Sub('브랜드'),
          h('div', { className: 'ds-grid ds-grid--4' }, [
            ['Brand 50', '--brand-50'], ['Brand 100', '--brand-100'], ['Brand 300', '--brand-300'], ['Brand 500 · Primary', '--brand-500'],
          ].map(([n, v]) => h(ColorSwatch, { key: v, name: n, varName: v }))),
          Sub('안전도 의미색'),
          h('div', { className: 'ds-grid ds-grid--3' }, [
            ['Safe · 안전', '--safe'], ['Caution · 주의', '--caution'], ['Danger · 위험', '--danger'],
          ].map(([n, v]) => h(ColorSwatch, { key: v, name: n, varName: v }))),
          Sub('표면 · 텍스트 (테마 토큰)'),
          h('div', { className: 'ds-grid ds-grid--4' }, [
            ['Background', '--bg'], ['Surface', '--surface'], ['Surface 2', '--surface-2'], ['Border', '--border'],
          ].map(([n, v]) => h(ColorSwatch, { key: v, name: n, varName: v }))),
        ]}),

        Sec({ id: 'type', kicker: 'FOUNDATION', title: '타이포그래피', desc: 'SUIT — 둥글고 친근하면서 한글 가독성이 높은 서체. 결과 화면의 핵심 정보는 크고 굵게, 설명은 가볍게.', children: [
          h(Stage, { col: true },
            [['t-display', 'Display / 30·800', '먹어도 괜찮아요'],
             ['t-h1', 'H1 / 24·800', '지금 바로 병원에 가세요'],
             ['t-h2', 'H2 / 20·700', '왜 위험한가요?'],
             ['t-title', 'Title / 17·700', '강남응급동물의료센터'],
             ['t-callout', 'Callout / 16·600', '근처 병원 찾기'],
             ['t-body', 'Body / 15·500', '포도와 건포도는 강아지에게 급성 신부전을 일으킬 수 있어요.'],
             ['t-caption', 'Caption / 13·500', '다음 접종까지 15일 남았어요'],
             ['t-micro', 'Micro / 11·700', 'AD · 댕댕펫보험']
            ].map(([cls, spec, txt]) => h('div', { key: cls, className: 'ds-type-row' },
              h('span', { className: 'spec' }, spec), h('span', { className: cls }, txt)))),
        ]}),

        Sec({ id: 'spacing', kicker: 'FOUNDATION', title: '스페이싱 · 라운드', desc: '4pt 그리드. 라운드는 iOS 느낌의 넉넉한 곡률을 기본으로 합니다.', children: [
          Sub('스페이싱 (4pt grid)'),
          h(Stage, null, [4, 8, 12, 16, 20, 24, 32].map(s => h('div', { key: s, className: 'ds-token-box' },
            h('div', { className: 'bar', style: { width: s, height: s } }), h('span', { className: 'lbl' }, s)))),
          Sub('라운드'),
          h(Stage, null, [['xs', 8], ['sm', 12], ['md', 16], ['lg', 20], ['xl', 26], ['pill', 999]].map(([n, r]) =>
            h('div', { key: n, className: 'ds-token-box' },
              h('div', { className: 'ds-radius', style: { borderRadius: r } }), h('span', { className: 'lbl' }, `--r-${n}`)))),
        ]}),

        Sec({ id: 'elevation', kicker: 'FOUNDATION', title: '엘리베이션', desc: '따뜻한 톤의 부드러운 그림자. 카드는 sm, 떠 있는 시트·버튼은 md/lg.', children: [
          h(Stage, { center: true }, ['sm', 'md', 'lg'].map(s => h('div', { key: s,
            style: { width: 120, height: 84, borderRadius: 16, background: 'var(--surface)', boxShadow: `var(--shadow-${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-3)', fontFamily: 'monospace' } }, `shadow-${s}`))),
        ]}),

        Sec({ id: 'icons', kicker: 'FOUNDATION', title: '아이콘', desc: '2px 스트로크 라인 아이콘 세트. 의미·표정이 필요한 곳(안전도·증상 카테고리)에는 이모지를 절제해 사용합니다.', children: [
          h(Stage, null, h('div', { className: 'ds-icons-grid', style: { width: '100%' } },
            ['home','bone','barcode','stethoscope','hospital','clipboard','search','plus','bell','phone','directions','camera','pin','map','star','alert','syringe','weight','gear','edit','check','chevR'].map(n =>
              h('div', { key: n, className: 'ds-icon-cell' }, h(Icon, { name: n, size: 26 }), h('span', null, n))))),
        ]}),

        /* ===== ATOMS ===== */
        Sec({ id: 'buttons', kicker: 'ATOM', title: '버튼', desc: 'Primary는 브랜드 앰버 + 부드러운 그림자. 위험 동작(병원 가기)은 danger.', children: [
          h(Stage, { name: 'Button', meta: 'variant · size · block',
            code: hl(`<Button variant="primary" size="lg">근처 병원 찾기</Button>\n<Button variant="secondary">건너뛰기</Button>\n<Button variant="danger" leftIcon="hospital">병원 찾기</Button>`) },
            h(Button, { variant: 'primary' }, '시작하기'),
            h(Button, { variant: 'secondary' }, '건너뛰기'),
            h(Button, { variant: 'outline' }, '취소'),
            h(Button, { variant: 'ghost' }, '더보기'),
            h(Button, { variant: 'danger', leftIcon: 'hospital' }, '병원 찾기')),
          h(Stage, { name: 'Sizes' },
            h(Button, { size: 'sm' }, 'Small'), h(Button, null, 'Default'), h(Button, { size: 'lg' }, 'Large')),
        ]}),

        Sec({ id: 'badges', kicker: 'ATOM', title: '뱃지', desc: 'SafetyBadge·StatusBadge·GradeBadge — level/상태만 넘기면 색·아이콘·문구가 자동 결정됩니다.', children: [
          h(Stage, { name: 'SafetyBadge', meta: "level='safe'|'caution'|'danger'",
            code: hl(`<SafetyBadge level="danger" />`) },
            h(SafetyBadge, { level: 'safe' }), h(SafetyBadge, { level: 'caution' }), h(SafetyBadge, { level: 'danger' })),
          h(Stage, { name: 'StatusBadge', meta: 'isOpen · is24h',
            code: hl(`<StatusBadge isOpen is24h={false} />`) },
            h(StatusBadge, { isOpen: true }), h(StatusBadge, { isOpen: true, is24h: true }), h(StatusBadge, { isOpen: false })),
          h(Stage, { name: 'GradeBadge', meta: "grade='A'..'D'",
            code: hl(`<GradeBadge grade="B" />`) },
            h(GradeBadge, { grade: 'A' }), h(GradeBadge, { grade: 'B' }), h(GradeBadge, { grade: 'C' }), h(GradeBadge, { grade: 'D' })),
        ]}),

        Sec({ id: 'chips', kicker: 'ATOM', title: '칩', desc: '자주 찾는 음식·관련 음식·반경 선택 등에 사용. 기본 / 브랜드 / 선택 / 삭제 가능.', children: [
          h(Stage, { name: 'Chip', code: hl(`<Chip variant="brand">사과</Chip>\n<Chip selected>선택됨</Chip>\n<Chip onRemove={fn}>최근 검색</Chip>`) },
            h(Chip, null, '포도'), h(Chip, { variant: 'brand' }, '사과'), h(Chip, { selected: true }, '선택됨'), h(Chip, { onRemove: () => {} }, '최근 검색')),
        ]}),

        Sec({ id: 'inputs', kicker: 'ATOM', title: '입력 필드', desc: 'Field로 라벨·필수 표시를 감싸고, Input/Textarea를 조합합니다.', children: [
          h(Stage, { col: true, name: 'Field + Input',
            code: hl(`<Field label="이름" required>\n  <Input placeholder="예) 뭉치" />\n</Field>`) },
            h('div', { style: { width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 16 } },
              h(Field, { label: '이름', required: true }, h(Input, { placeholder: '예) 뭉치' })),
              h(Field, { label: '검색' }, h(Input, { icon: 'search', placeholder: '음식을 검색해 보세요' })),
              h(Field, { label: '메모' }, h(Textarea, { placeholder: '특이사항을 적어주세요' })))),
        ]}),

        Sec({ id: 'controls', kicker: 'ATOM', title: '선택 컨트롤', desc: 'Segment(뷰 전환), Option(증상 체크 보기), PillGroup(성별·중성화).', children: [
          h(Stage, { col: true, name: 'Segment',
            code: hl(`<Segment value={v} onChange={set}\n  items={[{value:'map',label:'지도'},{value:'list',label:'목록'}]} />`) },
            h('div', { style: { width: 240 } }, h(Segment, { value: seg, onChange: setSeg, items: [{ value: 'map', label: '지도' }, { value: 'list', label: '목록' }] }))),
          h(Stage, { col: true, name: 'Option (radio row)',
            code: hl(`<Option label="1~2번" selected onClick={fn} />`) },
            h('div', { style: { width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 10 } },
              ['1~2번', '3~4번', '5번 이상'].map((l, i) => h(Option, { key: i, label: l, selected: opt === i, onClick: () => setOpt(i) })))),
          h(Stage, { col: true, name: 'PillGroup' },
            h('div', { style: { width: 260 } }, h(PillGroup, { options: ['남아', '여아'], value: sex, onChange: setSex }))),
        ]}),

        Sec({ id: 'misc', kicker: 'ATOM', title: '아바타 · 프로그레스', children: [
          h(Stage, { name: 'Avatar' }, h(Avatar, { size: 'lg', emoji: '🐶' }), h(Avatar, { size: 'md', emoji: '🐶' }), h(Avatar, { size: 'sm', emoji: '🐶' })),
          h(Stage, { col: true, name: 'ProgressBar' }, h('div', { style: { width: '100%', maxWidth: 360 } }, h(ProgressBar, { value: 2, total: 4 }))),
        ]}),

        /* ===== MOLECULES ===== */
        Sec({ id: 'cards', kicker: 'MOLECULE', title: '카드 · 리스트', children: [
          h(Stage, { col: true, name: 'Card' }, h('div', { style: { maxWidth: 360 } }, h(Card, { pad: true }, h('div', { className: 't-title' }, '카드'), h('div', { className: 't-body text-2', style: { marginTop: 4 } }, '모든 콘텐츠 블록의 기본 컨테이너입니다.')))),
          h(Stage, { col: true, name: 'Row (list item)', code: hl(`<Row icon="hospital" title="행복동물병원" sub="0.3km · 진료중" />`) },
            h('div', { style: { width: '100%', maxWidth: 360, background: 'var(--surface)', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' } },
              h(Row, { icon: 'hospital', title: '행복동물병원', sub: '0.3km · 진료중' }),
              h(Divider, { inset: true }),
              h(Row, { icon: 'syringe', title: '예방접종 기록', sub: '다음 접종 D-15' }))),
        ]}),

        Sec({ id: 'feedback', kicker: 'MOLECULE', title: '결과 · 피드백', desc: 'Verdict는 결과 화면의 주인공. 안전도/증상 심각도에 따라 색과 문구가 바뀝니다.', children: [
          h(Stage, { name: 'Verdict', meta: "level='safe'|'caution'|'danger'|'emergency'|'today'|'watch'",
            code: hl(`<Verdict level="danger" />`) },
            h('div', { style: { width: 180 } }, h(Verdict, { level: 'safe' })),
            h('div', { style: { width: 180 } }, h(Verdict, { level: 'caution' })),
            h('div', { style: { width: 180 } }, h(Verdict, { level: 'danger' })),
            h('div', { style: { width: 180 } }, h(Verdict, { level: 'emergency' }))),
          h(Stage, { col: true, name: 'IngredientItem' },
            h('div', { style: { width: '100%', maxWidth: 360 } },
              h(IngredientItem, { rank: 1, name: '닭고기', status: 'safe' }),
              h(IngredientItem, { rank: 3, name: '옥수수 글루텐', status: 'caution' }))),
          h(Stage, { col: true, name: 'Note (disclaimer)' },
            h('div', { style: { maxWidth: 420 } }, h(Note, null, '이 결과는 참고용이며 수의사의 진단을 대신하지 않아요.'))),
        ]}),

        Sec({ id: 'ads', kicker: 'MOLECULE', title: '광고 · 빈 상태', desc: '배너는 50pt 고정 높이로 레이아웃에 미리 자리를 잡고, [AD] 라벨을 항상 표기합니다. 응급 화면에는 노출하지 않아요.', children: [
          h(Stage, { col: true, name: 'AdBanner', meta: 'height 52px fixed' },
            h('div', { style: { width: '100%', maxWidth: 360, border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' } }, h(AdBanner, null))),
          h(Stage, { col: true, name: 'NativeAd', meta: '리스트 3번째 삽입' },
            h('div', { style: { width: '100%', maxWidth: 360 } }, h(NativeAd, null))),
          h(Stage, { col: true, name: 'EmptyState' },
            h('div', { style: { maxWidth: 360, width: '100%' } }, h(EmptyState, { icon: '🔍', title: '검색 결과가 없어요', desc: '아직 확인되지 않은 음식이에요.' }))),
        ]}),

        /* ===== COMPOUND ===== */
        Sec({ id: 'c-food', kicker: 'COMPOUND', title: 'FoodResult', desc: '음식 판별 결과 화면. 안전도에 따라 하위 컴포넌트가 자동으로 조합됩니다.', children: [
          h(Stage, { center: true,
            code: hl(`<FoodResult>\n  <FoodResult.Header foodName="포도" />\n  <FoodResult.SafetyBadge level="danger" />\n  <FoodResult.Description />\n  <FoodResult.Symptoms />        // danger/caution only\n  <FoodResult.RelatedFoods />\n  <FoodResult.AdBanner />\n</FoodResult>`) },
            h('div', { className: 'ds-phone' }, h(FoodResult, { food: DD.foods['포도'] }))),
        ]}),

        Sec({ id: 'c-analysis', kicker: 'COMPOUND', title: 'FoodAnalysisResult', desc: '사료 성분 분석 결과. 등급·원료 리스트·주의 원료 섹션을 조합합니다.', children: [
          h(Stage, { center: true,
            code: hl(`<FoodAnalysisResult>\n  <FoodAnalysisResult.ProductHeader name="..." brand="..." />\n  <FoodAnalysisResult.GradeBadge grade="B" />\n  <FoodAnalysisResult.IngredientList>\n    <FoodAnalysisResult.IngredientItem name="닭고기" status="safe" rank={1} />\n  </FoodAnalysisResult.IngredientList>\n  <FoodAnalysisResult.WarningSection />\n</FoodAnalysisResult>`) },
            h('div', { className: 'ds-phone' }, h(FoodAnalysisResult, { product: DD.product }))),
        ]}),

        Sec({ id: 'c-symptom', kicker: 'COMPOUND', title: 'SymptomChecker', desc: '증상 체크 세부 질문. 진행 바·질문·보기·다음 버튼을 조합합니다.', children: [
          h(Stage, { center: true,
            code: hl(`<SymptomChecker>\n  <SymptomChecker.ProgressBar current={2} total={4} />\n  <SymptomChecker.Question text="오늘 몇 번 토했나요?" />\n  <SymptomChecker.Options>\n    <SymptomChecker.Option value="1-2" label="1~2번" />\n  </SymptomChecker.Options>\n  <SymptomChecker.NextButton />\n</SymptomChecker>`) },
            h('div', { className: 'ds-phone' },
              h(SymptomChecker, { current: 1, total: 3, question: DD.symptomQuestions[0].q, options: DD.symptomQuestions[0].options, onSelect: () => {} }))),
        ]}),

        Sec({ id: 'c-symptomR', kicker: 'COMPOUND', title: 'SymptomResult', desc: '증상 체크 결과. 심각도(emergency/today/watch)에 따라 병원 버튼·광고 노출이 달라집니다.', children: [
          h(Stage, { center: true,
            code: hl(`<SymptomResult>\n  <SymptomResult.SeverityBadge level="emergency" />\n  <SymptomResult.Reason />\n  <SymptomResult.ActionList />\n  <SymptomResult.HospitalButton />  // emergency/today\n  <SymptomResult.Disclaimer />\n</SymptomResult>`) },
            h('div', { className: 'ds-phone' }, h(SymptomResult, { result: DD.symptomResults.emergency, onFindHospital: () => {} }))),
        ]}),

        Sec({ id: 'c-hospital', kicker: 'COMPOUND', title: 'HospitalList · HospitalCard', desc: '병원 찾기. 뷰 전환·반경·지도·병원 카드를 조합하고, 3번째에 네이티브 광고를 끼웁니다.', children: [
          h(Stage, { center: true,
            code: hl(`<HospitalList>\n  <HospitalList.ViewToggle />\n  <HospitalList.RadiusSelector />\n  <HospitalList.Map />\n  <HospitalCard>\n    <HospitalCard.StatusBadge isOpen is24h />\n    <HospitalCard.Name /> <HospitalCard.Distance />\n    <HospitalCard.Phone /> <HospitalCard.Hours />\n  </HospitalCard>\n</HospitalList>`) },
            h('div', { className: 'ds-phone' },
              h(HospitalList, null,
                h('div', { style: { display: 'flex', gap: 8, justifyContent: 'space-between' } }, h('div', { style: { width: 150 } }, h(HospitalList.ViewToggle, { value: seg, onChange: setSeg })), h(HospitalList.RadiusSelector, {})),
                h(HospitalList.Map, null),
                h(HospitalList.ResultCount, { count: DD.hospitals.length }),
                DD.hospitals.slice(0, 2).map(hh => h(HospitalCard, { key: hh.id, h: hh }))))),
        ]}),

        Sec({ id: 'c-record', kicker: 'COMPOUND', title: 'HealthRecord', desc: '건강 기록 타임라인. 카테고리 탭으로 접종·체중·병원 기록을 필터링합니다.', children: [
          h(Stage, { center: true,
            code: hl(`<HealthRecord>\n  <HealthRecord.PetHeader />\n  <HealthRecord.CategoryTabs />\n  <HealthRecord.Timeline>\n    <HealthRecord.TimelineGroup date="2026.06.10">\n      <HealthRecord.VaccineEntry data={...} />\n    </HealthRecord.TimelineGroup>\n  </HealthRecord.Timeline>\n</HealthRecord>`) },
            h('div', { className: 'ds-phone' }, h(HealthRecord, { pet: DD.pet, records: DD.records, tab: recTab, onTab: setRecTab }))),
        ]}),

        Sec({ id: 'c-home', kicker: 'COMPOUND', title: '홈 컴포넌트', desc: 'PetProfileCard · QuickMenu · HealthSummaryCard — 홈 화면을 이루는 3개 조합 블록.', children: [
          h(Stage, { center: true, code: hl(`<PetProfileCard>\n  <PetProfileCard.Avatar /> <PetProfileCard.Info />\n  <PetProfileCard.NextVaccine />\n</PetProfileCard>`) },
            h('div', { className: 'ds-phone', style: { display: 'flex', flexDirection: 'column', gap: 16 } },
              h(PetProfileCard, { pet: DD.pet }),
              h(QuickMenu, null,
                h(QuickMenu.Item, { icon: 'bone', label: '음식 판별' }),
                h(QuickMenu.Item, { icon: 'barcode', label: '사료 분석' }),
                h(QuickMenu.Item, { icon: 'stethoscope', label: '증상 체크' }),
                h(QuickMenu.Item, { icon: 'hospital', label: '병원 찾기' })),
              h(HealthSummaryCard, { pet: DD.pet }))),
        ]}),
      )));
}

/* paw+heart mark for the logo */
function PawHeart({ size = 18, color = '#fff' }) {
  return h('svg', { width: size, height: size, viewBox: '0 0 24 24', fill: color },
    h('circle', { cx: 7, cy: 8, r: 2.1 }), h('circle', { cx: 12, cy: 6.2, r: 2.1 }), h('circle', { cx: 17, cy: 8, r: 2.1 }),
    h('path', { d: 'M12 21c-3.2-2.1-5.5-4-5.5-6.4 0-1.9 1.6-3.1 3.2-3.1 1 0 1.8.5 2.3 1.2.5-.7 1.3-1.2 2.3-1.2 1.6 0 3.2 1.2 3.2 3.1 0 2.4-2.3 4.3-5.5 6.4Z' }));
}

function hl(s) {
  s = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  s = s.replace(/(\/\/[^\n]*)/g, '\u0001C\u0002$1\u0003');
  s = s.replace(/(&lt;\/?)([A-Za-z][A-Za-z0-9.]*)/g, '$1\u0001T\u0002$2\u0003');
  s = s.replace(/ ([a-zA-Z][a-zA-Z0-9]*)=/g, ' \u0001A\u0002$1\u0003=');
  return s
    .replace(/\u0001C\u0002([\s\S]*?)\u0003/g, '<span class="cmt">$1</span>')
    .replace(/\u0001T\u0002([\s\S]*?)\u0003/g, '<span class="tag">$1</span>')
    .replace(/\u0001A\u0002([\s\S]*?)\u0003/g, '<span class="attr">$1</span>');
}

ReactDOM.createRoot(document.getElementById('root')).render(h(App));
