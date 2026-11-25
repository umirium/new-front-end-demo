/*
 * 自治体紹介ページの動き（CMS の内容に依存しない汎用の演出のみ）
 * - 試作用の表示パターン切り替え（?pattern=minimal / full）
 * - ヒーロー：タイトルの1文字ずつ表示（長いタイトルでも合計 1.2 秒程度に収める）
 * - 長い本文の折りたたみ（「続きを読む」）
 * - 目次：表示されているセクションから生成し、現在位置に追従
 * - スクロールで表示（IntersectionObserver）、ヒーロー・写真のパララックス
 * - ヘッダー：トップ（top-codex-1）と同じ。メニューは ../top-codex-1/navigation.js、アイコンの動きと状態表示はここ
 * 動きを減らす設定（prefers-reduced-motion: reduce）では、動きを付けず最終状態で表示する
 */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  /* ---------- 試作用：表示パターン（本番では PHP の display_flg 判定に置き換わる） ---------- */
  const pattern = new URLSearchParams(location.search).get('pattern');
  if (pattern === 'minimal') {
    // 画像なしヒーロー、魅力は 1 件、キャラクター・ごあいさつ・みどころなし、特産品 1 件
    $('.hero').dataset.hasImage = 'false';
    ['m_dentou', 'm_kankou', 'm_chara', 'm_goaisatu', 'midokoro'].forEach((f) => $$(`[data-field="${f}"]`).forEach((el) => el.remove()));
    $('[data-split]').textContent = '海と山に抱かれた、ちいさな町';
    $('[data-hero-body]').textContent = '（サンプル）項目が少ない自治体の表示例です。設定されていない項目のセクションは表示しません。';
  } else if (pattern === 'full') {
    // 全項目あり。長いタイトルでも崩れないことを確認する
    $$('[data-sample="full"]').forEach((el) => (el.hidden = false));
    $('[data-split]').textContent = '時を超え　美しく　ひと輝く　歴史都市・京都　〜千年の都の文化と景観を、未来へつなぐ〜';
  }
  // 中身が空になったセクションは出さない（PHP 側でも同じ判定を行う）
  $$('#features, #sightseeing, #specialty').forEach((sec) => {
    if (!sec.querySelector('[data-field^="m_"]:not([hidden])')) sec.remove();
  });

  /* ---------- アイコン（トップのヘッダーは data-icon-size、このページの本文は data-icon-class） ---------- */
  $$('[data-icon]').forEach((el) => {
    el.innerHTML = window.icon(el.dataset.icon, el.dataset.iconSize || el.dataset.iconClass || (el.closest('header, dialog') ? 'size-4' : 'size-5'));
  });

  /* ---------- ヒーロー：1文字ずつ（読み上げ用に元の文字列を aria-label に残す） ---------- */
  $$('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    if (reduce) return;
    const chars = [...text];
    const step = Math.max(12, Math.min(60, Math.round(1200 / chars.length))); // 合計 約1.2秒以内
    el.style.setProperty('--step', `${step}ms`);
    el.setAttribute('aria-label', text);
    el.innerHTML = chars.map((ch, i) => `<span class="char" aria-hidden="true" style="--i:${i}">${ch.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</span>`).join('');
    // 本文はタイトルが出そろってから
    const body = $('[data-hero-body]');
    if (body) body.style.setProperty('--d', `${200 + step * chars.length + 300}ms`);
  });

  /* ---------- 長い本文の折りたたみ ----------
     Tailwind（ブラウザ版）の CSS 生成とフォント読み込みが終わってから高さを測る */
  const CLAMP_LINES = 7;
  const whenLaidOut = () => new Promise((resolve) => {
    const done = () => (document.fonts?.ready || Promise.resolve()).then(() => requestAnimationFrame(() => resolve()));
    document.readyState === 'complete' ? done() : addEventListener('load', done, { once: true });
  });
  whenLaidOut().then(() => $$('[data-clamp]').forEach((p) => {
    const lh = parseFloat(getComputedStyle(p).lineHeight) || 32;
    const limit = lh * CLAMP_LINES;
    if (p.scrollHeight <= limit + lh * 1.5) return; // 少しだけ長い程度なら畳まない
    const bg = getComputedStyle(p.closest('article, section') || document.body).backgroundColor;
    p.classList.add('clamp');
    p.style.setProperty('--clamp-h', `${limit}px`);
    p.style.setProperty('--full-h', `${p.scrollHeight + 40}px`);
    if (bg && bg !== 'rgba(0, 0, 0, 0)') p.style.setProperty('--clamp-bg', bg);
    if (!p.id) p.id = `clamp-${Math.random().toString(36).slice(2, 8)}`;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-bold text-brand-ink';
    btn.setAttribute('aria-controls', p.id);
    btn.setAttribute('aria-expanded', 'false');
    btn.textContent = '続きを読む';
    btn.addEventListener('click', () => {
      const open = p.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? '閉じる' : '続きを読む';
    });
    p.after(btn);
  }));

  /* ---------- 目次（表示中のセクションから生成。3 つ未満なら出さない） ---------- */
  const sections = $$('[data-section]');
  const toc = $('[data-toc]');
  if (sections.length >= 3) {
    $('[data-toc-list]').innerHTML = sections.map((s) =>
      `<li><a href="#${s.id}" class="block whitespace-nowrap rounded-full border border-rule bg-white px-3.5 py-1.5 transition">${s.dataset.tocLabel}</a></li>`).join('');
    toc.hidden = false;
  } else {
    toc.remove();
  }
  const tocLinks = $$('.toc a');
  if (hasIO && tocLinks.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        tocLinks.forEach((a) => {
          const on = a.getAttribute('href') === `#${e.target.id}`;
          a.setAttribute('aria-current', String(on));
          if (on) a.scrollIntoView?.({ block: 'nearest', inline: 'center', behavior: reduce ? 'auto' : 'smooth' });
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- スクロールで表示 ---------- */
  const targets = $$('.reveal, .reveal-mask, .rule-grow, .feature, .spot');
  if (reduce || !hasIO) {
    targets.forEach((el) => el.classList.add('is-in'));
  } else {
    // clip-path で完全に隠した要素（.reveal-mask）は、ブラウザによっては「画面外」と判定され続けるため、
    // 隠していない親要素を監視し、画面に入ったら本体に is-in を付ける
    const watched = new Map(); // 監視する要素 → is-in を付ける要素
    targets.forEach((el) => watched.set(el.matches('.reveal-mask') ? el.parentElement : el, el));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { watched.get(e.target)?.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    watched.forEach((_, el) => io.observe(el));
  }

  /* ---------- スクロール連動：ヒーロー・写真のパララックス ---------- */
  const parallax = $$('[data-parallax]');
  const hero = $('.hero');
  let ticking = false;
  function onScroll() {
    ticking = false;
    if (reduce) return;
    // ヒーロー：画面上端からどれだけ通り過ぎたか（0〜1）。写真・見出し・暗幕の動きは CSS 側で --hero-p から計算する
    if (hero) {
      const r = hero.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      hero.style.setProperty('--hero-p', p.toFixed(4));
    }
    parallax.forEach((img) => {
      if (!img.closest('.spot')?.classList.contains('is-in')) return; // めくれ演出が終わってから動かす
      const r = img.getBoundingClientRect();
      const center = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
      img.style.translate = `0 ${(center * -5).toFixed(2)}%`;
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---------- ヘッダー（トップと同じ振る舞い。メニューの開閉・PC/スマホ切り替えは navigation.js） ---------- */
  // ロゴが読めないときは店舗名を出す
  const logo = $('[data-store-logo]');
  logo?.addEventListener('error', () => { logo.hidden = true; $('[data-store-name]').hidden = false; }, { once: true });

  // ログイン・カートのアイコンの動き（top-codex-1/prototype.js と同じ）
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  $$('.header-action').forEach((link) => {
    let returning = false;
    function syncMotion() {
      if (returning) return;
      const active = link.matches(':hover, :focus-visible') && !reducedMotion.matches;
      if (active === link.hasAttribute('data-animating')) return;
      if (active) { link.setAttribute('data-animating', ''); return; }
      // 離れた瞬間の輪郭や位置から、SVG 本来の姿勢まで補間する
      const poses = link.getAnimations({ subtree: true }).filter((a) => a instanceof CSSAnimation).map((a) => {
        const part = a.effect.target;
        const style = getComputedStyle(part);
        const frame = part.matches('.header-wave-arm') ? { d: style.d } : { transform: style.transform, opacity: style.opacity };
        return { part, frame };
      });
      link.removeAttribute('data-animating');
      if (!poses.length || reducedMotion.matches) return;
      returning = true;
      const finishes = poses.map(({ part, frame }) => {
        const style = getComputedStyle(part);
        const rest = Object.fromEntries(Object.keys(frame).map((k) => [k, style[k]]));
        return part.animate([frame, rest], { duration: 360, easing: 'ease-out' }).finished;
      });
      Promise.allSettled(finishes).then(() => { returning = false; syncMotion(); });
    }
    for (const ev of ['pointerenter', 'pointerleave', 'focus', 'blur']) link.addEventListener(ev, syncMotion);
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches && returning) link.getAnimations({ subtree: true }).forEach((a) => a.cancel());
      syncMotion();
    });
  });

  // 試作用：ログイン・カートの状態切り替え（トップと同じ。ツールバーに入れる）
  const control = $('[data-account-preview-control]');
  if (control) {
    const accountState = $('[data-account-state]', control);
    const cartState = $('[data-cart-state]', control);
    const accountLink = $('[data-account-link]');
    const cartLink = $('[data-cart-link]');
    const loginPage = accountLink.getAttribute('href');
    const renderAccount = () => {
      const signedIn = accountState.value === 'signed-in';
      accountLink.classList.toggle('account-signed-in', signedIn);
      accountLink.setAttribute('href', signedIn ? '../../demo-scope.html' : loginPage);
      accountLink.title = signedIn ? 'マイページ（ログイン中）' : 'ログイン';
      accountLink.setAttribute('aria-label', accountLink.title);
    };
    const renderCart = () => {
      const hasItems = cartState.value === 'filled';
      cartLink.classList.toggle('has-items', hasItems);
      const count = hasItems ? 1 + Math.floor(Math.random() * 9) : 0;
      cartLink.querySelector('[data-cart-count]').textContent = count || '';
      cartLink.title = hasItems ? 'カート（商品' + count + '点）' : 'カート（商品なし）';
      cartLink.setAttribute('aria-label', cartLink.title);
    };
    accountState.value = new URLSearchParams(location.search).get('account') === 'signed-in' ? 'signed-in' : 'guest';
    accountState.addEventListener('change', renderAccount);
    cartState.addEventListener('change', renderCart);
    renderAccount(); renderCart();
  }
})();
