/**
 * Cara pakai:
 * 1. Buat Google Sheet baru, kasih nama sheet "Leads" pada tab pertama
 *    dengan header di baris 1: Timestamp | Halaman | Pesan
 * 2. Buka Extensions > Apps Script, hapus isi default, paste kode ini.
 * 3. Klik Deploy > New deployment > pilih tipe "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy URL Web App yang dihasilkan, isi ke .env.local project Next.js:
 *    GOOGLE_SHEET_WEBHOOK_URL=<url web app>
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Leads');
  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.page || '',
    data.message || '',
  ]);

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
