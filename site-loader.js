/* ============================================================
   MULIK MOTOR — SITE LOADER
   Reads saved settings from localStorage and applies them
   to the live public website on every page load.
   This file runs on index.html — NOT in the admin panel.
   ============================================================ */

(function () {
  'use strict';

  const EDITOR_KEY = 'mulik_site_settings';

  function getSettings() {
    try {
      const s = localStorage.getItem(EDITOR_KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) { return null; }
  }

  function setText(selector, value) {
    if (!value) return;
    const els = document.querySelectorAll(selector);
    els.forEach(el => { el.textContent = value; });
  }

  function setHTML(selector, value) {
    if (!value) return;
    const els = document.querySelectorAll(selector);
    els.forEach(el => { el.innerHTML = value; });
  }

  function setAttr(selector, attr, value) {
    if (!value) return;
    const els = document.querySelectorAll(selector);
    els.forEach(el => { el.setAttribute(attr, value); });
  }

  function applySettings(s) {
    if (!s) return;

    // ── COLORS via CSS Variables ──────────────────────────────
    const root = document.documentElement;
    if (s.primaryColor)   root.style.setProperty('--red',       s.primaryColor);
    if (s.primaryColor)   root.style.setProperty('--red-light', s.primaryColor + '22');
    if (s.secondaryColor) root.style.setProperty('--blue',      s.secondaryColor);
    if (s.accentDark)     root.style.setProperty('--red-dark',  s.accentDark);
    if (s.heroBg1 || s.heroBg2) {
      const bg1 = s.heroBg1 || '#0d1b2a';
      const bg2 = s.heroBg2 || '#1a2744';
      const hero = document.querySelector('.hero');
      if (hero) hero.style.background = `linear-gradient(135deg, ${bg1} 0%, ${bg2} 60%, ${bg2}dd 100%)`;
    }

    // ── FONTS ─────────────────────────────────────────────────
    if (s.headFont || s.bodyFont) {
      const fontsNeeded = [s.headFont, s.bodyFont].filter(Boolean);
      const link = document.createElement('link');
      link.rel  = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=' +
        fontsNeeded.map(f => f.replace(/ /g, '+') + ':wght@400;600;700;800;900').join('&family=') +
        '&display=swap';
      document.head.appendChild(link);
      if (s.headFont) root.style.setProperty('--font-head', `'${s.headFont}', sans-serif`);
      if (s.bodyFont) root.style.setProperty('--font-body', `'${s.bodyFont}', sans-serif`);
    }

    // ── BRAND ─────────────────────────────────────────────────
    if (s.schoolName)    setText('.logo-name', s.schoolName);
    if (s.schoolTagline) setText('.logo-sub',  s.schoolTagline);
    if (s.logoLetter)    setText('.logo-icon', s.logoLetter);

    // ── SEO ───────────────────────────────────────────────────
    if (s.seoTitle) document.title = s.seoTitle;
    if (s.seoDesc) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
      meta.content = s.seoDesc;
    }

    // ── HERO ──────────────────────────────────────────────────
    if (s.heroBadge) {
      const badge = document.querySelector('.hero-badge');
      if (badge) badge.innerHTML = `<span class="badge-dot"></span> ${s.heroBadge}`;
    }
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && (s.heroTitle1 || s.heroAccent || s.heroTitle2 || s.heroOutline)) {
      heroTitle.innerHTML =
        `${s.heroTitle1 || 'Drive with'} <span class="text-accent">${s.heroAccent || 'Experts.'}</span><br/>` +
        `${s.heroTitle2 || 'Learn with'} <span class="text-outline">${s.heroOutline || 'Confidence.'}</span>`;
    }
    if (s.heroSub) setText('.hero-sub', s.heroSub);
    if (s.fleetLabel) setText('.fleet-label', s.fleetLabel);

    // Hero pills
    const pills = document.querySelectorAll('.trust-pill');
    const pillData = [s.heroPill1, s.heroPill2, s.heroPill3, s.heroPill4];
    pills.forEach((p, i) => { if (pillData[i]) p.textContent = pillData[i]; });

    // Hero CTA buttons
    const heroBtns = document.querySelectorAll('.hero-ctas .btn');
    if (heroBtns[0] && s.heroBtnCall) {
      heroBtns[0].innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> ${s.heroBtnCall}`;
    }
    if (heroBtns[1] && s.heroBtnCourses) heroBtns[1].textContent = s.heroBtnCourses;

    // ── PHONE & WHATSAPP (all links) ──────────────────────────
    if (s.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(a => {
        a.href = 'tel:' + s.phone.replace(/\s/g, '');
        if (a.textContent.includes('XXXX') || a.textContent.includes('+91')) {
          a.textContent = s.phone;
        }
      });
      const stickyCTA = document.getElementById('stickyCTA');
      if (stickyCTA) stickyCTA.href = 'tel:' + s.phone.replace(/\s/g, '');
      const headerEnroll = document.querySelector('.nav .btn-primary');
      if (headerEnroll) headerEnroll.href = 'tel:' + s.phone.replace(/\s/g, '');
    }
    if (s.whatsapp) {
      document.querySelectorAll('a[href^="https://wa.me"]').forEach(a => {
        a.href = 'https://wa.me/' + s.whatsapp.replace(/\D/g, '');
      });
    }

    // ── TRUST BAR STATS ───────────────────────────────────────
    const trustNums  = document.querySelectorAll('.trust-num');
    const trustLabels= document.querySelectorAll('.trust-label');
    const statData = [
      { num: s.stat1Num, label: s.stat1Label },
      { num: s.stat2Num, label: s.stat2Label },
      { num: s.stat3Num, label: s.stat3Label },
      { num: s.stat4Num, label: s.stat4Label },
    ];
    statData.forEach((d, i) => {
      if (trustNums[i]  && d.num)   trustNums[i].textContent  = d.num;
      if (trustLabels[i]&& d.label) trustLabels[i].textContent= d.label;
    });

    // ── COURSES SECTION ───────────────────────────────────────
    applySection('.section-tag', s.coursesTag, 0);
    const courseTitles = document.querySelectorAll('.section-title');
    if (courseTitles[0] && s.coursesTitle) {
      courseTitles[0].innerHTML = `${s.coursesTitle}<br/><span class="text-accent">${s.coursesTitleAccent || ''}</span>`;
    }
    applySection('.section-sub', s.coursesSub, 0);

    const courseCards = document.querySelectorAll('.course-card');
    const courseData = [
      { name: s.course1Name, desc: s.course1Desc, feats: [s.course1Feat1,s.course1Feat2,s.course1Feat3,s.course1Feat4,s.course1Feat5] },
      { name: s.course2Name, desc: s.course2Desc, feats: [s.course2Feat1,s.course2Feat2,s.course2Feat3,s.course2Feat4] },
      { name: s.course3Name, desc: s.course3Desc, feats: [s.course3Feat1,s.course3Feat2,s.course3Feat3,s.course3Feat4] },
      { name: s.course4Name, desc: s.course4Desc, feats: [s.course4Feat1,s.course4Feat2,s.course4Feat3,s.course4Feat4] },
    ];
    courseCards.forEach((card, i) => {
      const d = courseData[i];
      if (!d) return;
      const h3 = card.querySelector('h3');
      const p  = card.querySelector('p:not(.course-special-tag)');
      const lis= card.querySelectorAll('.course-features li');
      if (h3 && d.name) h3.textContent = d.name;
      if (p  && d.desc) p.textContent  = d.desc;
      lis.forEach((li, j) => { if (d.feats[j]) li.textContent = d.feats[j]; });
    });

    // ── TRAINERS ─────────────────────────────────────────────
    if (s.trainersTag)          applySection('.section-tag', s.trainersTag, 1);
    const trainerTitles = document.querySelectorAll('.section-title');
    if (trainerTitles[1] && s.trainersTitle) {
      trainerTitles[1].innerHTML = `${s.trainersTitle}<br/><span class="text-accent">${s.trainersTitleAccent||''}</span>`;
    }
    if (s.trainersSub)          applySection('.section-sub', s.trainersSub, 1);

    const trainerCards = document.querySelectorAll('.trainer-card');
    const trainerData = [
      { name: s.trainer1Name, role: s.trainer1Role, bio: s.trainer1Bio, badges: [s.trainer1Badge1,s.trainer1Badge2,s.trainer1Badge3] },
      { name: s.trainer2Name, role: s.trainer2Role, bio: s.trainer2Bio, badges: [s.trainer2Badge1,s.trainer2Badge2] },
      { name: s.trainer3Name, role: s.trainer3Role, bio: s.trainer3Bio, badges: [s.trainer3Badge1,s.trainer3Badge2] },
    ];
    trainerCards.forEach((card, i) => {
      const d = trainerData[i];
      if (!d) return;
      const h3   = card.querySelector('h3');
      const role = card.querySelector('.trainer-role');
      const bio  = card.querySelector('.trainer-bio');
      const bdgs = card.querySelectorAll('.badge');
      if (h3   && d.name) h3.textContent   = d.name;
      if (role && d.role) role.textContent  = d.role;
      if (bio  && d.bio)  bio.textContent   = d.bio;
      bdgs.forEach((b, j) => { if (d.badges[j]) b.textContent = d.badges[j]; });
    });

    // Women banner
    if (s.womenBannerTitle || s.womenBannerText) {
      const banner = document.querySelector('.women-text');
      if (banner) {
        if (s.womenBannerTitle) banner.querySelector('strong').textContent = s.womenBannerTitle;
        if (s.womenBannerText)  banner.querySelector('span').textContent   = s.womenBannerText;
      }
    }

    // ── TESTIMONIALS ─────────────────────────────────────────
    const testCards = document.querySelectorAll('.testimonial-card');
    const testData = [
      { text: s.test1Text, name: s.test1Name },
      { text: s.test2Text, name: s.test2Name },
      { text: s.test3Text, name: s.test3Name },
      { text: s.test4Text, name: s.test4Name },
      { text: s.test5Text, name: s.test5Name },
      { text: s.test6Text, name: s.test6Name },
      { text: s.test7Text, name: s.test7Name },
    ];
    // Apply to first 7 cards (duplicates handled by loop)
    testCards.forEach((card, i) => {
      const d = testData[i % testData.length];
      if (!d) return;
      const p = card.querySelector('p');
      const r = card.querySelector('.reviewer');
      if (p && d.text) p.textContent = d.text;
      if (r && d.name) r.textContent = d.name;
    });

    // ── CTA SECTION ───────────────────────────────────────────
    const ctaH2 = document.querySelector('.cta-inner h2');
    const ctaP  = document.querySelector('.cta-inner p');
    const ctaHrs= document.querySelector('.cta-hours');
    if (ctaH2 && s.ctaTitle)    ctaH2.textContent = s.ctaTitle;
    if (ctaP  && s.ctaDesc)     ctaP.textContent  = s.ctaDesc;
    if (ctaHrs && s.ctaHours)   ctaHrs.textContent= s.ctaHours;
    const ctaBtns = document.querySelectorAll('.cta-buttons .btn');
    if (ctaBtns[0] && s.ctaBtnCall)     ctaBtns[0].textContent = s.ctaBtnCall;
    if (ctaBtns[1] && s.ctaBtnWhatsapp) ctaBtns[1].textContent = s.ctaBtnWhatsapp;

    // ── CONTACT ───────────────────────────────────────────────
    if (s.address) {
      const addrEls = document.querySelectorAll('.contact-item p');
      if (addrEls[0]) addrEls[0].textContent = s.address;
    }
    if (s.hours || s.workingDays) {
      const hoursEl = document.querySelectorAll('.contact-item p');
      if (hoursEl[1]) hoursEl[1].innerHTML = `${s.workingDays || 'Monday – Sunday'}<br/>${s.hours || '7:00 AM – 9:00 PM'}`;
    }
    if (s.mapEmbed) {
      const iframe = document.querySelector('.map-container iframe');
      if (iframe) iframe.src = s.mapEmbed;
    }

    // ── FOOTER ────────────────────────────────────────────────
    const footerDesc = document.querySelector('.footer-brand p');
    if (footerDesc && s.footerDesc) footerDesc.textContent = s.footerDesc;

    const footerBadges = document.querySelectorAll('.footer-badges span');
    if (footerBadges[0] && s.footerBadge1) footerBadges[0].textContent = s.footerBadge1;
    if (footerBadges[1] && s.footerBadge2) footerBadges[1].textContent = s.footerBadge2;
    if (footerBadges[2] && s.footerBadge3) footerBadges[2].textContent = s.footerBadge3;

    const copyright = document.querySelector('.footer-bottom p');
    if (copyright && s.footerCopyright) copyright.textContent = s.footerCopyright;

    // Footer contact replicate
    const footerContactLinks = document.querySelectorAll('.footer-contact a');
    if (footerContactLinks[0] && s.phone) {
      footerContactLinks[0].href        = 'tel:' + s.phone.replace(/\s/g, '');
      footerContactLinks[0].textContent = s.phone;
    }

    // Sticky call button text
    const stickyBtn = document.getElementById('stickyCTA');
    if (stickyBtn && s.heroBtnCall) {
      stickyBtn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg> ${s.heroBtnCall}`;
    }
  }

  // Helper: apply to nth occurrence of a selector
  function applySection(selector, value, index) {
    if (!value) return;
    const els = document.querySelectorAll(selector);
    if (els[index]) els[index].textContent = value;
  }

  // ── RUN ───────────────────────────────────────────────────
  const settings = getSettings();
  if (settings) {
    // Apply immediately (before paint) for colors/fonts
    applySettings(settings);
    // Also apply after DOM ready for all text content
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => applySettings(settings));
    }
  }

})();
