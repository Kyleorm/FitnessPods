/* ═══════════════════════════════════════════════
   FITNESSPOD IOM — MAIN JS
═══════════════════════════════════════════════ */

/* ── NAV: scroll state ─────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── NAV: mobile toggle ────────────────────────── */
const toggle = document.querySelector('.nav__toggle');
const links  = document.getElementById('main-nav');

toggle.addEventListener('click', () => {
  const isOpen = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
  nav.classList.toggle('menu-open', isOpen);
});

links.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    links.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    nav.classList.remove('menu-open');
  });
});

/* ── PRICING TABS ──────────────────────────────── */
document.querySelectorAll('.pricing-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pricing-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pricing-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    const panel = document.getElementById(`tab-${tab.dataset.tab}`);
    if (panel) panel.classList.add('active');
  });
});

/* ── FAQ ACCORDION ─────────────────────────────── */
document.querySelectorAll('.faq__item').forEach(item => {
  const btn = item.querySelector('.faq__q');
  const body = item.querySelector('.faq__a');

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all others
    document.querySelectorAll('.faq__item.open').forEach(openItem => {
      if (openItem !== item) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq__q').setAttribute('aria-expanded', 'false');
      }
    });

    // Toggle this one
    item.classList.toggle('open', !isOpen);
    btn.setAttribute('aria-expanded', !isOpen);
  });
});

/* ── SCROLL REVEAL ─────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = parseInt(el.dataset.delay || '0', 10);
    setTimeout(() => {
      el.classList.add('visible');
    }, delay);
    revealObserver.unobserve(el);
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

/* ── STAT COUNTERS ─────────────────────────────── */
function animateCounter(el, target, prefix, suffix, duration) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    const current = Math.round(ease * target);
    el.textContent = (prefix || '') + current.toLocaleString() + (suffix || '');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    animateCounter(el, target, prefix, suffix, 1800);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.4 });

document.querySelectorAll('[data-count]').forEach(el => {
  counterObserver.observe(el);
});

/* ── MARQUEE: pause on hover ───────────────────── */
document.querySelectorAll('.marquee-track').forEach(track => {
  track.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  track.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
});

/* ── CONTACT FORM: client-side validation ──────── */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const name    = contactForm.querySelector('#contact-name').value.trim();
    const email   = contactForm.querySelector('#contact-email').value.trim();
    const message = contactForm.querySelector('#contact-message').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const msgEl   = document.getElementById('contact-form-msg');

    if (!name || !email || !message) {
      e.preventDefault();
      showContactMsg('Please fill in your name, email and message.', 'error');
      return;
    }
    if (!emailRegex.test(email)) {
      e.preventDefault();
      showContactMsg('Please enter a valid email address.', 'error');
      return;
    }
  });

  function showContactMsg(text, type) {
    const el = document.getElementById('contact-form-msg');
    el.textContent = text;
    el.style.display = 'block';
    el.style.background = type === 'error' ? 'rgba(232,24,26,0.15)' : 'rgba(34,197,94,0.15)';
    el.style.border = type === 'error' ? '1px solid rgba(232,24,26,0.4)' : '1px solid rgba(34,197,94,0.4)';
    el.style.color = type === 'error' ? '#ff6b6b' : '#4ade80';
  }
}
