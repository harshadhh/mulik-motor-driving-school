/* ================================================================
   MULIK MOTOR — WEBSITE EDITOR
   Full site editor — saves to localStorage, applies live to website
   Works forever, zero server needed, zero dependencies.
   ================================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mulik_site_settings';

  // ── Load current settings ──────────────────────────────────────
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  }

  // ── Save settings ─────────────────────────────────────────────
  function saveSettings(patch) {
    const current = loadSettings();
    const merged  = Object.assign(current, patch);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  }

  // ── Reset all settings ────────────────────────────────────────
  function resetSettings() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // ── Fill editor form with current saved values ────────────────
  function populateEditor() {
    const s = loadSettings();
    document.querySelectorAll('[data-field]').forEach(input => {
      const key = input.getAttribute('data-field');
      if (s[key] !== undefined) {
        if (input.type === 'color') {
          // ensure 6-digit hex for color inputs
          input.value = s[key];
        } else {
          input.value = s[key];
        }
      }
      // Show live hex value next to color picker
      if (input.type === 'color') {
        const label = document.querySelector(`[data-hex="${key}"]`);
        if (label) label.textContent = input.value.toUpperCase();
      }
    });
  }

  // ── Live preview: open public site in iframe and apply changes ─
  function applyLivePreview(patch) {
    const preview = document.getElementById('sitePreviewFrame');
    if (!preview || !preview.contentWindow) return;
    try {
      const win = preview.contentWindow;
      if (win.MulikSettings) {
        win.MulikSettings.save(patch);
      }
    } catch (e) {
      // Cross-origin fallback — just save and let user refresh
    }
  }

  // ── Show save status ──────────────────────────────────────────
  function showEditorStatus(msg, type) {
    const el = document.getElementById('editorSaveStatus');
    if (!el) return;
    el.textContent   = msg;
    el.className     = `editor-save-status ${type}`;
    el.style.display = 'block';
    clearTimeout(el._timer);
    el._timer = setTimeout(() => { el.style.display = 'none'; }, 4000);
  }

  // ── Collect all editor form values into an object ─────────────
  function collectFormValues() {
    const result = {};
    document.querySelectorAll('[data-field]').forEach(input => {
      const key = input.getAttribute('data-field');
      result[key] = input.value;
    });
    return result;
  }

  // ── Handle section tab switching inside editor ────────────────
  // Uses event DELEGATION on the container — survives any DOM changes
  function setupEditorTabs() {
    // Remove any old listener first
    const container = document.getElementById('section-editor');
    if (!container) return;

    if (container._tabListenerAttached) return; // prevent duplicate
    container._tabListenerAttached = true;

    container.addEventListener('click', function(e) {
      const tab = e.target.closest('.editor-tab');
      if (!tab) return;
      e.preventDefault();
      e.stopPropagation();

      // Deactivate all tabs and panels
      container.querySelectorAll('.editor-tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.editor-panel').forEach(p => {
        p.classList.remove('active');
        p.style.display = 'none';
      });

      // Activate clicked tab
      tab.classList.add('active');

      // Activate matching panel
      const panelId = tab.getAttribute('data-panel');
      const panel   = document.getElementById('epanel-' + panelId);
      if (panel) {
        panel.classList.add('active');
        panel.style.display = 'block';
      }
    });

    // Make sure first panel is shown correctly on init
    const firstActive = container.querySelector('.editor-tab.active');
    if (firstActive) {
      container.querySelectorAll('.editor-panel').forEach(p => { p.style.display = 'none'; p.classList.remove('active'); });
      const panelId = firstActive.getAttribute('data-panel');
      const panel   = document.getElementById('epanel-' + panelId);
      if (panel) { panel.style.display = 'block'; panel.classList.add('active'); }
    }
  }

  // ── Color picker live update ──────────────────────────────────
  function setupColorPickers() {
    document.querySelectorAll('input[type="color"][data-field]').forEach(picker => {
      const key    = picker.getAttribute('data-field');
      const hexEl  = document.querySelector(`[data-hex="${key}"]`);

      picker.addEventListener('input', () => {
        if (hexEl) hexEl.textContent = picker.value.toUpperCase();
        // Live preview: patch just this color
        const patch = {};
        patch[key]  = picker.value;
        saveSettings(patch);
        applyLivePreview(patch);
      });
    });
  }

  // ── Font live update ──────────────────────────────────────────
  function setupFontSelects() {
    document.querySelectorAll('select[data-field]').forEach(select => {
      select.addEventListener('change', () => {
        const key    = select.getAttribute('data-field');
        const patch  = {};
        patch[key]   = select.value;
        saveSettings(patch);
        applyLivePreview(patch);
      });
    });
  }

  // ── Text field live update (debounced 600ms) ──────────────────
  function setupTextFields() {
    document.querySelectorAll('input[type="text"][data-field], input[type="tel"][data-field], textarea[data-field]').forEach(input => {
      let timer;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          const key   = input.getAttribute('data-field');
          const patch = {};
          patch[key]  = input.value;
          saveSettings(patch);
          applyLivePreview(patch);
        }, 600);
      });
    });
  }

  // ── Save ALL button ───────────────────────────────────────────
  function setupSaveButton() {
    const btn = document.getElementById('saveAllEditorBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const all = collectFormValues();
      saveSettings(all);
      applyLivePreview(all);
      showEditorStatus('✅ All changes saved! Your website has been updated.', 'success');
      btn.textContent = '✅ Saved!';
      setTimeout(() => { btn.textContent = '💾 Save All Changes'; }, 3000);
    });
  }

  // ── Reset button ──────────────────────────────────────────────
  function setupResetButton() {
    const btn = document.getElementById('resetEditorBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (confirm('⚠️ This will reset ALL your website changes back to the original design. Are you sure?')) {
        resetSettings();
        populateEditor();
        showEditorStatus('🔄 Reset to original. Refresh your website to see changes.', 'error');
      }
    });
  }

  // ── Preview button ────────────────────────────────────────────
  function setupPreviewButton() {
    const btn = document.getElementById('openPreviewBtn');
    if (!btn) return;
    btn.addEventListener('click', () => {
      window.open('../', '_blank');
    });
  }

  // ── Image upload via ImgBB free API ───────────────────────────
  // Users can get a free API key at imgbb.com (no credit card)
  function setupImageUploads() {
    document.querySelectorAll('.img-upload-input').forEach(input => {
      const key         = input.getAttribute('data-img-key');
      const preview     = document.querySelector(`[data-img-preview="${key}"]`);
      const statusEl    = document.querySelector(`[data-img-status="${key}"]`);
      const apiKeyInput = document.getElementById('imgbbApiKey');

      input.addEventListener('change', async () => {
        const file = input.files[0];
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
          if (statusEl) { statusEl.textContent = '❌ Please select an image file.'; statusEl.style.color = 'red'; }
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          if (statusEl) { statusEl.textContent = '❌ Image too large. Max 5MB.'; statusEl.style.color = 'red'; }
          return;
        }

        // Show local preview immediately
        const reader = new FileReader();
        reader.onload = (e) => {
          if (preview) { preview.src = e.target.result; preview.style.display = 'block'; }
        };
        reader.readAsDataURL(file);

        // Try ImgBB upload if API key is set
        const apiKey = apiKeyInput ? apiKeyInput.value.trim() : '';
        if (!apiKey) {
          // Save as base64 directly (works for logos, small images)
          const r2 = new FileReader();
          r2.onload = (e) => {
            const patch = {};
            patch[key]  = e.target.result;
            saveSettings(patch);
            applyLivePreview(patch);
            if (statusEl) { statusEl.textContent = '✅ Image saved!'; statusEl.style.color = 'green'; }
          };
          r2.readAsDataURL(file);
          return;
        }

        // Upload to ImgBB
        if (statusEl) { statusEl.textContent = '⏳ Uploading...'; statusEl.style.color = '#1976D2'; }
        try {
          const formData = new FormData();
          formData.append('image', file);
          const res  = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            const url   = data.data.url;
            const patch = {};
            patch[key]  = url;
            saveSettings(patch);
            applyLivePreview(patch);
            if (preview) { preview.src = url; preview.style.display = 'block'; }
            if (statusEl) { statusEl.textContent = '✅ Uploaded & saved!'; statusEl.style.color = 'green'; }
          } else {
            throw new Error('ImgBB error');
          }
        } catch (err) {
          // Fallback to base64
          const r3 = new FileReader();
          r3.onload = (e) => {
            const patch = {};
            patch[key]  = e.target.result;
            saveSettings(patch);
            applyLivePreview(patch);
            if (statusEl) { statusEl.textContent = '✅ Image saved locally!'; statusEl.style.color = 'green'; }
          };
          r3.readAsDataURL(file);
        }
      });
    });
  }

  // ── DEFAULT VALUE RESTORE BUTTONS ─────────────────────────────
  // Reads defaults from site-settings.js (window.MulikSettings.DEFAULTS)
  // and injects a small "↺ Default" button next to every text field.
  // Clicking it restores the original value and auto-saves instantly.
  function setupDefaultButtons() {
    // Wait a tick to ensure window.MulikSettings is loaded from site-settings.js
    // (it's loaded on the public site, not admin — so we use the DEFAULTS object
    // embedded directly in admin-editor.js as the source of truth)
    const DEFAULTS = {
      schoolName:      'Mulik Motor',
      schoolTagline:   'Driving School',
      schoolInitial:   'M',
      phone:           '+91XXXXXXXXXX',
      whatsapp:        '91XXXXXXXXXX',
      address:         'Vishrantwadi, Alandi Road, Pune, Maharashtra – 411015',
      hours:           '7:00 AM – 9:00 PM',
      hoursLabel:      'Monday – Sunday',
      mapEmbed:        '',
      heroBadge:       'Government Approved · RTO Certified',
      heroTitle1:      'Drive with',
      heroAccent:      'Experts.',
      heroTitle2:      'Learn with',
      heroOutline:     'Confidence.',
      heroSub:         "Pune's premier driving school in Vishrantwadi — building skilled, confident drivers for over a decade. Trusted by 380+ students.",
      heroCTA1:        'Call Mulik Sir Now',
      heroCTA2:        'View Courses →',
      trustPill1:      '⭐ 4.9 / 5',
      trustPill2:      '👩 Women-Owned',
      trustPill3:      '🏛️ Govt. Approved',
      trustPill4:      '383 Reviews',
      stat1Num:        '383',
      stat1Label:      '5-Star Reviews',
      stat2Num:        '380',
      stat2Label:      'Success Stories',
      stat3Num:        '10+',
      stat3Label:      'Years of Experience',
      stat4Num:        '4.9★',
      stat4Label:      'Google Rating',
      ctaTitle:        'Ready to Start Your Journey?',
      ctaSubtext:      'Join 380+ confident drivers who learned with Mulik Motor. Seats are limited — call us today to reserve yours.',
      ctaBtn1:         '📞 Call Mulik Sir Now',
      ctaBtn2:         '💬 WhatsApp Us',
      ctaHours:        '🕐 Open Daily: 7:00 AM – 9:00 PM  |  Vishrantwadi, Alandi Road, Pune',
      footerDesc:      "Pune's trusted, government-approved driving school. Serving Vishrantwadi and Alandi Road with patience, expertise, and dedication.",
      footerCopyright: '© 2025 Mulik Motor Driving School. All rights reserved.',
      trainer1Name:    'Mulik Sir',
      trainer1Role:    'Founder & Head Trainer',
      trainer1Bio:     'Over a decade of experience shaping confident drivers in Vishrantwadi. Known for his calm demeanor and structured teaching style.',
      trainer1Initial: 'MS',
      trainer2Name:    'Ashish Sir',
      trainer2Role:    'Senior Driving Instructor',
      trainer2Bio:     'Specializes in beginner and women learners. Students consistently rate his sessions as comfortable and encouraging.',
      trainer2Initial: 'AS',
      trainer3Name:    'Mangesh Sir',
      trainer3Role:    'Driving Instructor & Workshop Lead',
      trainer3Bio:     'Expert in mechanical fundamentals and advanced road driving. Leads the Pinpoint Workshop sessions.',
      trainer3Initial: 'MG',
      seoTitle:        'Mulik Motor Driving School | Government-Approved | Vishrantwadi, Pune',
      seoDescription:  "Mulik Motor Driving School — Pune's Premier Government-Approved Driving School in Vishrantwadi. 4.9★ rated, Women-Owned, Expert Trainers.",
      // Font sizes & shapes
      fontSizeHero:    '90px',
      fontSizeSection: '48px',
      fontSizeBody:    '16px',
      fontSizeBtn:     '16px',
      btnRadius:       '999px',
      cardRadius:      '12px',
      // Courses
      coursesTag:   'What We Offer',
      coursesTitle: 'Courses Built for Every Kind of Learner',
      coursesSub:   "Whether you're a complete beginner or need a refresher — we have a course designed for you.",
      course1Name: 'Beginner Driving Course', course1Badge: 'Most Popular',
      course1Desc: '20-day comprehensive training program — from theory to confident road driving. Perfect for first-time drivers.',
      course1F1: '✓ Theory & Road Safety Classes', course1F2: '✓ Field Practice with Dual Controls',
      course1F3: '✓ Traffic & Signal Training',    course1F4: '✓ Reverse & Parking Mastery', course1F5: '✓ RTO Test Preparation',
      course2Name: 'License Assistance', course2Icon: '📋',
      course2Desc: "Complete end-to-end help for your Learner's and Permanent Driving License — zero confusion, zero running around.",
      course2F1: '✓ Document Preparation Guide',    course2F2: '✓ Online RTO Form Filling',
      course2F3: "✓ Learner's License Test Prep",   course2F4: '✓ LL to DL Upgrade Support',
      course3Name: 'Refresher Lessons', course3Icon: '🔄',
      course3Desc: 'Already have a license but lost confidence? Our refresher course gets you back on the road safely.',
      course3F1: '✓ Custom Pace Training',          course3F2: '✓ Highway Confidence Building',
      course3F3: '✓ Parking in Tight Spaces',       course3F4: '✓ Night Driving Basics',
      course4Name: 'Mechanical Workshop', course4Icon: '🔧',
      course4Desc: 'Learn basic car maintenance every driver should know — from tyre changes to engine checks.',
      course4F1: '✓ Tyre Change & Pressure Check',  course4F2: '✓ Engine Oil & Fluids Basics',
      course4F3: '✓ Emergency Breakdown Tips',       course4F4: '✓ Dashboard Warning Lights',
      // Reviews
      reviewsTag: 'What Our Students Say', reviewsTitle: 'Real Stories from Real Drivers',
      review1Text: '"From day one I felt so comfortable. Mulik Sir is extremely patient and made me confident within a week."', review1Name: '— Priya S., Vishrantwadi', review1Stars: '⭐⭐⭐⭐⭐',
      review2Text: '"Best driving school in Pune. Ashish Sir is incredibly calm. Got my license on the first attempt!"',       review2Name: '— Rahul M., Alandi Road',    review2Stars: '⭐⭐⭐⭐⭐',
      review3Text: '"As a woman learner I was nervous, but the environment here is so welcoming and safe."',                   review3Name: '— Sneha K., Vishrantwadi',  review3Stars: '⭐⭐⭐⭐⭐',
      review4Text: '"The mechanical workshop session was a bonus I did not expect! Very practical school."',                   review4Name: '— Vikram P., Hadapsar',     review4Stars: '⭐⭐⭐⭐⭐',
      review5Text: '"Mangesh Sir's teaching is excellent. Very systematic, very patient. 5 stars without question."',        review5Name: '— Anita R., Pune',          review5Stars: '⭐⭐⭐⭐⭐',
      review6Text: '"I was scared of traffic but after 20 days with Mulik Motor, I'm driving daily without any stress."',    review6Name: '— Suresh D., Vishrantwadi', review6Stars: '⭐⭐⭐⭐⭐',
      review7Text: '"The RTO documentation process was completely stress-free. They handled everything. 100% recommend!"',     review7Name: '— Meera T., Alandi Road',   review7Stars: '⭐⭐⭐⭐⭐',
      // Footer
      footerBadge1: '🏛️ Govt. Approved', footerBadge2: '♀ Women-Owned', footerBadge3: '⭐ 4.9 Rated',
      socialFacebook: '', socialInstagram: '', socialYouTube: '', socialGoogleReview: '',
      // Nav
      nav1Text: 'Our Courses', nav2Text: 'License Process', nav3Text: 'About Us', nav4Text: 'Contact', navCtaText: 'Enroll Now',
      announcementText: '', announcementColor: '#D32F2F',
    };

    document.querySelectorAll('input[type="text"][data-field], input[type="tel"][data-field], textarea[data-field]').forEach(input => {
      const key = input.getAttribute('data-field');
      const defaultVal = DEFAULTS[key];

      // Only add button if a default exists for this field
      if (defaultVal === undefined || defaultVal === '') return;

      // Wrap the input + button in a relative container
      const parent = input.parentElement;
      if (!parent || parent.classList.contains('default-wrap')) return;

      // Create wrapper
      const wrap = document.createElement('div');
      wrap.className = 'default-wrap';

      // Insert wrapper before input, move input inside
      parent.insertBefore(wrap, input);
      wrap.appendChild(input);

      // Create the restore button
      const btn = document.createElement('button');
      btn.type      = 'button';
      btn.className = 'btn-restore-default';
      btn.title     = `Restore original: "${defaultVal.length > 40 ? defaultVal.slice(0,40)+'…' : defaultVal}"`;
      btn.innerHTML = '↺';

      // Show tooltip on hover with full default value
      btn.setAttribute('data-default-val', defaultVal);

      // On click: fill field with default, trigger save, show flash
      btn.addEventListener('click', () => {
        input.value = defaultVal;

        // Visual feedback on the button
        btn.textContent  = '✓';
        btn.classList.add('restored');
        setTimeout(() => {
          btn.innerHTML   = '↺';
          btn.classList.remove('restored');
        }, 1500);

        // Highlight the input briefly
        input.classList.add('field-restored');
        setTimeout(() => input.classList.remove('field-restored'), 1200);

        // Auto-save this field immediately
        const patch = {};
        patch[key]  = defaultVal;
        saveSettings(patch);

        // Show status
        showEditorStatus(`↺ "${key}" restored to default. Click Save All to publish.`, 'success');
      });

      wrap.appendChild(btn);
    });
  }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    populateEditor();
    setupEditorTabs();
    setupColorPickers();
    setupFontSelects();
    setupTextFields();
    setupSaveButton();
    setupResetButton();
    setupPreviewButton();
    setupImageUploads();
    setupDefaultButtons();  // ← new

    // Show saved images in preview
    const s = loadSettings();
    ['logoUrl', 'heroImageUrl', 'trainer1Photo', 'trainer2Photo', 'trainer3Photo'].forEach(key => {
      if (s[key]) {
        const prev = document.querySelector(`[data-img-preview="${key}"]`);
        if (prev) { prev.src = s[key]; prev.style.display = 'block'; }
      }
    });
  }

  // Run when editor section is shown
  document.addEventListener('DOMContentLoaded', () => {
    // Init immediately if editor section visible
    if (document.getElementById('section-editor')) {
      init();
    }
  });

  // Also init when section is switched to
  window.initEditor = init;

})();

// ── SLIDER SETUP (font sizes, border radius) ──────────────────
(function setupSliders() {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.size-slider[data-field]').forEach(slider => {
      const key    = slider.getAttribute('data-field');
      const label  = document.querySelector(`[data-size-label="${key}"]`);

      // Load saved value
      const saved = (function() {
        try { const s = localStorage.getItem('mulik_site_settings'); return s ? JSON.parse(s) : {}; } catch(e) { return {}; }
      })();
      if (saved[key] !== undefined) {
        slider.value = parseInt(saved[key]);
        if (label) label.textContent = saved[key] + 'px';
      }

      // Update gradient fill + label live
      function updateSlider() {
        const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--red) ${pct}%, #e0e0e0 ${pct}%)`;
        if (label) label.textContent = slider.value + 'px';
        // Live preview for button radius
        if (key === 'btnRadius') {
          const preview = document.getElementById('btnRadiusPreview');
          if (preview) preview.style.borderRadius = slider.value + 'px';
        }
      }

      updateSlider();
      slider.addEventListener('input', () => {
        updateSlider();
        const patch = {}; patch[key] = slider.value + 'px';
        // Save immediately
        try {
          const cur = JSON.parse(localStorage.getItem('mulik_site_settings') || '{}');
          localStorage.setItem('mulik_site_settings', JSON.stringify(Object.assign(cur, patch)));
        } catch(e) {}
      });
    });
  });
})();
