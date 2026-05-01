import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const pods = [
  { id: 1, name: 'FitnessPod 1', short: 'Pod 1', type: 'Cardio & Conditioning', free: true,  minuteOffset: 0  },
  { id: 2, name: 'FitnessPod 2', short: 'Pod 2', type: 'Cardio & Conditioning', free: true,  minuteOffset: 15 },
  { id: 3, name: 'FitnessPod 3', short: 'Pod 3', type: 'Strength & Cardio',     free: false, minuteOffset: 30 },
  { id: 4, name: 'FitnessPod 4', short: 'Pod 4', type: 'Upgraded Equipment',    free: true,  minuteOffset: 45 },
  { id: 5, name: 'HIITPod',      short: 'HIIT',  type: 'High Intensity',        free: false, minuteOffset: 0  },
  { id: 6, name: 'PowerPod',     short: 'Power', type: 'Strength & Power',      free: true,  minuteOffset: 30 },
];

function getTimeSlots(date, minuteOffset) {
  const slots = [];
  const isToday = date === new Date().toISOString().split('T')[0];
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (let h = 0; h < 24; h++) {
    const startMins = h * 60 + minuteOffset;
    const slotHour = Math.floor(startMins / 60) % 24;
    const slotMin = startMins % 60;
    const timeStr = `${slotHour.toString().padStart(2,'0')}:${slotMin.toString().padStart(2,'0')}`;
    const endHour = Math.floor((startMins + 60) / 60) % 24;
    const endMin = (startMins + 60) % 60;
    const endStr = `${endHour.toString().padStart(2,'0')}:${endMin.toString().padStart(2,'0')}`;
    const past = isToday && startMins <= nowMins;
    const price = slotHour >= 16 ? '£10.50' : '£7';
    const points = slotHour >= 16 ? '1.5pts' : '1pt';
    slots.push({ time: timeStr, end: endStr, price, points, past, busy: Math.random() < 0.45 });
  }
  return slots;
}

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

export default function Book() {
  const location = useLocation();
  const navigate = useNavigate();
  const initPod = location.state?.podId || pods.find(p => p.free)?.id || pods[0].id;

  const [step, setStep] = useState(0);
  const [selectedPod, setSelectedPod] = useState(initPod);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].iso);
  const [selectedTime, setSelectedTime] = useState(null);
  const tabsRef = useRef(null);

  const days = getNext7Days();
  const chosenPod = pods.find(p => p.id === selectedPod);
  const slots = getTimeSlots(selectedDate, chosenPod?.minuteOffset ?? 0);
  const chosenSlot = slots.find(s => s.time === selectedTime);
  const isEvening = selectedTime && parseInt(selectedTime) >= 16;

  function selectPod(pod) {
    setSelectedPod(pod.id);
    setSelectedTime(null);
  }

  function scrollTabIntoView(idx) {
    const container = tabsRef.current;
    if (!container) return;
    const tab = container.children[idx];
    if (tab) tab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  // Step 0: Pod tabs + date + time
  if (step === 0) {
    return (
      <div className="screen" style={s.screen}>
        <div style={s.header}>
          <h1 style={s.title} className="fade-up">Book a <span style={{ color: 'var(--red)' }}>Pod.</span></h1>
        </div>

        {/* Sticky pod tab bar */}
        <div style={s.tabBar} ref={tabsRef}>
          {pods.map((pod, idx) => {
            const active = selectedPod === pod.id;
            return (
              <button
                key={pod.id}
                style={{
                  ...s.tab,
                  borderColor: active ? 'var(--red)' : 'var(--w10)',
                  background: active ? 'rgba(232,24,26,0.1)' : 'var(--bg2)',
                  color: active ? 'var(--white)' : 'var(--w40)',
                }}
                onClick={() => { selectPod(pod); scrollTabIntoView(idx); }}
              >
                <span style={{ ...s.tabDot, background: pod.free ? '#22c55e' : '#ef4444' }} />
                {pod.short}
              </button>
            );
          })}
        </div>

        {/* Pod info strip */}
        <div style={s.podStrip}>
          <div style={s.podStripLeft}>
            <p style={s.podStripName}>{chosenPod?.name}</p>
            <p style={s.podStripType}>{chosenPod?.type}</p>
          </div>
          <span style={{ ...s.podStripStatus, color: chosenPod?.free ? '#22c55e' : '#ef4444' }}>
            <span style={{ ...s.statusDot, background: chosenPod?.free ? '#22c55e' : '#ef4444' }} />
            {chosenPod?.free ? 'Available' : 'Occupied'}
          </span>
        </div>

        <div style={s.body}>
          {/* Date picker */}
          <p style={s.sectionLabel}>Pick a date</p>
          <div style={s.dayScroll}>
            {days.map(d => (
              <button
                key={d.iso}
                style={{
                  ...s.dayBtn,
                  borderColor: selectedDate === d.iso ? 'var(--red)' : 'var(--w10)',
                  background: selectedDate === d.iso ? 'rgba(232,24,26,0.1)' : 'var(--bg2)',
                  color: selectedDate === d.iso ? 'var(--white)' : 'var(--w60)',
                }}
                onClick={() => { setSelectedDate(d.iso); setSelectedTime(null); }}
              >
                <span style={s.dayLabel}>{d.label}</span>
                <span style={s.dayDate}>{d.date}</span>
              </button>
            ))}
          </div>

          {/* Time slots */}
          <p style={{ ...s.sectionLabel, marginTop: '20px' }}>Pick a time</p>
          <div style={s.priceLegend}>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: 'var(--w40)' }} />£7 — before 4pm</span>
            <span style={s.legendItem}><span style={{ ...s.legendDot, background: 'var(--red)' }} />£10.50 — 4pm onwards</span>
          </div>
          <div style={s.slotGrid}>
            {slots.map(slot => {
              const active = selectedTime === slot.time;
              const disabled = slot.past || slot.busy;
              return (
                <button
                  key={slot.time}
                  style={{
                    ...s.slot,
                    borderColor: active ? 'var(--red)' : 'var(--w10)',
                    background: active ? 'rgba(232,24,26,0.12)' : 'var(--bg2)',
                    opacity: disabled ? 0.3 : 1,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                  }}
                  disabled={disabled}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <span style={s.slotTime}>{slot.time}</span>
                  <span style={{ ...s.slotPrice, color: parseInt(slot.time) >= 16 ? 'var(--red)' : 'var(--w40)' }}>
                    {slot.price}
                  </span>
                  <span style={s.slotPoints}>{slot.points}</span>
                  {slot.busy && <span style={s.slotBusyLabel}>Full</span>}
                </button>
              );
            })}
          </div>

          <div style={s.stickyFooter}>
            {selectedTime && (
              <div style={s.selectionSummary}>
                <span style={s.summaryPod}>{chosenPod?.short || chosenPod?.name}</span>
                <span style={s.summaryDivider}>·</span>
                <span style={s.summaryTime}>{selectedTime}–{chosenSlot?.end}</span>
                <span style={s.summaryDivider}>·</span>
                <span style={s.summaryPrice}>{isEvening ? '£10.50' : '£7'}</span>
              </div>
            )}
            <button
              className="btn btn--primary btn--block"
              style={{ opacity: selectedTime ? 1 : 0.4 }}
              disabled={!selectedTime}
              onClick={() => setStep(1)}
            >
              Continue to Review
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 1: Review & Pay
  return (
    <div className="screen">
      <div style={s.header}>
        <button style={s.backBtn} onClick={() => setStep(0)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M13 5L8 10L13 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back
        </button>
        <h1 style={s.title} className="fade-up">Review <span style={{ color: 'var(--red)' }}>Booking.</span></h1>
      </div>

      <div style={s.body}>
        <div style={s.reviewCard} className="card">
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Pod</span>
            <span style={s.reviewValue}>{chosenPod?.name}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Type</span>
            <span style={s.reviewValue}>{chosenPod?.type}</span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Date</span>
            <span style={s.reviewValue}>
              {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div style={s.reviewDivider} />
          <div style={s.reviewRow}>
            <span style={s.reviewLabel}>Time</span>
            <span style={s.reviewValue}>
              {selectedTime} – {chosenSlot?.end}
            </span>
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
          <p style={s.noticeText}>Your door code will be sent to your email and phone number immediately after payment is confirmed.</p>
        </div>

        <button
          className="btn btn--primary btn--block"
          style={{ marginTop: '16px' }}
          onClick={() => navigate('/book/confirm')}
        >
          Pay {isEvening ? '£10.50' : '£7.00'} with Pay360
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const s = {
  screen: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflow: 'hidden',
  },
  header: {
    padding: '56px 20px 16px',
    borderBottom: '1px solid var(--w06)',
    flexShrink: 0,
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    letterSpacing: '0.02em',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'none',
    border: 'none',
    color: 'var(--w60)',
    fontSize: '0.85rem',
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
    marginBottom: '12px',
    fontFamily: 'var(--font-body)',
  },
  tabBar: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    scrollbarWidth: 'none',
    padding: '12px 16px',
    borderBottom: '1px solid var(--w06)',
    flexShrink: 0,
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '20px',
    border: '1px solid',
    fontSize: '0.8rem',
    fontWeight: 700,
    whiteSpace: 'nowrap',
    flexShrink: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 0.2s',
  },
  tabDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  podStrip: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 16px',
    background: 'var(--bg2)',
    borderBottom: '1px solid var(--w06)',
    flexShrink: 0,
  },
  podStripLeft: { display: 'flex', flexDirection: 'column', gap: '1px' },
  podStripName: { fontSize: '0.88rem', fontWeight: 700, color: 'var(--white)' },
  podStripType: { fontSize: '0.72rem', color: 'var(--w40)' },
  podStripStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.75rem',
    fontWeight: 700,
  },
  statusDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
  },
  body: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px 16px 0',
  },
  sectionLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '10px',
  },
  dayScroll: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '4px',
    scrollbarWidth: 'none',
  },
  dayBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  dayLabel: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  dayDate: { fontSize: '0.72rem', color: 'var(--w40)' },
  priceLegend: {
    display: 'flex',
    gap: '16px',
    marginBottom: '10px',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.7rem',
    color: 'var(--w40)',
  },
  legendDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
  },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
    paddingBottom: '8px',
  },
  slot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '3px',
    padding: '10px 6px',
    borderRadius: '10px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
    position: 'relative',
  },
  slotTime: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--white)' },
  slotPrice: { fontSize: '0.68rem', fontWeight: 600 },
  slotPoints: {
    fontSize: '0.62rem',
    fontWeight: 600,
    color: '#f5c842',
    letterSpacing: '0.02em',
  },
  slotBusyLabel: {
    position: 'absolute',
    top: '3px',
    right: '4px',
    fontSize: '0.55rem',
    fontWeight: 700,
    color: 'var(--red)',
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },
  stickyFooter: {
    position: 'sticky',
    bottom: 0,
    background: 'var(--bg)',
    paddingTop: '12px',
    paddingBottom: '24px',
    borderTop: '1px solid var(--w06)',
    marginTop: '12px',
  },
  selectionSummary: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '10px',
  },
  summaryPod: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--white)' },
  summaryDivider: { fontSize: '0.82rem', color: 'var(--w30)' },
  summaryTime: { fontSize: '0.82rem', color: 'var(--w60)' },
  summaryPrice: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--red)' },
  reviewCard: { marginBottom: '16px' },
  reviewRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
  },
  reviewLabel: { fontSize: '0.82rem', color: 'var(--w60)' },
  reviewValue: { fontSize: '0.88rem', fontWeight: 600, color: 'var(--white)', textAlign: 'right' },
  reviewDivider: { height: '1px', background: 'var(--w06)', margin: '0 16px' },
  notice: {
    display: 'flex',
    gap: '10px',
    padding: '12px 14px',
    background: 'var(--w06)',
    borderRadius: '10px',
    marginTop: '4px',
  },
  noticeText: { fontSize: '0.78rem', color: 'var(--w60)', lineHeight: 1.5 },
};
