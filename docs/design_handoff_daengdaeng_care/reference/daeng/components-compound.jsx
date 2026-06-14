/* DaengDaeng Care — COMPOUND COMPONENTS
   Implements the spec's composable APIs (FoodResult, SymptomChecker, etc).
   Built by composing core atoms/molecules. Exported to window. */
(function () {
  const h = React.createElement;
  const {
    Icon, Button, SafetyBadge, StatusBadge, GradeBadge, Chip, Avatar, ProgressBar,
    Card, Row, SectionHeading, AdBanner, NativeAd, Note, Verdict, IngredientItem, Bullets,
    Option, Segment,
  } = window;

  const Stack = (gap, children, style) => h('div', { style: { display: 'flex', flexDirection: 'column', gap, ...style } }, React.Children.toArray(children));
  const Block = ({ title, children }) => h('div', null,
    title ? h(SectionHeading, null, title) : null, children);

  /* ============ PetProfileCard ============ */
  function PetProfileCard({ pet, onClick }) {
    return h('button', { className: 'dd-card dd-card--pad', onClick,
      style: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left', cursor: 'pointer', border: '1px solid var(--border)' } },
      h(PetProfileCard.Avatar, { pet }),
      h(PetProfileCard.Info, { pet }),
      h(PetProfileCard.NextVaccine, { days: pet.nextVaccineDays }));
  }
  PetProfileCard.Avatar = ({ pet }) => h(Avatar, { size: 'md', name: pet.name, emoji: '🐶' });
  PetProfileCard.Info = ({ pet }) => h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 } },
    h('div', { className: 't-title' }, pet.name),
    h('div', { className: 't-caption text-2' }, `${pet.breed} · ${pet.age}`));
  PetProfileCard.NextVaccine = ({ days }) => h('div', {
    style: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 } },
    h('span', { className: 't-micro text-3' }, '다음 접종'),
    h('span', { className: 'dd-chip dd-chip--brand', style: { minHeight: 26, padding: '0 10px', fontWeight: 800 } }, `D-${days}`));

  /* ============ QuickMenu ============ */
  function QuickMenu({ children }) {
    return h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 } }, children);
  }
  QuickMenu.Item = ({ icon, label, sub, onClick }) => h('button', { className: 'dd-card', onClick,
    style: { display: 'flex', flexDirection: 'column', gap: 10, padding: 16, cursor: 'pointer', textAlign: 'left', alignItems: 'flex-start' } },
    h('span', { style: { width: 44, height: 44, borderRadius: 13, background: 'var(--brand-soft)', color: 'var(--brand-text)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
      h(Icon, { name: icon, size: 24 })),
    h('div', { style: { display: 'flex', flexDirection: 'column', gap: 3 } },
      h('div', { className: 't-callout', style: { fontWeight: 700 } }, label),
      sub ? h('div', { className: 't-caption text-2' }, sub) : null));

  /* ============ HealthSummaryCard ============ */
  function HealthSummaryCard({ pet, children }) {
    return h(Card, { className: '', style: { overflow: 'hidden' } },
      children || [
        h(HealthSummaryCard.WeightRow, { key: 'w', value: pet.weight }),
        h('hr', { key: 'd1', className: 'dd-divider dd-divider--inset' }),
        h(HealthSummaryCard.LastVisitRow, { key: 'v', value: pet.lastVisit }),
        h('hr', { key: 'd2', className: 'dd-divider dd-divider--inset' }),
        h(HealthSummaryCard.NextVaccineRow, { key: 'n', value: `D-${pet.nextVaccineDays}` }),
      ]);
  }
  const summaryRow = (icon, label, value) => h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' } },
    h('span', { style: { color: 'var(--text-3)' } }, h(Icon, { name: icon, size: 19 })),
    h('span', { className: 't-sub', style: { flex: 1, color: 'var(--text-2)', fontWeight: 600 } }, label),
    h('span', { className: 't-callout', style: { fontWeight: 700, whiteSpace: 'nowrap' } }, value));
  HealthSummaryCard.WeightRow = ({ value }) => summaryRow('weight', '최근 체중', value);
  HealthSummaryCard.LastVisitRow = ({ value }) => summaryRow('hospital', '최근 병원 방문', value);
  HealthSummaryCard.NextVaccineRow = ({ value }) => summaryRow('syringe', '다음 예방접종', value);

  /* ============ FoodResult ============ */
  function FoodResult({ food }) {
    const hasSymptoms = food.symptoms && food.symptoms.length;
    return Stack(20, [
      h(FoodResult.Header, { key: 'h', name: food.name }),
      h(Verdict, { key: 'v', level: food.level }),
      h(FoodResult.Description, { key: 'd', level: food.level, text: food.reason, serve: food.serve }),
      hasSymptoms ? h(FoodResult.Symptoms, { key: 's', items: food.symptoms }) : null,
      food.nutrition ? h(FoodResult.Nutrition, { key: 'n', items: food.nutrition }) : null,
      food.related ? h(FoodResult.RelatedFoods, { key: 'r', level: food.level, items: food.related }) : null,
    ]);
  }
  FoodResult.Header = ({ name }) => h('div', null, h('span', { className: 't-h1' }, name));
  FoodResult.Description = ({ level, text, serve }) => h('div', null,
    h(SectionHeading, null, level === 'safe' ? '왜 괜찮을까요?' : level === 'caution' ? '왜 주의해야 하나요?' : '왜 위험한가요?'),
    h('p', { className: 't-body', style: { margin: 0, color: 'var(--text)' } }, text),
    serve ? h('div', { style: { marginTop: 12 } }, h(SectionHeading, null, '이렇게 주세요'), h('p', { className: 't-body', style: { margin: 0 } }, serve)) : null);
  FoodResult.Symptoms = ({ items }) => h(Block, { title: '먹었을 때 증상' }, h(Bullets, { items, variant: 'danger' }));
  FoodResult.Nutrition = ({ items }) => h(Block, { title: '영양 정보' },
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, items.map((n, i) => h(Chip, { key: i, variant: 'brand' }, n))));
  FoodResult.RelatedFoods = ({ level, items }) => h(Block, { title: level === 'danger' ? '이것도 피하세요' : '함께 보면 좋아요' },
    h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: 8 } }, items.map((n, i) => h(Chip, { key: i }, n))));
  FoodResult.AdBanner = AdBanner;

  /* ============ FoodAnalysisResult ============ */
  function FoodAnalysisResult({ product }) {
    return Stack(20, [
      h(FoodAnalysisResult.ProductHeader, { key: 'p', name: product.name, brand: product.brand }),
      h(FoodAnalysisResult.Grade, { key: 'g', grade: product.grade, label: product.gradeLabel }),
      h(FoodAnalysisResult.IngredientList, { key: 'i', items: product.ingredients }),
      h(FoodAnalysisResult.WarningSection, { key: 'w', warnings: product.warnings }),
    ]);
  }
  FoodAnalysisResult.ProductHeader = ({ name, brand, image }) => h('div', { style: { display: 'flex', gap: 14, alignItems: 'center' } },
    h('div', { style: { width: 64, height: 64, borderRadius: 14, background: 'var(--surface-sunken)', flexShrink: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 } }, image ? h('img', { src: image, style: { width: '100%' } }) : '📦'),
    h('div', null, h('div', { className: 't-title' }, name), h('div', { className: 't-caption text-2' }, brand)));
  FoodAnalysisResult.Grade = ({ grade, label }) => h(Card, { pad: true, style: { display: 'flex', alignItems: 'center', gap: 16 } },
    h(GradeBadge, { grade }),
    h('div', null, h('div', { className: 't-micro text-3' }, '종합 등급'), h('div', { className: 't-title' }, label)));
  FoodAnalysisResult.IngredientList = ({ items }) => h(Block, { title: '주요 원료 TOP 5' },
    h(Card, { pad: true, flat: true, style: { padding: '4px 16px' } },
      items.map((it, i) => [
        h(IngredientItem, { key: it.rank, ...it }),
        i < items.length - 1 ? h('hr', { key: 'd' + i, className: 'dd-divider' }) : null,
      ])));
  FoodAnalysisResult.IngredientItem = IngredientItem;
  FoodAnalysisResult.WarningSection = ({ warnings }) => warnings && warnings.length ? h(Block, { title: '주의가 필요한 원료' },
    Stack(10, warnings.map((w, i) => h(Card, { key: i, pad: true, style: { borderLeft: '3px solid var(--caution)' } },
      h('div', { style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 } },
        h('span', { className: 'dd-ingredient__tag dd-ingredient__tag--caution' }, '주의'),
        h('span', { className: 't-callout', style: { fontWeight: 700 } }, w.name)),
      h('p', { className: 't-sub text-2', style: { margin: 0 } }, w.note))))) : null;
  FoodAnalysisResult.AdBanner = AdBanner;

  /* ============ SymptomChecker ============ */
  function SymptomChecker({ current, total, question, options, onSelect }) {
    return h('div', { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
      h(SymptomChecker.ProgressBar, { current, total }),
      h(SymptomChecker.Question, { text: question }),
      h(SymptomChecker.Options, null, options.map((o, i) =>
        h(SymptomChecker.Option, { key: i, label: o.label, onClick: () => onSelect(o) }))));
  }
  SymptomChecker.ProgressBar = ({ current, total }) => h('div', { style: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 } },
    h('div', { style: { flex: 1 } }, h(ProgressBar, { value: current, total })),
    h('span', { className: 't-caption text-2', style: { fontWeight: 700, fontVariantNumeric: 'tabular-nums' } }, `${current}/${total}`));
  SymptomChecker.Question = ({ text }) => h('h2', { className: 't-h1', style: { margin: '0 0 24px', textWrap: 'pretty' } }, text);
  SymptomChecker.Options = ({ children }) => Stack(10, children);
  SymptomChecker.Option = ({ label, onClick, selected }) => h(Option, { label, onClick, selected });
  SymptomChecker.NextButton = (p) => h(Button, { block: true, size: 'lg', ...p }, p.children || '다음');

  /* ============ SymptomResult ============ */
  function SymptomResult({ result, onFindHospital }) {
    const isEmergency = result.level === 'emergency';
    return Stack(20, [
      h(Verdict, { key: 'v', level: result.level, label: result.title }),
      h(SymptomResult.Reason, { key: 'r', level: result.level, text: result.reason }),
      result.actions ? h(SymptomResult.ActionList, { key: 'a', level: result.level, items: result.actions }) : null,
      result.watchList ? h(SymptomResult.WatchList, { key: 'w', items: result.watchList }) : null,
      result.hospital ? h(SymptomResult.HospitalButton, { key: 'h', onClick: onFindHospital }) : null,
      h(SymptomResult.Disclaimer, { key: 'd' }),
    ]);
  }
  SymptomResult.SeverityBadge = ({ level, label }) => h(Verdict, { level, label });
  SymptomResult.Reason = ({ level, text }) => h(Block, { title: level === 'watch' ? '지금 상태는요' : level === 'emergency' ? '왜 급한가요?' : '왜 가봐야 하나요?' },
    h('p', { className: 't-body', style: { margin: 0 } }, text));
  SymptomResult.ActionList = ({ level, items }) => h(Block, { title: level === 'watch' ? '집에서 이렇게 해주세요' : '지금 바로 해주세요' },
    h(Bullets, { items, variant: level === 'watch' ? 'safe' : undefined }));
  SymptomResult.WatchList = ({ items }) => h(Block, { title: '이럴 땐 병원으로' }, h(Bullets, { items, variant: 'danger' }));
  SymptomResult.HospitalButton = ({ onClick }) => h(Button, { variant: 'danger', block: true, size: 'lg', leftIcon: 'hospital', onClick }, '근처 병원 찾기');
  SymptomResult.Disclaimer = () => h(Note, { icon: 'info' }, '이 결과는 참고용이며 수의사의 진단을 대신하지 않아요.');
  SymptomResult.AdBanner = AdBanner;

  /* ============ HospitalCard ============ */
  function HospitalCard({ h: hosp, onClick }) {
    return h('button', { className: 'dd-card', onClick, style: { width: '100%', textAlign: 'left', padding: 16, cursor: 'pointer', display: 'block' } },
      h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 } },
        h(HospitalCard.StatusBadge, { isOpen: hosp.open, is24h: hosp.is24h }),
        h(HospitalCard.Distance, { value: hosp.dist })),
      h(HospitalCard.Name, { value: hosp.name }),
      h('div', { style: { display: 'flex', gap: 14, marginTop: 6 } },
        h(HospitalCard.Hours, { value: hosp.hours }),
        h(HospitalCard.Phone, { value: hosp.phone })));
  }
  HospitalCard.StatusBadge = StatusBadge;
  HospitalCard.Name = ({ value }) => h('div', { className: 't-title' }, value);
  HospitalCard.Distance = ({ value }) => h('span', { className: 't-caption text-2', style: { fontWeight: 700 } }, value);
  HospitalCard.Hours = ({ value }) => h('span', { className: 't-caption text-2', style: { display: 'inline-flex', alignItems: 'center', gap: 4 } }, value);
  HospitalCard.Phone = ({ value }) => h('span', { className: 't-caption', style: { color: 'var(--brand-text)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 } }, h(Icon, { name: 'phone', size: 13 }), value);

  function HospitalList({ children }) { return Stack(12, children); }
  HospitalList.ViewToggle = ({ value, onChange }) => h(Segment, { value, onChange, items: [{ value: 'map', label: '지도' }, { value: 'list', label: '목록' }] });
  HospitalList.RadiusSelector = ({ value = '1km', onClick }) => h('button', { className: 'dd-chip', onClick, style: { fontWeight: 700 } }, '반경 ', value, h(Icon, { name: 'chevD', size: 14 }));
  HospitalList.Map = () => h('div', { style: { height: 150, borderRadius: 16, overflow: 'hidden', position: 'relative', background: 'linear-gradient(135deg, #DCE8DC, #C9DCC9)' } },
    h('div', { style: { position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)', backgroundSize: '28px 28px' } }),
    h('div', { style: { position: 'absolute', left: '46%', top: '54%', width: 16, height: 16, borderRadius: '50%', background: '#2D74E0', border: '3px solid #fff', boxShadow: '0 2px 6px rgba(0,0,0,.3)' } }),
    h('div', { style: { position: 'absolute', left: '30%', top: '32%', fontSize: 22 } }, '🟢'),
    h('div', { style: { position: 'absolute', left: '66%', top: '38%', fontSize: 22 } }, '⭐'),
    h('div', { style: { position: 'absolute', left: '72%', top: '66%', fontSize: 22 } }, '🔴'));
  HospitalList.ResultCount = ({ count }) => h('div', { className: 't-sub', style: { fontWeight: 700, color: 'var(--text-2)' } }, `주변 동물병원 ${count}곳`);

  /* ============ HealthRecord ============ */
  const RECORD_META = {
    vaccine: { icon: '💉', emoji: '💉', label: '예방접종' },
    weight: { icon: '⚖️', emoji: '⚖️', label: '체중' },
    vet: { icon: '🏥', emoji: '🏥', label: '병원 방문' },
  };
  function HealthRecord({ pet, records, tab, onTab }) {
    const filtered = tab === 'all' ? records : records.filter(r => r.type === tab);
    const groups = filtered.map(r => ({ date: r.date, rec: r }));
    return h('div', null,
      h(HealthRecord.PetHeader, { pet }),
      h('div', { style: { margin: '14px 0' } }, h(HealthRecord.CategoryTabs, { tab, onTab })),
      h(HealthRecord.Timeline, null, groups.map(g =>
        h(HealthRecord.TimelineGroup, { key: g.rec.id, date: g.date },
          h(HealthRecord.Entry, { rec: g.rec })))));
  }
  HealthRecord.PetHeader = ({ pet }) => h('div', { style: { display: 'flex', alignItems: 'center', gap: 12 } },
    h(Avatar, { size: 'sm', emoji: '🐶' }), h('span', { className: 't-title' }, pet.name));
  HealthRecord.CategoryTabs = ({ tab, onTab }) => h(Segment, { value: tab, onChange: onTab, items: [
    { value: 'all', label: '전체' }, { value: 'vaccine', label: '접종' }, { value: 'weight', label: '체중' }, { value: 'vet', label: '병원' }] });
  HealthRecord.Timeline = ({ children }) => Stack(18, children);
  HealthRecord.TimelineGroup = ({ date, children }) => h('div', null,
    h('div', { className: 't-caption text-3', style: { fontWeight: 700, marginBottom: 8 } }, date), children);
  HealthRecord.Entry = ({ rec }) => {
    const m = RECORD_META[rec.type];
    return h(Card, { pad: true, style: { display: 'flex', gap: 12, alignItems: 'center' } },
      h('span', { style: { fontSize: 22 } }, m.emoji),
      h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 } },
        h('div', { className: 't-micro text-3' }, m.label),
        h('div', { className: 't-callout', style: { fontWeight: 700 } }, rec.title),
        h('div', { className: 't-caption text-2' }, rec.sub)));
  };
  HealthRecord.VaccineEntry = ({ data }) => h(HealthRecord.Entry, { rec: { ...data, type: 'vaccine' } });
  HealthRecord.WeightEntry = ({ data }) => h(HealthRecord.Entry, { rec: { ...data, type: 'weight' } });
  HealthRecord.VetEntry = ({ data }) => h(HealthRecord.Entry, { rec: { ...data, type: 'vet' } });
  HealthRecord.AdBanner = AdBanner;

  Object.assign(window, {
    PetProfileCard, QuickMenu, HealthSummaryCard, FoodResult, FoodAnalysisResult,
    SymptomChecker, SymptomResult, HospitalCard, HospitalList, HealthRecord,
  });
})();
