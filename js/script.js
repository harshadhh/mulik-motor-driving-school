/* ============================================
   MULIK MOTOR DRIVING SCHOOL — JAVASCRIPT
   Interactions, Animations, Mobile UX
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // === HAMBURGER MENU ===
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close nav on link click
    nav.querySelectorAll('.nav-link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
        hamburger.classList.remove('active');
      }
    });
  }

  // === HEADER SCROLL EFFECT ===
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // === COUNTER ANIMATION ===
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startVal = 0;

    function update(currentTime) {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // cubic ease-out
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = current.toLocaleString('en-IN') + '+';
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Intersection Observer for counters
  const counterEls = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => counterObserver.observe(el));

  // === PROGRESS BAR ANIMATION ===
  const progressFill = document.getElementById('progressFill');
  const progressCar = document.querySelector('.progress-car-icon');

  if (progressFill && progressCar) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            progressFill.style.width = '100%';
            progressCar.style.left = 'calc(100% - 20px)';
          }, 300);
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressObserver.observe(progressFill);
  }

  // === SCROLL REVEAL ANIMATIONS ===
  const revealEls = document.querySelectorAll(
    '.course-card, .trainer-card, .checklist-glass, .process-step-item, .progress-step, .trust-item'
  );

  const style = document.createElement('style');
  style.textContent = `
    .reveal-hidden {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1);
    }
    .reveal-visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  revealEls.forEach((el, i) => {
    el.classList.add('reveal-hidden');
    el.style.transitionDelay = `${(i % 4) * 80}ms`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // === ACTIVE NAV LINK on SCROLL ===
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === `#${id}`) {
            link.style.color = 'var(--red)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

  // === STICKY CTA: Hide when Contact Section is Visible ===
  const stickyCTA = document.getElementById('stickyCTA');
  const contactSection = document.getElementById('contact');

  if (stickyCTA && contactSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          stickyCTA.style.opacity = '0';
          stickyCTA.style.pointerEvents = 'none';
        } else {
          stickyCTA.style.opacity = '1';
          stickyCTA.style.pointerEvents = 'all';
        }
      });
    }, { threshold: 0.2 });

    ctaObserver.observe(contactSection);

    stickyCTA.style.transition = 'opacity 0.3s ease';
  }

  // === HERO SECTION PARALLAX (subtle) ===
  const heroBg = document.querySelector('.hero-bg-grid');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      heroBg.style.transform = `translateY(${y * 0.3}px)`;
    }, { passive: true });
  }

  // === HAMBURGER ICON ANIMATION ===
  const hamburgerStyle = document.createElement('style');
  hamburgerStyle.textContent = `
    .hamburger.active span:nth-child(1) {
      transform: translateY(7.5px) rotate(45deg);
    }
    .hamburger.active span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .hamburger.active span:nth-child(3) {
      transform: translateY(-7.5px) rotate(-45deg);
    }
    .hamburger span {
      transform-origin: center;
      transition: 0.3s cubic-bezier(0.4,0,0.2,1);
    }
  `;
  document.head.appendChild(hamburgerStyle);

  // === SMOOTH SCROLL for anchor links ===
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerH = document.getElementById('header')?.offsetHeight || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  console.log('✅ Mulik Motor Driving School — Site loaded successfully!');
});

/* ============================================================
   GALLERY — Loads from localStorage, renders with filter + lightbox
   ============================================================ */
(function() {
  const GALLERY_KEY = 'mulik_gallery_data';
  const SETTINGS_KEY = 'mulik_site_settings';

  function getGallery() {
    try { return JSON.parse(localStorage.getItem(GALLERY_KEY) || '[]'); } catch(e) { return []; }
  }

  function getSettings() {
    try { return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}'); } catch(e) { return {}; }
  }

  function buildGallery() {
    var items   = getGallery();
    var grid    = document.getElementById('galleryGrid');
    var filters = document.getElementById('galleryFilters');
    var empty   = document.getElementById('galleryEmpty');
    if (!grid || !filters) return;

    if (!items.length) { if (empty) empty.style.display = 'block'; return; }
    if (empty) empty.style.display = 'none';

    // Collect unique categories
    var cats = ['all'];
    items.forEach(function(item) { if (item.category && !cats.includes(item.category)) cats.push(item.category); });

    // Build filter buttons
    filters.innerHTML = '';
    cats.forEach(function(cat) {
      var btn = document.createElement('button');
      btn.className = 'gallery-filter-btn' + (cat === 'all' ? ' active' : '');
      btn.setAttribute('data-cat', cat);
      btn.textContent = cat === 'all' ? 'All Photos' : cat;
      btn.onclick = function() {
        document.querySelectorAll('.gallery-filter-btn').forEach(function(b) { b.classList.remove('active'); });
        btn.classList.add('active');
        document.querySelectorAll('.gallery-item').forEach(function(el) {
          el.classList.toggle('hidden', cat !== 'all' && el.getAttribute('data-cat') !== cat);
        });
      };
      filters.appendChild(btn);
    });

    // Build grid items
    // Keep only the gallery items (remove empty state but keep it in DOM)
    Array.from(grid.querySelectorAll('.gallery-item')).forEach(function(el) { el.remove(); });

    items.forEach(function(item, idx) {
      var el = document.createElement('div');
      el.className = 'gallery-item';
      el.setAttribute('data-cat', item.category || '');
      el.setAttribute('data-idx', idx);
      el.innerHTML =
        '<img src="' + item.src + '" alt="' + (item.caption || '') + '" loading="lazy" />' +
        '<div class="gallery-item-overlay">' +
          '<div class="gallery-item-caption">' +
            (item.category ? '<span class="gallery-item-tag">' + item.category + '</span><br/>' : '') +
            (item.caption || '') +
          '</div>' +
        '</div>';
      el.onclick = function() { openLightbox(idx, items); };
      grid.appendChild(el);
    });
  }

  // Lightbox
  var currentIdx = 0;
  var currentItems = [];

  function openLightbox(idx, items) {
    currentIdx  = idx;
    currentItems = items;
    var lb = document.getElementById('galleryLightbox');
    if (!lb) return;
    lb.style.display = 'block';
    document.body.style.overflow = 'hidden';
    showLightboxItem(idx);
  }

  function showLightboxItem(idx) {
    var item = currentItems[idx];
    if (!item) return;
    var img  = document.getElementById('lightboxImg');
    var cap  = document.getElementById('lightboxCaption');
    if (img) img.src = item.src;
    if (cap) cap.textContent = (item.caption || '') + (item.category ? '  ·  ' + item.category : '');
    currentIdx = idx;
  }

  function closeLightbox() {
    var lb = document.getElementById('galleryLightbox');
    if (lb) lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function() {
    buildGallery();

    // Apply hero photo from settings
    var s = getSettings();
    if (s.heroPhotoUrl) {
      var wrap = document.getElementById('heroPhotoWrap');
      var img  = document.getElementById('heroPhoto');
      var def  = document.getElementById('heroDefault');
      if (wrap && img) { img.src = s.heroPhotoUrl; wrap.style.display = 'block'; }
      if (def) def.style.display = 'none';
    }

    // Apply gallery text settings
    if (s.galleryTag)   { var el = document.querySelector('[data-s="galleryTag"]');   if (el) el.textContent = s.galleryTag; }
    if (s.galleryTitle) { var el = document.querySelector('[data-s="galleryTitle"]'); if (el) el.textContent = s.galleryTitle; }
    if (s.gallerySub)   { var el = document.querySelector('[data-s="gallerySub"]');   if (el) el.textContent = s.gallerySub; }

    // Lightbox controls
    var closeBtn = document.getElementById('lightboxClose');
    var backdrop = document.getElementById('lightboxBackdrop');
    var prevBtn  = document.getElementById('lightboxPrev');
    var nextBtn  = document.getElementById('lightboxNext');
    if (closeBtn) closeBtn.onclick = closeLightbox;
    if (backdrop) backdrop.onclick = closeLightbox;
    if (prevBtn)  prevBtn.onclick  = function() { showLightboxItem((currentIdx - 1 + currentItems.length) % currentItems.length); };
    if (nextBtn)  nextBtn.onclick  = function() { showLightboxItem((currentIdx + 1) % currentItems.length); };

    // Keyboard nav
    document.addEventListener('keydown', function(e) {
      var lb = document.getElementById('galleryLightbox');
      if (!lb || lb.style.display === 'none') return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  showLightboxItem((currentIdx - 1 + currentItems.length) % currentItems.length);
      if (e.key === 'ArrowRight') showLightboxItem((currentIdx + 1) % currentItems.length);
    });
  });
})();
