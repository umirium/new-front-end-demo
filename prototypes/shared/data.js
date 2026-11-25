/*
 * 試作用データ：府ホテル京都百条（vm 4700473 / st 1）
 * legacy/kyoto-hachijo/ の実データから転記。本番では PHP（CodeIgniter の view）が出力する想定。
 */
window.PROTO_DATA = {
  store: {
    name: '京都府京都市ふるさと納税',
    municipality: '京都府京都市',
    logo: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/basis2/47/rm23jh_go.png',
  },
  facility: {
    vmId: 4700473,
    stId: 1,
    name: '府ホテル京都百条',
    lead: '府ホテル京都百条の宿泊やレストランでご利用いただける利用券です。',
    description:
      '京都駅から徒歩2分、抜群のアクセス、気心知れたスタッフの笑顔、おひとりおひとりの気持ちに寄り添うおもてなし、十人十色の寛ぎをお約束する多彩な客室。そして、四季折々の京都らしさあふれる味覚を楽しめるレストランの数々。',
    pickupNote: 'この返礼品は当日受け取りです。発送はされず、提供者の施設での引き換えとなります。',
  },
  products: [
    { id: 4701954, name: '府ホテル京都百条 館内利用券 3枚', voucher: 3000, amount: 10000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1954/1_gfu4p3uzhm_5qg2a.jpeg' },
    { id: 4701955, name: '府ホテル京都百条 館内利用券 9枚', voucher: 9000, amount: 30000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1955/1_gfu4pkz3s3_1r8j.jpeg' },
    { id: 4701956, name: '府ホテル京都百条 館内利用券 15枚', voucher: 15000, amount: 50000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1956/1_gfu4pwpxuj_1rww4.jpeg' },
    { id: 4701957, name: '府ホテル京都百条 館内利用券 30枚', voucher: 30000, amount: 100000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1957/1_gfu4qaxwr3_3ca7p.jpeg' },
    { id: 4701958, name: '府ホテル京都百条 館内利用券 90枚', voucher: 90000, amount: 300000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1958/1_gfu4qnc2xe_1bt2.jpeg' },
    { id: 4701959, name: '府ホテル京都百条 館内利用券 150枚', voucher: 150000, amount: 500000, image: 'https://furusato-tax.s3.ap-northeast-1.amazonaws.com/production_kyoto/products/1959/1_gfu4r61i8g_5932f.jpeg' },
  ],
  // 旧サイトのサイドメニュー構成（ゲスト時）
  menu: [
    { title: 'ゲスト様', items: ['新規サイト利用者登録', 'ログイン'] },
    { title: 'ふるさと納税とは？', items: ['ふるさと納税とは？', 'ワンストップ特例制度について', '寄附金の使い道', '寄附金控除額シミュレーション（外部サイト）'] },
    { title: 'ガイド・その他', items: ['京都府京都市ふるさと納税について', '個人情報取り扱いについて', '特定商取引法に基づく表記', 'お問合せ'] },
  ],
  poweredBy: 'このシステムはグローキーアップ株式会社が提供するUNIOSS©を使用しています。',
};

window.yen = (n) => n.toLocaleString('ja-JP');
// 旧サイトの商品詳細ページ（比較用リンク）
window.legacyDetail = (id) => `../../demo-scope.html`;
