import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const pods = [
  { id: 1, name: 'FitnessPod 1', type: 'Cardio & Conditioning', free: true  },
  { id: 2, name: 'FitnessPod 2', type: 'Cardio & Conditioning', free: true  },
  { id: 3, name: 'FitnessPod 3', type: 'Strength & Cardio',     free: false },
  { id: 4, name: 'FitnessPod 4', type: 'Upgraded Equipment',    free: true  },
  { id: 5, name: 'HIITPod',      type: 'High Intensity',        free: false },
  { id: 6, name: 'PowerPod',     type: 'Strength & Power',      free: true  },
];

const STEPS = ['Pod', 'Date & Time', 'Review'];

function getTimeSlots(date) {
  const slots = [];
  const isToday = date === new Date().toISOString().split('T')[0];
  const now = new Date();
  for (let h = 6; h < 22; h++) {
    const timeStr = `${h.toString().padStart(2,'0')}:00`;
    const past = isToday && h <= now.getHours();
    const price = h >= 16 ? '£10' : '£7';
    slots.push({ time: timeStr, price, past, busy: Math.random() < 0.2 });
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
  const initPod = location.state?.podId || null;

  const [step, setStep] = useState(initPod ? 1 : 0);
  const [selectedPod, setSelectedPod] = useState(initPod);
  const [selectedDate, setSelectedDate] = useState(getNext7Days()[0].iso);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = getNext7Days();
  const slots = getTimeSlots(selectedDate);
  const chosenPod = pods.find(p => p.id === selectedPod);
  const chosenSlot = slots.find(s => s.time === selectedTime);
  const isEvening = selectedTime && parseInt(selectedTime) >= 16;

  function next() { if (step < 2) setStep(s => s + 1); }
  function back() { if (step > 0) setStep(s => s - 1); }

  return (
    <div className="screen">
      <div style={s.header}>
        <h1 style={s.title} className="fade-up">Book a <span style={{ color: 'var(--red)' }}>Pod.</span></h1>

        {/* Stepper */}
        <div style={s.stepper} className="fade-up fade-up-1">
          {STEPS.map((label, i) => (
            <div key={i} style={s.stepWrap}>
              <div style={{
                ...s.stepNum,
                background: i < step ? 'var(--red)' : i === step ? 'var(--red)' : 'transparent',
                borderColor: i <= step ? 'var(--red)' : 'var(--w20)',
                color: i <= step ? '#fff' : 'var(--w40)',
              }}>
                {i < step ? '✓' : i + 1}
              </div>
              <span style={{ ...s.stepLabel, color: i === step ? 'var(--white)' : 'var(--w40)' }}>{label}</span>
              {i < STEPS.length - 1 && <div style={{ ...s.stepLine, background: i < step ? 'var(--red)' : 'var(--w10)' }} />}
            </div>
          ))}
        </div>
      </div>

      <div style={s.body}>
        {/* STEP 0: Pod Selection */}
        {step === 0 && (
          <div className="fade-up">
            <p style={s.stepTitle}>Choose your pod</p>
            <div style={s.podList}>
              {pods.map(pod => (
                <div
                  key={pod.id}
                  style={{
                    ...s.podOption,
                    borderColor: selectedPod === pod.id ? 'var(--red)' : 'var(--w06)',
                    background: selectedPod === pod.id ? 'rgba(232,24,26,0.06)' : 'var(--bg2)',
                    opacity: pod.free ? 1 : 0.5,
                  }}
                  onClick={() => pod.free && setSelectedPod(pod.id)}
                >
                  <div style={s.podOptionLeft}>
                    <div style={{ ...s.podDot, background: pod.free ? '#22c55e' : 'var(--red)' }} />
                    <div>
                      <p style={s.podOptionName}>{pod.name}</p>
                      <p style={s.podOptionType}>{pod.type}</p>
                    </div>
                  </div>
                  <div style={s.podOptionRight}>
                    <span style={{ ...s.availLabel, color: pod.free ? '#22c55e' : 'var(--w30)' }}>
                      {pod.free ? 'Available' : 'Occupied'}
                    </span>
                    {selectedPod === pod.id && (
                      <div style={s.checkMark}>✓</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: '20px', opacity: selectedPod ? 1 : 0.4 }}
              disabled={!selectedPod}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 1: Date & Time */}
        {step === 1 && (
          <div className="fade-up">
            <div style={s.selectedPodBar}>
              <span style={s.selectedPodName}>{chosenPod?.name}</span>
              <button style={s.changeBtn} onClick={back}>Change</button>
            </div>

            <p style={s.stepTitle}>Pick a date</p>
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

            <p style={{ ...s.stepTitle, marginTop: '20px' }}>Pick a time</p>
            <div style={s.slotGrid}>
              {slots.map(slot => (
                <button
                  key={slot.time}
                  style={{
                    ...s.slot,
                    borderColor: selectedTime === slot.time ? 'var(--red)' : 'var(--w10)',
                    background: selectedTime === slot.time ? 'rgba(232,24,26,0.1)' : 'var(--bg2)',
                    opacity: slot.past || slot.busy ? 0.35 : 1,
                    cursor: slot.past || slot.busy ? 'not-allowed' : 'pointer',
                  }}
                  disabled={slot.past || slot.busy}
                  onClick={() => setSelectedTime(slot.time)}
                >
                  <span style={s.slotTime}>{slot.time}</span>
                  <span style={{ ...s.slotPrice, color: parseInt(slot.time) >= 16 ? 'var(--red)' : 'var(--w40)' }}>{slot.price}</span>
                </button>
              ))}
            </div>

            <button
              className="btn btn--primary btn--block"
              style={{ marginTop: '20px', opacity: selectedTime ? 1 : 0.4 }}
              disabled={!selectedTime}
              onClick={next}
            >
              Continue
            </button>
          </div>
        )}

        {/* STEP 2: Review & Pay */}
        {step === 2 && (
          <div className="fade-up">
            <p style={s.stepTitle}>Review your booking</p>

            <div style={s.reviewCard} className="card">
              <div style={s.reviewRow}>
                <span style={s.reviewLabel}>Pod</span>
                <span style={s.reviewValue}>{chosenPod?.name}</span>
              </div>
              <div style={s.reviewDivider} />
              <div style={s.reviewRow}>
                <span style={s.reviewLabel}>Date</span>
                <span style={s.reviewValue}>{new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
              </div>
              <div style={s.reviewDivider} />
              <div style={s.reviewRow}>
                <span style={s.reviewLabel}>Time</span>
                <span style={s.reviewValue}>{selectedTime} – {`${(parseInt(selectedTime) + 1).toString().padStart(2,'0')}:00`}</span>
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
                  {isEvening ? '£10.00' : '£7'}
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

            <button className="btn btn--primary btn--block" style={{ marginTop: '16px' }}
              onClick={() => navigate('/book/confirm')}>
              Pay {isEvening ? '£10.00' : '£7'} with Pay360
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none"><path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="btn btn--ghost btn--block" style={{ marginTop: '10px' }} onClick={back}>
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  header: {
    padding: '56px 20px 20px',
    borderBottom: '1px solid var(--w06)',
  },
  title: {
    fontFamily: 'var(--font-head)',
    fontSize: '2.8rem',
    lineHeight: 1,
    marginBottom: '20px',
    letterSpacing: '0.02em',
  },
  stepper: {
    display: 'flex',
    alignItems: 'center',
    gap: 0,
  },
  stepWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flex: 1,
  },
  stepNum: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '2px solid',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
    transition: 'all 0.3s',
  },
  stepLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    whiteSpace: 'nowrap',
    transition: 'color 0.3s',
  },
  stepLine: {
    flex: 1,
    height: '1px',
    marginLeft: '6px',
    transition: 'background 0.3s',
  },
  body: {
    padding: '20px 16px',
  },
  stepTitle: {
    fontSize: '0.72rem',
    fontWeight: 700,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'var(--w40)',
    marginBottom: '12px',
  },
  podList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  podOption: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
  },
  podOptionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  podDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  podOptionName: { fontSize: '0.9rem', fontWeight: 700, marginBottom: '2px' },
  podOptionType: { fontSize: '0.75rem', color: 'var(--w40)' },
  podOptionRight: { display: 'flex', alignItems: 'center', gap: '10px' },
  availLabel: { fontSize: '0.75rem', fontWeight: 600 },
  checkMark: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    background: 'var(--red)',
    color: '#fff',
    fontSize: '0.7rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  selectedPodBar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    background: 'rgba(232,24,26,0.08)',
    borderRadius: '10px',
    border: '1px solid rgba(232,24,26,0.2)',
    marginBottom: '20px',
  },
  selectedPodName: { fontSize: '0.85rem', fontWeight: 700 },
  changeBtn: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--red)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
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
    background: 'var(--bg2)',
    cursor: 'pointer',
    flexShrink: 0,
    transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  dayLabel: { fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' },
  dayDate: { fontSize: '0.72rem', color: 'var(--w40)' },
  slotGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '8px',
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
  },
  slotTime: { fontSize: '0.82rem', fontWeight: 700, color: 'var(--white)' },
  slotPrice: { fontSize: '0.68rem', fontWeight: 600 },
  reviewCard: {
    marginBottom: '16px',
  },
  reviewRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
  },
  reviewLabel: {
    fontSize: '0.82rem',
    color: 'var(--w60)',
  },
  reviewValue: {
    fontSize: '0.88rem',
    fontWeight: 600,
    color: 'var(--white)',
    textAlign: 'right',
  },
  reviewDivider: {
    height: '1px',
    background: 'var(--w06)',
    margin: '0 16px',
  },
  notice: {
    display: 'flex',
    gap: '10px',
    padding: '12px 14px',
    background: 'var(--w06)',
    borderRadius: '10px',
    marginTop: '4px',
  },
  noticeText: {
    fontSize: '0.78rem',
    color: 'var(--w60)',
    lineHeight: 1.5,
  },
};
