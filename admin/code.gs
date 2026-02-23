// ================================================================
// MULIK MOTOR DRIVING SCHOOL — GOOGLE APPS SCRIPT BACKEND
// Fixed version — CORS-safe for GitHub Pages
// ================================================================
// IMPORTANT: After pasting this code, make a BRAND NEW Deployment
// Do NOT click "Manage deployments" → instead click
// Deploy → New Deployment → Web App → Anyone → Deploy
// Copy the NEW URL and paste in admin-dashboard.js CONFIG
// ================================================================

const SHEET_NAMES = {
  students:    'Students',
  attendance:  'Attendance',
  payments:    'Payments',
  enquiries:   'Enquiries',
  fleet:       'Fleet',
  instructors: 'Instructors',
};

const HEADERS = {
  Students:    ['Name', 'Phone', 'Course', 'Instructor', 'Start Date', 'Total Fee (Rs)', 'Fee Paid (Rs)', 'Address', 'Notes', 'Added On'],
  Attendance:  ['Date', 'Student Name', 'Instructor', 'Status', 'Training Day', 'Car Used', 'Notes', 'Logged On'],
  Payments:    ['Date', 'Student Name', 'Amount (Rs)', 'Payment Mode', 'Payment Type', 'Receipt No.', 'Notes', 'Logged On'],
  Enquiries:   ['Date', 'Name', 'Phone', 'Source', 'Course Interest', 'Status', 'Notes', 'Logged On'],
  Fleet:       ['Date', 'Car', 'Instructor', 'Hours', 'Fuel (L)', 'Fuel Cost (Rs)', 'Issue Status', 'Odometer (km)', 'Notes', 'Logged On'],
  Instructors: ['Date', 'Instructor', 'Students Handled', 'Hours Worked', 'Session Summary', 'Logged On'],
};

// ALL requests handled as GET — this completely avoids CORS issues
function doGet(e) {
  try {
    const action    = e.parameter.action;
    const sheetName = e.parameter.sheet;

    // READ data from a sheet
    if (action === 'read' && sheetName) {
      const ss    = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = getOrCreateSheet(ss, sheetName);
      const data  = sheet.getDataRange().getValues();
      const rows  = data.length > 1 ? data.slice(1) : [];
      return buildResponse({ success: true, data: rows });
    }

    // WRITE data — row sent as JSON string in URL param
    if (action === 'append' && sheetName && e.parameter.data) {
      const rowData   = JSON.parse(decodeURIComponent(e.parameter.data));
      const ss        = SpreadsheetApp.getActiveSpreadsheet();
      const sheet     = getOrCreateSheet(ss, sheetName);
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      sheet.appendRow([...rowData, timestamp]);
      return buildResponse({ success: true, message: 'Saved to ' + sheetName });
    }

    return buildResponse({ success: false, error: 'Invalid action' });

  } catch (err) {
    return buildResponse({ success: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    const body    = JSON.parse(e.postData.contents);
    const sheet   = getOrCreateSheet(SpreadsheetApp.getActiveSpreadsheet(), body.sheet);
    const ts      = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    sheet.appendRow([...body.data, ts]);
    return buildResponse({ success: true });
  } catch (err) {
    return buildResponse({ success: false, error: err.toString() });
  }
}

function buildResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getOrCreateSheet(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    const headers = HEADERS[name];
    if (headers) {
      const r = sheet.getRange(1, 1, 1, headers.length);
      r.setValues([headers]);
      r.setBackground('#1a1a2e');
      r.setFontColor('#ffffff');
      r.setFontWeight('bold');
      r.setFontSize(11);
      sheet.setFrozenRows(1);
      headers.forEach((_, i) => sheet.autoResizeColumn(i + 1));
    }
  }
  return sheet;
}

function setupAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.values(SHEET_NAMES).forEach(name => getOrCreateSheet(ss, name));
  const d = ss.getSheetByName('Sheet1');
  if (d) {
    d.setName('_Dashboard_Notes');
    d.getRange('A1').setValue('Mulik Motor Driving School - Admin Data').setFontWeight('bold').setFontSize(14);
    d.getRange('A2').setValue('DO NOT DELETE any tabs below. They are connected to your website.');
  }
  SpreadsheetApp.getUi().alert('All 6 sheets created successfully!');
}
