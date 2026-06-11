
'use strict';

(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Shrink navbar
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(a => {
      a.classList.remove('active');
      if (a.getAttribute('href') === `#${current}`) {
        a.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


(function initBurger() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    // Prevent body scroll when menu open
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !burger.contains(e.target)) {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();


/* ── SCROLL REVEAL ── */
(function initScrollReveal() {
  // Add .reveal to elements we want to animate
  const selectors = [
    '#about .about-text',
    '#about .about-visual',
    '#about .edu-card',
    '#skills .skill-group',
    '#projects .project-card',
    '#achievements .ach-card',
    '#contact .contact-item',
    '#contact .contact-form',
    '#contact .contact-intro',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 80}ms`;
    });
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, idx * 100);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  items.forEach(item => observer.observe(item));
})();


/* ── CONTACT FORM VALIDATION ── */
(function initContactForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  const fields = {
    name:    { el: null, err: null, validate: v => v.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).' },
    email:   { el: null, err: null, validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
    message: { el: null, err: null, validate: v => v.trim().length >= 10 ? '' : 'Message must be at least 10 characters.' },
  };

  // Wire up elements
  Object.keys(fields).forEach(key => {
    fields[key].el  = document.getElementById(key);
    fields[key].err = document.getElementById(key + 'Error');
  });

  function validateField(key) {
    const { el, err, validate } = fields[key];
    const msg = validate(el.value);
    err.textContent = msg;
    el.classList.toggle('error', !!msg);
    return !msg;
  }

  // Inline validation on blur
  Object.keys(fields).forEach(key => {
    fields[key].el.addEventListener('blur', () => validateField(key));
    fields[key].el.addEventListener('input', () => {
      if (fields[key].el.classList.contains('error')) validateField(key);
    });
  });

  // Submit
  form.addEventListener('submit', e => {
    e.preventDefault();

    const valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) return;

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    setTimeout(() => {
      form.reset();
      Object.keys(fields).forEach(key => {
        fields[key].el.classList.remove('error');
        fields[key].err.textContent = '';
      });
      btn.disabled = false;
      btn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      success.classList.add('show');

      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1200);
  });
})();


(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


(function initParallax() {
  const ring = document.querySelector('.avatar-ring');
  if (!ring || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    ring.style.transform = `translate(${dx * 12}px, ${dy * 8}px)`;
  });
})();


(function addActiveStyle() {
  const style = document.createElement('style');
  style.textContent = '.nav-links a.active { color: var(--red); } .nav-links a.active::after { width: 100%; }';
  document.head.appendChild(style);
})();
