/*
 * 試作確認用ツールバー（本番には含めない）
 * - 店舗テーマ色の切り替え：:root の --brand を差し替えるだけで全体の色が変わることを確認する
 * - 比較ページ・旧サイトへのリンク
 * 選んだ色は localStorage に保存（失敗しても動作に影響しない）
 */
(function () {
  const PRESETS = [
    { name: '既定', value: null },
    { name: '京紫', value: '#6b3f8f' },
    { name: '藍', value: '#1f4e79' },
    { name: '朱', value: '#c2410c' },
    { name: '若竹', value: '#2f7d5b' },
    { name: '旧サイト茶', value: '#7a5230' },
  ];
  const KEY = 'proto-brand';
  const root = document.documentElement;
  const initial = getComputedStyle(root).getPropertyValue('--brand').trim();

  function apply(v) {
    if (v) root.style.setProperty('--brand', v);
    else root.style.removeProperty('--brand');
    try { v ? localStorage.setItem(KEY, v) : localStorage.removeItem(KEY); } catch (e) {}
    document.querySelectorAll('[data-proto-swatch]').forEach((b) => {
      b.setAttribute('aria-pressed', String((b.dataset.protoSwatch || null) === (v || null)));
    });
  }

  function enableDragging(bar) {
    bar.style.left = 'auto';
    bar.style.right = 'max(12px, env(safe-area-inset-right))';
    bar.style.bottom = 'max(12px, env(safe-area-inset-bottom))';
    const handle = document.createElement('button');
    handle.type = 'button';
    handle.dataset.dragHandle = '';
    handle.textContent = '⠿';
    handle.title = 'テーマ設定バーを移動（ドラッグ・矢印キー）';
    handle.setAttribute('aria-label', handle.title);
    bar.prepend(handle);
    let drag = null;

    function move(x, y) {
      bar.style.right = bar.style.bottom = 'auto';
      bar.style.left = Math.max(0, Math.min(x, document.documentElement.clientWidth - bar.offsetWidth)) + 'px';
      bar.style.top = Math.max(0, Math.min(y, window.innerHeight - bar.offsetHeight)) + 'px';
    }
    handle.addEventListener('pointerdown', (event) => {
      if (!event.isPrimary || event.button !== 0) return;
      const rect = bar.getBoundingClientRect();
      drag = { id: event.pointerId, x: event.clientX - rect.left, y: event.clientY - rect.top };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', stopDrag);
      window.addEventListener('pointercancel', stopDrag);
      window.addEventListener('blur', stopDrag);
      handle.setPointerCapture(event.pointerId);
    });
    function onMove(event) {
      if (drag?.id === event.pointerId) move(event.clientX - drag.x, event.clientY - drag.y);
    }
    function stopDrag(event) {
      if (event.pointerId !== undefined && drag?.id !== event.pointerId) return;
      drag = null;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
      window.removeEventListener('blur', stopDrag);
    }
    handle.addEventListener('keydown', (event) => {
      const delta = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }[event.key];
      if (!delta) return;
      event.preventDefault();
      const rect = bar.getBoundingClientRect();
      move(rect.left + delta[0], rect.top + delta[1]);
    });
    const fit = () => {
      if (bar.style.top) {
        const rect = bar.getBoundingClientRect();
        move(rect.left, rect.top);
      }
    };
    new ResizeObserver(fit).observe(bar);
    window.addEventListener('resize', fit);
  }

  function mount() {
    const bar = document.createElement('div');
    bar.setAttribute('data-proto-toolbar', '');
    // <body data-proto-toolbar="top"> のページは画面下の固定 UI と重ならないよう上に置く
    const pos = document.body.dataset.protoToolbar === 'top' ? 'top:72px;right:12px' : 'left:12px;bottom:12px';
    bar.style.cssText =
      'position:fixed;' + pos + ';z-index:9999;display:flex;align-items:center;gap:6px;padding:6px 8px;' +
      'background:rgba(17,17,17,.82);backdrop-filter:blur(8px);border-radius:999px;font:12px/1 system-ui,sans-serif;color:#fff;' +
      'box-shadow:0 4px 16px rgba(0,0,0,.2)';
    const swatches = PRESETS.map((p) => {
      const c = p.value || initial;
      return `<button type="button" data-proto-swatch="${p.value || ''}" title="${p.name}" aria-label="テーマ色: ${p.name}"
        style="width:20px;height:20px;border-radius:999px;border:2px solid rgba(255,255,255,.7);background:${c};cursor:pointer"></button>`;
    }).join('');
    const draggable = document.body.hasAttribute('data-draggable-toolbar');
    const palette = `<span style="opacity:.85">テーマ色</span>${swatches}`;
    bar.innerHTML = draggable ? palette :
      `<a href="../index.html" style="color:#fff;text-decoration:none;padding:0 6px">← 比較</a>` +
      palette + `<button type="button" data-proto-hide style="background:none;border:0;color:#fff;opacity:.6;cursor:pointer;padding:0 4px" aria-label="ツールバーを隠す">×</button>`;
    document.body.appendChild(bar);
    if (draggable) enableDragging(bar);
    const control = document.querySelector('[data-account-preview-control]');
    if (control && document.getElementById('preview-settings')) {
      const toggle = document.querySelector('.preview-toggle');
      const panel = document.getElementById('preview-settings');
      panel.querySelector('.preview-palette').append(...bar.querySelectorAll(':scope > span, [data-proto-swatch]'));
      panel.append(control);
      bar.append(toggle, panel);
      toggle.addEventListener('click', () => {
        toggle.setAttribute('aria-expanded', String(toggle.getAttribute('aria-expanded') !== 'true'));
      });
      toggle.hidden = panel.hidden = false;
      control.hidden = false;
    }
    bar.addEventListener('click', (e) => {
      const s = e.target.closest('[data-proto-swatch]');
      if (s) apply(s.dataset.protoSwatch || null);
      if (e.target.closest('[data-proto-hide]')) bar.remove();
    });
    let saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(saved);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
