/* インライン SVG アイコン（Lucide 風、stroke=currentColor）。ライブラリ非依存にするため手書き。 */
(function () {
  const svg = (d, cls = 'size-5') =>
    `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const user = '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>';
  const cart = '<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h2.6l.8 4"/><path fill="white" d="M5.9 7l1.6 8.2a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.2L21.5 7Z"/>';
  const cartGoods = `<g class="header-cart-parcel" display="none" fill="white" stroke-width="1.35">
    <g transform="rotate(-12 11 11)">
      <path d="M9 1h3v2.6c0 1.2 1.5 1.5 1.5 3.3v6.3H7.6V6.9C7.6 5.1 9 4.8 9 3.6Z"/>
      <path d="M9 3h3"/>
    </g>
    <g transform="rotate(8 16 11)">
      <rect x="12.7" y="4.1" width="6.6" height="9" rx=".9"/>
      <path d="M16 4.4v8.3"/>
    </g>
  </g>`;
  const waveHead = '<circle cx="10.8" cy="7.6" r="4"/>';
  const waveArm = `<path class="header-wave-arm" d="M3.5 21 C3.7 16.7 6.6 13.4 10.8 13.4 C11.64 13.4 12.43 13.53 13.15 13.78 C13.88 14.02 14.54 14.38 15.13 14.84 C15.71 15.29 16.23 15.84 16.65 16.47 C17.08 17.09 17.42 17.8 17.67 18.56 C17.91 19.32 18.06 20.14 18.1 21"/>`;
  const P = {
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    user,
    userWave: waveHead + waveArm,
    userWaveBoard: `${waveArm}<g class="login-board">
      <rect x="-12.5" y="-8.9" width="25" height="10" rx="2" fill="white" stroke-width="1.8"/>
      <text x="0" y="-1.5" text-anchor="middle" font-size="7.3" textLength="22.5" lengthAdjust="spacingAndGlyphs" fill="currentColor">ログイン</text>
    </g>${waveHead}`,
    cart,
    cartRoll: `<path class="header-cart-trail" opacity="0" stroke-width="1.3" d="M.9 9.5h3.2M.5 13h3.7M1.8 16.5h2.6"/><g class="header-cart-body">${cartGoods}${cart}
      <g class="header-cart-badge" display="none" transform="translate(23 3)" aria-hidden="true">
        <circle r="5.8" fill="currentColor" stroke="white" stroke-width="1"/>
        <text data-cart-count y="3.1" text-anchor="middle" font-family="system-ui, sans-serif" font-size="9" font-weight="700" fill="white" stroke="none"></text>
      </g></g>`,
    chevronRight: '<path d="m9 6 6 6-6 6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    mapPin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    store: '<path d="M3 9.5 4.5 4h15L21 9.5"/><path d="M4 10v10h16V10"/><path d="M9 20v-6h6v6"/>',
    ticket: '<path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z"/><path d="M13 6v12" stroke-dasharray="2 2"/>',
    heart: '<path d="M12 20s-7.5-4.6-9.3-9.2C1.4 7.4 3.6 4 7 4c2 0 3.6 1.1 5 3 1.4-1.9 3-3 5-3 3.4 0 5.6 3.4 4.3 6.8C19.5 15.4 12 20 12 20z"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5"/>',
    calculator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h.01M12 12h.01M16 12h.01M8 16h.01M12 16h.01M16 16h.01"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
    minus: '<path d="M5 12h14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    train: '<rect x="5" y="3" width="14" height="14" rx="3"/><path d="M5 11h14M8 21l2-4M16 21l-2-4"/><circle cx="9" cy="14" r=".6"/><circle cx="15" cy="14" r=".6"/>',
  };
  window.icon = (name, cls) => svg(P[name] || '', cls);
})();
