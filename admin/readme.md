# 🏫 Mulik Motor Driving School — Admin Panel Setup Guide

## What You Have Built

Your website now has two layers:

```
mulik-driving-school/
│
├── index.html              ← Public website (visitors see this)
├── css/style.css
├── js/script.js
│
└── admin/
    ├── index.html          ← Admin login page
    ├── dashboard.html      ← Owner dashboard (6 modules)
    ├── admin.css           ← Admin styles
    ├── admin-auth.js       ← Login/session logic
    ├── admin-dashboard.js  ← All dashboard logic + Google Sheets
    └── Code.gs             ← Google Apps Script (paste into Google)
```

---

## 🚀 STEP-BY-STEP SETUP (Do This Once)

### STEP 1 — Create Your Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: **Mulik Motor Driving School Data**
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/  THIS_PART_IS_YOUR_ID  /edit
   ```
5. Keep this tab open — you'll need it soon

---

### STEP 2 — Set Up Google Apps Script

1. In your Google Sheet, click **Extensions → Apps Script**
2. A new tab will open with a code editor
3. **Delete all existing code** in the editor
4. Open the file `admin/Code.gs` from your project
5. **Copy all the code** from `Code.gs` and paste it into the Apps Script editor
6. Click 💾 **Save** (Ctrl+S)
7. Now click **Run → setupAllSheets** (this creates all 6 sheet tabs automatically)
8. It will ask for permission — click **Review Permissions → Allow**
9. You should see: *"✅ All 6 sheets created successfully!"*

---

### STEP 3 — Deploy as Web App

1. Still in Apps Script, click **Deploy → New Deployment**
2. Click the ⚙️ gear next to "Type" → Select **Web App**
3. Fill in:
   - **Description:** Mulik Motor Admin API
   - **Execute as:** Me (your Google account)
   - **Who has access:** Anyone
4. Click **Deploy**
5. It will ask for permission again — click **Allow**
6. **COPY the Web App URL** — it looks like:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXXXX/exec
   ```

---

### STEP 4 — Connect to Your Admin Panel

1. Open `admin/admin-dashboard.js` in VS Code
2. Find this section near the top:
   ```javascript
   const CONFIG = {
     SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',
     SHEET_ID:   'YOUR_GOOGLE_SHEET_ID_HERE',
   };
   ```
3. Replace:
   - `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE` → paste your Web App URL
   - `YOUR_GOOGLE_SHEET_ID_HERE` → paste your Sheet ID from Step 1
4. Save the file

---

### STEP 5 — Change Your Login Password

1. Open `admin/admin-auth.js`
2. Find this section:
   ```javascript
   const ADMIN_CREDENTIALS = {
     username: 'mulikadmin',
     password: 'mulik@motor2024'
   };
   ```
3. Change the username and password to something **only you know**
4. Write it down somewhere safe — there is no "forgot password" option

---

### STEP 6 — Deploy to GitHub Pages

1. Upload ALL files (including the `admin/` folder) to your GitHub repo
2. Your admin panel will be at:
   ```
   https://yourusername.github.io/mulik-driving-school/admin/
   ```
3. ✅ This URL is not linked from the public website — it's private

---

## 🖥️ HOW TO USE THE DASHBOARD

### Accessing the Dashboard
- On your phone/laptop, go to: `yoursite.com/admin/`
- Enter your username and password
- You're logged in for **8 hours** — no need to log in again

### The 6 Modules

| Module | What You Log |
|--------|-------------|
| 🎓 Students | New enrollments, course details, fees |
| 📅 Attendance | Daily attendance for each student |
| 💰 Payments | Every payment received, mode, amount |
| 📞 Enquiries | Calls/WhatsApp leads, follow-up status |
| 🚗 Fleet | Car usage, fuel, issues, odometer |
| 👨‍🏫 Instructors | Daily activity log per trainer |

### Daily Routine (5 minutes every evening)

1. **Morning:** Log any new enquiries you received
2. **After Sessions:** Mark attendance for each student
3. **When Fee is Paid:** Record payment immediately
4. **End of Day:** Fill car log, instructor activity

---

## 📊 Viewing Your Data in Google Sheets

Every entry from your admin panel goes directly into your Google Sheet. You can:
- Open it on your phone via the Google Sheets app
- Filter and sort any column
- Download as Excel or CSV for any month
- Share read-only access with your accountant

Click **"Open in Google Sheets"** from any table in the dashboard to jump directly to that sheet tab.

---

## 🔒 Security Notes

- The admin panel URL is not linked from the public website
- Do not share your `admin/` URL publicly
- Change default credentials immediately (Step 5)
- Sessions expire after 8 hours automatically
- Your data lives in **your own Google account** — not any third-party server

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| "Demo Mode" banner showing | You haven't added the Script URL to CONFIG yet |
| Data not saving | Check that your Apps Script is deployed and URL is correct |
| Login not working | Check username/password in `admin-auth.js` |
| Old data showing after changes | Refresh the page (cache clears every 60 seconds) |
| Apps Script permission error | Re-deploy and click Allow for all permissions |

---

## 📞 Need Help?

If something isn't working, check:
1. Your `SCRIPT_URL` in `admin-dashboard.js` — is it the full URL ending in `/exec`?
2. Your Apps Script deployment — is access set to "Anyone"?
3. The sheet names — they must be exactly: Students, Attendance, Payments, Enquiries, Fleet, Instructors