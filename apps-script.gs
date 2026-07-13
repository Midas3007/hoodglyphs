/**
 * HoodGlyphs — waitlist collector
 * Paste this into Extensions → Apps Script on your Google Sheet.
 * Full instructions are in SETUP.md
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);                       // stop two people writing the same row

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // write the header row once
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp', 'x_handle', 'comment_link', 'wallet', 'user_agent']);
      sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    var p = e.parameter || {};

    // ignore anything without a real-looking wallet
    if (!/^0x[a-fA-F0-9]{40}$/.test(p.wallet || '')) {
      return json({ ok: false, error: 'bad wallet' });
    }

    // skip duplicates — same wallet only counts once
    var existing = sheet.getLastRow() > 1
      ? sheet.getRange(2, 4, sheet.getLastRow() - 1, 1).getValues().flat()
      : [];
    var wallet = String(p.wallet).toLowerCase();
    if (existing.some(function (w) { return String(w).toLowerCase() === wallet; })) {
      return json({ ok: true, duplicate: true });
    }

    sheet.appendRow([
      p.timestamp || new Date().toISOString(),
      p.handle || '',
      p.commentLink || '',
      p.wallet || '',
      p.userAgent || ''
    ]);

    return json({ ok: true });

  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, msg: 'hoodglyphs waitlist endpoint is live' });
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
