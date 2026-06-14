/* DaengDaeng Care — Icon set (clean stroke icons). Exported to window.Icon */
(function () {
  const P = {
    home: 'M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h3.5v-6h5v6H18a1 1 0 0 0 1-1V9.5',
    bone: 'M7.5 9.5a2.5 2.5 0 1 0-2.4-3.2A2.5 2.5 0 1 0 6.8 10l5.2 5.2a2.5 2.5 0 1 0 1.2 3.6 2.5 2.5 0 1 0 3.4-3.4l-5.2-5.2',
    barcode: 'M4 6v12M7.5 6v12M11 6v12M14 6v12M17 6v12M20 6v12',
    stethoscope: 'M5 4v5a4 4 0 0 0 8 0V4M5 4H3.5M5 4h1.5M13 4h-1.5M13 4h1.5M9 17a5 5 0 0 0 5-5m4 2a2 2 0 1 0 0 .01M18 14v-2',
    hospital: 'M12 7v8M8 11h8M5 21V6.5a1.5 1.5 0 0 1 1.5-1.5h11A1.5 1.5 0 0 1 19 6.5V21M3 21h18',
    clipboard: 'M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1ZM8 6H6.5A1.5 1.5 0 0 0 5 7.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16M9 12h6M9 16h4',
    search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16ZM21 21l-4.3-4.3',
    chevR: 'M9 6l6 6-6 6',
    chevL: 'M15 6l-6 6 6 6',
    chevD: 'M6 9l6 6 6-6',
    back: 'M15 6l-6 6 6 6',
    plus: 'M12 5v14M5 12h14',
    close: 'M6 6l12 12M18 6L6 18',
    bell: 'M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16ZM10 21a2 2 0 0 0 4 0',
    phone: 'M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.6 1.5A16 16 0 0 1 5 6.6 1.5 1.5 0 0 1 6.5 4Z',
    directions: 'M11.3 3.7 3.7 11.3a1 1 0 0 0 0 1.4l7.6 7.6a1 1 0 0 0 1.4 0l7.6-7.6a1 1 0 0 0 0-1.4l-7.6-7.6a1 1 0 0 0-1.4 0ZM10 14v-2.5a1.5 1.5 0 0 1 1.5-1.5H15M13 8l2.5 2.5L13 13',
    camera: 'M4 8.5A1.5 1.5 0 0 1 5.5 7h2L9 5h6l1.5 2h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9ZM12 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    check: 'M5 12.5 10 17 19 7',
    pin: 'M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
    map: 'M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4ZM9 4v14M15 6v14',
    paw: 'M12 14.5c2.2 0 4 1.6 4 3.2 0 1.3-1 2.1-2.3 2.1-.7 0-1.1-.3-1.7-.3s-1 .3-1.7.3C9 19.8 8 19 8 17.7c0-1.6 1.8-3.2 4-3.2ZM7 12.5a1.6 1.9 0 1 0 0-.01ZM17 12.5a1.6 1.9 0 1 0 0-.01ZM10 9.5a1.5 1.8 0 1 0 0-.01ZM14 9.5a1.5 1.8 0 1 0 0-.01Z',
    weight: 'M5 8h14l1.5 11a1 1 0 0 1-1 1.1H4.5a1 1 0 0 1-1-1.1L5 8ZM9 8a3 3 0 1 1 6 0M9.5 12l-1.5 4.5h2', 
    syringe: 'm14 4 6 6M17 7l-9.5 9.5L4 20l.5-3.5L14 7M9 13l2 2M5.5 15.5 4 14',
    gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM19.4 13a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a2 2 0 0 1-4 0V19a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4 13H3.7a2 2 0 0 1 0-4H4a1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 11 4.3V4a2 2 0 0 1 4 0v.3a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 19.7 11h.3a2 2 0 0 1 0 4h-.3a1.6 1.6 0 0 0-1.3.9Z',
    star: 'M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5Z',
    alert: 'M12 8v5M12 16.5v.5M10.3 3.9 2.4 18a1.5 1.5 0 0 0 1.3 2.2h16.6a1.5 1.5 0 0 0 1.3-2.2L13.7 3.9a1.5 1.5 0 0 0-2.6 0Z',
    info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 11v5M12 8v.5',
    edit: 'M5 19h3l9-9-3-3-9 9v3ZM14 7l3 3',
  };
  function Icon({ name, size = 22, stroke = 2, color = 'currentColor', fill = 'none', style, ...rest }) {
    const d = P[name];
    if (!d) return null;
    const solidFill = (name === 'paw');
    return React.createElement('svg', {
      width: size, height: size, viewBox: '0 0 24 24', fill: solidFill ? color : fill,
      stroke: solidFill ? 'none' : color, strokeWidth: stroke, strokeLinecap: 'round',
      strokeLinejoin: 'round', style, 'aria-hidden': true,
    }, React.createElement('path', { d }));
  }
  window.Icon = Icon;
})();
