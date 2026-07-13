# HoodGlyphs — setup

Three things to do. None of them need a developer.

---

## 1. Put the site online (5 minutes)

1. Go to **vercel.com** and sign up (free — use your GitHub or email).
2. Go to **vercel.com/new**.
3. Find the box that says **"Deploy from a folder"** / drag-and-drop area.
4. Drag this **whole folder** (the one containing `index.html` and `assets/`) into it.
5. Click **Deploy**.

You'll get a URL like `hoodglyphs.vercel.app`. Done — the site is live.

> On a phone: unzip the folder first, then use the Vercel app or the mobile site's upload button.
> If drag-and-drop isn't available on mobile, use **netlify.com/drop** instead — it's a single
> drop zone that works in a phone browser and gives you a live URL instantly.

The site works right away. The form will just log entries to the browser console until you do step 2.

---

## 2. Wire up the waitlist form → Google Sheet (10 minutes)

**a. Make the sheet**
1. Go to **sheets.google.com** → **Blank spreadsheet**.
2. Name it `HoodGlyphs Waitlist`.

**b. Add the script**
1. In that sheet: menu **Extensions** → **Apps Script**.
2. Delete whatever code is in the editor.
3. Open `apps-script.gs` from this folder, copy **all** of it, paste it in.
4. Click the **save** icon (💾).

**c. Deploy it**
1. Top right: **Deploy** → **New deployment**.
2. Click the **gear icon** next to "Select type" → choose **Web app**.
3. Fill in:
   - **Description:** `waitlist`
   - **Execute as:** **Me**
   - **Who has access:** **Anyone** ← this one matters. Not "Anyone with Google account". **Anyone.**
4. Click **Deploy**.
5. Google will ask you to authorize. Click through: **Authorize access** → pick your account →
   it may warn "Google hasn't verified this app" → click **Advanced** → **Go to (your project)** → **Allow**.
   (This warning is normal. It's your own script.)
6. Copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfy..................../exec`

**d. Paste it into the site**
1. Open `index.html` in any text editor.
2. Near the top of the `<script>` block, find:
   ```js
   const SHEET_ENDPOINT = "";
   ```
3. Paste your URL between the quotes:
   ```js
   const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfy..../exec";
   ```
4. Save, and re-deploy the site (drag the folder onto Vercel again).

**Test it:** open your site, fill in the form with your own wallet, submit. A row should appear
in the sheet within a couple of seconds.

> ⚠️ If you ever edit `apps-script.gs`, you must **Deploy → Manage deployments → edit (pencil) →
> Version: New version → Deploy** again. Saving alone does not update the live endpoint.

---

## 3. Turn the mint on (when you're ready)

Open `index.html`, find this block near the top of the `<script>`:

```js
const MINT = {
  price:      "TBD",              // e.g. "0.0001 ETH"
  supply:     "5,555",
  date:       "TBD",              // e.g. "AUG 2 · 18:00 UTC"
  maxPer:     "5 per wallet",
  chain:      "Robinhood Chain",
  openseaUrl: ""                  // paste the OpenSea mint URL here
};
```

- Fill in `price` and `date` — they'll stop showing as grey "TBD".
- The moment you put a URL in `openseaUrl`, the big grey **[ MINT NOT OPEN YET ]** button
  automatically turns lime, reads **[ MINT ON OPENSEA → ]**, and links out. The footer's
  `[ opensea ]` link switches on too. You don't have to change anything else.

Re-deploy after editing.

---

## Getting the entries out

In the sheet: **File → Download → Comma-separated values (.csv)**.

Columns: `timestamp · x_handle · comment_link · wallet · user_agent`

Before sending free glyphs, spot-check the `comment_link` column — that's the whole point of
collecting it. The script already drops duplicate wallets and rejects malformed addresses,
and the site has a honeypot field plus a 3-second timing trap, so most bots never make it in.
Humans still need to be checked by a human.

---

## Files

```
index.html        the entire site (all HTML, CSS, JS in one file)
apps-script.gs    the Google Sheets backend — paste into Apps Script
assets/           images, the animated glyph, trait tiles, the .txt
SETUP.md          this file
```
