// ── LIVE POD STATUS (homepage) ──────────────────────────────────
// Reflects real-time bookings from ClubSolution (via the /api/availability
// proxy) on the hero status chips and the 6 pod cards. The pods appear in the
// same order in the markup as the array below, so we map by position.
(function () {
  const PODS = [
    { name: 'GymPod 1', offset: 0  },
    { name: 'GymPod 2', offset: 15 },
    { name: 'GymPod 3', offset: 30 },
    { name: 'GymPod 4', offset: 45 },
    { name: 'HIITPod',  offset: 0  },
    { name: 'PowerPod', offset: 30 },
  ];

  function fmtTime(h, offset) {
    const suffix = offset === 0 ? '' : ':' + offset.toString().padStart(2, '0');
    if (h === 0)  return `12${suffix}am`;
    if (h < 12)   return `${h}${suffix}am`;
    if (h === 12) return `12${suffix}pm`;
    return `${h - 12}${suffix}pm`;
  }

  async function updateLivePodStatus() {
    const cards = document.querySelectorAll('.pods-grid .pod-card');
    const chips = document.querySelectorAll('.hero__pod-chips .pod-chip');
    if (!cards.length && !chips.length) return;

    const d = new Date();
    const todayISO = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const booked = new Set();
    try {
      const res = await fetch(`/api/availability?date=${todayISO}`);
      if (!res.ok) return; // leave existing markup if the feed is unavailable
      const json = await res.json();
      (json.booked || []).forEach(b => {
        const i = PODS.findIndex(p => p.name === b.pod);
        if (i !== -1) booked.add(`${i}-${b.hour}`);
      });
    } catch {
      return; // offline / opened as a file — leave existing markup
    }

    const nowHour = new Date().getHours();

    PODS.forEach((pod, i) => {
      const bookedNow = booked.has(`${i}-${nowHour}`);

      // Find the next free hour today, for the "Back at …" label.
      let backAt = null;
      if (bookedNow) {
        for (let h = nowHour + 1; h < 24; h++) {
          if (!booked.has(`${i}-${h}`)) { backAt = fmtTime(h, pod.offset); break; }
        }
      }

      const card = cards[i];
      if (card) {
        const status = card.querySelector('.pod-card__status');
        const btn = card.querySelector('.pod-card__footer .btn');
        if (status) {
          if (bookedNow) {
            card.classList.add('pod-card--in-use');
            status.classList.remove('pod-card__status--free');
            status.classList.add('pod-card__status--busy');
            status.innerHTML = '<span class="status-dot status-dot--busy"></span>In Use'
              + (backAt ? ' — Back at ' + backAt : ' — Back tomorrow');
          } else {
            card.classList.remove('pod-card--in-use');
            status.classList.remove('pod-card__status--busy');
            status.classList.add('pod-card__status--free');
            status.innerHTML = '<span class="status-dot status-dot--free"></span>Available Now';
          }
        }
        if (btn) {
          btn.textContent = bookedNow ? 'Book Later' : 'Book Now';
          btn.classList.toggle('btn--outline', bookedNow);
          btn.classList.toggle('btn--primary', !bookedNow);
        }
      }

      const chip = chips[i];
      if (chip) {
        chip.classList.toggle('pod-chip--busy', bookedNow);
        chip.classList.toggle('pod-chip--free', !bookedNow);
      }
    });
  }

  updateLivePodStatus();
  // Keep the homepage current without a manual refresh.
  setInterval(updateLivePodStatus, 60000);
}());
