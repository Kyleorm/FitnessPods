/* ═══════════════════════════════════════════════
   FITNESSPOD IOM — CONTACT FORM
   Validates the homepage contact form, then sends it through Web3Forms.
   Nothing is sent until validation passes.
═══════════════════════════════════════════════ */

document.getElementById('contact-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const btn = document.getElementById('contact-submit');
  const msg = document.getElementById('contact-form-msg');
  const form = this;
  const errorStyle = 'display:block;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:0.9rem;background:rgba(212,32,40,0.12);color:#d42028;border:1px solid rgba(212,32,40,0.25)';

  // Validate before anything is sent, so empty or malformed messages never leave the browser.
  const name = form.querySelector('#contact-name').value.trim();
  const email = form.querySelector('#contact-email').value.trim();
  const message = form.querySelector('#contact-message').value.trim();
  if (!name || !email || !message) {
    msg.style.cssText = errorStyle;
    msg.textContent = 'Please fill in your name, email and message.';
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    msg.style.cssText = errorStyle;
    msg.textContent = 'Please enter a valid email address.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  const data = Object.fromEntries(new FormData(form));
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (result.success) {
      msg.style.cssText = 'display:block;padding:12px 16px;border-radius:8px;margin-bottom:16px;font-size:0.9rem;background:rgba(39,174,96,0.12);color:#4caf7d;border:1px solid rgba(39,174,96,0.25)';
      msg.textContent = "Message sent! We’ll be in touch shortly.";
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    msg.style.cssText = errorStyle;
    msg.textContent = 'Something went wrong. Please email us directly at enquiries@fitnesspod.im';
  } finally {
    btn.disabled = false;
    btn.innerHTML = 'Send Message <svg class="btn__icon" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
});
