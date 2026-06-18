/* ========================================
   Shagun Patel | Portfolio – script.js
   ======================================== */

'use strict';

/* ─── Cursor Glow ─────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
  cursorGlow.style.left = e.clientX + 'px';
  cursorGlow.style.top  = e.clientY + 'px';
});

/* ─── Theme Toggle ─────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const body        = document.body;

// Apply saved preference immediately (no flash)
if (localStorage.getItem('theme') === 'light') {
  body.classList.add('light');
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('light');
  localStorage.setItem('theme', body.classList.contains('light') ? 'light' : 'dark');
});

/* ─── Navbar scroll effect ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNav();
}, { passive: true });

/* ─── Hamburger menu ───────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── Active nav link on scroll ─────────────────────── */
const sections = ['home', 'about', 'skills', 'technologies', 'education', 'certifications', 'contact'];

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = 'home';

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

/* ─── Typewriter effect ─────────────────────────────── */
const phrases = [
  'Web Developer',
  'CS Student @ Parul University',
  'Cybersecurity Enthusiast',
  'Software Infrastructure Explorer',
  'REST API Builder'
];

const typeEl = document.getElementById('typewriter');
let pIndex = 0, cIndex = 0, isDeleting = false, typePause = false;

function type() {
  const phrase = phrases[pIndex];
  if (typePause) {
    setTimeout(type, 1500);
    typePause = false;
    isDeleting = true;
    return;
  }
  if (!isDeleting) {
    typeEl.textContent = phrase.slice(0, ++cIndex);
    if (cIndex === phrase.length) { typePause = true; setTimeout(type, 100); return; }
  } else {
    typeEl.textContent = phrase.slice(0, --cIndex);
    if (cIndex === 0) {
      isDeleting = false;
      pIndex = (pIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, isDeleting ? 50 : 80);
}
setTimeout(type, 1000);

/* ─── Scroll Reveal ─────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Skill card tilt effect ────────────────────────── */
document.querySelectorAll('.skill-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ─── Contact Form ─────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submit-form-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Basic validation
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!field.value.trim()) {
      field.style.borderColor = '#ef4444';
      valid = false;
    } else {
      field.style.borderColor = '';
    }
  });
  if (!valid) return;

  // Simulate send
  const btnText = submitBtn.querySelector('.btn-text');
  btnText.textContent = 'Sending…';
  submitBtn.disabled = true;

  setTimeout(() => {
    form.reset();
    btnText.textContent = 'Send Message';
    submitBtn.disabled = false;
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  }, 1400);
});

/* ─── Smooth counter animation for stats ────────────── */
function animateCounter(el, target, suffix = '') {
  let start = 0;
  const step = target / 40;
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    el.textContent = Math.round(start) + suffix;
    if (start >= target) clearInterval(timer);
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(numEl => {
        const raw = numEl.textContent.trim();
        const num = parseInt(raw.replace(/\D/g, ''));
        const suffix = raw.replace(/[0-9]/g, '');
        animateCounter(numEl, num, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const aboutSection = document.getElementById('about');
if (aboutSection) statsObserver.observe(aboutSection);

/* ─── Navbar logo click → scroll top ─────────────────── */
document.querySelector('.nav-logo').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Input focus ripple ─────────────────────────────── */
document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
  el.addEventListener('focus', function () {
    this.parentElement.classList.add('focused');
  });
  el.addEventListener('blur', function () {
    this.parentElement.classList.remove('focused');
  });
});
/* ─── Certificate Lightbox ────────────────────────────────── */
const certModal       = document.getElementById('certModal');
const certModalImg    = document.getElementById('certModalImg');
const certModalTitle  = document.getElementById('certModalTitle');
const certModalPH     = document.getElementById('certModalPlaceholder');

function openCertModal(src, title) {
  certModalTitle.textContent = title;
  certModalImg.classList.remove('loaded');
  certModalPH.style.display = 'none';
  certModalImg.style.display = 'none';

  certModalImg.onload = () => {
    certModalImg.classList.add('loaded');
    certModalImg.style.display = 'block';
    certModalPH.style.display = 'none';
  };
  certModalImg.onerror = () => {
    certModalImg.style.display = 'none';
    certModalPH.style.display = 'flex';
  };

  certModalImg.src = src;
  certModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCertModal(e) {
  if (e && e.target !== certModal && !e.target.classList.contains('cert-modal-close')) return;
  certModal.classList.remove('open');
  document.body.style.overflow = '';
  certModalImg.src = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCertModal({ target: certModal });
});
