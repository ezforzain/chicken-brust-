import { useRef } from 'react';
import { SIZES, chip, fmt, unitPrice } from '../../shared/data.js';
import { Heart } from '../../shared/icons.jsx';
import { useFav } from './shared.jsx';

const glassBtn = {
  width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(17,17,17,0.28)',
  backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0,
};

export default function Detail({ app }) {
  const { s, set, go, add, flash, D, dish, timers } = app;
  const fav = useFav(app, s.dishId);
  const sheet = useRef(null);
  const fade = { opacity: s.swap ? 0 : 1, transition: 'opacity .16s ease' };

  // Cross-fade to another dish from "Often ordered with".
  const openSide = id => {
    set({ swap: true });
    clearTimeout(timers.current.swap);
    timers.current.swap = setTimeout(() => {
      if (sheet.current) sheet.current.scrollTop = 0;
      set({ dishId: id, size: 0, swap: false });
    }, 160);
  };

  const sides = D.filter(d => d.side && !d.off && d.id !== s.dishId);

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#EFEFED' }}>
      <div style={{ position: 'absolute', top: 62, left: 22, right: 22, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
        <button onClick={() => go('home')} aria-label="Back" style={glassBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button onClick={fav.toggle} aria-label="Favourite" style={glassBtn}>
          <Heart size={16} width={2.2} fill={fav.on ? '#E0521B' : 'none'} stroke={fav.on ? '#E0521B' : '#fff'} />
        </button>
      </div>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360, overflow: 'hidden', background: '#E6E6E3' }}>
        <img src={dish.img} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.04)', ...fade }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,0.28) 0%,rgba(0,0,0,0) 32%,rgba(0,0,0,0) 70%,rgba(0,0,0,0.18) 100%)' }} />
      </div>

      <div ref={sheet} className="no-scrollbar" style={{
        ...fade, position: 'absolute', top: 300, left: 0, right: 0, bottom: 0, background: 'rgba(250,250,249,0.94)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '32px 32px 0 0', overflowY: 'auto',
        padding: '24px 22px 130px', display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em' }}>{dish.name}</div>
            <div style={{ fontSize: 12, color: '#9A9A96' }}>{dish.tag}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <div style={{ color: '#E0521B', fontSize: 22, fontWeight: 600, whiteSpace: 'nowrap' }}><span style={{ fontSize: 13 }}>Rs</span> {fmt(unitPrice(dish.price, s.size))}</div>
            <div style={{ fontSize: 12, display: 'flex', gap: 4 }}><span style={{ color: '#F2A516' }}>★</span><b>{dish.rating}</b><span style={{ color: '#9A9A96' }}>({dish.reviews})</span></div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderTop: '1px solid #E6E6E3', borderBottom: '1px solid #E6E6E3', fontSize: 12.5, color: '#333' }}>
          <span>Free delivery</span><Divider /><span>20–25 min</span><Divider /><span>{dish.kcal} kcal</span>
        </div>

        <Section title="Choose portion">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SIZES.map((z, i) => <button key={z.label} className="chip" onClick={() => set({ size: i })} style={chip(i === s.size)}>{z.label}</button>)}
          </div>
        </Section>

        <Section title="Description" gap={8}>
          <div style={{ fontSize: 13, lineHeight: 1.55, color: '#8A8A86', textWrap: 'pretty' }}>{dish.desc}</div>
        </Section>

        {sides.length > 0 && (
          <Section title="Often ordered with">
            <div style={{ display: 'flex', flexDirection: 'column', borderRadius: 22, background: '#fff', padding: '4px 12px' }}>
              {sides.map((sd, i) => {
                const inCart = s.cart.some(c => c.id === sd.id);
                return (
                  <div key={sd.id} onClick={() => openSide(sd.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderTop: i ? '1px solid #F0F0EE' : 'none', cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                      <img src={sd.img} alt={sd.name} style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                        <span style={{ fontSize: 14, fontWeight: 500 }}>{sd.name}</span>
                        <span style={{ fontSize: 12, color: '#9A9A96' }}>{sd.tag}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap' }}>Rs {fmt(sd.price)}</span>
                    <button aria-label={'Add ' + sd.name} onClick={e => { e.stopPropagation(); add(sd.id, 0); flash(sd.name + ' added to cart'); }} style={{
                      width: 34, height: 34, flexShrink: 0, borderRadius: '50%', border: inCart ? 'none' : '1px solid #E6E6E3', background: inCart ? '#111' : '#fff',
                      color: inCart ? '#fff' : '#111', fontSize: 16, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    }}>{inCart ? '✓' : '+'}</button>
                  </div>
                );
              })}
            </div>
          </Section>
        )}
      </div>

      <div style={{ position: 'absolute', left: 14, right: 14, bottom: 30, display: 'flex', gap: 10, zIndex: 6 }}>
        <button onClick={() => { add(dish.id, s.size); flash('Added to cart'); }} style={{
          flex: 1, height: 56, borderRadius: 28, border: 'none', background: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer', boxShadow: '0 10px 30px rgba(0,0,0,0.10)',
        }}>Add to Cart</button>
        <button onClick={() => { add(dish.id, s.size); go('cart'); }} style={{
          flex: 1, height: 56, borderRadius: 28, border: 'none', background: '#111', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer',
        }}>Order now</button>
      </div>
    </div>
  );
}

const Divider = () => <span style={{ width: 1, height: 14, background: '#DDD' }} />;

function Section({ title, gap = 12, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      <div style={{ fontSize: 15, fontWeight: 600 }}>{title}</div>
      {children}
    </div>
  );
}
