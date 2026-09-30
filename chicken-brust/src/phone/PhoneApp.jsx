import { usePhoneStore, RIDER } from './usePhoneStore.js';
import { clockTime } from '../shared/data.js';
import { IconArrowRight, IconPath } from '../shared/icons.jsx';
import Intro from './screens/Intro.jsx';
import Home from './screens/Home.jsx';
import Detail from './screens/Detail.jsx';
import Cart from './screens/Cart.jsx';
import Checkout from './screens/Checkout.jsx';
import Track from './screens/Track.jsx';
import Profile from './screens/Profile.jsx';

const SCREENS = { intro: Intro, home: Home, detail: Detail, cart: Cart, checkout: Checkout, track: Track, profile: Profile };

const TABS = [
  ['home', 'Home', 'M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z'],
  ['cart', 'Cart', 'M5 8h14l-1.5 11h-11zM9 8a3 3 0 0 1 6 0'],
  ['track', 'Track', 'M12 21s-7-6.5-7-12a7 7 0 0 1 14 0c0 5.5-7 12-7 12zM12 7.5a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3'],
  ['profile', 'Profile', 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6'],
];

export default function PhoneApp() {
  const app = usePhoneStore();
  const { s } = app;
  const Screen = SCREENS[s.screen] || Intro;

  return (
    <div className="phone-stage">
      <div className="phone">
        <div className="phone-statusbar" style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 50, display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', padding: '0 32px', fontWeight: 600, fontSize: 15, zIndex: 20, pointerEvents: 'none',
          color: s.callOpen ? '#fff' : '#111',
        }}>
          <span>{clockTime(app.nowMs)}</span>
          <span style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            <span style={{ width: 17, height: 10, borderRadius: 2, background: 'currentColor' }} />
            <span style={{ width: 24, height: 12, borderRadius: 4, border: '1.5px solid currentColor' }} />
          </span>
        </div>

        <Screen app={app} />

        {['home', 'track', 'profile'].includes(s.screen) && <TabBar app={app} />}
        {s.chatOpen && <ChatSheet app={app} />}
        {s.callOpen && <CallScreen app={app} />}

        {s.toast && (
          <div role="status" style={{
            position: 'absolute', top: 116, left: '50%', transform: 'translateX(-50%)', zIndex: 30, background: '#111',
            color: '#fff', fontSize: 13, padding: '10px 18px', borderRadius: 20, whiteSpace: 'nowrap',
          }}>{s.toast}</div>
        )}
        <div className="phone-home-indicator" />
      </div>
    </div>
  );
}

function TabBar({ app }) {
  const { s, go, count } = app;
  return (
    <nav style={{
      position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 15, height: 68, padding: '0 8px',
      borderRadius: 34, background: '#111', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 14px 40px rgba(0,0,0,0.2)',
    }}>
      {TABS.map(([k, label, icon]) => {
        const active = k === s.screen;
        const badge = k === 'cart' && count ? count : 0;
        return (
          <button key={k} onClick={() => go(k)} aria-label={label} style={{
            position: 'relative', height: 52, minWidth: 52, padding: active ? '0 18px' : 0, borderRadius: 26, border: 'none',
            background: active ? '#fff' : 'transparent', color: '#111', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all .25s ease',
          }}>
            <IconPath d={icon} size={21} stroke={active ? '#111' : '#8A8A86'} />
            {active && <span>{label}</span>}
            {badge > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 6, minWidth: 17, height: 17, borderRadius: 9, background: '#E0521B', color: '#fff',
                fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px', border: '2px solid #111',
              }}>{badge}</span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

const QUICK_REPLIES = ['Please call at the gate', 'How long?', "Please don't ring the bell", 'Thank you!'];

function ChatSheet({ app }) {
  const { s, set, send } = app;
  const close = () => set({ chatOpen: false });
  return (
    <>
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(17,17,17,0.3)', zIndex: 26 }} />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 560, background: '#F4F4F3', borderRadius: '32px 32px 0 0',
        zIndex: 27, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 20px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid #E6E6E3' }}>
          <img src={RIDER.img} alt={RIDER.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{RIDER.name}</span>
            <span style={{ fontSize: 11, color: '#2F8F4E' }}>Online · rider</span>
          </div>
          <button onClick={close} aria-label="Close chat" style={{ width: 36, height: 36, borderRadius: '50%', border: 'none', background: '#fff', fontSize: 17, cursor: 'pointer' }}>×</button>
        </div>
        <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {s.msgs.map((m, i) => (
            <div key={i} style={{
              alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '78%', padding: '10px 14px', borderRadius: 18,
              background: m.me ? '#111' : '#fff', color: m.me ? '#fff' : '#111', fontSize: 13, lineHeight: 1.4,
              display: 'flex', flexDirection: 'column', gap: 3,
            }}>
              <span>{m.text}</span>
              <span style={{ fontSize: 10, opacity: 0.55, alignSelf: 'flex-end' }}>{m.time}</span>
            </div>
          ))}
        </div>
        <div className="no-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '0 16px 10px' }}>
          {QUICK_REPLIES.map(t => (
            <button key={t} onClick={() => send(t)} style={{
              height: 34, padding: '0 14px', borderRadius: 17, border: '1px solid #E0E0DC', background: '#fff', fontSize: 12,
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0,
            }}>{t}</button>
          ))}
        </div>
        <div style={{ padding: '0 14px 30px', display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, height: 50, borderRadius: 25, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 18px' }}>
            <input value={s.draft} onChange={e => set({ draft: e.target.value })} onKeyDown={e => e.key === 'Enter' && send(s.draft)}
              placeholder="Write a message" style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 14, minWidth: 0 }} />
          </div>
          <button onClick={() => send(s.draft)} aria-label="Send" style={{
            width: 50, height: 50, borderRadius: '50%', border: 'none', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          }}><IconArrowRight stroke="#fff" width={2.2} /></button>
        </div>
      </div>
    </>
  );
}

function CallScreen({ app }) {
  const { s, set, endCall } = app;
  const status = s.callSec < 2 ? 'Calling…' : Math.floor((s.callSec - 2) / 60) + ':' + String((s.callSec - 2) % 60).padStart(2, '0');
  const round = on => ({
    width: 62, height: 62, borderRadius: '50%', border: 'none', background: on ? '#fff' : '#262625', color: on ? '#111' : '#fff',
    fontSize: 12, fontWeight: 500, cursor: 'pointer',
  });
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 19, background: '#111', color: '#fff', display: 'flex', flexDirection: 'column',
      alignItems: 'center', padding: '130px 24px 70px',
    }}>
      <div style={{ width: 132, height: 132, borderRadius: '50%', padding: 5, background: '#1E1E1D', boxShadow: '0 0 0 12px rgba(255,255,255,0.05),0 0 0 26px rgba(255,255,255,0.03)' }}>
        <img src={RIDER.img} alt={RIDER.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
      </div>
      <span style={{ marginTop: 34, fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>{RIDER.name}</span>
      <span style={{ marginTop: 6, fontSize: 14, color: '#A5A5A1' }}>{status}</span>
      <div style={{ marginTop: 'auto', display: 'flex', gap: 26, alignItems: 'center' }}>
        <button onClick={() => set({ muted: !s.muted })} style={round(s.muted)}>{s.muted ? 'Unmute' : 'Mute'}</button>
        <button onClick={endCall} aria-label="End call" style={{
          width: 74, height: 74, borderRadius: '50%', border: 'none', background: '#E0521B', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" style={{ transform: 'rotate(135deg)' }}>
            <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z" />
          </svg>
        </button>
        <button onClick={() => set({ speaker: !s.speaker })} style={round(s.speaker)}>Speaker</button>
      </div>
    </div>
  );
}
