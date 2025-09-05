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
