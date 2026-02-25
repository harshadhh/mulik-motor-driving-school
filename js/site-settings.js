/* ================================================================
   MULIK MOTOR — SITE SETTINGS LOADER
   Reads settings saved by the admin editor and applies them
   to the live public website instantly on every page load.
   Works via localStorage — no server needed, works forever.
   ================================================================ */

(function () {
  'use strict';

  const STORAGE_KEY = 'mulik_site_settings';

  // Default values — fallback if nothing has been saved yet
  const DEFAULTS = {
    // Identity
    schoolName:       'Mulik Motor',
    schoolTagline:    'Driving School',
    schoolInitial:    'M',

    // Contact
    phone:            '+91XXXXXXXXXX',
    whatsapp:         '91XXXXXXXXXX',
    address:          'Vishrantwadi, Alandi Road, Pune, Maharashtra – 411015',
    hours:            '7:00 AM – 9:00 PM',
    hoursLabel:       'Monday – Sunday',
    mapEmbed:         'https://www.google.com/maps/embed?pb=!1m18!1m12!1d3781.8743!2d73.8932!3d18.5778!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDM0JzQwLjEiTiA3M8KwNTMnMzUuNSJF!5e0!3m2!1sen!2sin!4v1234567890',

    // Hero
    heroBadge:        'Government Approved · RTO Certified',
    heroTitle1:       'Drive with',
    heroAccent:       'Experts.',
    heroTitle2:       'Learn with',
    heroOutline:      'Confidence.',
    heroSub:          "Pune's premier driving school in Vishrantwadi — building skilled, confident drivers for over a decade. Trusted by 380+ students.",
    heroCTA1:         'Call Mulik Sir Now',
    heroCTA2:         'View Courses →',

    // Trust pills
    trustPill1:       '⭐ 4.9 / 5',
    trustPill2:       '👩 Women-Owned',
    trustPill3:       '🏛️ Govt. Approved',
    trustPill4:       '383 Reviews',

    // Stats bar
    stat1Num:         '383',
    stat1Label:       '5-Star Reviews',
    stat2Num:         '380',
    stat2Label:       'Success Stories',
    stat3Num:         '10+',
    stat3Label:       'Years of Experience',
    stat4Num:         '4.9★',
    stat4Label:       'Google Rating',

    // CTA Section
    ctaTitle:         'Ready to Start Your Journey?',
    ctaSubtext:       'Join 380+ confident drivers who learned with Mulik Motor. Seats are limited — call us today to reserve yours.',
    ctaBtn1:          '📞 Call Mulik Sir Now',
    ctaBtn2:          '💬 WhatsApp Us',
    ctaHours:         '🕐 Open Daily: 7:00 AM – 9:00 PM  |  Vishrantwadi, Alandi Road, Pune',

    // Footer
    footerDesc:       "Pune's trusted, government-approved driving school. Serving Vishrantwadi and Alandi Road with patience, expertise, and dedication.",
    footerCopyright:  '© 2025 Mulik Motor Driving School. All rights reserved.',

    // Trainers
    trainer1Name:     'Mulik Sir',
    trainer1Role:     'Founder & Head Trainer',
    trainer1Bio:      'Over a decade of experience shaping confident drivers in Vishrantwadi. Known for his calm demeanor and structured teaching style.',
    trainer1Initial:  'MS',

    trainer2Name:     'Ashish Sir',
    trainer2Role:     'Senior Driving Instructor',
    trainer2Bio:      'Specializes in beginner and women learners. Students consistently rate his sessions as comfortable and encouraging.',
    trainer2Initial:  'AS',

    trainer3Name:     'Mangesh Sir',
    trainer3Role:     'Driving Instructor & Workshop Lead',
    trainer3Bio:      'Expert in mechanical fundamentals and advanced road driving. Leads the Pinpoint Workshop sessions.',
    trainer3Initial:  'MG',

    // Colors & Fonts
    colorPrimary:     '#D32F2F',
    colorSecondary:   '#1976D2',
    colorDark:        '#1a1a2e',
    colorBg:          '#f8f9fa',
    fontBody:         'DM Sans',
    fontHead:         'Barlow Condensed',

    // SEO
    seoTitle:         'Mulik Motor Driving School | Government-Approved | Vishrantwadi, Pune',
    seoDescription:   "Mulik Motor Driving School — Pune's Premier Government-Approved Driving School in Vishrantwadi. 4.9★ rated, Women-Owned, Expert Trainers.",
  };

  // Load settings from localStorage, merge with defaults
  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return DEFAULTS;
      return Object.assign({}, DEFAULTS, JSON.parse(saved));
    } catch (e) {
      return DEFAULTS;
    }
  }

  // Apply a single CSS variable change
  function setCSSVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  // Safe text setter — only updates if element exists
  function setText(selector, text, attr) {
    const els = document.querySelectorAll(selector);
    els.forEach(el => {
      if (attr) el.setAttribute(attr, text);
      else el.textContent = text;
    });
  }

  // Safe href setter
  function setHref(selector, href) {
    document.querySelectorAll(selector).forEach(el => el.setAttribute('href', href));
  }

  // Apply all settings to the DOM
  function applySettings(s) {

    // === COLORS ===
    setCSSVar('--red',      s.colorPrimary);
    setCSSVar('--red-dark', shadeColor(s.colorPrimary, -20));
    setCSSVar('--red-light',shadeColor(s.colorPrimary, 85));
    setCSSVar('--blue',     s.colorSecondary);
    setCSSVar('--blue-dark',shadeColor(s.colorSecondary, -20));
    setCSSVar('--text-dark',s.colorDark);
    setCSSVar('--bg',       s.colorBg);

    // === FONTS ===
    const fontMap = {
      'DM Sans':          "'DM Sans', sans-serif",
      'Roboto':           "'Roboto', sans-serif",
      'Open Sans':        "'Open Sans', sans-serif",
      'Lato':             "'Lato', sans-serif",
      'Poppins':          "'Poppins', sans-serif",
      'Nunito':           "'Nunito', sans-serif",
      'Inter':            "'Inter', sans-serif",
    };
    const headMap = {
      'Barlow Condensed': "'Barlow Condensed', sans-serif",
      'Oswald':           "'Oswald', sans-serif",
      'Montserrat':       "'Montserrat', sans-serif",
      'Raleway':          "'Raleway', sans-serif",
    };
    if (fontMap[s.fontBody])  setCSSVar('--font-body', fontMap[s.fontBody]);
    if (headMap[s.fontHead])  setCSSVar('--font-head', headMap[s.fontHead]);

    // === IDENTITY ===
    setText('[data-s="schoolName"]',    s.schoolName);
    setText('[data-s="schoolTagline"]', s.schoolTagline);
    setText('[data-s="schoolInitial"]', s.schoolInitial);

    // === CONTACT ===
    setHref('[data-s="phoneHref"]',     'tel:' + s.phone);
    setText('[data-s="phoneText"]',     s.phone);
    setHref('[data-s="waHref"]',        'https://wa.me/' + s.whatsapp);
    setText('[data-s="addressText"]',   s.address);
    setText('[data-s="hoursText"]',     s.hours);
    setText('[data-s="hoursLabel"]',    s.hoursLabel);

    // Map embed
    const map = document.querySelector('[data-s="mapEmbed"]');
    if (map && s.mapEmbed) map.setAttribute('src', s.mapEmbed);

    // === HERO ===
    setText('[data-s="heroBadge"]',   s.heroBadge);
    setText('[data-s="heroTitle1"]',  s.heroTitle1);
    setText('[data-s="heroAccent"]',  s.heroAccent);
    setText('[data-s="heroTitle2"]',  s.heroTitle2);
    setText('[data-s="heroOutline"]', s.heroOutline);
    setText('[data-s="heroSub"]',     s.heroSub);
    setText('[data-s="heroCTA1"]',    s.heroCTA1);
    setText('[data-s="heroCTA2"]',    s.heroCTA2);

    // === TRUST PILLS ===
    setText('[data-s="trustPill1"]', s.trustPill1);
    setText('[data-s="trustPill2"]', s.trustPill2);
    setText('[data-s="trustPill3"]', s.trustPill3);
    setText('[data-s="trustPill4"]', s.trustPill4);

    // === STATS BAR ===
    const s1 = document.querySelector('[data-s="stat1Num"]');
    if (s1) { s1.textContent = s.stat1Num; s1.removeAttribute('data-count'); }
    setText('[data-s="stat1Label"]', s.stat1Label);
    const s2 = document.querySelector('[data-s="stat2Num"]');
    if (s2) { s2.textContent = s.stat2Num; s2.removeAttribute('data-count'); }
    setText('[data-s="stat2Label"]', s.stat2Label);
    setText('[data-s="stat3Num"]',   s.stat3Num);
    setText('[data-s="stat3Label"]', s.stat3Label);
    setText('[data-s="stat4Num"]',   s.stat4Num);
    setText('[data-s="stat4Label"]', s.stat4Label);

    // === CTA ===
    setText('[data-s="ctaTitle"]',   s.ctaTitle);
    setText('[data-s="ctaSubtext"]', s.ctaSubtext);
    setText('[data-s="ctaBtn1"]',    s.ctaBtn1);
    setText('[data-s="ctaBtn2"]',    s.ctaBtn2);
    setText('[data-s="ctaHours"]',   s.ctaHours);

    // === FOOTER ===
    setText('[data-s="footerDesc"]',      s.footerDesc);
    setText('[data-s="footerCopyright"]', s.footerCopyright);

    // === TRAINERS ===
    setText('[data-s="trainer1Name"]',    s.trainer1Name);
    setText('[data-s="trainer1Role"]',    s.trainer1Role);
    setText('[data-s="trainer1Bio"]',     s.trainer1Bio);
    setText('[data-s="trainer1Initial"]', s.trainer1Initial);
    setText('[data-s="trainer2Name"]',    s.trainer2Name);
    setText('[data-s="trainer2Role"]',    s.trainer2Role);
    setText('[data-s="trainer2Bio"]',     s.trainer2Bio);
    setText('[data-s="trainer2Initial"]', s.trainer2Initial);
    setText('[data-s="trainer3Name"]',    s.trainer3Name);
    setText('[data-s="trainer3Role"]',    s.trainer3Role);
    setText('[data-s="trainer3Bio"]',     s.trainer3Bio);
    setText('[data-s="trainer3Initial"]', s.trainer3Initial);

    // === SEO (page title + meta) ===
    if (s.seoTitle)       document.title = s.seoTitle;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && s.seoDescription) metaDesc.setAttribute('content', s.seoDescription);

    // === LOGO PHOTO ===
    if (s.logoUrl) {
      document.querySelectorAll('[data-s="logoImg"]').forEach(el => {
        el.style.backgroundImage = `url(${s.logoUrl})`;
        el.style.backgroundSize  = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
      });
    }
  }

  // Darken/lighten a hex color by percent
  function shadeColor(hex, percent) {
    try {
      let R = parseInt(hex.slice(1,3), 16);
      let G = parseInt(hex.slice(3,5), 16);
      let B = parseInt(hex.slice(5,7), 16);
      R = Math.min(255, Math.max(0, Math.round(R + (R * percent / 100))));
      G = Math.min(255, Math.max(0, Math.round(G + (G * percent / 100))));
      B = Math.min(255, Math.max(0, Math.round(B + (B * percent / 100))));
      return '#' + R.toString(16).padStart(2,'0') + G.toString(16).padStart(2,'0') + B.toString(16).padStart(2,'0');
    } catch(e) { return hex; }
  }

  // Run immediately on script load (before DOM fully parsed)
  // for colors/fonts to prevent flash
  const earlySettings = loadSettings();
  setCSSVar('--red',       earlySettings.colorPrimary);
  setCSSVar('--blue',      earlySettings.colorSecondary);
  setCSSVar('--text-dark', earlySettings.colorDark);
  setCSSVar('--bg',        earlySettings.colorBg);

  // Apply everything else after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => applySettings(loadSettings()));
  } else {
    applySettings(loadSettings());
  }

  // Expose globally so admin editor can trigger re-apply during live preview
  window.MulikSettings = {
    load:    loadSettings,
    apply:   applySettings,
    save:    function(newSettings) {
      const merged = Object.assign(loadSettings(), newSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      applySettings(merged);
      return merged;
    },
    reset:   function() {
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    },
    STORAGE_KEY,
    DEFAULTS,
  };

})();
