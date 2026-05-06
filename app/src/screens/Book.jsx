import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const PODS = [
  { index: 0, name: 'FitnessPod 1', short: 'Pod 1', type: 'Cardio & Conditioning', minuteOffset: 0  },
  { index: 1, name: 'FitnessPod 2', short: 'Pod 2', type: 'Cardio & Conditioning', minuteOffset: 15 },
  { index: 2, name: 'FitnessPod 3', short: 'Pod 3', type: 'Strength & Cardio',     minuteOffset: 30 },
  { index: 3, name: 'FitnessPod 4', short: 'Pod 4', type: 'Upgraded Equipment',    minuteOffset: 45 },
  { index: 4, name: 'HIITPod',      short: 'HIIT',  type: 'High Intensity',        minuteOffset: 0  },
  { index: 5, name: 'PowerPod',     short: 'Power', type: 'Strength & Power',      minuteOffset: 30 },
];

const LOCK_DURATION_SECS = 600; // 10 minutes

function getNext7Days() {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      iso: d.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-GB', { weekday: 'short' }),
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    });
  }
  return days;
}

function fmtSlotTime(hour, offset) {
  const pad = n => String(n).padStart(2, '0');
  const startMins = hour * 60 + offset;
  const endMins   = startMins + 60;
  return {
    start: `${pad(Math.floor(startMins / 60) % 24)}:${pad(startMins % 60)}`,
    end:   `${pad(Math.floor(endMins   / 60) % 24)}:${pad(endMins   % 60)}`,
  };
}

function isEveningSlot(hour, offset) {
  return (hour * 60 + offset) >= 990; // 16:30 onwards
}

function fmtCountdown(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function Book() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { profile } = useAuth();
  const sessionId = useRef(crypto.randomUUID());

  const initPodIndex = location.state?.podIndex ?? 0;
  const [step,          setStep]          = useState(0);
  const [selectedPod,   setSelectedPod]   = useState(initPodIndex);
  const [selectedDate,  setSelectedDate]  = useState(getNext7Days()[0].iso);
  const [selectedHour,  setSelectedHour]  = useState(null);
  const [takenHours,    setTakenHours]    = useState(new Set());
  const [loadingSlots,  setLoadingSlots]  = useState(false);
  const [locking,       setLocking]       = useState(false);
  const [lockError,     setLockError]     = useState('');
  const [countdown,     setCountdown]     = useState(LOCK_DURATION_SECS);
  const countdownRef    = useRef(null);
  const tabsRef         = useRef(null);
  const days            = getNext7Days();
  const chosenPod       = PODS[selectedPod];

  // Fetch availability whenever pod or date changes
  const fetchAvailability = useCallback(async () => {
    setLoadingSlots(true);
    const [bookingsRes, locksRes] = await Promise.all([
      supabase.from('bookings').select('booking_hour').eq('pod_index', selectedPod).eq('booking_date', selectedDate).eq('status', 'confirmed').is('deleted_at', null),
      supabase.from('slot_locks').select('booking_hour').eq('pod_index', selectedPod).eq('booking_date', selectedDate).gt('expires_at', new Date().toISOString()),
    ]);
    const taken = new Set([
      ...(bookingsRes.data || []).map(b => b.booking_hour),
      ...(locksRes.data   || []).map(l => l.booking_hour),
    ]);
    setTakenHours(taken);
    setLoadingSlots(false);
  }, [selectedPod, selectedDate]);

  useEffect(() => {
    fetchAvailability();
    setSelectedHour(null);
  }, [fetchAvailability]);

  // Release lock on unmount
  useEffect(() => {
    return () => {
      clearInterval(countdownRef.current);
      if (step === 1) releaseLock();
    };
  }, [step]);

  async function releaseLock() {
    if (selectedHour === null) return;
    await supabase.from('slot_locks').delete()
      .eq('pod_index', selectedPod)
      .eq('booking_date', selectedDate)
      .eq('booking_hour', selectedHour)
      .eq('session_id', sessionId.current);
  }

  async function handleContinue() {
    if (selectedHour === null) return;
    setLocking(true);
    setLockError('');

    const { data: locked, error } = await supabase.rpc('try_lock_slot', {
      p_pod_index:    selectedPod,
      p_booking_date: selectedDate,
      p_booking_hour: selectedHour,
      p_session_id:   sessionId.current,
    });

    setLocking(false);

    if (error || !locked) {
      setLockError('This slot was just taken. Please choose another time.');
      await fetchAvailability();
      setSelectedHour(null);
      return;
    }

    // Start 10-minute countdown
    setCountdown(LOCK_DURATION_SECS);
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          setStep(0);
          setSelectedHour(null);
          setLockError('Your slot hold expired. Please select a time again.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    setStep(1);
  }

  function handleBack() {
    clearInterval(countdownRef.current);
    releaseLock();
    setStep(0);
  }

  function scrollTabIntoView(idx) {
    const container = tabsRef.current;
    if (!container) return;
    const tab = container.children[idx];
    if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const isToday = selectedDate === getNext7Days()[0].iso;

  // Build slot list for chosen pod (hours 6–22 only for display)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  const slots = hours.map(h => {
    const { start, end } = fmtSlotTime(h, chosenPod.minuteOffset);
    const slotStartMins  = h * 60 + chosenPod.minuteOffset;
    const past    = isToday && slotStartMins <= nowMins;
    const taken   = takenHours.has(h);
    const evening = isEveningSlot(h, chosenPod.minuteOffset);
    return { hour: h, start, end, price: evening ? '£10.50' : '£7', points: evening ? '1.5pts' : '1pt', past, taken };
  });

  const chosenSlot = slots.find(s => s.hour === selectedHour);
  const isEvening  = chosenSlot ? isEveningSlot(chosenSlot.hour, chosenPod.minuteOffset) : false;

  // ── STEP 0: Select pod, date, time ──
  if (step === 0) {
    return (
      <div className="screen" style={s.screen}>
        <div style={s.header}>
          <h1 style={s.title} className="fade-up">Book a <span style={{ color: 'var(--red)' }}>Pod.</span></h1>
        </div>

        <div style={s.tabBar} ref={tabsRef}>
          {PODS.map((pod, idx) => {
            const active = selectedPod === pod.index;
            return (
              <button key={pod.index} style={{ ...s.tab, borderColor: active ? 'var(--red)' : 'var(--w10)', background: active ? 'rgba(232,24,26,0.1)' : 'var(--bg2)', color: active ? 'var(--white)' : 'var(--w40)' }}
                onClick={() => { setSelectedPod(pod.index); setSelectedHour(null); scrollTabIntoView(idx); }}>
                {pod.short}
              </button>
            );
          })}
        </div>

        <div style={s.podStrip}>
          <div style={s.podStripLeft}>
            <p style={s.podStripName}>{chosenPod.name}</p>
            <p style={s.podStripType}>{chosenPod.type}</p>
          </div>
        </div>

        <div style={s.body}>
          <p style={s.sectionLabel}>Pick a date</p>
          <div style={s.dayScroll}>
            {days.map(d => (
              <button key={d.iso} style={{ ...s.dayBtn, borderColor: selectedDate === d.iso ? 'var(--red)' : 'var(--w10)', background: selectedDate === d.iso ? 'rgba(232,24,26,0.1)' : 'var(--bg2)', color: selectedDate === d.iso ? 'var(--white)' : 'var(--w60)' }}
                onClick={() => { setSelectedDate(d.iso); setSelectedHour(null); }}>
                <span style={s.dayLabel}>{d.label}</span>
                <span style={s.dayDate}>{d.date}</span>
              </button>
            ))}
          </div>

          <p style={{ ...s.sectionLabel, marginTop: '20px' }}>Pick a time</p>
          <div style={s.priceLegend}>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: 'var(--w40)' }} />£7 — before 4:30pm</span>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: 'var(--red)' }} />£10.50 — 4:30pm+</span>
          </div>

          {loadingSlots ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '32px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', border: '2px solid var(--w10)', borderTopColor: 'var(--red)', animation: 'spin 0.8s linear infinite' }} />
            </div>
          ) : (
            <div style={s.slotGrid}>
              {slots.map(slot => {
                const active   = selectedHour === slot.hour;
                const disabled = slot.past || slot.taken;
                return (
                  <button key={slot.hour} style={{ ...s.slot, borderColor: active ? 'var(--red)' : 'var(--w10)', background: active ? 'rgba(232,24,26,0.12)' : 'var(--bg2)', opacity: disabled ? 0.3 : 1, cursor: disabled ? 'not-allowed' : 'pointer' }}
                    disabled={disabled} onClick={() => { setSelectedHour(slot.hour); setLockError(''); }}>
                    <span style={s.slotTime}>{slot.start}</span>
                    <span style={{ ...s.slotPrice, color: isEveningSlot(slot.hour, chosenPod.minuteOffset) ? 'var(--red)' : 'var(--w40)' }}>{slot.price}</span>
                    <span style={s.slotPoints}>{slot.points}</span>
                    {slot.taken && <span style={s.slotBusyLabel}>Full</span>}
                  </button>
                );
              })}
            </div>
          )}

          {lockError && <p style={s.errorMsg}>{lockError}</p>}

          <div style={s.stickyFooter}>
            {selectedHour !== null && (
              <div style={s.selectionSummary}>
                <span style={s.summaryPod}>{chosenPod.short}</span>
                <span style={s.summaryDivider}>·</span>
                <span style={s.summaryTime}>{chosenSlot?.start}–{chosenSlot?.end}</span>
                <span style={s.summaryDivider}>·</span>
                <span style={s.summaryPrice}>{isEvening ? '£10.50' : '£7'}</span>
              </div>
            )}
            <button className="btn btn--primary btn--block" style={{ opacity: selectedHour !== null && !locking ? 1 : 0.4 }}
              disabled={selectedHour === null || locking} onClick={handleContinue}>
              {locking ? 'Securing slot…' : 'Continue to Review'}
            </button>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── STEP 1: Review ──
  return (
    <div className="screen">
      <div style={s.header}>
        <button style={s.backBtn} onClick={handleBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 5L8 10L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 style={s.title} className="fade-up">Review <span style={{ color: 'var(--red)' }}>Booking.</span></h1>
      </div>

      {/* Countdown banner */}
      <div style={{ ...s.countdownBanner, borderColor: countdown < 120 ? 'rgba(212,32,40,0.4)' : 'rgba(245,158,11,0.3)', background: countdown < 120 ? 'rgba(212,32,40,0.08)' : 'rgba(245,158,11,0.06)' }}>
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
          <circle cx="10" cy="10" r="8" stroke={countdown < 120 ? 'var(--red)' : '#f59e0b'} strokeWidth="1.5"/>
          <path d="M10 6v5l3 2" stroke={countdown < 120 ? 'var(--red)' : '#f59e0b'} strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <p style={{ ...s.countdownText, color: countdown < 120 ? 'var(--red)' : '#f59e0b' }}>
          Slot held for <strong>{fmtCountdown(countdown)}</strong> — complete your booking before it expires
        </p>
      </div>

      <div style={s.body}>
        <div style={s.reviewCard} className="card">
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Pod</span>
            <span style={s.reviewValue}>{chosenPod.name}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Type</span>
            <span style={s.reviewValue}>{chosenPod.type}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Date</span>
            <span style={s.reviewValue}>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Time</span>
            <span style={s.reviewValue}>{chosenSlot?.start} – {chosenSlot?.end}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Duration</span>
            <span style={s.reviewValue}>1 hour</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Capacity</span>
            <span style={s.reviewValue}>Up to 3 people</span>
          </div>
          <div style={{ ...s.reviewDivider, background: 'var(--w10)' }} />
          <div style={s.reviewRow}>
            <span style={{ ...s.reviewLabel, fontWeight: 700, color: 'var(--white)' }}>Total</span>
            <span style={{ ...s.reviewValue, fontFamily: 'var(--font-head)', fontSize: '1.6rem', color: 'var(--red)' }}>
              {isEvening ? '£10.50' : '£7.00'}
            </span>
          </div>
        </div>

        <div style={s.notice}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: '2px' }}>
            <circle cx="10" cy="10" r="8" stroke="var(--w40)" strokeWidth="1.5"/>
            <path d="M10 9v5M10 7h.01" stroke="var(--w40)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <p style={s.noticeText}>Your door code will be sent to your email immediately after payment is confirmed.</p>
        </div>

        <button className="btn btn--primary btn--block" style={{ marginTop: '16px' }}
          onClick={() => navigate('/book/confirm', { state: { podIndex: selectedPod, date: selectedDate, hour: selectedHour, sessionId: sessionId.current } })}>
          Pay {isEvening ? '£10.50' : '£7.00'} — Secure360Pay
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const s = {
  screen: { display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' },
  header: { padding: '56px 20px 16px', borderBottom: '1px solid var(--w06)', flexShrink: 0 },
  title: { fontFamily: 'var(--font-head)', fontSize: '2.8rem', lineHeight: 1, letterSpacing: '0.02em' },
  backBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', color: 'var(--w60)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', padding: 0, marginBottom: '12px', fontFamily: 'var(--font-body)' },
  tabBar: { display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', padding: '12px 16px', borderBottom: '1px solid var(--w06)', flexShrink: 0 },
  tab: { display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '20px', border: '1px solid', fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0, cursor: 'pointer', fontFamily: 'var(--font-body)', transition: 'all 0.2s' },
  podStrip: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', background: 'var(--bg2)', borderBottom: '1px solid var(--w06)', flexShrink: 0 },
  podStripLeft: { display: 'flex', flexDirection: 'column', gap: '1px' },
  podStripName: { fontSize: '0.88rem', fontWeight: 700, color: 'var(--white)' },
  podStripType: { fontSize: '0.72rem', color: 'var(--w40)' },
  body: { flex: 1, overflowY: 'auto', padding: '16px 16px 0' },
  sectionLabel: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--w40)', marginBottom: '10px' },
  dayScroll: { display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' },
  dayBtn: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 14px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s', fontFamily: 'var(--font-body)' },
  dayLabel: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  dayDate: { fontSize: '0.72rem', color: 'var(--w40)' },
  priceLegend: { display: 'flex', gap: '16px', marginBottom: '10px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.7rem', color: 'var(--w40)' },
  legendDot: { width: '6px', height: '6px', borderRadius: '50%' },
  slotGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', paddingBottom: '8px' },
  slot: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '10px 6px', borderRadius: '10px', border: '1px solid', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-body)', position: 'relative' },
  slotTime: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--white)' },
  slotPrice: { fontSize: '0.68rem', fontWeight: 600 },
  slotPoints: { fontSize: '0.62rem', fontWeight: 600, color: '#f5c842', letterSpacing: '0.02em' },
  slotBusyLabel: { position: 'absolute', top: '3px', right: '4px', fontSize: '0.55rem', fontWeight: 700, color: 'var(--red)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  errorMsg: { fontSize: '0.82rem', color: 'var(--red)', background: 'rgba(212,32,40,0.1)', border: '1px solid rgba(212,32,40,0.3)', borderRadius: '8px', padding: '10px 14px', marginTop: '12px', lineHeight: 1.4 },
  stickyFooter: { position: 'sticky', bottom: 0, background: 'var(--bg)', paddingTop: '12px', paddingBottom: '24px', borderTop: '1px solid var(--w06)', marginTop: '12px' },
  selectionSummary: { display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', marginBottom: '10px' },
  summaryPod: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--white)' },
  summaryDivider: { fontSize: '0.82rem', color: 'var(--w30)' },
  summaryTime: { fontSize: '0.82rem', color: 'var(--w60)' },
  summaryPrice: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--red)' },
  countdownBanner: { display: 'flex', alignItems: 'center', gap: '10px', margin: '12px 16px 0', padding: '10px 14px', borderRadius: '10px', border: '1px solid' },
  countdownText: { fontSize: '0.78rem', lineHeight: 1.4 },
  reviewCard: { marginBottom: '16px' },
  reviewRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' },
  reviewLabel: { fontSize: '0.82rem', color: 'var(--w60)' },
  reviewValue: { fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)', textAlign: 'right' },
  reviewDivider: { height: '1px', background: 'var(--w06)', margin: '0 16px' },
  notice: { display: 'flex', gap: '10px', padding: '12px 14px', background: 'var(--w06)', borderRadius: '10px', marginTop: '4px' },
  noticeText: { fontSize: '0.78rem', color: 'var(--w60)', lineHeight: 1.5 },
};
