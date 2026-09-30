import { clockTime } from '../../shared/data.js';
import { IconChat, IconPhone } from '../../shared/icons.jsx';
import { RIDER, STEPS, TRACKED_ORDER } from '../usePhoneStore.js';
import { TopBar } from './shared.jsx';

export default function Track({ app }) {
  const { s, set, go, startCall, stepMs } = app;
  const eta = s.stage === 3 ? 'Delivered' : clockTime(stepMs(3), true);
  const stageLabel = s.cancelled ? 'Cancelled' : STEPS[s.stage];

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <RouteMap />
      <TopBar onBack={() => go('home')}>
        <span style={{ height: 36, padding: '0 14px', borderRadius: 18, background: '#fff', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center' }}>
          Order #{TRACKED_ORDER}
        </span>
      </TopBar>

      <div className="no-scrollbar" style={{
        position: 'absolute', top: 370, left: 0, right: 0, bottom: 0, background: '#F4F4F3', borderRadius: '32px 32px 0 0',
        padding: '24px 20px 130px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 12, color: '#9A9A96' }}>Estimated arrival</span>
            <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.03em' }}>{eta}</span>
          </div>
          <span style={{ fontSize: 13, color: '#E0521B', fontWeight: 600 }}>{stageLabel}</span>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {STEPS.map((label, i) => <div key={label} style={{ flex: 1, height: 5, borderRadius: 3, background: i <= s.stage ? '#111' : '#DADAD6' }} />)}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 22, height: 22, borderRadius: '50%', background: i <= s.stage ? '#111' : '#DADAD6', color: '#fff', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {i < s.stage ? '✓' : ''}
              </span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: i <= s.stage ? '#111' : '#9A9A96' }}>{label}</span>
              <span style={{ fontSize: 12, color: '#9A9A96' }}>{clockTime(stepMs(i))}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 24, background: '#fff' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
            <img src={RIDER.img} alt="Rider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{RIDER.name}</span>
            <span style={{ fontSize: 12, color: '#9A9A96' }}>Delivery rider · ★ {RIDER.rating}</span>
          </div>
          <button onClick={() => set({ chatOpen: true })} title="Message" aria-label="Message rider" style={{
            width: 42, height: 42, borderRadius: '50%', border: '1px solid #EAEAE7', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
          }}><IconChat /></button>
          <button onClick={startCall} title="Call" aria-label="Call rider" style={{
            width: 42, height: 42, borderRadius: '50%', border: 'none', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
          }}><IconPhone size={17} stroke="#fff" /></button>
        </div>
      </div>
    </div>
  );
}

// Stylised route map: branch (black) → rider → home (orange).
function RouteMap() {
  const tag = { position: 'absolute', height: 30, padding: '0 12px', borderRadius: 15, fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center' };
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 420, background: '#EFEEEA', overflow: 'hidden' }}>
      <svg viewBox="0 0 400 420" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', display: 'block' }} aria-label="Delivery route map">
        <rect x="250" y="40" width="130" height="110" rx="18" fill="#DDE8D5" />
        <rect x="20" y="250" width="110" height="90" rx="18" fill="#DDE8D5" />
        <path d="M290 300 Q340 280 400 310 L400 420 L260 420 Z" fill="#D6E3EA" />
        <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
          <path d="M-10 180 L410 150" strokeWidth="18" />
          <path d="M-10 230 L410 205" strokeWidth="22" />
          <path d="M150 -10 L185 430" strokeWidth="18" />
          <path d="M300 -10 L255 430" strokeWidth="14" />
          <path d="M60 -10 L40 430" strokeWidth="10" />
          <path d="M-10 350 L410 330" strokeWidth="10" />
        </g>
        <path d="M70 175 L171 166 L176 222 L262 214 L256 330" stroke="#E0521B" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M70 175 L171 166 L176 222 L262 214 L259 270" stroke="#111" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.15" />
        <circle cx="70" cy="175" r="14" fill="#111" />
        <circle cx="70" cy="175" r="5" fill="#fff" />
        <circle cx="256" cy="330" r="22" fill="#E0521B" opacity="0.18" />
        <circle cx="256" cy="330" r="12" fill="#E0521B" />
        <circle cx="256" cy="330" r="4.5" fill="#fff" />
        <circle cx="259" cy="270" r="26" fill="#fff" opacity="0.7" />
        <circle cx="259" cy="270" r="17" fill="#111" />
        <path d="M252 273 h14 M255 267 l4 -4 l4 4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <div style={{ ...tag, left: 30, top: 196, background: '#111', color: '#fff' }}>Chicken Brust</div>
      <div style={{ ...tag, left: 206, top: 282, background: '#fff', color: '#111', boxShadow: '0 6px 16px rgba(0,0,0,0.08)' }}>Home</div>
    </div>
  );
}
