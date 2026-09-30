import { SIZES, fmt, unitPrice } from '../../shared/data.js';
import { IconTrash } from '../../shared/icons.jsx';
import { ScrollBody, TopBar, Totals, primaryBtn } from './shared.jsx';

export default function Cart({ app }) {
  const { s, set, go, qty, find, cartItems, count, total } = app;

  const applyPromo = () => (s.promo.trim().toUpperCase() === 'BRUST10'
    ? set({ discountPct: 10, promoMsg: '10% discount applied' })
    : set({ discountPct: 0, promoMsg: 'This code is not valid' }));

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <TopBar onBack={() => go('home')}>
        <span style={{ fontSize: 17, fontWeight: 600 }}>Cart <span style={{ color: '#9A9A96', fontWeight: 500 }}>({count})</span></span>
      </TopBar>

      <ScrollBody top={120}>
        {cartItems.map(c => {
          const d = find(c.id);
          return (
            <div key={c.key} style={{ display: 'flex', gap: 12, padding: 8, borderRadius: 24, background: '#fff' }}>
              <div style={{ width: 94, height: 88, borderRadius: 18, overflow: 'hidden', flexShrink: 0, background: '#F3F3F2' }}>
                <img src={d.img} alt={d.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, padding: '4px 4px 0 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600 }}>{d.name}</span>
                  <button onClick={() => qty(c.key, -c.qty)} title="Remove" aria-label={'Remove ' + d.name} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                    <IconTrash size={16} />
                  </button>
                </div>
                <span style={{ fontSize: 11, color: '#9A9A96' }}>{SIZES[c.size].label} portion</span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                  <span style={{ color: '#E0521B', fontSize: 17, fontWeight: 600 }}><span style={{ fontSize: 11 }}>Rs</span> {fmt(unitPrice(d.price, c.size) * c.qty)}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => qty(c.key, -1)} aria-label="Decrease" style={{ width: 24, height: 24, border: 'none', background: 'none', fontSize: 18, cursor: 'pointer' }}>−</button>
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{c.qty}</span>
                    <button onClick={() => qty(c.key, 1)} aria-label="Increase" style={{ width: 26, height: 26, borderRadius: '50%', border: 'none', background: '#111', color: '#fff', fontSize: 16, cursor: 'pointer' }}>+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {cartItems.length === 0 && <div style={{ padding: '48px 0', textAlign: 'center', color: '#9A9A96', fontSize: 14 }}>Your cart is empty</div>}

        <div style={{ marginTop: 6, padding: 14, borderRadius: 28, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 52, borderRadius: 26, background: '#F3F3F2', padding: '0 6px 0 18px' }}>
            <input value={s.promo} onChange={e => set({ promo: e.target.value })} onKeyDown={e => e.key === 'Enter' && applyPromo()}
              placeholder="Promo code (BRUST10)" aria-label="Promo code"
              style={{ flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: 14, minWidth: 0 }} />
            <button onClick={applyPromo} style={{ height: 40, padding: '0 22px', borderRadius: 20, border: 'none', background: '#111', color: '#fff', fontSize: 14, cursor: 'pointer' }}>Apply</button>
          </div>
          {s.promoMsg && <div style={{ fontSize: 12, color: s.discountPct ? '#2F8F4E' : '#E0521B', padding: '0 6px' }}>{s.promoMsg}</div>}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 6px', fontSize: 13 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>Order summary</div>
            <Totals app={app} />
          </div>
        </div>
      </ScrollBody>

      <button onClick={() => count && go('checkout')} disabled={!count} style={{
        ...primaryBtn, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', fontVariantNumeric: 'tabular-nums',
        opacity: count ? 1 : 0.5, cursor: count ? 'pointer' : 'default',
      }}>
        <span>Checkout</span><span>Rs {fmt(total)}</span>
      </button>
    </div>
  );
}
