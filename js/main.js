(function () {
  'use strict';

  /* ── Header scroll ── */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile nav ── */
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navMenu.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Scroll reveal (fallback when GSAP not loaded) ── */
  if (!window.__lufGsap) {
    const revealEls = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));

    document.querySelectorAll('.hero .reveal, .page-hero .reveal').forEach((el) => {
      requestAnimationFrame(() => el.classList.add('visible'));
    });
  }

  /* ── Counter animation (fallback when GSAP not loaded) ── */
  if (!window.__lufGsap) {
    document.querySelectorAll('[data-count]').forEach((el) => {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const target = parseInt(el.dataset.count, 10);
          const duration = 2000;
          const start = performance.now();
          const suffix = el.dataset.suffix || '+';

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + (progress >= 1 ? suffix : '');
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );
    counterObserver.observe(el);
    });
  }

  /* ── Prospectus download ── */
  document.querySelectorAll('[data-prospectus]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const content = `LEVEL UP FITNESS — COURSE PROSPECTUS 2026

Pakistan's Leading Fitness Education & Training Institute
Founded 2018 by Umar Farooq | REPs UK Accredited

COURSES:
• Diploma in Fitness Training — Level 1 & 2 (12-16 weeks)
• Diploma in Personal Training — Level 3 (16-20 weeks)
• Senior Citizen Fitness Specialist (8 weeks)
• Exercise Referral Specialist (10 weeks)
• Corporate Wellness Programs

CONTACT:
F-7 Markaz, Islamabad, Pakistan
Phone: 0325-5584546
Email: im.ur.coach@outlook.com
Web: www.levelupfitness.pk

Visit levelupfitness.pk/contact to enroll.`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Level-Up-Fitness-Prospectus-2026.txt';
      a.click();
      URL.revokeObjectURL(url);
    });
  });

  /* ── Contact form ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'corporate') {
      const courseSelect = contactForm.querySelector('#course');
      if (courseSelect) courseSelect.value = 'corporate';
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = 'Request Submitted!';
      btn.style.background = '#16a34a';
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }, 4000);
    });
  }

  /* ── Newsletter ── */
  document.querySelectorAll('#newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input');
      const placeholder = input.placeholder;
      input.value = '';
      input.placeholder = 'Subscribed!';
      setTimeout(() => { input.placeholder = placeholder; }, 3000);
    });
  });

  /* ── Certificate verification ── */
  const verifyForm = document.getElementById('verify-form');
  const verifyResult = document.getElementById('verify-result');
  if (verifyForm && verifyResult) {
    verifyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const certNum = document.getElementById('cert-number').value.trim();
      const name = document.getElementById('graduate-name').value.trim();

      verifyResult.hidden = false;
      if (certNum.toUpperCase().startsWith('LUF-')) {
        verifyResult.className = 'verify__result verify__result--valid';
        verifyResult.innerHTML = `<strong>✓ Certificate Verified</strong><p>${name} holds a valid Level Up Fitness qualification.<br>Certificate: ${certNum.toUpperCase()}</p>`;
      } else {
        verifyResult.className = 'verify__result verify__result--invalid';
        verifyResult.innerHTML = `<strong>✗ Not Found</strong><p>No matching certificate found. Please check the number and try again, or contact im.ur.coach@outlook.com</p>`;
      }
    });
  }
})();
