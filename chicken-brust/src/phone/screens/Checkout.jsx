import { U, chip } from '../../shared/data.js';
import { IconPin } from '../../shared/icons.jsx';
import { Card, ScrollBody, TopBar, Totals, primaryBtn } from './shared.jsx';

const PAYS = [
  { label: 'Cash on delivery', sub: '', img: U('1580519542036-c47de6196ba5', 160) },
  { label: 'JazzCash / Easypaisa', sub: 'Wallet', img: U('1512941937669-90a1b58e7e9c', 160) },
  { label: 'Debit / credit card', sub: '•••• 4821', img: U('1556742502-ec7c0e9f34b1', 160) },
];

const fmtMinutes = m => {
  const h = Math.floor(m / 60), mm = m % 60;
  return ((h % 12) || 12) + ':' + String(mm).padStart(2, '0') + (h < 12 ? ' AM' : ' PM');
};

export default function Checkout({ app }) {
  const { s, set, go, flash, count } = app;

  // Schedule: today / tomorrow / day after, 30-min slots 12:00–23:00, at least 45 min from now.
  const now = new Date();
  const day = s.schedDay || 0;
  const days = [0, 1, 2].map(k => {
    const d = new Date(now);
    d.setDate(d.getDate() + k);
    return {
      k,
      label: k === 0 ? 'Today' : k === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    };
  });
  const minM = day === 0 ? now.getHours() * 60 + now.getMinutes() + 45 : 0;
  const slots = [];
  for (let m = 12 * 60; m <= 23 * 60; m += 30) if (m >= minM) slots.push(m);
  const sel = slots.includes(s.schedSlot) ? s.schedSlot : null;
  const times = [
    { label: 'Now', sub: '20–25 min' },
    { label: 'Schedule', sub: s.time === 1 && sel != null ? days[day].label + ', ' + fmtMinutes(sel) : 'Later' },
  ];

  const placeOrder = () => {
    if (!count) return flash('Your cart is empty');
    if (s.time === 1 && sel == null) return flash('Pick a delivery slot');
    set(p => ({ screen: 'track', stage: 0, stageAt: { 0: Date.now() }, cancelled: false, cart: [], orders: p.orders + 1, discountPct: 0, promo: '', promoMsg: '' }));
    flash('Order placed!');
  };

  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <TopBar onBack={() => go('cart')}><span style={{ fontSize: 17, fontWeight: 600 }}>Checkout</span></TopBar>

      <ScrollBody top={122}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Delivery address</span>
            <span style={{ fontSize: 12, color: '#9A9A96' }}>Change</span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: '#F3F3F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IconPin /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 500 }}>Home</span>
              <span style={{ fontSize: 12, color: '#8A8A86' }}>House 42, Street 7, DHA Phase 5, Lahore</span>
            </div>
          </div>
        </Card>

        <Card>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Delivery time</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {times.map((t, i) => (
              <button key={t.label} onClick={() => set({ time: i })} style={{
                ...chip(i === s.time), flex: 1, height: 52, borderRadius: 18, border: '1px solid', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{t.label}</span>
                <span style={{ fontSize: 11, opacity: 0.7 }}>{t.sub}</span>
              </button>
            ))}
          </div>
          {s.time === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {days.map(d => (
                  <button key={d.k} onClick={() => set({ schedDay: d.k })} style={{
                    ...chip(d.k === day), flex: 1, height: 54, borderRadius: 16, border: '1px solid', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                  }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{d.label}</span>
                    <span style={{ fontSize: 11, opacity: 0.7 }}>{d.date}</span>
                  </button>
                ))}
              </div>
              <div className="no-scrollbar" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 8, maxHeight: 148, overflowY: 'auto' }}>
                {slots.map(m => (
                  <button key={m} onClick={() => set({ schedSlot: m })} style={{
                    ...chip(m === sel), height: 40, borderRadius: 14, border: '1px solid', fontSize: 12.5, fontWeight: 500,
                    fontVariantNumeric: 'tabular-nums', cursor: 'pointer',
                  }}>{fmtMinutes(m)}</button>
                ))}
              </div>
              {!slots.length && <span style={{ fontSize: 12, color: '#9A9A96' }}>No slots left today — pick another day.</span>}
            </div>
          )}
        </Card>

        <Card style={{ gap: 6 }}>
          <span style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Payment</span>
          {PAYS.map((p, i) => (
            <div key={p.label} role="radio" aria-checked={i === s.pay} onClick={() => set({ pay: i })} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 4px', cursor: 'pointer', borderBottom: '1px solid #F0F0EE',
            }}>
              <span style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid ' + (i === s.pay ? '#111' : '#CFCFCB'), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: i === s.pay ? '#111' : 'transparent' }} />
              </span>
              <img src={p.img} alt="" style={{ width: 44, height: 44, borderRadius: 14, objectFit: 'cover', flex: 'none', background: '#F0F0EE' }} />
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{p.label}</span>
              <span style={{ fontSize: 12, color: '#9A9A96' }}>{p.sub}</span>
            </div>
          ))}
        </Card>

        <Card style={{ gap: 10, fontSize: 13 }}>
          <Totals app={app} itemsLabel={`Items (${count})`} />
        </Card>
      </ScrollBody>

      <button onClick={placeOrder} style={primaryBtn}>Place order</button>
    </div>
  );
}
