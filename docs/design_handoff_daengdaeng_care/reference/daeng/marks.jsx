/* DaengDaeng Care — Logo marks (shared). Exported to window.MarkA / MarkB / MarkC */
(function () {
  const h = React.createElement;
  function MarkA({ size = 96, c = 'currentColor' }) {
    return h('svg', { width: size, height: size, viewBox: '0 0 96 96', fill: c },
      h('ellipse', { cx: 24, cy: 43, rx: 7.5, ry: 9.5, transform: 'rotate(-20 24 43)' }),
      h('ellipse', { cx: 39, cy: 32, rx: 8, ry: 10.5 }),
      h('ellipse', { cx: 57, cy: 32, rx: 8, ry: 10.5 }),
      h('ellipse', { cx: 72, cy: 43, rx: 7.5, ry: 9.5, transform: 'rotate(20 72 43)' }),
      h('path', { d: 'M48 82 C 25 65 21 51 32 45 C 39 41 45 45 48 50 C 51 45 57 41 64 45 C 75 51 71 65 48 82 Z' }));
  }
  function MarkB({ size = 96, c = 'currentColor', c2 = '#fff' }) {
    return h('svg', { width: size, height: size, viewBox: '0 0 96 96' },
      h('g', { fill: c },
        h('ellipse', { cx: 33, cy: 33, rx: 8, ry: 10 }),
        h('ellipse', { cx: 48, cy: 27, rx: 8.5, ry: 11 }),
        h('ellipse', { cx: 63, cy: 33, rx: 8, ry: 10 }),
        h('ellipse', { cx: 48, cy: 61, rx: 23, ry: 20 })),
      h('path', { d: 'M38 61 l7.5 7.5 L60 53', fill: 'none', stroke: c2, strokeWidth: 6.5, strokeLinecap: 'round', strokeLinejoin: 'round' }));
  }
  function MarkC({ size = 96, c = 'currentColor' }) {
    const s = { fill: 'none', stroke: c, strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' };
    return h('svg', { width: size, height: size, viewBox: '0 0 96 96' },
      h('ellipse', { cx: 26, cy: 41, rx: 6.5, ry: 8.5, transform: 'rotate(-18 26 41)', ...s }),
      h('ellipse', { cx: 40, cy: 31, rx: 7, ry: 9, ...s }),
      h('ellipse', { cx: 56, cy: 31, rx: 7, ry: 9, ...s }),
      h('ellipse', { cx: 70, cy: 41, rx: 6.5, ry: 8.5, transform: 'rotate(18 70 41)', ...s }),
      h('path', { d: 'M48 80 C 29 66 24 56 30 50 C 35 45 43 47 48 54 C 53 47 61 45 66 50 C 72 56 67 66 48 80 Z', ...s }),
      h('path', { d: 'M33 63 H41 l3.5 -8 l5 14 l3.5 -6 H63', fill: 'none', stroke: c, strokeWidth: 4, strokeLinecap: 'round', strokeLinejoin: 'round' }));
  }
  Object.assign(window, { MarkA, MarkB, MarkC });
})();
