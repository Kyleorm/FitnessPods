import { NavLink } from 'react-router-dom';

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 21V12h6v9" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const PodsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="3" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="3" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
    <rect x="13" y="13" width="8" height="8" rx="2" stroke="currentColor" strokeWidth="1.8"/>
  </svg>
);

const BookIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M8 15h4m-4 3h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const SessionsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ProfileIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const tabs = [
  { to: '/',        icon: HomeIcon,     label: 'Home'     },
  { to: '/pods',    icon: PodsIcon,     label: 'Pods'     },
  { to: '/book',    icon: BookIcon,     label: 'Book',    primary: true },
  { to: '/sessions',icon: SessionsIcon, label: 'Sessions' },
  { to: '/profile', icon: ProfileIcon,  label: 'Profile'  },
];

export default function BottomNav() {
  return (
    <nav style={styles.nav}>
      {tabs.map(({ to, icon: Icon, label, primary }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          style={({ isActive }) => ({
            ...styles.tab,
            color: isActive ? 'var(--red)' : 'var(--w40)',
          })}
        >
          {({ isActive }) => (
            <>
              {primary ? (
                <span style={{
                  ...styles.bookBtn,
                  background: isActive ? 'linear-gradient(135deg, #12297a 50%, #b01820 50%)' : 'linear-gradient(135deg, var(--navy) 50%, var(--red) 50%)',
                }}>
                  <Icon />
                </span>
              ) : (
                <span style={styles.icon}>
                  <Icon />
                </span>
              )}
              <span style={{
                ...styles.label,
                color: primary ? (isActive ? 'var(--red)' : 'var(--w60)') : undefined,
              }}>
                {label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'calc(var(--nav-h) + var(--safe-bottom))',
    paddingBottom: 'var(--safe-bottom)',
    background: 'rgba(8,12,24,0.97)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255,255,255,0.07)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    zIndex: 100,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    flex: 1,
    paddingTop: '8px',
    transition: 'color 0.2s',
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtn: {
    width: '48px',
    height: '48px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    marginTop: '-20px',
    boxShadow: '0 4px 20px rgba(232,24,26,0.4)',
    transition: 'background 0.2s',
  },
  label: {
    fontSize: '0.65rem',
    fontWeight: 600,
    letterSpacing: '0.02em',
  },
};
