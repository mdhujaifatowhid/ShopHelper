// ═══════════════════════════════════════════════════════════
// TrendHive – Order Webhook
// Google Apps Script (paste this in script.google.com)
// ═══════════════════════════════════════════════════════════

// ── CONFIG ──────────────────────────────────────────────────
const SHEET_NAME        = "Orders";
const TELEGRAM_TOKEN    = "8695861301:AAHVnmIkjQ1Db8qG3gI4wpmMpkXKznKYxW0";   // botfather token
const TELEGRAM_CHAT_ID  = "6893691775";       // Chat ID
// ────────────────────────────────────────────────────────────

function doPost(e) {
  try {
    const data    = JSON.parse(e.postData.contents);
    const name    = data.name    || "N/A";
    const phone   = data.phone   || "N/A";
    const address = data.address || "N/A";
    const product = data.product || "N/A";
    const size    = data.size    || "N/A";
    const time    = new Date().toLocaleString("en-BD", {timeZone:"Asia/Dhaka"});

    // 1️⃣ Save to Google Sheet
    const ss  = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(["#", "Time", "Name", "Phone", "Address", "Product", "Size", "Status"]);
      sheet.getRange(1,1,1,8).setFontWeight("bold").setBackground("#f472b6").setFontColor("#fff");
    }
    const orderNo = sheet.getLastRow();
    sheet.appendRow([orderNo, time, name, phone, address, product, size, "New ✅"]);

    // 2️⃣ Send Telegram notification
    const msg =
      "🛍️ New Order! #" + orderNo + "\n" +
      "👤 Name: " + name + "\n" +
      "📞 Phone: " + phone + "\n" +
      "📍 Address: " + address + "\n" +
      "👗 Product: " + product + "\n" +
      "📐 Size: " + size + "\n" +
      "🕐 Time: " + time;

    const telegramUrl = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage";
    UrlFetchApp.fetch(telegramUrl, {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: msg
      })
    });

    return ContentService
      .createTextOutput(JSON.stringify({status: "ok", order: orderNo}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
