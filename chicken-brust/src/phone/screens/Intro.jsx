import { useRef, useState } from 'react';
import { DISHES } from '../../shared/data.js';
import { COOKS, COOK_IMG } from '../usePhoneStore.js';
import { Heart } from '../../shared/icons.jsx';
import { useFav } from './shared.jsx';

const SLIDE_MAX = 168;
const BOWL = 'https://images.unsplash.com/photo-1762631934518-f75e233413ca?auto=format&fit=crop&w=240&h=240&q=90&crop=entropy';

export default function Intro({ app }) {
  const { s, set, go, timers } = app;
  const hero = DISHES[0];
  const fav = useFav(app, hero.id);

  // "Slide to view menu" control.
  const [x, setX] = useState(0);
  const [sliding, setSliding] = useState(false);
  const startX = useRef(0);
  const down = e => {
    e.preventDefault();
    window.getSelection?.().removeAllRanges();
    e.currentTarget.setPointerCapture(e.pointerId);
    startX.current = e.clientX - x;
    setSliding(true);
  };
  const move = e => { if (sliding) setX(Math.min(SLIDE_MAX, Math.max(0, e.clientX - startX.current))); };
  const up = () => {
    if (!sliding) return;
    const done = x > SLIDE_MAX * 0.8;
    setSliding(false);
    setX(done ? SLIDE_MAX : 0);
    if (done) timers.current.slide = setTimeout(() => { go('home'); setX(0); }, 260);
  };

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F6F6F5' }}>
      <div style={{ position: 'absolute', top: 62, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
        <div style={{ height: 44, padding: '0 16px', borderRadius: 22, background: '#fff', display: 'flex', alignItems: 'center', fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em' }}>Chicken Brust</div>
        <button className="icon-btn" onClick={fav.toggle} aria-label="Favourite"><Heart fill={fav.on ? '#E0521B' : 'none'} stroke={fav.on ? '#E0521B' : '#111'} /></button>
      </div>

      <div style={{ position: 'absolute', top: 128, left: 24, zIndex: 5, fontSize: 34, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.035em' }}>
        Grilled <span style={{ color: '#A5A5A1', fontWeight: 500 }}>chicken</span><br />breast
      </div>
      <div style={{ position: 'absolute', top: 212, right: 26, zIndex: 5, display: 'flex', alignItems: 'flex-start', gap: 2 }}>
        <span style={{ fontSize: 54, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>{COOKS[s.cook].t}</span>
        <span style={{ fontSize: 18, fontWeight: 600, marginTop: 24 }}>°c</span>
      </div>

      <div style={{ position: 'absolute', top: 270, left: 24, width: 560, height: 560, borderRadius: '50%', background: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.10)', padding: 22 }}>
        <img src={hero.img} alt={hero.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
      </div>

      {/* Doneness picker */}
      <div style={{
        position: 'absolute', top: 318, left: 22, zIndex: 6, display: 'flex', flexDirection: 'column', gap: 8, padding: 6, borderRadius: 40,
        background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)', border: '1px solid rgba(255,255,255,0.7)',
      }}>
        {COOKS.map((c, i) => (
          <div key={c.label} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <div onClick={() => set({ cook: i })} role="button" aria-label={c.label} style={{
              width: 46, height: 46, borderRadius: '50%', overflow: 'hidden', cursor: 'pointer', outline: i === s.cook ? '2px solid #fff' : 'none', outlineOffset: 2,
            }}>
              <img src={COOK_IMG[i]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {i === s.cook && (
              <div style={{
                position: 'absolute', left: 58, display: 'flex', alignItems: 'center', gap: 14, height: 46, padding: '0 18px', borderRadius: 23,
                background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.85)',
                whiteSpace: 'nowrap', fontSize: 14, fontWeight: 500,
              }}>{c.label}<span style={{ letterSpacing: 2, color: '#555' }}>•••</span></div>
            )}
          </div>
        ))}
      </div>

      {/* Slide to open the menu */}
      <div style={{
        position: 'absolute', bottom: 52, left: '50%', transform: 'translateX(-50%)', zIndex: 6, width: 240, height: 72, borderRadius: 36, background: '#111',
        boxShadow: '0 14px 40px rgba(0,0,0,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 8px',
        userSelect: 'none', WebkitUserSelect: 'none', touchAction: 'none',
      }}>
        <div onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} role="slider" aria-label="Slide to view menu"
          aria-valuemin={0} aria-valuemax={SLIDE_MAX} aria-valuenow={Math.round(x)} tabIndex={0}
          onKeyDown={e => (e.key === 'Enter' || e.key === 'ArrowRight') && go('home')}
          style={{
            position: 'relative', zIndex: 2, width: 56, height: 56, borderRadius: '50%', background: '#fff', padding: 3, flexShrink: 0, cursor: 'grab',
            touchAction: 'none', transform: `translateX(${x}px)`, transition: sliding ? 'none' : 'transform .3s cubic-bezier(.2,.8,.2,1)',
          }}>
          <img src={BOWL} alt="" draggable="false" style={{
            pointerEvents: 'none', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', filter: 'contrast(1.08) saturate(1.12) brightness(1.04)',
          }} />
        </div>
        <span style={{ color: '#fff', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, pointerEvents: 'none', opacity: Math.max(0, 1 - x / 110) }}>
          View menu<span style={{ color: '#8A8A86', letterSpacing: -1 }}>›››</span>
        </span>
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#E0521B', boxShadow: '0 0 0 4px rgba(224,82,27,0.22)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </div>
      </div>
    </div>
  );
}
