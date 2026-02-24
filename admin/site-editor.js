/* ============================================================
   MULIK MOTOR — SITE EDITOR
   Saves settings to localStorage (instant) + Google Sheets
   (persistent backup). Public index.html reads from
   localStorage on every load — works offline too.
   ============================================================ */

const EDITOR_KEY = 'mulik_site_settings';

// ============================================================
// DEFAULT SETTINGS — mirrors the original website exactly
// ============================================================
const DEFAULT_SETTINGS = {

  // BRAND
  schoolName:       'Mulik Motor',
  schoolTagline:    'Driving School',
  logoLetter:       'M',

  // COLORS
  primaryColor:     '#D32F2F',
  secondaryColor:   '#1976D2',
  accentDark:       '#b71c1c',
  heroBg1:          '#0d1b2a',
  heroBg2:          '#1a2744',

  // FONTS
  headFont:         'Barlow Condensed',
  bodyFont:         'DM Sans',

  // CONTACT
  phone:            '+91XXXXXXXXXX',
  whatsapp:         '91XXXXXXXXXX',
  address:          'Vishrantwadi, Alandi Road, Pune – 411015',
  hours:            '7:00 AM – 9:00 PM',
  workingDays:      'Monday – Sunday',
  mapEmbed:         'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.8743!2d73.8932!3d18.5778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM0JzQwLjEiTiA3M8KwNTMnMzUuNSJF!5e0!3m2!1sen!2sin!4v1234567890',

  // HERO SECTION
  heroBadge:        'Government Approved · RTO Certified',
  heroTitle1:       'Drive with',
  heroAccent:       'Experts.',
  heroTitle2:       'Learn with',
  heroOutline:      'Confidence.',
  heroSub:          "Pune's premier driving school in Vishrantwadi — building skilled, confident drivers for over a decade. Trusted by 380+ students.",
  heroBtnCall:      'Call Mulik Sir Now',
  heroBtnCourses:   'View Courses →',
  heroPill1:        '⭐ 4.9 / 5',
  heroPill2:        '👩 Women-Owned',
  heroPill3:        '🏛️ Govt. Approved',
  heroPill4:        '383 Reviews',
  fleetLabel:       'Our Training Fleet',

  // TRUST BAR
  stat1Num:         '383',
  stat1Label:       '5-Star Reviews',
  stat2Num:         '380',
  stat2Label:       'Success Stories',
  stat3Num:         '10+',
  stat3Label:       'Years of Experience',
  stat4Num:         '4.9★',
  stat4Label:       'Google Rating',

  // COURSES SECTION
  coursesTag:       'What We Offer',
  coursesTitle:     'Courses Built for',
  coursesTitleAccent:'Every Kind of Learner',
  coursesSub:       "Whether you're a complete beginner or need a refresher — we have a course designed for you.",

  course1Name:      'Beginner Driving Course',
  course1Desc:      '20-day comprehensive training program — from theory to confident road driving. Perfect for first-time drivers.',
  course1Feat1:     '✓ Theory & Road Safety Classes',
  course1Feat2:     '✓ Field Practice with Dual Controls',
  course1Feat3:     '✓ Traffic & Signal Training',
  course1Feat4:     '✓ Reverse & Parking Mastery',
  course1Feat5:     '✓ RTO Test Preparation',

  course2Name:      'License Assistance',
  course2Desc:      "Complete end-to-end help for your Learner's and Permanent Driving License — zero confusion, zero running around.",
  course2Feat1:     '✓ Document Preparation Guide',
  course2Feat2:     '✓ Online RTO Form Filling',
  course2Feat3:     "✓ Learner's License Test Prep",
  course2Feat4:     '✓ LL to DL Upgrade Support',

  course3Name:      'Refresher Lessons',
  course3Desc:      'Already have a license but lost confidence? Our refresher course gets you back on the road — safely and quickly.',
  course3Feat1:     '✓ Custom Pace Training',
  course3Feat2:     '✓ Highway Confidence Building',
  course3Feat3:     '✓ Parking in Tight Spaces',
  course3Feat4:     '✓ Night Driving Basics',

  course4Name:      'Mechanical Workshop',
  course4Desc:      'Learn basic car maintenance every driver should know — from tyre changes to engine checks. Pinpoint Workshop sessions.',
  course4Feat1:     '✓ Tyre Change & Pressure Check',
  course4Feat2:     '✓ Engine Oil & Fluids Basics',
  course4Feat3:     '✓ Emergency Breakdown Tips',
  course4Feat4:     '✓ Dashboard Warning Lights',

  // TRAINERS SECTION
  trainersTag:      'Meet Your Trainers',
  trainersTitle:    'Patient Experts Who',
  trainersTitleAccent:'Make You Confident',
  trainersSub:      'Every instructor at Mulik Motor is trained to be calm, patient, and encouraging — especially for beginners and women learners.',

  trainer1Name:     'Mulik Sir',
  trainer1Role:     'Founder & Head Trainer',
  trainer1Bio:      'Over a decade of experience shaping confident drivers in Vishrantwadi. Known for his calm demeanor and structured teaching style.',
  trainer1Badge1:   '👏 Patience Level: 100%',
  trainer1Badge2:   '🏛️ RTO Certified',
  trainer1Badge3:   '10+ Years',

  trainer2Name:     'Ashish Sir',
  trainer2Role:     'Senior Driving Instructor',
  trainer2Bio:      'Specializes in beginner and women learners. Students consistently rate his sessions as comfortable and encouraging.',
  trainer2Badge1:   '👏 Patience Level: 100%',
  trainer2Badge2:   '⭐ 5-Star Rated',

  trainer3Name:     'Mangesh Sir',
  trainer3Role:     'Driving Instructor & Workshop Lead',
  trainer3Bio:      'Expert in mechanical fundamentals and advanced road driving. Leads the Pinpoint Workshop sessions at Mulik Motor.',
  trainer3Badge1:   '👏 Patience Level: 100%',
  trainer3Badge2:   '🔧 Workshop Expert',

  womenBannerTitle: 'Proudly Women-Owned & Women-Friendly',
  womenBannerText:  'Our school was founded with a special focus on creating a safe, comfortable learning environment for women. All our instructors are trained in patient, judgment-free teaching.',

  // CTA SECTION
  ctaTitle:         'Ready to Start Your Journey?',
  ctaDesc:          'Join 380+ confident drivers who learned with Mulik Motor. Seats are limited — call us today to reserve yours.',
  ctaBtnCall:       '📞 Call Mulik Sir Now',
  ctaBtnWhatsapp:   '💬 WhatsApp Us',
  ctaHours:         '🕐 Open Daily: 7:00 AM – 9:00 PM  |  Vishrantwadi, Alandi Road, Pune',

  // TESTIMONIALS
  test1Text:        '"From day one I felt so comfortable. Mulik Sir is extremely patient and made me confident within a week. I never thought I could drive but here I am!"',
  test1Name:        '— Priya S., Vishrantwadi',
  test2Text:        '"Best driving school in Pune. Ashish Sir is incredibly calm and never made me feel nervous. Got my license on the first attempt!"',
  test2Name:        '— Rahul M., Alandi Road',
  test3Text:        '"As a woman learner I was nervous, but the environment here is so welcoming and safe. Highly recommend to every woman looking to learn driving."',
  test3Name:        '— Sneha K., Vishrantwadi',
  test4Text:        '"The mechanical workshop session was a bonus I didn\'t expect! Now I know how to change a tyre and check my oil. Very practical school."',
  test4Name:        '— Vikram P., Hadapsar',
  test5Text:        '"Mangesh Sir\'s teaching is excellent. Very systematic, very patient. The whole team at Mulik Motor is top class. 5 stars without question."',
  test5Name:        '— Anita R., Pune',
  test6Text:        '"I was scared of traffic but after 20 days with Mulik Motor, I\'m driving daily on Alandi Road without any stress. Thank you so much!"',
  test6Name:        '— Suresh D., Vishrantwadi',
  test7Text:        '"Very professional school. The RTO documentation process was completely stress-free because they handled everything. 100% recommend!"',
  test7Name:        '— Meera T., Alandi Road',

  // FOOTER
  footerDesc:       "Pune's trusted, government-approved driving school. Serving Vishrantwadi and Alandi Road with patience, expertise, and dedication.",
  footerBadge1:     '🏛️ Govt. Approved',
  footerBadge2:     '♀ Women-Owned',
  footerBadge3:     '⭐ 4.9 Rated',
  footerCopyright:  '© 2025 Mulik Motor Driving School. All rights reserved.',

  // SEO
  seoTitle:         'Mulik Motor Driving School | Government-Approved | Vishrantwadi, Pune',
  seoDesc:          "Mulik Motor Driving School — Pune's Premier Government-Approved Driving School in Vishrantwadi. 4.9★ rated, Women-Owned, Expert Trainers. Call now to enroll!",
};

// ============================================================
// LOAD SETTINGS
// ============================================================
function loadSettings() {
  try {
    const saved = localStorage.getItem(EDITOR_KEY);
    if (saved) {
      return Object.assign({}, DEFAULT_SETTINGS, JSON.parse(saved));
    }
  } catch (e) { /* ignore */ }
  return Object.assign({}, DEFAULT_SETTINGS);
}

// ============================================================
// SAVE SETTINGS
// ============================================================
function saveSettings(settings) {
  localStorage.setItem(EDITOR_KEY, JSON.stringify(settings));
}

// ============================================================
// POPULATE EDITOR FORM with current values
// ============================================================
function populateForm(settings) {
  Object.keys(settings).forEach(key => {
    const el = document.getElementById('se_' + key);
    if (!el) return;
    if (el.type === 'color') {
      el.value = settings[key] || '#000000';
      const preview = document.getElementById('se_preview_' + key);
      if (preview) preview.style.background = el.value;
    } else {
      el.value = settings[key] || '';
    }
  });
}

// ============================================================
// COLLECT FORM VALUES
// ============================================================
function collectForm() {
  const settings = {};
  Object.keys(DEFAULT_SETTINGS).forEach(key => {
    const el = document.getElementById('se_' + key);
    if (el) settings[key] = el.value;
    else settings[key] = DEFAULT_SETTINGS[key];
  });
  return settings;
}

// ============================================================
// LIVE PREVIEW — update color swatches as user picks
// ============================================================
function setupColorPreviews() {
  document.querySelectorAll('.editor-color-input').forEach(input => {
    const key = input.id.replace('se_', '');
    const preview = document.getElementById('se_preview_' + key);
    input.addEventListener('input', () => {
      if (preview) preview.style.background = input.value;
    });
  });
}

// ============================================================
// FONT PREVIEW
// ============================================================
function setupFontPreviews() {
  ['headFont', 'bodyFont'].forEach(key => {
    const sel = document.getElementById('se_' + key);
    const prev = document.getElementById('font_preview_' + key);
    if (!sel || !prev) return;
    sel.addEventListener('change', () => {
      prev.style.fontFamily = sel.value + ', sans-serif';
      prev.textContent = sel.value + ' — Aa Bb Cc 1 2 3';
    });
  });
}

// ============================================================
// SAVE HANDLER
// ============================================================
async function handleSave() {
  const btn = document.getElementById('seSaveBtn');
  const status = document.getElementById('seStatus');
  btn.disabled = true;
  btn.textContent = '⏳ Saving...';
  status.textContent = '';

  try {
    const settings = collectForm();
    saveSettings(settings);

    // Also try to back up to Google Sheets if configured
    if (typeof CONFIG !== 'undefined' &&
        CONFIG.SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE') {
      try {
        const params = new URLSearchParams({
          action: 'append',
          sheet:  'SiteSettings',
          data:   JSON.stringify([
            new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
            JSON.stringify(settings)
          ]),
        });
        await fetch(`${CONFIG.SCRIPT_URL}?${params.toString()}`);
      } catch (e) { /* Sheets backup failed silently — local save is what matters */ }
    }

    status.textContent = '✅ Website updated! Changes are live.';
    status.className = 'se-status success';
    btn.textContent = '✅ Saved!';
    setTimeout(() => {
      btn.textContent = '💾 Save & Publish Changes';
      btn.disabled = false;
      status.textContent = '';
    }, 3000);

  } catch (err) {
    status.textContent = '❌ Error saving. Please try again.';
    status.className = 'se-status error';
    btn.textContent = '💾 Save & Publish Changes';
    btn.disabled = false;
  }
}

// ============================================================
// RESET TO DEFAULTS
// ============================================================
function handleReset() {
  if (!confirm('⚠️ This will reset ALL website settings back to the original defaults. Are you sure?')) return;
  localStorage.removeItem(EDITOR_KEY);
  populateForm(DEFAULT_SETTINGS);
  document.getElementById('seStatus').textContent = '✅ Reset to defaults. Click Save to apply.';
  document.getElementById('seStatus').className = 'se-status success';
}

// ============================================================
// ACCORDION — open/close editor sections
// ============================================================
function setupAccordions() {
  document.querySelectorAll('.editor-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = body.style.display !== 'none';
      // Close all
      document.querySelectorAll('.editor-accordion-body').forEach(b => b.style.display = 'none');
      document.querySelectorAll('.editor-accordion-header').forEach(h => h.classList.remove('open'));
      // Open clicked if it was closed
      if (!isOpen) {
        body.style.display = 'block';
        header.classList.add('open');
      }
    });
  });
  // Open first one by default
  const first = document.querySelector('.editor-accordion-body');
  if (first) {
    first.style.display = 'block';
    first.previousElementSibling.classList.add('open');
  }
}

// ============================================================
// INIT
// ============================================================
function initSiteEditor() {
  const settings = loadSettings();
  populateForm(settings);
  setupColorPreviews();
  setupFontPreviews();
  setupAccordions();

  document.getElementById('seSaveBtn')?.addEventListener('click', handleSave);
  document.getElementById('seResetBtn')?.addEventListener('click', handleReset);
  document.getElementById('sePreviewBtn')?.addEventListener('click', () => {
    window.open('../index.html', '_blank');
  });
}

// Run when editor section is visible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSiteEditor);
} else {
  initSiteEditor();
}

// Wire up floating save bar button
document.addEventListener('DOMContentLoaded', () => {
  const floatBtn = document.getElementById('seSaveBtnFloat');
  if (floatBtn) {
    floatBtn.addEventListener('click', async () => {
      floatBtn.disabled = true;
      floatBtn.textContent = '⏳ Saving...';
      await handleSave();
      const bar = document.getElementById('seStatusBar');
      if (bar) bar.textContent = '✅ Changes published!';
      setTimeout(() => {
        floatBtn.disabled = false;
        floatBtn.textContent = '💾 Save & Publish';
        if (bar) bar.textContent = '';
      }, 3000);
    });
  }
});
