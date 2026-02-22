/* ============================================
   MULIK MOTOR — ADMIN DASHBOARD JAVASCRIPT
   Google Sheets Integration via Apps Script
   ============================================ */

// ================================================================
// ⚙️  CONFIGURATION — FILL THESE IN AFTER SETUP (see README)
// ================================================================
const CONFIG = {
  // After you deploy your Google Apps Script, paste the Web App URL here:
  SCRIPT_URL: 'Yhttps://script.google.com/macros/s/AKfycbw2rChsLlylB0j97tLdWwW0AdQ9eK4QsKdMI7paD0mhQ3iFUBerJ2xVlEhiIOSTBmNq/execOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE',

  // Your Google Sheet ID (from the URL: docs.google.com/spreadsheets/d/THIS_PART/)
  SHEET_ID: '1Bx_GnBsd-_kjwVvJ4l0E_6KXW6Z2AOHNrpRIp_-kYx8',
};
// ================================================================

// Sheet names — must match exactly what's in your Google Sheet
const SHEETS = {
  students:    'Students',
  attendance:  'Attendance',
  payments:    'Payments',
  enquiries:   'Enquiries',
  fleet:       'Fleet',
  instructors: 'Instructors',
};

// In-memory cache to avoid repeated fetches
const cache = {};

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

function today() {
  return new Date().toISOString().split('T')[0];
}

function formatINR(num) {
  if (!num || isNaN(num)) return '₹0';
  return '₹' + Number(num).toLocaleString('en-IN');
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

function showGlobalAlert(msg, type = 'success') {
  const el = document.getElementById('globalAlert');
  if (!el) return;
  el.textContent = msg;
  el.className = `global-alert alert alert-${type}`;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function setFormStatus(id, msg, type) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = msg;
  el.className = `form-status ${type}`;
  if (type === 'success') setTimeout(() => { el.textContent = ''; }, 5000);
}

function statusBadge(status) {
  const map = {
    'Present':            'status-present',
    'Absent':             'status-absent',
    'Leave':              'status-leave',
    'New Lead':           'status-new',
    'Contacted':          'status-new',
    'Follow-up Required': 'status-issue',
    'Enrolled':           'status-enrolled',
    'Not Interested':     'status-absent',
    'No Issues':          'status-noissue',
    'Minor Issue':        'status-issue',
    'Needs Service':      'status-issue',
    'Sent for Repair':    'status-repair',
  };
  const cls = map[status] || '';
  return `<span class="status-badge ${cls}">${status || '—'}</span>`;
}

function addRecentActivity(icon, text) {
  const list = document.getElementById('recentActivity');
  if (!list) return;
  const empty = list.querySelector('.recent-empty');
  if (empty) empty.remove();

  const item = document.createElement('div');
  item.className = 'recent-item';
  item.innerHTML = `
    <span class="ri-icon">${icon}</span>
    <span class="ri-text">${text}</span>
    <span class="ri-time">${new Date().toLocaleTimeString('en-IN', {hour:'2-digit', minute:'2-digit'})}</span>
  `;
  list.insertBefore(item, list.firstChild);
  if (list.children.length > 8) list.lastChild.remove();
}

// ================================================================
// API — SEND DATA TO GOOGLE SHEETS
// ================================================================

async function sendToSheet(sheetName, data) {
  if (CONFIG.SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
    // DEMO MODE — not yet configured
    console.log('DEMO MODE: Would send to', sheetName, data);
    return { success: true, demo: true };
  }

  const payload = { sheet: sheetName, action: 'append', data };
  const response = await fetch(CONFIG.SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await response.json();
}

// ================================================================
// API — READ DATA FROM GOOGLE SHEETS
// ================================================================

async function readSheet(sheetName) {
  if (CONFIG.SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
    return getSampleData(sheetName);
  }

  if (cache[sheetName] && cache[sheetName].time > Date.now() - 60000) {
    return cache[sheetName].data;
  }

  const url = `${CONFIG.SCRIPT_URL}?sheet=${sheetName}&action=read`;
  const response = await fetch(url);
  const result = await response.json();
  const rows = result.data || [];
  cache[sheetName] = { data: rows, time: Date.now() };
  return rows;
}

// ================================================================
// SAMPLE DATA (shown before Google Sheets is configured)
// ================================================================

function getSampleData(sheetName) {
  const samples = {
    Students: [
      ['Priya Sharma',  '9876543210', 'Beginner Course (20 Days)', 'Ashish Sir',  '2024-01-10', '5000', '2500', 'Vishrantwadi', 'Very enthusiastic learner'],
      ['Rahul More',    '9123456789', 'License Assistance Only',   'Mulik Sir',   '2024-01-12', '2000', '2000', 'Alandi Road',  'License done, paid in full'],
      ['Sneha Kulkarni','9988776655', 'Refresher Lessons',         'Mangesh Sir', '2024-01-15', '3000', '1500', 'Vishrantwadi', 'Building highway confidence'],
    ],
    Attendance: [
      [today(), 'Priya Sharma',   'Ashish Sir',  'Present', '5',  'MH12XQ6546', 'Great session on parking'],
      [today(), 'Sneha Kulkarni', 'Mangesh Sir', 'Present', '3',  'MH12WK2574', 'Highway practice'],
      [today(), 'Rahul More',     'Mulik Sir',   'Absent',  '—',  '—',          'Informed in advance'],
    ],
    Payments: [
      [today(),      'Priya Sharma',   '2500', 'Cash',     'Partial Payment', 'RCP001', 'First installment'],
      ['2024-01-12', 'Rahul More',     '2000', 'UPI / GPay','Full Payment',   'RCP002', 'Paid in full via GPay'],
      ['2024-01-15', 'Sneha Kulkarni', '1500', 'Cash',     'Partial Payment', 'RCP003', 'Will pay balance next week'],
    ],
    Enquiries: [
      [today(),      'Anita Desai',  '9876501234', 'Google Maps',     'Beginner Course (20 Days)', 'New Lead',           'Called at 10am, interested in morning batches'],
      ['2024-01-14', 'Vikram Patil', '9812345678', 'Referral / Friend','License Assistance Only',  'Follow-up Required', 'Friend referred. Wants to know fees.'],
      ['2024-01-13', 'Meera Joshi',  '9900112233', 'Google Search',   'Refresher Lessons',         'Enrolled',           'Enrolled same day!'],
    ],
    Fleet: [
      [today(),      'MH12XQ6546', 'Ashish Sir',  '4',   '5',  '500', 'No Issues',   '45230', ''],
      [today(),      'MH12WK2574', 'Mangesh Sir', '3.5', '0',  '0',   'No Issues',   '32100', 'No fuel needed'],
      ['2024-01-14', 'MH12XQ6546', 'Mulik Sir',   '6',   '8',  '800', 'Minor Issue', '45180', 'Slight brake noise, check needed'],
    ],
    Instructors: [
      [today(),      'Mulik Sir',   '3', '5',   'Handled 3 beginner students. All completed Day 4 session.'],
      [today(),      'Ashish Sir',  '2', '4',   '2 students, refresher and beginner. Both sessions went well.'],
      [today(),      'Mangesh Sir', '4', '6',   '4 students including workshop session. Very productive day.'],
    ],
  };
  return samples[sheetName] || [];
}

// ================================================================
// POPULATE TABLES
// ================================================================

async function loadStudents() {
  const rows = await readSheet(SHEETS.students);
  const tbody = document.getElementById('studentsBody');
  if (!tbody) return;

  // Update stat
  document.getElementById('statTotalStudents').textContent = rows.length;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="9" class="table-empty">No students yet. Add your first student above.</td></tr>';
    return;
  }

  // Calculate pending
  let totalDue = 0;
  tbody.innerHTML = rows.map(r => {
    const total = Number(r[5]) || 0;
    const paid  = Number(r[6]) || 0;
    const due   = total - paid;
    totalDue += due;

    // Training day (days since start)
    let dayNum = '—';
    if (r[4]) {
      const diff = Math.floor((Date.now() - new Date(r[4])) / 86400000) + 1;
      dayNum = Math.min(diff, 20);
    }

    return `<tr>
      <td><strong>${r[0] || '—'}</strong></td>
      <td><a href="tel:${r[1]}">${r[1] || '—'}</a></td>
      <td>${r[2] || '—'}</td>
      <td>${r[3] || '—'}</td>
      <td>${formatDate(r[4])}</td>
      <td>${formatINR(r[5])}</td>
      <td style="color:#2e7d32;font-weight:700;">${formatINR(r[6])}</td>
      <td style="color:${due > 0 ? '#c62828' : '#2e7d32'};font-weight:700;">${formatINR(due)}</td>
      <td>Day ${dayNum}</td>
    </tr>`;
  }).join('');

  document.getElementById('statPendingPayments').textContent = formatINR(totalDue);
}

async function loadAttendance() {
  const rows = await readSheet(SHEETS.attendance);
  const tbody = document.getElementById('attendanceBody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No attendance records yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.reverse().map(r => `<tr>
    <td>${formatDate(r[0])}</td>
    <td><strong>${r[1] || '—'}</strong></td>
    <td>${r[2] || '—'}</td>
    <td>${statusBadge(r[3])}</td>
    <td>${r[4] ? 'Day ' + r[4] : '—'}</td>
    <td>${r[5] || '—'}</td>
    <td style="max-width:200px;">${r[6] || '—'}</td>
  </tr>`).join('');
}

async function loadPayments() {
  const rows = await readSheet(SHEETS.payments);
  const tbody = document.getElementById('paymentsBody');
  if (!tbody) return;

  let todayTotal = 0, monthTotal = 0;
  const now = new Date();
  const todayStr = today();

  rows.forEach(r => {
    const amt = Number(r[2]) || 0;
    const d = new Date(r[0]);
    if (r[0] === todayStr) todayTotal += amt;
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) monthTotal += amt;
  });

  document.getElementById('payStatToday') .textContent = formatINR(todayTotal);
  document.getElementById('payStatMonth') .textContent = formatINR(monthTotal);
  document.getElementById('statMonthRevenue').textContent = formatINR(monthTotal);

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No payments recorded yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.reverse().map(r => `<tr>
    <td>${formatDate(r[0])}</td>
    <td><strong>${r[1] || '—'}</strong></td>
    <td style="color:#2e7d32;font-weight:700;">${formatINR(r[2])}</td>
    <td>${r[3] || '—'}</td>
    <td>${r[4] || '—'}</td>
    <td>${r[5] || '—'}</td>
    <td>${r[6] || '—'}</td>
  </tr>`).join('');
}

async function loadEnquiries() {
  const rows = await readSheet(SHEETS.enquiries);
  const tbody = document.getElementById('enquiriesBody');
  if (!tbody) return;

  const open = rows.filter(r => r[5] === 'New Lead' || r[5] === 'Follow-up Required').length;
  document.getElementById('statOpenEnquiries').textContent = open;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="table-empty">No enquiries logged yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.reverse().map(r => `<tr>
    <td>${formatDate(r[0])}</td>
    <td><strong>${r[1] || '—'}</strong></td>
    <td><a href="tel:${r[2]}">${r[2] || '—'}</a></td>
    <td>${r[3] || '—'}</td>
    <td>${r[4] || '—'}</td>
    <td>${statusBadge(r[5])}</td>
    <td style="max-width:200px;">${r[6] || '—'}</td>
  </tr>`).join('');
}

async function loadFleet() {
  const rows = await readSheet(SHEETS.fleet);
  const tbody = document.getElementById('fleetBody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="8" class="table-empty">No fleet logs yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.reverse().map(r => `<tr>
    <td>${formatDate(r[0])}</td>
    <td><strong>${r[1] || '—'}</strong></td>
    <td>${r[2] || '—'}</td>
    <td>${r[3] ? r[3] + ' hrs' : '—'}</td>
    <td>${r[4] ? r[4] + ' L' : '—'}</td>
    <td>${r[5] ? formatINR(r[5]) : '—'}</td>
    <td>${statusBadge(r[6])}</td>
    <td>${r[7] ? r[7] + ' km' : '—'}</td>
  </tr>`).join('');
}

async function loadInstructors() {
  const rows = await readSheet(SHEETS.instructors);
  const tbody = document.getElementById('instructorsBody');
  if (!tbody) return;

  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="5" class="table-empty">No instructor logs yet.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.reverse().map(r => `<tr>
    <td>${formatDate(r[0])}</td>
    <td><strong>${r[1] || '—'}</strong></td>
    <td style="text-align:center;">${r[2] || '—'}</td>
    <td style="text-align:center;">${r[3] ? r[3] + ' hrs' : '—'}</td>
    <td style="max-width:280px;">${r[4] || '—'}</td>
  </tr>`).join('');
}

// ================================================================
// FORM SUBMISSIONS
// ================================================================

function setupForm(formId, sheetName, statusId, toggleBtnId, cancelBtnId, formCardId, dataExtractor, iconText, activityText) {
  const form     = document.getElementById(formId);
  const toggleBtn= document.getElementById(toggleBtnId);
  const cancelBtn= document.getElementById(cancelBtnId);
  const formCard = document.getElementById(formCardId);

  if (!form) return;

  // Set today's date on any date inputs
  form.querySelectorAll('input[type="date"]').forEach(el => {
    if (!el.value) el.value = today();
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      formCard.style.display = formCard.style.display === 'none' ? 'block' : 'none';
      form.querySelectorAll('input[type="date"]').forEach(el => {
        if (!el.value) el.value = today();
      });
    });
  }

  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      formCard.style.display = 'none';
      form.reset();
      setFormStatus(statusId, '', '');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFormStatus(statusId, '⏳ Saving to Google Sheets...', 'loading');

    const data = dataExtractor(form);

    try {
      const result = await sendToSheet(sheetName, data);
      if (result.success || result.demo) {
        const demoNote = result.demo ? ' (Demo Mode — connect Google Sheets to save for real)' : '';
        setFormStatus(statusId, `✅ Saved successfully!${demoNote}`, 'success');
        addRecentActivity(iconText, activityText(form));
        form.reset();
        form.querySelectorAll('input[type="date"]').forEach(el => { el.value = today(); });
        // Invalidate cache and reload table
        delete cache[sheetName];
        setTimeout(() => loadSectionData(sheetName), 500);
      } else {
        setFormStatus(statusId, '❌ Error saving. Please try again.', 'error');
      }
    } catch (err) {
      console.error(err);
      setFormStatus(statusId, '❌ Network error. Check your connection and Script URL.', 'error');
    }
  });
}

function loadSectionData(sheetName) {
  const map = {
    [SHEETS.students]:    loadStudents,
    [SHEETS.attendance]:  loadAttendance,
    [SHEETS.payments]:    loadPayments,
    [SHEETS.enquiries]:   loadEnquiries,
    [SHEETS.fleet]:       loadFleet,
    [SHEETS.instructors]: loadInstructors,
  };
  if (map[sheetName]) map[sheetName]();
}

// ================================================================
// NAVIGATION
// ================================================================

function switchSection(sectionId) {
  document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const section = document.getElementById('section-' + sectionId);
  if (section) section.classList.add('active');

  const navItem = document.querySelector(`.nav-item[data-section="${sectionId}"]`);
  if (navItem) navItem.classList.add('active');

  // Load data on first switch to that section
  const loaders = {
    overview:     () => { loadStudents(); loadPayments(); loadEnquiries(); },
    students:     loadStudents,
    attendance:   loadAttendance,
    payments:     loadPayments,
    enquiries:    loadEnquiries,
    fleet:        loadFleet,
    instructors:  loadInstructors,
  };
  if (loaders[sectionId]) loaders[sectionId]();

  // Close sidebar on mobile
  document.getElementById('sidebar')?.classList.remove('mobile-open');
}

// ================================================================
// SEARCH / FILTER HELPERS
// ================================================================

function setupSearch(inputId, tableBodyId, colIndexes) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    document.querySelectorAll(`#${tableBodyId} tr`).forEach(row => {
      const text = colIndexes.map(i => row.cells[i]?.textContent || '').join(' ').toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

function setupSelectFilter(selectId, tableBodyId, colIndex) {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.addEventListener('change', () => {
    const val = select.value.toLowerCase();
    document.querySelectorAll(`#${tableBodyId} tr`).forEach(row => {
      const text = (row.cells[colIndex]?.textContent || '').toLowerCase();
      row.style.display = (!val || text.includes(val)) ? '' : 'none';
    });
  });
}

// ================================================================
// INIT — RUNS ON DASHBOARD LOAD
// ================================================================

document.addEventListener('DOMContentLoaded', () => {

  // Set header date
  const dashDate = document.getElementById('dashDate');
  const todayDate = document.getElementById('todayDate');
  const dateStr = new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
  if (dashDate) dashDate.textContent = dateStr;
  if (todayDate) todayDate.textContent = dateStr;

  // Set Google Sheets links
  if (CONFIG.SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE') {
    const base = `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/edit#gid=`;
    document.getElementById('studentsSheetLink')    ?.setAttribute('href', base + '0');
    document.getElementById('attendanceSheetLink')  ?.setAttribute('href', base + '1');
    document.getElementById('paymentsSheetLink')    ?.setAttribute('href', base + '2');
    document.getElementById('enquiriesSheetLink')   ?.setAttribute('href', base + '3');
    document.getElementById('fleetSheetLink')       ?.setAttribute('href', base + '4');
    document.getElementById('instructorsSheetLink') ?.setAttribute('href', base + '5');
  }

  // Navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection(item.dataset.section);
    });
  });

  // Quick action buttons in overview
  document.querySelectorAll('.quick-btn').forEach(btn => {
    btn.addEventListener('click', () => switchSection(btn.dataset.goto));
  });

  // Sidebar toggle (mobile)
  document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
  });

  document.getElementById('sidebarClose')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('mobile-open');
  });

  // ----------------------------------------------------------------
  // SETUP FORMS
  // ----------------------------------------------------------------

  setupForm('studentForm', SHEETS.students, 'studentFormStatus',
    'openStudentForm', 'cancelStudentForm', 'studentFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('studentName'), fd.get('phone'), fd.get('course'),
              fd.get('instructor'), fd.get('startDate'), fd.get('totalFee'),
              fd.get('feePaid') || '0', fd.get('address'), fd.get('notes')];
    },
    '🎓', (form) => `New student: ${new FormData(form).get('studentName') || ''}`,
  );

  setupForm('attendanceForm', SHEETS.attendance, 'attendanceFormStatus',
    'openAttendanceForm', 'cancelAttendanceForm', 'attendanceFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('date'), fd.get('studentName'), fd.get('instructor'),
              fd.get('status'), fd.get('trainingDay'), fd.get('car'), fd.get('notes')];
    },
    '📅', (form) => `Attendance marked for ${new FormData(form).get('studentName') || ''}`,
  );

  setupForm('paymentForm', SHEETS.payments, 'paymentFormStatus',
    'openPaymentForm', 'cancelPaymentForm', 'paymentFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('date'), fd.get('studentName'), fd.get('amount'),
              fd.get('paymentMode'), fd.get('paymentType'), fd.get('receipt'), fd.get('notes')];
    },
    '💰', (form) => {
      const fd = new FormData(form);
      return `Payment ₹${fd.get('amount')} from ${fd.get('studentName') || ''}`;
    },
  );

  setupForm('enquiryForm', SHEETS.enquiries, 'enquiryFormStatus',
    'openEnquiryForm', 'cancelEnquiryForm', 'enquiryFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('date'), fd.get('name'), fd.get('phone'),
              fd.get('source'), fd.get('course'), fd.get('status'), fd.get('notes')];
    },
    '📞', (form) => `Enquiry from ${new FormData(form).get('name') || ''}`,
  );

  setupForm('fleetForm', SHEETS.fleet, 'fleetFormStatus',
    'openFleetForm', 'cancelFleetForm', 'fleetFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('date'), fd.get('car'), fd.get('instructor'),
              fd.get('hours'), fd.get('fuel'), fd.get('fuelCost'),
              fd.get('issue'), fd.get('odometer'), fd.get('notes')];
    },
    '🚗', (form) => `Fleet log for ${new FormData(form).get('car') || ''}`,
  );

  setupForm('instructorForm', SHEETS.instructors, 'instructorFormStatus',
    'openInstructorForm', 'cancelInstructorForm', 'instructorFormCard',
    (form) => {
      const fd = new FormData(form);
      return [fd.get('date'), fd.get('instructor'), fd.get('studentsCount'),
              fd.get('hours'), fd.get('notes')];
    },
    '👨‍🏫', (form) => `Activity logged for ${new FormData(form).get('instructor') || ''}`,
  );

  // ----------------------------------------------------------------
  // SEARCH & FILTERS
  // ----------------------------------------------------------------
  setupSearch('studentSearch', 'studentsBody', [0, 1, 2, 3]);
  setupSearch('paymentSearch', 'paymentsBody', [0, 1, 3, 4]);
  setupSelectFilter('enquiryStatusFilter', 'enquiriesBody', 5);
  setupSelectFilter('carFilter', 'fleetBody', 1);
  setupSelectFilter('instructorFilter', 'instructorsBody', 1);

  // Show "Connect Google Sheets" banner if not yet configured
  if (CONFIG.SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
    showGlobalAlert('⚠️  Demo Mode: Showing sample data. Follow the setup guide in README.md to connect your Google Sheet.', 'error');
  }

  // Load initial overview data
  switchSection('overview');
});