// プレビュー内では通常のページを描画し、メディアクエリを指定幅で評価する。
if (window === window.top) {
  const preview = new URL('../shared/device-preview.html', location.href);
  preview.search = location.search;
  preview.hash = location.hash;
  preview.searchParams.set('page', location.pathname.includes('/municipality-claude/') ? 'municipality' :
    location.pathname.endsWith('/account-preview.html') ? 'account' : 'gifts');
  location.replace(preview);
}
