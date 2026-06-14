/* DaengDaeng Care — Component library: ATOMS + MOLECULES
   Compound-friendly building blocks. Exported to window. */
(function () {
  const { Icon } = window;
  const h = React.createElement;

  /* ============ ATOMS ============ */

  function Button({ variant = 'primary', size, block, children, leftIcon, ...rest }) {
    const cls = ['dd-btn', `dd-btn--${variant}`];
    if (size) cls.push(`dd-btn--${size}`);
    if (block) cls.push('dd-btn--block');
    return h('button', { className: cls.join(' '), ...rest },
      leftIcon ? h(Icon, { name: leftIcon, size: 20 }) : null, children);
  }

  function IconButton({ icon, size = 22, ...rest }) {
    return h('button', { className: 'dd-iconbtn', ...rest }, h(Icon, { name: icon, size }));
  }

  const SAFETY = {
    safe: { ic: '✅', label: '먹어도 좋아요' },
    caution: { ic: '⚠️', label: '소량만 주세요' },
    danger: { ic: '🚨', label: '절대 안 돼요' },
  };
  function SafetyBadge({ level = 'safe', label }) {
    const m = SAFETY[level];
    return h('span', { className: `dd-safety dd-safety--${level}` },
      h('span', { className: 'ic' }, m.ic), label || m.label);
  }

  function StatusBadge({ isOpen, is24h }) {
    if (is24h) return h('span', { className: 'dd-status dd-status--24h' }, h('span', { className: 'dot' }), '24시간');
    if (isOpen) return h('span', { className: 'dd-status dd-status--open' }, h('span', { className: 'dot' }), '진료중');
    return h('span', { className: 'dd-status dd-status--closed' }, h('span', { className: 'dot' }), '진료마감');
  }

  function GradeBadge({ grade = 'B' }) {
    const key = grade[0].toLowerCase();
    return h('span', { className: `dd-grade dd-grade--${key}` }, grade);
  }

  function Chip({ children, variant, selected, onRemove, ...rest }) {
    const cls = ['dd-chip'];
    if (variant) cls.push(`dd-chip--${variant}`);
    if (selected) cls.push('dd-chip--selected');
    return h('button', { className: cls.join(' '), ...rest }, children,
      onRemove ? h('span', { className: 'x', onClick: onRemove }, '✕') : null);
  }

  function Avatar({ size = 'md', src, name = '', emoji }) {
    return h('span', { className: `dd-avatar dd-avatar--${size}` },
      src ? h('img', { src, alt: name }) : (emoji || (name ? name[0] : '🐶')));
  }

  function ProgressBar({ value = 0, total = 1 }) {
    const pct = Math.max(0, Math.min(100, (value / total) * 100));
    return h('div', { className: 'dd-progress' }, h('div', { className: 'dd-progress__fill', style: { width: pct + '%' } }));
  }

  function Field({ label, required, children }) {
    return h('label', { className: 'dd-field' },
      label ? h('span', { className: 'dd-field__label' }, label, required ? h('span', { className: 'req' }, '*') : null) : null,
      children);
  }

  function Input({ icon, ...rest }) {
    return h('div', { className: 'dd-input' },
      icon ? h('span', { className: 'lead' }, h(Icon, { name: icon, size: 20 })) : null,
      h('input', rest));
  }

  function Textarea({ ...rest }) {
    return h('div', { className: 'dd-input' }, h('textarea', { rows: 3, ...rest }));
  }

  function Segment({ items, value, onChange }) {
    const ref = React.useRef(null);
    const [thumb, setThumb] = React.useState({ left: 3, width: 0 });
    React.useEffect(() => {
      const el = ref.current; if (!el) return;
      const idx = items.findIndex(i => i.value === value);
      const btn = el.children[idx + 1];
      if (btn) setThumb({ left: btn.offsetLeft, width: btn.offsetWidth });
    }, [value, items]);
    return h('div', { className: 'dd-segment', ref },
      h('div', { className: 'dd-segment__thumb', style: { left: thumb.left, width: thumb.width } }),
      items.map(it => h('button', {
        key: it.value, className: it.value === value ? 'active' : '',
        onClick: () => onChange && onChange(it.value),
      }, it.label)));
  }

  function Option({ label, selected, onClick }) {
    return h('button', { className: 'dd-option' + (selected ? ' dd-option--selected' : ''), onClick },
      h('span', { className: 'dd-option__check' }, h(Icon, { name: 'check', size: 14, stroke: 3 })),
      h('span', { className: 'dd-option__label' }, label));
  }

  function PillGroup({ options, value, onChange }) {
    return h('div', { className: 'dd-pillgroup' },
      options.map(o => h('button', {
        key: o, className: o === value ? 'active' : '', onClick: () => onChange && onChange(o),
      }, o)));
  }

  /* ============ MOLECULES ============ */

  function Card({ pad, flat, className = '', children, ...rest }) {
    const cls = ['dd-card']; if (pad) cls.push('dd-card--pad'); if (flat) cls.push('dd-card--flat');
    return h('div', { className: cls.join(' ') + ' ' + className, ...rest }, children);
  }

  function Row({ icon, emoji, title, sub, onClick, chevron = true, right }) {
    return h('button', { className: 'dd-row', onClick },
      (icon || emoji) ? h('span', { className: 'dd-row__icon' }, emoji ? emoji : h(Icon, { name: icon, size: 20 })) : null,
      h('span', { className: 'dd-row__body' },
        h('span', { className: 'dd-row__title' }, title),
        sub ? h('span', { className: 'dd-row__sub' }, sub) : null),
      right || (chevron ? h('span', { className: 'dd-row__chev' }, h(Icon, { name: 'chevR', size: 18 })) : null));
  }

  function SectionHeading({ children }) { return h('h3', { className: 'dd-section-h' }, children); }

  function Divider({ inset }) { return h('hr', { className: 'dd-divider' + (inset ? ' dd-divider--inset' : '') }); }

  function AdBanner({ title = '우리 아이 첫 종합검진 50% 할인', sub = 'AD · 댕댕펫보험' }) {
    return h('div', { className: 'dd-ad' },
      h('span', { className: 'dd-ad__tag' }, 'AD'),
      h('div', { className: 'dd-ad__thumb' }),
      h('div', { className: 'dd-ad__body' },
        h('div', { className: 'dd-ad__title' }, title),
        h('div', { className: 'dd-ad__sub' }, sub)));
  }

  function NativeAd({ title = '프리미엄 사료 첫 구매 30%', sub = '믿을 수 있는 성분, 무료 배송' }) {
    return h('div', { className: 'dd-card', style: { margin: '0 0 12px', overflow: 'hidden' } },
      h('div', { style: { display: 'flex', gap: 12, padding: 14, alignItems: 'center' } },
        h('div', { style: { width: 52, height: 52, borderRadius: 12, background: 'var(--surface-sunken)', flexShrink: 0 } }),
        h('div', { style: { flex: 1, minWidth: 0 } },
          h('div', { style: { display: 'flex', alignItems: 'center', gap: 6 } },
            h('span', { className: 'dd-ad__tag' }, 'AD'),
            h('span', { className: 't-caption text-3' }, '광고')),
          h('div', { className: 't-callout', style: { fontWeight: 700, marginTop: 4 } }, title),
          h('div', { className: 't-caption text-2' }, sub))));
  }

  function Note({ icon = 'info', children }) {
    return h('div', { className: 'dd-note' }, h('span', { className: 'ic' }, h(Icon, { name: icon, size: 16 })), h('span', null, children));
  }

  function EmptyState({ icon = '🐾', title, desc, action }) {
    return h('div', { className: 'dd-empty' },
      h('div', { className: 'dd-empty__icon' }, icon),
      h('div', { className: 'dd-empty__title' }, title),
      desc ? h('div', { className: 'dd-empty__desc' }, desc) : null,
      action);
  }

  const VERDICT = {
    safe: { emoji: '✅', label: '먹어도 좋아요' },
    caution: { emoji: '⚠️', label: '소량만 주세요' },
    danger: { emoji: '🚨', label: '절대 안 돼요' },
    emergency: { emoji: '🚨', label: '바로 병원으로' },
    today: { emoji: '⚠️', label: '오늘 안에 병원' },
    watch: { emoji: '✅', label: '지켜봐 주세요' },
  };
  function Verdict({ level, label, sub }) {
    const m = VERDICT[level] || VERDICT.safe;
    return h('div', { className: `dd-verdict dd-verdict--${level}` },
      h('div', { className: 'pulse' }),
      h('div', { className: 'emoji' }, m.emoji),
      h('div', { className: 'label' }, label || m.label),
      sub ? h('div', { style: { fontSize: 14, fontWeight: 600, opacity: .92 } }, sub) : null);
  }

  function IngredientItem({ rank, name, status }) {
    const tag = { safe: '좋아요', caution: '주의', danger: '위험' }[status];
    return h('div', { className: 'dd-ingredient' },
      rank ? h('span', { className: 'dd-ingredient__rank' }, rank) : null,
      h('span', { className: 'dd-ingredient__name' }, name),
      h('span', { className: `dd-ingredient__tag dd-ingredient__tag--${status}` }, tag));
  }

  function Bullets({ items, variant }) {
    return h('ul', { className: 'dd-bullets' + (variant ? ' dd-bullets--' + variant : ''), style: { margin: 0, padding: 0 } },
      items.map((t, i) => h('li', { key: i }, t)));
  }

  Object.assign(window, {
    Button, IconButton, SafetyBadge, StatusBadge, GradeBadge, Chip, Avatar, ProgressBar,
    Field, Input, Textarea, Segment, Option, PillGroup,
    Card, Row, SectionHeading, Divider, AdBanner, NativeAd, Note, EmptyState, Verdict, IngredientItem, Bullets,
  });
})();
