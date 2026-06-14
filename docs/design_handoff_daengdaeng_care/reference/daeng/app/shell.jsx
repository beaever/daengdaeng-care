/* DaengDaeng Care — App shell: Header, TabBar, AppScreen, insets */
(function () {
  const h = React.createElement;
  const { Icon } = window;

  const INSETS = { ios: { top: 52, bottom: 34 }, android: { top: 10, bottom: 12 } };
  window.ddInsets = (p) => INSETS[p] || INSETS.ios;

  const TABS = [
    { id: 'home', label: '홈', icon: 'home', screen: 'home' },
    { id: 'food', label: '음식', icon: 'bone', screen: 'foodSearch' },
    { id: 'symptom', label: '증상', icon: 'stethoscope', screen: 'symptomCats' },
    { id: 'hospital', label: '병원', icon: 'hospital', screen: 'hospitalList' },
    { id: 'records', label: '기록', icon: 'clipboard', screen: 'records' },
  ];

  function TabBar({ active, nav, platform }) {
    const ins = window.ddInsets(platform);
    return h('nav', { className: 'app-tabbar', style: { paddingBottom: ins.bottom } },
      TABS.map(t => {
        const on = t.id === active;
        return h('button', { key: t.id, className: 'app-tab' + (on ? ' app-tab--on' : ''), onClick: () => nav.tab(t.screen, t.id) },
          h(Icon, { name: t.icon, size: 24, stroke: on ? 2.4 : 2 }),
          h('span', null, t.label));
      }));
  }

  function Header({ title, onBack, right, platform, transparent, large }) {
    const ins = window.ddInsets(platform);
    const android = platform === 'android';
    return h('header', { className: 'app-header' + (transparent ? ' app-header--t' : ''), style: { paddingTop: ins.top } },
      h('div', { className: 'app-header__bar' },
        onBack ? h('button', { className: 'app-header__back', onClick: onBack, 'aria-label': '뒤로' },
          h(Icon, { name: 'back', size: android ? 24 : 22, stroke: 2.4 })) : h('span', { style: { width: android ? 24 : 8 } }),
        h('div', { className: 'app-header__title' + (android ? ' app-header__title--left' : ''), style: { textAlign: android ? 'left' : 'center' } }, title),
        right || h('span', { style: { width: 36 } })));
  }

  // Full-height app screen: header? + scroll + (ad?) + tabbar?
  function AppScreen({ header, children, tab, nav, platform, ad, footer, scrollRef, bg }) {
    return h('div', { className: 'app-screen', style: bg ? { background: bg } : null },
      header,
      h('div', { className: 'app-scroll', ref: scrollRef }, children),
      ad,
      footer,
      tab ? h(TabBar, { active: tab, nav, platform }) : null);
  }

  window.AppShell = { TabBar, Header, AppScreen, TABS };
})();
