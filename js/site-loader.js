/* ================================================================
   MULIK MOTOR — SITE LOADER v2
   Reads settings saved by the admin editor and applies them
   to the live public website. Runs on index.html only.
   Key names match exactly what dashboard.html uses (data-field).
================================================================ */
(function () {
  'use strict';
  const KEY = 'mulik_site_settings';

  function get() {
    try { const s = localStorage.getItem(KEY); return s ? JSON.parse(s) : null; }
    catch(e) { return null; }
  }

  function q(sel)  { return document.querySelector(sel); }
  function qa(sel) { return document.querySelectorAll(sel); }

  function apply(s) {
    if (!s) return;
    const root = document.documentElement;

    /* ── COLORS ─────────────────────────────────────────────── */
    if (s.colorPrimary) {
      root.style.setProperty('--red',      s.colorPrimary);
      root.style.setProperty('--red-dark', shadeHex(s.colorPrimary, -20));
      root.style.setProperty('--red-light',hexAlpha(s.colorPrimary, 0.1));
    }
    if (s.colorSecondary) {
      root.style.setProperty('--blue',      s.colorSecondary);
      root.style.setProperty('--blue-dark', shadeHex(s.colorSecondary, -20));
    }
    if (s.colorDark) {
      root.style.setProperty('--text-dark', s.colorDark);
      const hero = q('.hero');
      if (hero) hero.style.background =
        `linear-gradient(135deg, ${s.colorDark} 0%, ${shadeHex(s.colorDark, 15)} 60%, ${shadeHex(s.colorDark, 25)} 100%)`;
      const footer = q('.footer');
      if (footer) footer.style.background = s.colorDark;
      const trustBar = q('.trust-bar');
      if (trustBar) trustBar.style.background = shadeHex(s.colorDark, 5);
    }
    if (s.colorBg) {
      root.style.setProperty('--bg', s.colorBg);
      document.body.style.background = s.colorBg;
    }

    /* ── FONTS ──────────────────────────────────────────────── */
    if (s.fontHead || s.fontBody) {
      const fonts = [s.fontHead, s.fontBody].filter(Boolean);
      const link  = document.createElement('link');
      link.rel    = 'stylesheet';
      link.href   = 'https://fonts.googleapis.com/css2?family=' +
        fonts.map(f => encodeURIComponent(f) + ':wght@400;600;700;800;900').join('&family=') +
        '&display=swap';
      document.head.appendChild(link);
      if (s.fontHead) root.style.setProperty('--font-head', `'${s.fontHead}', sans-serif`);
      if (s.fontBody) root.style.setProperty('--font-body', `'${s.fontBody}', sans-serif`);
    }

    /* ── BRAND ──────────────────────────────────────────────── */
    if (s.schoolName)    qa('.logo-name').forEach(e => e.textContent = s.schoolName);
    if (s.schoolTagline) qa('.logo-sub').forEach(e => e.textContent = s.schoolTagline);
    if (s.schoolInitial) qa('.logo-icon').forEach(e => e.textContent = s.schoolInitial);

    /* ── LOGO IMAGE ─────────────────────────────────────────── */
    if (s.logoUrl) {
      qa('.logo-icon').forEach(el => {
        el.style.backgroundImage = `url(${s.logoUrl})`;
        el.style.backgroundSize  = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent = '';
      });
    }

    /* ── SEO ────────────────────────────────────────────────── */
    if (s.seoTitle) document.title = s.seoTitle;
    if (s.seoDescription) {
      let m = q('meta[name="description"]');
      if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
      m.content = s.seoDescription;
    }

    /* ── PHONE & WHATSAPP ───────────────────────────────────── */
    if (s.phone) {
      const clean = s.phone.replace(/\s/g, '');
      qa('a[href^="tel:"]').forEach(a => {
        a.href = 'tel:' + clean;
        if (/XXXX|placeholder/i.test(a.textContent)) a.textContent = s.phone;
      });
    }
    if (s.whatsapp) {
      const num = s.whatsapp.replace(/\D/g, '');
      qa('a[href^="https://wa.me"]').forEach(a => { a.href = 'https://wa.me/' + num; });
    }

    /* ── HERO ───────────────────────────────────────────────── */
    if (s.heroBadge) {
      const b = q('.hero-badge');
      if (b) b.innerHTML = `<span class="badge-dot"></span> ${s.heroBadge}`;
    }
    const ht = q('.hero-title');
    if (ht && (s.heroTitle1 || s.heroAccent || s.heroTitle2 || s.heroOutline)) {
      ht.innerHTML =
        `${s.heroTitle1||'Drive with'} <span class="text-accent">${s.heroAccent||'Experts.'}</span><br/>` +
        `${s.heroTitle2||'Learn with'} <span class="text-outline">${s.heroOutline||'Confidence.'}</span>`;
    }
    if (s.heroSub)  { const el = q('.hero-sub');  if (el) el.textContent = s.heroSub; }
    const pills = qa('.trust-pill');
    [s.trustPill1, s.trustPill2, s.trustPill3, s.trustPill4].forEach((v, i) => {
      if (v && pills[i]) pills[i].textContent = v;
    });
    const hbtns = qa('.hero-ctas .btn');
    if (hbtns[0] && s.heroCTA1) hbtns[0].innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> ${s.heroCTA1}`;
    if (hbtns[1] && s.heroCTA2) hbtns[1].textContent = s.heroCTA2;

    /* ── STATS BAR ──────────────────────────────────────────── */
    const tnums = qa('.trust-num'), tlbls = qa('.trust-label');
    [[s.stat1Num,s.stat1Label],[s.stat2Num,s.stat2Label],[s.stat3Num,s.stat3Label],[s.stat4Num,s.stat4Label]]
      .forEach(([n,l], i) => {
        if (n && tnums[i]) tnums[i].textContent = n;
        if (l && tlbls[i]) tlbls[i].textContent = l;
      });

    /* ── TRAINERS ───────────────────────────────────────────── */
    const tCards = qa('.trainer-card');
    [
      { name:s.trainer1Name, role:s.trainer1Role, bio:s.trainer1Bio, init:s.trainer1Initial, photo:s.trainer1Photo },
      { name:s.trainer2Name, role:s.trainer2Role, bio:s.trainer2Bio, init:s.trainer2Initial, photo:s.trainer2Photo },
      { name:s.trainer3Name, role:s.trainer3Role, bio:s.trainer3Bio, init:s.trainer3Initial, photo:s.trainer3Photo },
    ].forEach((d, i) => {
      const card = tCards[i]; if (!card) return;
      if (d.name) { const el = card.querySelector('h3');           if (el) el.textContent = d.name; }
      if (d.role) { const el = card.querySelector('.trainer-role');if (el) el.textContent = d.role; }
      if (d.bio)  { const el = card.querySelector('.trainer-bio'); if (el) el.textContent = d.bio; }
      if (d.init) { const el = card.querySelector('.trainer-avatar');if (el) el.textContent = d.init; }
      if (d.photo){ const el = card.querySelector('.trainer-avatar');
        if (el) { el.style.backgroundImage=`url(${d.photo})`; el.style.backgroundSize='cover'; el.style.backgroundPosition='center'; el.textContent=''; }
      }
    });

    /* ── CTA ────────────────────────────────────────────────── */
    if (s.ctaTitle)   { const el = q('.cta-inner h2');  if (el) el.textContent = s.ctaTitle; }
    if (s.ctaSubtext) { const el = q('.cta-inner > p'); if (el) el.textContent = s.ctaSubtext; }
    if (s.ctaHours)   { const el = q('.cta-hours');     if (el) el.textContent = s.ctaHours; }
    const cbtns = qa('.cta-buttons .btn');
    if (cbtns[0] && s.ctaBtn1) cbtns[0].textContent = s.ctaBtn1;
    if (cbtns[1] && s.ctaBtn2) cbtns[1].textContent = s.ctaBtn2;

    /* ── CONTACT ────────────────────────────────────────────── */
    if (s.address) {
      const els = qa('.contact-item p');
      if (els[0]) els[0].innerHTML = s.address.replace(/,/g,'<br/>');
    }
    if (s.hours || s.hoursLabel) {
      const els = qa('.contact-item p');
      if (els[1]) els[1].innerHTML = `${s.hoursLabel||'Monday – Sunday'}<br/>${s.hours||'7:00 AM – 9:00 PM'}`;
    }
    if (s.mapEmbed) {
      const iframe = q('.map-container iframe');
      if (iframe) iframe.src = s.mapEmbed;
    }

    /* ── FOOTER ─────────────────────────────────────────────── */
    if (s.footerDesc) { const el = q('.footer-brand p'); if (el) el.textContent = s.footerDesc; }
    if (s.footerCopyright) { const el = q('.footer-bottom p'); if (el) el.textContent = s.footerCopyright; }
    if (s.phone) {
      const a = q('.footer-contact a');
      if (a) { a.href = 'tel:' + s.phone.replace(/\s/g,''); a.textContent = s.phone; }
    }

    /* ── STICKY CALL ────────────────────────────────────────── */
    if (s.phone) {
      const sc = document.getElementById('stickyCTA');
      if (sc) sc.href = 'tel:' + s.phone.replace(/\s/g,'');
    }
  }

  /* ── COLOR HELPERS ────────────────────────────────────────── */
  function shadeHex(hex, amt) {
    try {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      const r = Math.max(0,Math.min(255, parseInt(hex.slice(0,2),16)+amt));
      const g = Math.max(0,Math.min(255, parseInt(hex.slice(2,4),16)+amt));
      const b = Math.max(0,Math.min(255, parseInt(hex.slice(4,6),16)+amt));
      return '#'+[r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
    } catch(e) { return hex; }
  }
  function hexAlpha(hex, alpha) {
    try {
      hex = hex.replace('#','');
      if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
      const r=parseInt(hex.slice(0,2),16), g=parseInt(hex.slice(2,4),16), b=parseInt(hex.slice(4,6),16);
      return `rgba(${r},${g},${b},${alpha})`;
    } catch(e) { return hex; }
  }

  /* ── RUN ───────────────────────────────────────────────────── */
  const s = get();
  if (s) {
    apply(s);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => apply(s));
    }
  }
})();
