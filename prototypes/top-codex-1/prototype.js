(function () {
  const { facility, store, products, poweredBy } = window.PROTO_DATA;
  const query = (selector) => document.querySelector(selector);

  function showImage(image, source, onLoad) {
    if (!source) return;
    image.addEventListener('load', () => {
      image.hidden = false;
      image.classList.remove('invisible');
      onLoad?.();
    }, { once: true });
    // 遅延画像が読み込み対象になるよう、取得前からレイアウトに置く。
    if (image.loading === 'lazy') image.hidden = false;
    image.src = source;
  }

  function fillIcons(root) {
    root.querySelectorAll('[data-icon]').forEach((slot) => {
      slot.innerHTML = window.icon(slot.dataset.icon, slot.dataset.iconSize || 'size-4');
    });
  }

  const normalize = (value) => value.normalize('NFKC').replace(/\s+/g, '').toLowerCase();

  document.title = `${facility.name}｜${store.name}`;
  const logo = query('[data-store-logo]');
  const storeName = query('[data-store-name]');
  logo.alt = storeName.textContent = store.name;
  showImage(logo, store.logo, () => { storeName.hidden = true; });
  query('[data-powered-by]').textContent = poweredBy;
  fillIcons(document);

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.header-action').forEach((link) => {
    let returning = false;

    function syncMotion() {
      if (returning) return;
      const active = link.matches(':hover, :focus-visible') && !reducedMotion.matches;
      if (active === link.hasAttribute('data-animating')) return;
      if (active) {
        link.setAttribute('data-animating', '');
        return;
      }

      // 離れた瞬間の輪郭や位置から、SVG 本来の姿勢まで補間する。
      const poses = link.getAnimations({ subtree: true }).filter((animation) => animation instanceof CSSAnimation).map((animation) => {
        const part = animation.effect.target;
        const style = getComputedStyle(part);
        const frame = part.matches('.header-wave-arm') ? { d: style.d }
          : { transform: style.transform, opacity: style.opacity };
        return { part, frame };
      });
      link.removeAttribute('data-animating');
      if (!poses.length || reducedMotion.matches) return;

      returning = true;
      const finishes = poses.map(({ part, frame }) => {
        const style = getComputedStyle(part);
        const rest = Object.fromEntries(Object.keys(frame).map((key) => [key, style[key]]));
        return part.animate([frame, rest], { duration: 360, easing: 'ease-out' }).finished;
      });
      Promise.allSettled(finishes).then(() => {
        returning = false;
        syncMotion();
      });
    }

    for (const event of ['pointerenter', 'pointerleave', 'focus', 'blur']) {
      link.addEventListener(event, syncMotion);
    }
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches && returning) {
        link.getAnimations({ subtree: true }).forEach((animation) => animation.cancel());
      }
      syncMotion();
    });
  });

  const list = query('[data-product-list]');
  const template = query('#product-card');
  [...products].sort((a, b) => a.amount - b.amount).forEach((product) => {
    const row = template.content.firstElementChild.cloneNode(true);
    row.dataset.searchText = normalize(product.name);
    row.dataset.budget = product.amount <= 30000 ? 'low' : product.amount <= 100000 ? 'middle' : 'high';
    row.querySelector('[data-product-link]').href = window.legacyDetail(product.id);
    row.querySelector('[data-product-name]').textContent = product.name;
    row.querySelector('[data-amount]').textContent = window.yen(product.amount);
    if (Number.isFinite(product.voucher)) {
      row.querySelector('[data-voucher-value]').textContent = window.yen(product.voucher);
      row.querySelector('[data-voucher]').hidden = false;
    }
    showImage(row.querySelector('[data-product-image]'), product.image);
    fillIcons(row);
    list.append(row);
  });

  const filters = query('[data-filters]');
  const search = query('[data-search]');
  const budget = query('[data-budget]');
  const count = query('[data-product-count]');
  const empty = query('[data-empty]');
  const rows = [...list.querySelectorAll('[data-product]')];

  function applyFilters() {
    const term = normalize(search.value);
    let visible = 0;
    rows.forEach((row) => {
      row.hidden = !row.dataset.searchText.includes(term)
        || (budget.value !== 'all' && row.dataset.budget !== budget.value);
      if (!row.hidden) visible += 1;
    });
    count.textContent = `${visible}件`;
    list.hidden = visible === 0;
    empty.hidden = visible !== 0;
    empty.textContent = rows.length ? '条件に合う返礼品がありません。' : '掲載中の返礼品はありません。';
  }

  filters.hidden = rows.length < 9;
  filters.addEventListener('submit', (event) => event.preventDefault());
  search.addEventListener('input', applyFilters);
  budget.addEventListener('change', applyFilters);
  applyFilters();
})();
