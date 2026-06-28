(function () {
  'use strict';

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const canAnimate = !prefersReducedMotion;

  gsap.registerPlugin(ScrollTrigger);
  window.__lufGsap = true;

  /* ── Dumbbell custom cursor (desktop only) ── */
  if (canAnimate && !isTouchDevice && window.innerWidth > 768) {
    document.body.classList.add('has-custom-cursor');

    const cursor = document.createElement('div');
    cursor.className = 'dumbbell-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = `
      <svg class="dumbbell-cursor__icon" viewBox="0 0 40 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="6" width="7" height="12" rx="2" fill="currentColor"/>
        <rect x="6" y="9" width="3" height="6" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="9" y="10.5" width="22" height="3" rx="1.5" fill="currentColor"/>
        <rect x="31" y="9" width="3" height="6" rx="1" fill="currentColor" opacity="0.6"/>
        <rect x="32" y="6" width="7" height="12" rx="2" fill="currentColor"/>
      </svg>
      <span class="dumbbell-cursor__ring"></span>
    `;
    document.body.appendChild(cursor);

    const icon = cursor.querySelector('.dumbbell-cursor__icon');
    const ring = cursor.querySelector('.dumbbell-cursor__ring');
    let mouseX = 0;
    let mouseY = 0;
    let prevX = 0;
    let prevY = 0;

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const setX = gsap.quickSetter(cursor, 'x', 'px');
    const setY = gsap.quickSetter(cursor, 'y', 'px');

    gsap.set(cursor, { xPercent: -50, yPercent: -50, opacity: 0 });
    gsap.to(cursor, { opacity: 1, duration: 0.4, delay: 0.3 });

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    }, { passive: true });

    gsap.ticker.add(() => {
      const dx = mouseX - prevX;
      const dy = mouseY - prevY;
      prevX = mouseX;
      prevY = mouseY;

      pos.x += (mouseX - pos.x) * 0.18;
      pos.y += (mouseY - pos.y) * 0.18;
      setX(pos.x);
      setY(pos.y);

      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        gsap.to(icon, { rotation: angle, duration: 0.3, ease: 'power2.out' });
      }
    });

    const interactiveSelector = 'a, button, .btn, input, select, textarea, [role="button"], .card, .nav__link, .whatsapp-btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.add('dumbbell-cursor--hover');
        gsap.to(ring, { scale: 1.6, opacity: 0.35, duration: 0.3, ease: 'power2.out' });
        gsap.to(icon, { scale: 1.25, duration: 0.3, ease: 'back.out(2)' });
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelector)) {
        cursor.classList.remove('dumbbell-cursor--hover');
        gsap.to(ring, { scale: 1, opacity: 0.2, duration: 0.3 });
        gsap.to(icon, { scale: 1, duration: 0.3 });
      }
    });

    document.addEventListener('mousedown', () => cursor.classList.add('dumbbell-cursor--click'));
    document.addEventListener('mouseup', () => cursor.classList.remove('dumbbell-cursor--click'));
  }

  if (!canAnimate) return;

  /* ── Header entrance ── */
  const header = document.getElementById('header');
  if (header) {
    gsap.from(header, {
      y: -100,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.1,
    });
  }

  /* ── Hero parallax & entrance ── */
  const hero = document.querySelector('.hero, .page-hero');
  if (hero) {
    const heroBg = hero.querySelector('.hero__gradient, .page-hero__bg');
    const heroGrid = hero.querySelector('.hero__grid');
    const heroReveals = hero.querySelectorAll('.reveal');

    if (heroBg) {
      gsap.to(heroBg, {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    if (heroGrid) {
      gsap.to(heroGrid, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }

    gsap.set(heroReveals, { opacity: 0, y: 40 });
    gsap.to(heroReveals, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2,
      onComplete: () => heroReveals.forEach((el) => el.classList.add('visible')),
    });
  }

  /* ── Scroll-triggered reveals ── */
  const staggerGridSelector = '.why__grid, .courses-preview__grid, .partners__grid, .blog__grid, .stories__grid';
  const scrollReveals = document.querySelectorAll('.reveal');
  scrollReveals.forEach((el) => {
    if (hero && hero.contains(el)) return;
    if (el.closest(staggerGridSelector)) return;
    if (el.closest('.cta-banner')) return;

    gsap.set(el, { opacity: 0, y: 50 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      onComplete: () => el.classList.add('visible'),
    });
  });

  /* ── Staggered grid cards ── */
  document.querySelectorAll('.why__grid, .courses-preview__grid, .partners__grid, .blog__grid, .stories__grid').forEach((grid) => {
    const cards = grid.querySelectorAll('.card, .partners__logo, .blog-card, .story-card');
    if (!cards.length) return;

    gsap.set(grid, { opacity: 1 });
    grid.classList.add('visible');
    gsap.set(cards, { opacity: 0, y: 40, scale: 0.96 });
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: grid,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── Section headers accent line ── */
  document.querySelectorAll('.section__label').forEach((label) => {
    gsap.from(label, {
      x: -30,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: label,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
    });
  });

  /* ── CTA banner scale-in ── */
  document.querySelectorAll('.cta-banner__inner').forEach((cta) => {
    gsap.set(cta, { opacity: 1, scale: 1 });
    gsap.from(cta, {
      scale: 0.92,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cta.closest('.cta-banner') || cta,
        start: 'top 90%',
        toggleActions: 'play none none none',
      },
      onComplete: () => cta.classList.add('visible'),
    });
  });

  /* ── Counter animation (GSAP) ── */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '+';
    const counter = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.floor(counter.val).toLocaleString() + suffix;
          },
        });
      },
    });
  });

  /* ── Magnetic buttons ── */
  document.querySelectorAll('.btn--primary, .btn--white').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });

  /* ── Card tilt on hover ── */
  document.querySelectorAll('.card--feature, .card--course').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 800,
        duration: 0.4,
        ease: 'power2.out',
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  });

  /* ── WhatsApp button pulse ── */
  const waBtn = document.querySelector('.whatsapp-btn');
  if (waBtn) {
    gsap.to(waBtn, {
      scale: 1.08,
      duration: 1.2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });
  }
})();
