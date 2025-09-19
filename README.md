# MinamiGo

**美波町の飲食店・観光スポット検索アプリ（PWA対応）**  
AIを活用して生成したコードを、一般社団法人 美波御塩が公開しています。

- 🗺️ 現在地から周辺スポットを検索  
- 📃 地図表示／リスト表示を切り替え  
- 📲 スマホのホーム画面に追加してアプリ風に利用（PWA対応）  
- 🌐 公開アプリ: https://minamigoen.github.io/MinamiGo/

---

## 📝 このプロジェクトについて
旅行やドライブで美波町を訪れた方が「今から、どこでご飯を食べよう？」と迷ったときに役立つ軽量Webアプリです。  
町が公開している**オープンデータ**をもとに、AIで整形・表示しています。  

> どなたでも自由に利用・シェア可能です。  
> ただし **動作の保証はありません**。自己責任でご利用ください。

---

## 📂 リポジトリ構成
```
.
├─ index.html # メイン画面
├─ manifest.json # PWA 設定
├─ sw.js # Service Worker
├─ icon-192.png # アプリアイコン
├─ icon-512.png # アプリアイコン
├─ webApp.gs # GAS バックエンド例
├─ config.gs # GAS 設定ファイル例
└─ README.md
```

---

## 🚀 使い方（利用者向け）

1. 公開版（[MinamiGo 公開版](https://minamigoen.github.io/MinamiGo/)）を開く
2. **「現在地を表示」** で周辺のお店を確認  
3. **「リスト表示に切替」** で一覧表示に変更  
4. よく使う場合は **ホーム画面に追加** すると便利（PWA対応）

---

## ⚙️ Google Apps Script（GAS）での拡張

このプロジェクトには `webApp.gs` と `config.gs` が含まれています。  
Google Apps Script にコピーして **ウェブアプリとしてデプロイ**してください。  

### webApp.gs
```javascript
function doGet() {
  // 定数ファイルから取得
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) {
    return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
  }

const range = sheet.getRange(2, 1, lastRow - 1, 12); // 12列
const values = range.getValues();

const data = values
  .filter(row => row[1]) // 名称（B列）が空でない行のみ
  .map(row => ({
    no:      row[0],   // NO
    name:    row[1],   // 名称
    address: row[2],   // 住所
    lat:     row[3],   // 緯度
    lng:     row[4],   // 経度
    tel:     row[5],   // 電話
    comment: row[6],   // 備考・コメント
    hours:   row[7],   // 営業時間
    closed:  row[8],   // 休日
    url:     row[9],   // URL
    sns:     row[10],  // SNS
    image:   row[11],  // 画像
  }));



  const json = JSON.stringify(data);
  // キャッシュも適宜
  CacheService.getScriptCache().put('gallery', json, 600);

  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

```

### config.gs
```javascript
// 設定ファイル例
const CONFIG = {
  SHEET_ID: 'YOUR_SHEET_ID',
  ALLOW_ORIGIN: '*'
};
```

## 🔗 関連リンク
- プロジェクトの背景や詳細ストーリーは、こちらのnote記事をご覧ください  
  👉 https://note.com/_cop/n/n07e509067b73
- この仕組みはGoogleGemini公式noteで紹介していただきました。
  📒 https://note.com/google_gemini/n/nec0800699ec3
