/* ════════════════════════════════════════════════════════════════
   Shagun Patel — Portfolio · script.js
   Clean, structured JS matching the new flat design system
   ════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Theme Toggle (dark / light) ────────────────────────────────── */
const THEME_KEY   = 'sp-theme';
const htmlEl      = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

// Apply saved theme immediately (no flash)
const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) htmlEl.setAttribute('data-theme', savedTheme);

function toggleTheme() {
  const isLight = htmlEl.getAttribute('data-theme') === 'light';
  const next    = isLight ? 'dark' : 'light';
  if (next === 'dark') {
    htmlEl.removeAttribute('data-theme');
  } else {
    htmlEl.setAttribute('data-theme', next);
  }
  localStorage.setItem(THEME_KEY, next);
  themeToggle?.setAttribute('aria-label',
    next === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
  );
}

themeToggle?.addEventListener('click', toggleTheme);

/* ─── Navbar: scroll state ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  syncActiveNav();
}, { passive: true });

/* ─── Active nav link tracking ──────────────────────────────────── */
const NAV_SECTIONS = ['home', 'about', 'skills', 'technologies', 'education', 'certifications', 'contact'];

function syncActiveNav() {
  const offset = window.scrollY + 120;
  let current = 'home';

  NAV_SECTIONS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= offset) current = id;
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

/* ─── Hamburger menu ────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close on nav link click
navLinks?.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', e => {
  if (navLinks?.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      e.target !== hamburger &&
      !hamburger?.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  }
});

/* ─── Typewriter ────────────────────────────────────────────────── */
const PHRASES = [
  'Web Developer',
  'CS Student · Parul University',
  'Cybersecurity Enthusiast',
  'Software Infrastructure Explorer',
  'REST API Builder'
];

const typeEl = document.getElementById('typewriter');
let pIdx = 0, cIdx = 0, deleting = false, paused = false;

function runTypewriter() {
  if (!typeEl) return;
  const phrase = PHRASES[pIdx];

  if (paused) {
    paused = false;
    deleting = true;
    setTimeout(runTypewriter, 1600);
    return;
  }

  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++cIdx);
    if (cIdx === phrase.length) { paused = true; setTimeout(runTypewriter, 100); return; }
  } else {
    typeEl.textContent = phrase.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      pIdx = (pIdx + 1) % PHRASES.length;
    }
  }
  setTimeout(runTypewriter, deleting ? 45 : 75);
}
setTimeout(runTypewriter, 900);

/* ─── Scroll reveal ─────────────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 70);
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -48px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── Tech bar animation on reveal ─────────────────────────────── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('bar-visible'), 100);
      barObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.tech-bar').forEach(bar => barObs.observe(bar));

/* ─── Contact form ──────────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submit-form-btn');

form?.addEventListener('submit', (e) => {
  e.preventDefault();

  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const ok = field.value.trim().length > 0;
    field.style.borderColor = ok ? '' : '#666';
    if (!ok) valid = false;
  });
  if (!valid) return;

  const btnText = submitBtn?.querySelector('.btn-text');
  if (btnText) btnText.textContent = 'Sending…';
  if (submitBtn) submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    form.querySelectorAll('input, textarea').forEach(f => f.style.borderColor = '');
    if (btnText) btnText.textContent = 'Send Message';
    if (submitBtn) submitBtn.disabled = false;
    formSuccess?.classList.add('show');
    setTimeout(() => formSuccess?.classList.remove('show'), 5000);
  }, 1400);
});

/* ─── Certificate lightbox ──────────────────────────────────────── */
const certModal      = document.getElementById('certModal');
const certModalImg   = document.getElementById('certModalImg');
const certModalTitle = document.getElementById('certModalTitle');
const certModalPH    = document.getElementById('certModalPlaceholder');

function openCertModal(src, title) {
  if (!certModal) return;
  certModalTitle.textContent = title;
  certModalImg.classList.remove('loaded');
  certModalImg.style.display = 'none';
  certModalPH.style.display  = 'none';

  certModalImg.onload = () => {
    certModalImg.classList.add('loaded');
    certModalImg.style.display = 'block';
  };
  certModalImg.onerror = () => {
    certModalImg.style.display = 'none';
    certModalPH.style.display  = 'flex';
  };

  certModalImg.src = src;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
  if (e && e.target !== certModal && !e.target.classList.contains('cert-modal-close') && !e.target.closest('.cert-modal-close')) return;
  certModal?.classList.remove('open');
  document.body.style.overflow = '';
  if (certModalImg) certModalImg.src = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && certModal?.classList.contains('open')) {
    closeCertModal({ target: certModal });
  }
});

/* ─── Logo click → scroll top ───────────────────────────────────── */
document.getElementById('nav-logo-link')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
