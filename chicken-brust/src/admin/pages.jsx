import { CATEGORIES, chip, fmt } from '../shared/data.js';
import { HOURS, RIDERS, ST, readPhoto } from './useAdminStore.js';
import { Field, Panel, PanelTitle, StatusPill, Switch, photoPlaceholder } from './ui.jsx';

const adminChip = sel => chip(sel, '#DCDCD8');
const smallBtn = { height: 34, padding: '0 14px', borderRadius: 17, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap' };

// ---------------- Dashboard ----------------
export function Dashboard({ admin }) {
  const { s, set, counts, live, sales, busy, dish, summary, advance, armCancel, ALL } = admin;
  const maxH = Math.max(...HOURS.map(h => h[1]));
  const queue = s.orders.filter(o => ['new', 'prep', 'out'].includes(o.status)).slice(0, 5);
  const top = [...ALL].sort((a, b) => (b.sold || 0) - (a.sold || 0)).slice(0, 4);

  const kpis = [
    { label: "Today's sales", value: 'Rs ' + fmt(sales), sub: '+18% vs last Tuesday', dark: true },
    { label: 'Orders', value: live.length, sub: counts.cancel + ' cancelled' },
    { label: 'Avg order value', value: 'Rs ' + fmt(live.length ? sales / live.length : 0), sub: 'Target Rs 1,500' },
    { label: 'Active orders', value: counts.new + counts.prep + counts.out, sub: busy.size + ' riders on the way' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12 }}>
        {kpis.map(k => (
          <div key={k.label} style={{ padding: 20, borderRadius: 26, background: k.dark ? '#111' : '#fff', color: k.dark ? '#fff' : '#111', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <span style={{ fontSize: 13, opacity: 0.7 }}>{k.label}</span>
            <span style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>{k.value}</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{k.sub}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 16 }}>
        <Panel style={{ gap: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <PanelTitle title="Today's sales" sub="Hourly breakdown" />
            <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em' }}>Rs {fmt(sales)}</span>
          </div>
          <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 8 }} role="img" aria-label="Orders per hour">
            {HOURS.map(([label, v], i) => (
              <div key={label} style={{ flex: 1, minWidth: 0, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
                <div title={v + ' orders'} style={{ width: '100%', maxWidth: 28, height: Math.max(4, (v / maxH) * 160), borderRadius: 10, background: i === 9 ? '#E0521B' : v ? '#111' : '#EDEDEA' }} />
                <span style={{ fontSize: 10, color: '#9A9A96' }}>{label}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>Live queue</span>
            <button onClick={() => set({ page: 'orders', filter: 'all' })} style={{ border: 'none', background: 'none', fontSize: 12, color: '#9A9A96', cursor: 'pointer' }}>All orders ›</button>
          </div>
          {queue.map(o => {
            const armed = s.confirmId === o.id;
            return (
              <div key={o.id} onClick={() => set({ selId: o.id })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 20, background: '#F6F6F5', cursor: 'pointer', flexWrap: 'wrap' }}>
                <img src={dish(o.items[0][0]).img} alt="" style={{ width: 44, height: 44, borderRadius: 14, objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 140, display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{o.id} · {o.customer}</span>
                  <span style={{ fontSize: 11, color: '#9A9A96', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary(o)}</span>
                </div>
                <StatusPill status={o.status} />
                <button onClick={e => { e.stopPropagation(); armCancel(o); }} title="Cancel order" style={{
                  ...smallBtn, border: '1px solid #F1D3C6', background: armed ? '#E0521B' : '#fff', color: armed ? '#fff' : '#E0521B',
                }}>{armed ? 'Confirm cancel?' : 'Cancel'}</button>
                <button onClick={e => { e.stopPropagation(); advance(o); }} style={{ ...smallBtn, border: 'none', background: '#111', color: '#fff' }}>{ST[o.status].next}</button>
              </div>
            );
          })}
          {queue.length === 0 && <div style={{ padding: '32px 0', textAlign: 'center', fontSize: 13, color: '#9A9A96' }}>No active orders</div>}
        </Panel>
      </div>

      <Panel>
        <span style={{ fontSize: 15, fontWeight: 600 }}>Top dishes · today</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
          {top.map((d, i) => (
            <div key={d.id} className="hover-soft" onClick={() => set({ page: 'menu', cat: 'All', query: d.name })} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 20, background: '#F6F6F5', cursor: 'pointer' }}>
              <img src={d.img} alt="" style={{ width: 52, height: 52, borderRadius: 16, objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                <span style={{ fontSize: 11, color: '#9A9A96' }}>{d.sold} sold</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#E0521B', paddingRight: 8 }}>#{i + 1}</span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

// ---------------- Orders ----------------
const COLS = '100px 1.3fr 1.8fr 100px 110px 120px 70px';

export function Orders({ admin }) {
  const { s, set, counts, summary, total } = admin;
  const q = s.query.trim().toLowerCase();
  const rows = s.orders.filter(o => (s.filter === 'all' || o.status === s.filter) && (!q || (o.id + o.customer + summary(o)).toLowerCase().includes(q)));
  const tabs = [['all', 'All', s.orders.length], ...Object.keys(ST).map(k => [k, ST[k].label, counts[k]])];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {tabs.map(([k, label, c]) => (
          <button key={k} className="chip" onClick={() => set({ filter: k })} style={{ ...adminChip(k === s.filter), padding: '0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            {label}<span style={{ opacity: 0.6 }}>{c}</span>
          </button>
        ))}
      </div>
      <div style={{ borderRadius: 28, background: '#fff', padding: 8, overflowX: 'auto' }}>
        <div style={{ minWidth: 860, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: COLS, gap: 12, padding: '12px 16px', fontSize: 11, fontWeight: 600, color: '#9A9A96', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            <span>Order</span><span>Customer</span><span>Items</span><span>Total</span><span>Payment</span><span>Status</span><span>Time</span>
          </div>
          {rows.map(o => (
            <div key={o.id} className="hover-row" onClick={() => set({ selId: o.id })} style={{
              display: 'grid', gridTemplateColumns: COLS, gap: 12, alignItems: 'center', padding: '14px 16px', borderTop: '1px solid #F0F0EE',
              fontSize: 13, cursor: 'pointer', borderRadius: 16, background: o.id === s.selId ? '#F6F6F5' : 'transparent',
            }}>
              <span style={{ fontWeight: 600 }}>{o.id}</span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <span style={{ fontWeight: 500 }}>{o.customer}</span>
                <span style={{ fontSize: 11, color: '#9A9A96' }}>{o.area}</span>
              </div>
              <span style={{ color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{summary(o)}</span>
              <span style={{ fontWeight: 600 }}>Rs {fmt(total(o))}</span>
              <span style={{ color: '#555' }}>{o.pay}</span>
              <StatusPill status={o.status} style={{ justifySelf: 'start' }} />
              <span style={{ color: '#9A9A96' }}>{o.time}</span>
            </div>
          ))}
          {rows.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: '#9A9A96' }}>No orders match this filter</div>}
        </div>
      </div>
    </div>
  );
}

// ---------------- Menu ----------------
export function Menu({ admin }) {
  const { s, set, ALL, toggleAvail, setPrice, setPhoto } = admin;
  const q = s.query.trim().toLowerCase();
  const rows = ALL.filter(d => (s.cat === 'All' || d.cat === s.cat) && (!q || d.name.toLowerCase().includes(q)));
  const availCount = ALL.filter(d => s.avail[d.id]).length;
  const stop = e => e.stopPropagation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map(c => <button key={c} className="chip" onClick={() => set({ cat: c })} style={{ ...adminChip(c === s.cat), padding: '0 16px' }}>{c}</button>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 13, color: '#9A9A96' }}>{availCount} / {ALL.length} dishes available</span>
          <button onClick={() => set({ addOpen: true })} style={{ height: 42, padding: '0 20px', borderRadius: 21, border: 'none', background: '#111', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>Add new dish
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(230px,1fr))', gap: 12 }}>
        {rows.map(d => {
          const on = !!s.avail[d.id];
          return (
            <div key={d.id} className="hover-lift" onClick={() => set({ editId: d.id, edDraft: null })} style={{ background: '#fff', borderRadius: 26, padding: 10, display: 'flex', flexDirection: 'column', gap: 10, opacity: on ? 1 : 0.6, cursor: 'pointer' }}>
              <div style={{ height: 140, borderRadius: 18, overflow: 'hidden', background: '#F3F3F2', position: 'relative' }}>
                {d.img ? (
                  <img src={d.img} alt={d.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <label onClick={stop} style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', color: '#9A9A96', fontSize: 12, background: photoPlaceholder }}>
                    <span style={{ fontSize: 22, lineHeight: 1 }}>+</span>Add photo
                    <input type="file" accept="image/*" onChange={e => readPhoto(e.target.files[0], img => setPhoto(d, img))} style={{ display: 'none' }} />
                  </label>
                )}
                {!on && <span style={{ position: 'absolute', top: 10, left: 10, height: 26, padding: '0 10px', borderRadius: 13, background: '#111', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center' }}>Sold out</span>}
              </div>
              <div style={{ padding: '0 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span>
                  <span style={{ fontSize: 11, color: '#9A9A96' }}>{d.cat} · ★ {d.rating}</span>
                </div>
                <Switch on={on} label={'Available: ' + d.name} onToggle={() => toggleAvail(d)} />
              </div>
              <div onClick={stop} style={{ display: 'flex', alignItems: 'center', height: 42, borderRadius: 21, background: '#F3F3F2', padding: '0 14px', gap: 6, cursor: 'text' }}>
                <span style={{ fontSize: 12, color: '#9A9A96' }}>Rs</span>
                <input value={s.prices[d.id] ?? ''} onChange={e => setPrice(d.id, e.target.value)} inputMode="numeric" aria-label={'Price of ' + d.name}
                  style={{ flex: 1, minWidth: 0, border: 'none', background: 'none', outline: 'none', fontSize: 15, fontWeight: 600, color: '#E0521B' }} />
                <span style={{ fontSize: 11, color: '#9A9A96' }}>{d.sold || 0} today</span>
              </div>
            </div>
          );
        })}
      </div>
      {rows.length === 0 && <div style={{ padding: '40px 0', textAlign: 'center', fontSize: 13, color: '#9A9A96' }}>No dishes match your search</div>}
    </div>
  );
}

// ---------------- Riders ----------------
const RIDER_ST = {
  off: { label: 'Offline', bg: '#EDEDEA', color: '#6E6E6A' },
  busy: { label: 'On delivery', bg: '#E2EAF8', color: '#234C94' },
  free: { label: 'Available', bg: '#E0F0E4', color: '#2A6B40' },
};

export function Riders({ admin }) {
  const { s, busy } = admin;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
      {RIDERS.map(r => {
        const st = RIDER_ST[r.offline ? 'off' : busy.has(r.id) ? 'busy' : 'free'];
        const cur = s.orders.find(o => o.status === 'out' && o.rider === r.id);
        const note = cur ? cur.id + ' · ' + cur.area + ' — en route' : r.offline ? 'Shift starts at 11am' : 'Waiting at branch';
        return (
          <div key={r.id} style={{ padding: 18, borderRadius: 28, background: '#fff', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <img src={r.img} alt={r.name} style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{r.name}</span>
                <span style={{ fontSize: 12, color: '#9A9A96' }}>{r.bike}</span>
              </div>
              <span className="status-pill" style={{ background: st.bg, color: st.color }}>{st.label}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {[[r.trips, 'Trips today'], ['★ ' + r.rating, 'Rating'], [r.avg + 'm', 'Avg time']].map(([v, l]) => (
                <div key={l} style={{ padding: '10px 12px', borderRadius: 16, background: '#F6F6F5', display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 17, fontWeight: 600 }}>{v}</span>
                  <span style={{ fontSize: 11, color: '#9A9A96' }}>{l}</span>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#555' }}>{note}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------------- Promos ----------------
export function Promos({ admin }) {
  const { s, set, flash } = admin;
  const addPromo = () => {
    if (!s.newCode) return flash('Enter a code');
    if (s.promos.some(x => x.code === s.newCode)) return flash('This code already exists');
    set({ promos: [{ code: s.newCode, pct: s.newPct, uses: 0, on: true }, ...s.promos], newCode: '' });
    flash(s.newCode + ' created');
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 16, alignItems: 'start' }}>
      <div style={{ borderRadius: 28, background: '#fff', padding: '8px 20px', display: 'flex', flexDirection: 'column' }}>
        {s.promos.map((pr, i) => (
          <div key={pr.code} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 0', borderBottom: i < s.promos.length - 1 ? '1px solid #F0F0EE' : 'none' }}>
            <span style={{ height: 36, padding: '0 14px', borderRadius: 12, border: '1.5px dashed #C9C9C4', fontSize: 13, fontWeight: 600, letterSpacing: '0.04em', display: 'flex', alignItems: 'center' }}>{pr.code}</span>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{pr.pct}% off</span>
              <span style={{ fontSize: 12, color: '#9A9A96' }}>Used {pr.uses} times</span>
            </div>
            <Switch on={pr.on} label={'Enable ' + pr.code} onToggle={() => set({ promos: s.promos.map((x, j) => (j === i ? { ...x, on: !x.on } : x)) })} />
          </div>
        ))}
      </div>
      <Panel>
        <span style={{ fontSize: 15, fontWeight: 600 }}>New promo code</span>
        <Field height={50} value={s.newCode} placeholder="Code (e.g. WEEKEND15)" onChange={e => set({ newCode: e.target.value.toUpperCase().replace(/\s/g, '') })} />
        <div style={{ display: 'flex', gap: 8 }}>
          {[5, 10, 15, 20].map(v => (
            <button key={v} onClick={() => set({ newPct: v })} style={{ ...adminChip(v === s.newPct), flex: 1, height: 42, borderRadius: 21, border: '1px solid', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{v}%</button>
          ))}
        </div>
        <button onClick={addPromo} style={{ height: 52, borderRadius: 26, border: 'none', background: '#111', color: '#fff', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Create code</button>
      </Panel>
    </div>
  );
}

// ---------------- Settings ----------------
const STORE_FIELDS = [['name', 'Store name'], ['branch', 'Branch address'], ['phone', 'Contact number'], ['hours', 'Opening hours']];
const DELIVERY_FIELDS = [['fee', 'Delivery fee', 'Rs', ''], ['freeOver', 'Free delivery above', 'Rs', ''], ['radius', 'Delivery radius', '', 'km'], ['prep', 'Avg prep time', '', 'min']];
const TOGGLES = [
  ['autoAccept', 'Auto-accept orders', 'New orders go straight to the grill'],
  ['sound', 'Sound alert on new order', 'Plays a chime in the admin panel'],
  ['sms', 'SMS updates to customers', 'Order confirmed, on the way, delivered'],
  ['cod', 'Cash on delivery', 'Pay the rider in cash'],
  ['wallet', 'JazzCash / Easypaisa', 'Mobile wallet payments'],
  ['card', 'Debit / credit card', 'Online card payments'],
];

export function Settings({ admin }) {
  const { s, set, flash } = admin;
  const setCfg = (k, v) => set(st => ({ cfg: { ...st.cfg, [k]: v } }));
  const dirty = JSON.stringify(s.cfg) !== JSON.stringify(s.savedCfg);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: 16, alignItems: 'start' }}>
      <Panel>
        <PanelTitle title="Store details" sub="Customers see this in the app" />
        {STORE_FIELDS.map(([k, l]) => <Field key={k} label={l} value={s.cfg[k]} onChange={e => setCfg(k, e.target.value)} />)}
      </Panel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <Panel>
          <PanelTitle title="Delivery" sub="Fees and timings" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DELIVERY_FIELDS.map(([k, l, pre, post]) => (
              <Field key={k} label={l} pre={pre} post={post} numeric strong value={s.cfg[k]} style={{ padding: '0 16px' }}
                onChange={e => setCfg(k, e.target.value.replace(/[^\d.]/g, ''))} />
            ))}
          </div>
        </Panel>
        <div style={{ padding: '8px 22px', borderRadius: 28, background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 15, fontWeight: 600, padding: '14px 0 6px' }}>Orders & payments</span>
          {TOGGLES.map(([k, l, sub], i) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < TOGGLES.length - 1 ? '1px solid #F0F0EE' : 'none' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>{l}</span>
                <span style={{ fontSize: 12, color: '#9A9A96' }}>{sub}</span>
              </div>
              <Switch on={s.cfg[k]} label={l} onToggle={() => setCfg(k, !s.cfg[k])} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
        <button disabled={!dirty} onClick={() => { set({ cfg: s.savedCfg }); flash('Changes discarded'); }} style={{
          height: 50, padding: '0 24px', borderRadius: 25, border: 'none', background: '#fff', fontSize: 14, fontWeight: 500, cursor: dirty ? 'pointer' : 'default', opacity: dirty ? 1 : 0.5,
        }}>Discard changes</button>
        <button disabled={!dirty} onClick={() => { set({ savedCfg: s.cfg }); flash('Settings saved'); }} style={{
          height: 50, padding: '0 28px', borderRadius: 25, border: 'none', background: '#111', color: '#fff', fontSize: 14, fontWeight: 500, cursor: dirty ? 'pointer' : 'default', opacity: dirty ? 1 : 0.5,
        }}>Save settings</button>
      </div>
    </div>
  );
}
