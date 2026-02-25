/* ================================================================
   MULIK MOTOR — WEBSITE EDITOR v3
   Clean rewrite. Simple, direct, no clever tricks.
================================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mulik_site_settings';

  const DEFAULTS = {
    schoolName: 'Mulik Motor', schoolTagline: 'Driving School', schoolInitial: 'M',
    phone: '+91XXXXXXXXXX', whatsapp: '91XXXXXXXXXX',
    address: 'Vishrantwadi, Alandi Road, Pune, Maharashtra – 411015',
    hours: '7:00 AM – 9:00 PM', hoursLabel: 'Monday – Sunday', mapEmbed: '',
    heroBadge: 'Government Approved · RTO Certified',
    heroTitle1: 'Drive with', heroAccent: 'Experts.',
    heroTitle2: 'Learn with', heroOutline: 'Confidence.',
    heroSub: "Pune's premier driving school in Vishrantwadi — building skilled, confident drivers for over a decade.",
    heroCTA1: 'Call Mulik Sir Now', heroCTA2: 'View Courses →',
    trustPill1: '⭐ 4.9 / 5', trustPill2: '👩 Women-Owned',
    trustPill3: '🏛️ Govt. Approved', trustPill4: '383 Reviews',
    stat1Num: '383', stat1Label: '5-Star Reviews',
    stat2Num: '380', stat2Label: 'Success Stories',
    stat3Num: '10+', stat3Label: 'Years of Experience',
    stat4Num: '4.9★', stat4Label: 'Google Rating',
    ctaTitle: 'Ready to Start Your Journey?',
    ctaSubtext: 'Join 380+ confident drivers who learned with Mulik Motor.',
    ctaBtn1: '📞 Call Mulik Sir Now', ctaBtn2: '💬 WhatsApp Us',
    ctaHours: '🕐 Open Daily: 7:00 AM – 9:00 PM  |  Vishrantwadi, Alandi Road, Pune',
    footerDesc: "Pune's trusted, government-approved driving school.",
    footerCopyright: '© 2025 Mulik Motor Driving School. All rights reserved.',
    footerBadge1: '🏛️ Govt. Approved', footerBadge2: '♀ Women-Owned', footerBadge3: '⭐ 4.9 Rated',
    socialFacebook: '', socialInstagram: '', socialYouTube: '', socialGoogleReview: '',
    trainer1Name: 'Mulik Sir',    trainer1Role: 'Founder & Head Trainer',
    trainer1Bio: 'Over a decade of experience shaping confident drivers in Vishrantwadi.',
    trainer1Initial: 'MS',
    trainer2Name: 'Ashish Sir',   trainer2Role: 'Senior Driving Instructor',
    trainer2Bio: 'Specializes in beginner and women learners.',
    trainer2Initial: 'AS',
    trainer3Name: 'Mangesh Sir',  trainer3Role: 'Driving Instructor & Workshop Lead',
    trainer3Bio: 'Expert in mechanical fundamentals and advanced road driving.',
    trainer3Initial: 'MG',
    coursesTag: 'What We Offer',
    coursesTitle: 'Courses Built for Every Kind of Learner',
    coursesSub: "Whether you're a complete beginner or need a refresher — we have a course designed for you.",
    course1Name: 'Beginner Driving Course', course1Badge: 'Most Popular',
    course1Desc: '20-day comprehensive training program — from theory to confident road driving.',
    course1F1: '✓ Theory & Road Safety Classes', course1F2: '✓ Field Practice with Dual Controls',
    course1F3: '✓ Traffic & Signal Training',    course1F4: '✓ Reverse & Parking Mastery', course1F5: '✓ RTO Test Preparation',
    course2Name: 'License Assistance', course2Icon: '📋',
    course2Desc: "Complete end-to-end help for your Learner's and Permanent Driving License.",
    course2F1: '✓ Document Preparation Guide', course2F2: '✓ Online RTO Form Filling',
    course2F3: "✓ Learner's License Test Prep", course2F4: '✓ LL to DL Upgrade Support',
    course3Name: 'Refresher Lessons', course3Icon: '🔄',
    course3Desc: 'Already have a license but lost confidence? Get back on the road safely.',
    course3F1: '✓ Custom Pace Training',        course3F2: '✓ Highway Confidence Building',
    course3F3: '✓ Parking in Tight Spaces',     course3F4: '✓ Night Driving Basics',
    course4Name: 'Mechanical Workshop', course4Icon: '🔧',
    course4Desc: 'Learn basic car maintenance every driver should know.',
    course4F1: '✓ Tyre Change & Pressure Check', course4F2: '✓ Engine Oil & Fluids Basics',
    course4F3: '✓ Emergency Breakdown Tips',      course4F4: '✓ Dashboard Warning Lights',
    reviewsTag: 'What Our Students Say', reviewsTitle: 'Real Stories from Real Drivers',
    review1Text: '"From day one I felt so comfortable. Mulik Sir is extremely patient."', review1Name: '— Priya S., Vishrantwadi', review1Stars: '⭐⭐⭐⭐⭐',
    review2Text: '"Best driving school in Pune. Got my license on the first attempt!"',   review2Name: '— Rahul M., Alandi Road',  review2Stars: '⭐⭐⭐⭐⭐',
    review3Text: '"As a woman learner I was nervous, but the environment here is so welcoming."', review3Name: '— Sneha K., Vishrantwadi', review3Stars: '⭐⭐⭐⭐⭐',
    review4Text: '"The mechanical workshop session was a bonus I did not expect!"',       review4Name: '— Vikram P., Hadapsar',    review4Stars: '⭐⭐⭐⭐⭐',
    review5Text: '"Mangesh Sir\'s teaching is excellent. Very systematic and patient."',  review5Name: '— Anita R., Pune',         review5Stars: '⭐⭐⭐⭐⭐',
    review6Text: '"After 20 days with Mulik Motor, I\'m driving daily without stress."', review6Name: '— Suresh D., Vishrantwadi',review6Stars: '⭐⭐⭐⭐⭐',
    review7Text: '"The RTO documentation process was completely stress-free. 100% recommend!"', review7Name: '— Meera T., Alandi Road', review7Stars: '⭐⭐⭐⭐⭐',
    nav1Text: 'Our Courses', nav2Text: 'License Process', nav3Text: 'About Us', nav4Text: 'Contact', navCtaText: 'Enroll Now',
    announcementText: '', announcementColor: '#D32F2F',
    colorPrimary: '#D32F2F', colorSecondary: '#1976D2',
    colorDark: '#1a1a2e', colorBg: '#f8f9fa',
    fontHead: 'Barlow Condensed', fontBody: 'DM Sans',
    fontSizeHero: '90px', fontSizeSection: '48px', fontSizeBody: '16px', fontSizeBtn: '16px',
    btnRadius: '999px', cardRadius: '12px',
    seoTitle: 'Mulik Motor Driving School | Government-Approved | Vishrantwadi, Pune',
    seoDescription: "Mulik Motor Driving School — Pune's Premier Government-Approved Driving School.",
  };

  // ── Storage ──────────────────────────────────────────────────
  function loadSettings() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch(e) { return {}; }
  }

  function saveSettings(patch) {
    var current = loadSettings();
    var merged = Object.assign(current, patch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  // ── Populate all form fields ─────────────────────────────────
  function populateEditor() {
    var saved = loadSettings();
    var merged = Object.assign({}, DEFAULTS, saved);

    document.querySelectorAll('[data-field]').forEach(function(input) {
      var key = input.getAttribute('data-field');
      if (merged[key] !== undefined) {
        input.value = merged[key];
      }
      // Sync hex label for color pickers
      if (input.type === 'color') {
        var hexEl = document.querySelector('[data-hex="' + key + '"]');
        if (hexEl) hexEl.textContent = input.value.toUpperCase();
      }
    });
  }

  // ── TAB SWITCHING ────────────────────────────────────────────
  function setupTabs() {
    var tabs = document.querySelectorAll('.editor-tab');
    var panels = document.querySelectorAll('.editor-panel');

    tabs.forEach(function(tab) {
      tab.onclick = function(e) {
        var targetId = 'epanel-' + tab.getAttribute('data-panel');

        // Hide all panels
        panels.forEach(function(p) {
          p.style.display = 'none';
        });
        // Deactivate all tabs
        tabs.forEach(function(t) {
          t.style.background = '';
          t.style.color = '';
          t.style.boxShadow = '';
        });

        // Show target panel
        var target = document.getElementById(targetId);
        if (target) {
          target.style.display = 'block';
        }
        // Activate this tab
        tab.style.background = '#D32F2F';
        tab.style.color = 'white';
        tab.style.boxShadow = '0 4px 12px rgba(211,47,47,0.3)';
      };
    });

    // Show first panel on init
    panels.forEach(function(p) { p.style.display = 'none'; });
    var firstPanel = document.getElementById('epanel-identity');
    if (firstPanel) firstPanel.style.display = 'block';
    if (tabs[0]) {
      tabs[0].style.background = '#D32F2F';
      tabs[0].style.color = 'white';
      tabs[0].style.boxShadow = '0 4px 12px rgba(211,47,47,0.3)';
    }
  }

  // ── Color pickers ────────────────────────────────────────────
  function setupColorPickers() {
    document.querySelectorAll('input[type="color"][data-field]').forEach(function(picker) {
      var key = picker.getAttribute('data-field');
      picker.oninput = function() {
        var hexEl = document.querySelector('[data-hex="' + key + '"]');
        if (hexEl) hexEl.textContent = picker.value.toUpperCase();
        var patch = {}; patch[key] = picker.value;
        saveSettings(patch);
      };
    });
    // Color swatches
    document.querySelectorAll('.color-swatch[data-target]').forEach(function(swatch) {
      swatch.onclick = function() {
        var target = swatch.getAttribute('data-target');
        var color  = swatch.getAttribute('data-color');
        var picker = document.querySelector('input[type="color"][data-field="' + target + '"]');
        if (picker) { picker.value = color; picker.dispatchEvent(new Event('input')); }
      };
    });
  }

  // ── Font selects ─────────────────────────────────────────────
  function setupFontSelects() {
    document.querySelectorAll('select[data-field]').forEach(function(select) {
      select.onchange = function() {
        var key = select.getAttribute('data-field');
        var patch = {}; patch[key] = select.value;
        saveSettings(patch);
        // Update font preview
        if (key === 'fontHead') {
          var prev = document.getElementById('headFontPreview');
          if (prev) prev.style.fontFamily = "'" + select.value + "', sans-serif";
        }
        if (key === 'fontBody') {
          var prev = document.getElementById('bodyFontPreview');
          if (prev) prev.style.fontFamily = "'" + select.value + "', sans-serif";
        }
      };
    });
  }

  // ── Sliders ──────────────────────────────────────────────────
  function setupSliders() {
    document.querySelectorAll('.size-slider[data-field]').forEach(function(slider) {
      var key   = slider.getAttribute('data-field');
      var label = document.querySelector('[data-size-label="' + key + '"]');
      // Load saved value
      var saved = loadSettings();
      if (saved[key]) {
        slider.value = parseInt(saved[key]);
      }
      function updateSlider() {
        var pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = 'linear-gradient(to right, #D32F2F ' + pct + '%, #e0e0e0 ' + pct + '%)';
        if (label) label.textContent = slider.value + 'px';
        if (key === 'btnRadius') {
          var prev = document.getElementById('btnRadiusPreview');
          if (prev) prev.style.borderRadius = slider.value + 'px';
        }
      }
      updateSlider();
      slider.oninput = function() {
        updateSlider();
        var patch = {}; patch[key] = slider.value + 'px';
        saveSettings(patch);
      };
    });
  }

  // ── Save button ──────────────────────────────────────────────
  function setupSaveButton() {
    var btn = document.getElementById('saveAllEditorBtn');
    if (!btn) return;
    btn.onclick = function() {
      var result = {};
      document.querySelectorAll('[data-field]').forEach(function(input) {
        result[input.getAttribute('data-field')] = input.value;
      });
      document.querySelectorAll('.size-slider[data-field]').forEach(function(slider) {
        result[slider.getAttribute('data-field')] = slider.value + 'px';
      });
      saveSettings(result);
      // Flash button
      btn.textContent = '✅ Saved!';
      btn.style.background = '#2e7d32';
      setTimeout(function() {
        btn.textContent = '💾 Save All Changes';
        btn.style.background = '';
      }, 2500);
      // Show status
      var status = document.getElementById('editorSaveStatus');
      if (status) {
        status.textContent = '✅ All changes saved! Open your website to see them.';
        status.className = 'editor-save-status success';
        status.style.display = 'block';
        setTimeout(function() { status.style.display = 'none'; }, 5000);
      }
    };
  }

  // ── Reset button ─────────────────────────────────────────────
  function setupResetButton() {
    var btn = document.getElementById('resetEditorBtn');
    if (!btn) return;
    btn.onclick = function() {
      if (confirm('Reset ALL changes back to original defaults?')) {
        localStorage.removeItem(STORAGE_KEY);
        populateEditor();
        var status = document.getElementById('editorSaveStatus');
        if (status) {
          status.textContent = '🔄 Reset to original defaults.';
          status.className = 'editor-save-status error';
          status.style.display = 'block';
          setTimeout(function() { status.style.display = 'none'; }, 4000);
        }
      }
    };
  }

  // ── Preview button ───────────────────────────────────────────
  function setupPreviewButton() {
    var btn = document.getElementById('openPreviewBtn');
    if (!btn) return;
    btn.onclick = function() { window.open('../', '_blank'); };
  }

  // ── Default restore buttons ──────────────────────────────────
  function setupDefaultButtons() {
    document.querySelectorAll('input[type="text"][data-field], input[type="tel"][data-field], textarea[data-field]').forEach(function(input) {
      var key = input.getAttribute('data-field');
      var defaultVal = DEFAULTS[key];
      if (!defaultVal) return;

      var parent = input.parentElement;
      if (!parent || parent.classList.contains('default-wrap')) return;

      var wrap = document.createElement('div');
      wrap.className = 'default-wrap';
      parent.insertBefore(wrap, input);
      wrap.appendChild(input);

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'btn-restore-default';
      btn.innerHTML = '↺';
      btn.title = 'Restore default: ' + defaultVal.slice(0, 60);
      btn.setAttribute('data-default-val', defaultVal.slice(0, 60) + (defaultVal.length > 60 ? '…' : ''));

      btn.onclick = function() {
        input.value = defaultVal;
        var patch = {}; patch[key] = defaultVal;
        saveSettings(patch);
        btn.textContent = '✓';
        btn.style.background = '#e8f5e9';
        btn.style.color = '#2e7d32';
        setTimeout(function() {
          btn.innerHTML = '↺';
          btn.style.background = '';
          btn.style.color = '';
        }, 1500);
      };
      wrap.appendChild(btn);
    });
  }

  // ── Image uploads ────────────────────────────────────────────
  function setupImageUploads() {
    document.querySelectorAll('.img-upload-input').forEach(function(input) {
      var key = input.getAttribute('data-img-key');
      var preview = document.querySelector('[data-img-preview="' + key + '"]');
      var statusEl = document.querySelector('[data-img-status="' + key + '"]');

      input.onchange = function() {
        var file = input.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(e) {
          var patch = {}; patch[key] = e.target.result;
          saveSettings(patch);
          if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
          if (statusEl) { statusEl.textContent = '✅ Image saved!'; statusEl.style.color = 'green'; }
        };
        reader.readAsDataURL(file);
      };
    });
  }

  // ── MAIN INIT ────────────────────────────────────────────────
  function init() {
    populateEditor();
    setupTabs();        // ← tabs first, simple direct onclick
    setupColorPickers();
    setupFontSelects();
    setupSliders();
    setupSaveButton();
    setupResetButton();
    setupPreviewButton();
    setupDefaultButtons();
    setupImageUploads();
  }

  // Run on DOM ready AND expose for sidebar navigation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.initEditor = init;

})();
