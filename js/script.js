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