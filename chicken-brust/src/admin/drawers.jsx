import { CATEGORIES, SIZES, chip, fmt, unitPrice } from '../shared/data.js';
import { IconPencil } from '../shared/icons.jsx';
import { FLOW, RIDERS, ST, readPhoto } from './useAdminStore.js';
import { Card, Drawer, Field, StatusPill, Switch, bigBtn, photoPlaceholder } from './ui.jsx';

const adminChip = sel => ({ ...chip(sel, '#DCDCD8'), padding: '0 16px' });

// ---------------- Order details ----------------
export function OrderDrawer({ admin }) {
  const { s, set, flash, dish, price, total, busy, advance, cancel, patchOrder } = admin;
  const o = s.orders.find(x => x.id === s.selId);
  if (!o) return null;

  const cur = FLOW.indexOf(o.status);
  const active = !['done', 'cancel'].includes(o.status);
  const needsRider = ['new', 'prep'].includes(o.status);
  const rider = o.rider && RIDERS.find(r => r.id === o.rider);
  const freeRiders = RIDERS.filter(r => !r.offline && (!busy.has(r.id) || o.rider === r.id));
  const close = () => set({ selId: null });

  return (
    <Drawer title={'Order ' + o.id} sub={o.time + ' · ' + o.pay} onClose={close}
      footer={active && (
        <>
          <button onClick={() => cancel(o)} style={bigBtn('danger')}>Cancel</button>
          <button onClick={() => advance(o)} style={bigBtn('dark')}>{ST[o.status].next}</button>
        </>
      )}>
      <Card>
        <div style={{ display: 'flex', gap: 6 }}>
          {FLOW.map((k, i) => (
            <div key={k} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ height: 5, borderRadius: 3, background: i <= cur ? '#111' : '#DADAD6' }} />
              <span style={{ fontSize: 10, color: i <= cur ? '#111' : '#9A9A96' }}>{ST[k].label}</span>
            </div>
          ))}
        </div>
        {o.status === 'cancel' && <span style={{ fontSize: 13, color: '#E0521B', fontWeight: 600 }}>This order has been cancelled</span>}
      </Card>

      <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#F3F3F2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600 }}>
          {o.customer.split(' ').map(w => w[0]).join('')}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{o.customer}</span>
          <span style={{ fontSize: 12, color: '#9A9A96' }}>{o.phone} · {o.area}</span>
        </div>
      </Card>

      <Card style={{ padding: '8px 16px', gap: 0 }}>
        {o.items.map(([id, sz, qty]) => {
          const d = dish(id);
          return (
            <div key={id + sz} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F0F0EE' }}>
              <img src={d.img} alt="" style={{ width: 48, height: 48, borderRadius: 14, objectFit: 'cover' }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.name}</span>
                <span style={{ fontSize: 11, color: '#9A9A96' }}>{SIZES[sz].label} × {qty}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Rs {fmt(unitPrice(price(d), sz) * qty)}</span>
            </div>
          );
        })}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0 8px', fontSize: 15, fontWeight: 600 }}>
          <span>Total</span><span>Rs {fmt(total(o))}</span>
        </div>
      </Card>

      {needsRider && (
        <Card style={{ gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Assign rider</span>
          {freeRiders.map(r => (
            <div key={r.id} role="radio" aria-checked={o.rider === r.id} onClick={() => { patchOrder(o.id, { rider: r.id }); flash(r.name + ' assigned'); }} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: 8, borderRadius: 18, border: '1px solid ' + (o.rider === r.id ? '#111' : '#EDEDEA'), cursor: 'pointer',
            }}>
              <img src={r.img} alt="" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{r.name}</span>
              <span style={{ fontSize: 11, color: '#9A9A96' }}>★ {r.rating}</span>
            </div>
          ))}
          {freeRiders.length === 0 && <span style={{ fontSize: 12, color: '#9A9A96' }}>No rider available right now</span>}
        </Card>
      )}
      {rider && <div style={{ padding: '14px 16px', borderRadius: 24, background: '#fff', fontSize: 13, color: '#555' }}>Rider: <b style={{ color: '#111' }}>{rider.name}</b></div>}
    </Drawer>
  );
}

// ---------------- Add dish ----------------
export function AddDishDrawer({ admin }) {
  const { s, set, flash } = admin;
  const close = () => set({ addOpen: false });

  const save = () => {
    const name = s.ndName.trim();
    if (!name) return flash('Enter a dish name');
    if (!Number(s.ndPrice)) return flash('Enter a price');
    const id = 'new-' + Date.now();
    set(st => ({
      extra: [{ id, name, cat: st.ndCat, price: Number(st.ndPrice), rating: 4.5, sold: 0, img: st.ndImg, isNew: true }, ...st.extra],
      avail: { ...st.avail, [id]: true }, prices: { ...st.prices, [id]: st.ndPrice },
      addOpen: false, ndName: '', ndPrice: '', ndImg: '', cat: 'All',
    }));
    flash(name + ' added to menu');
  };

  return (
    <Drawer title="Add new dish" sub="Add it to the menu" onClose={close}
      footer={<button onClick={save} style={{ ...bigBtn('dark'), fontSize: 15 }}>Add to menu</button>}>
      <Card>
        <Label text="Dish name"><Field height={50} value={s.ndName} placeholder="e.g. Honey Garlic Breast" onChange={e => set({ ndName: e.target.value })} /></Label>
        <Label text="Category">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => <button key={c} className="chip" onClick={() => set({ ndCat: c })} style={adminChip(c === s.ndCat)}>{c}</button>)}
          </div>
        </Label>
        <Label text="Price (Regular)">
          <Field height={50} pre="Rs" numeric strong accent value={s.ndPrice} placeholder="890" onChange={e => set({ ndPrice: e.target.value.replace(/\D/g, '') })} />
          <span style={{ fontSize: 11, color: '#9A9A96' }}>Large and Double prices are calculated automatically</span>
        </Label>
      </Card>
      <Card style={{ gap: 10 }}>
        <span style={{ fontSize: 13, fontWeight: 600 }}>Photo</span>
        <PhotoPicker img={s.ndImg} height={160} align="center" label={s.ndImg ? 'Change photo' : 'Choose photo'} onPick={img => set({ ndImg: img })} />
      </Card>
    </Drawer>
  );
}

// ---------------- Dish details / edit ----------------
export function DishDrawer({ admin }) {
  const { s, set, flash, ALL, toggleAvail, setPrice, setPhoto } = admin;
  const d = ALL.find(x => x.id === s.editId);
  if (!d) return null;

  const on = !!s.avail[d.id];
  const pr = Number(s.prices[d.id]) || d.price;
  const orders = s.orders.filter(o => o.items.some(([id]) => id === d.id));
  const editing = !!s.edDraft;
  const close = () => set({ editId: null, edDraft: null });

  const saveEdit = () => {
    const name = s.edDraft.name.trim();
    if (!name) return flash('Enter a dish name');
    const up = { name, cat: s.edDraft.cat };
    if (d.isNew) set(st => ({ extra: st.extra.map(x => (x.id === d.id ? { ...x, ...up } : x)), edDraft: null }));
    else set(st => ({ meta: { ...st.meta, [d.id]: up }, edDraft: null }));
    flash('Dish updated');
  };
  const remove = () => { set(st => ({ extra: st.extra.filter(x => x.id !== d.id), editId: null })); flash(d.name + ' deleted'); };

  return (
    <Drawer title={d.name} sub={`${d.cat} · ★ ${d.rating} · ${on ? 'Available' : 'Sold out'}`} onClose={close}
      headerExtra={!editing && (
        <button onClick={() => set({ edDraft: { name: d.name, cat: d.cat } })} style={{ height: 40, padding: '0 16px', borderRadius: 20, border: 'none', background: '#111', color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
          <IconPencil size={14} stroke="currentColor" />Edit
        </button>
      )}
      footer={editing ? (
        <>
          <button onClick={() => set({ edDraft: null })} style={bigBtn('light')}>Cancel</button>
          <button onClick={saveEdit} style={bigBtn('brand')}>Save changes</button>
        </>
      ) : (
        <>
          {d.isNew && <button onClick={remove} style={bigBtn('danger')}>Delete dish</button>}
          <button onClick={close} style={bigBtn('dark')}>Done</button>
        </>
      )}>
      {editing && (
        <Card>
          <Label text="Dish name"><Field height={50} value={s.edDraft.name} onChange={e => set({ edDraft: { ...s.edDraft, name: e.target.value } })} /></Label>
          <Label text="Category">
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => <button key={c} className="chip" onClick={() => set({ edDraft: { ...s.edDraft, cat: c } })} style={adminChip(s.edDraft.cat === c)}>{c}</button>)}
            </div>
          </Label>
        </Card>
      )}

      <PhotoPicker img={d.img} height={200} label={d.img ? 'Change photo' : 'Add photo'} onPick={img => setPhoto(d, img)} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[[d.sold || 0, 'Sold today'], ['Rs ' + fmt(pr * (d.sold || 0)), 'Revenue'], ['★ ' + d.rating, 'Rating']].map(([v, l]) => (
          <div key={l} style={{ padding: '12px 14px', borderRadius: 20, background: '#fff', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 18, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{v}</span>
            <span style={{ fontSize: 11, color: '#9A9A96' }}>{l}</span>
          </div>
        ))}
      </div>

      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>Available</span>
            <span style={{ fontSize: 12, color: '#9A9A96' }}>Customers can order this dish</span>
          </div>
          <Switch on={on} label="Available" onToggle={() => toggleAvail(d)} />
        </div>
        <Label text="Price (Regular)">
          <Field height={50} pre="Rs" numeric strong accent value={s.prices[d.id] ?? ''} onChange={e => setPrice(d.id, e.target.value)} />
        </Label>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {SIZES.map((z, i) => (
            <div key={z.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 2px', borderTop: '1px solid #F0F0EE', fontSize: 13 }}>
              <span style={{ color: '#555' }}>{z.label}</span><span style={{ fontWeight: 600 }}>Rs {fmt(unitPrice(pr, i))}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ gap: 10 }}>
        <span style={{ fontSize: 14, fontWeight: 600 }}>Recent orders</span>
        {orders.slice(0, 5).map(o => (
          <div key={o.id} onClick={() => set({ editId: null, edDraft: null, selId: o.id })} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderTop: '1px solid #F0F0EE', cursor: 'pointer', fontSize: 13 }}>
            <span style={{ fontWeight: 600 }}>{o.id}</span>
            <span style={{ flex: 1, color: '#555' }}>{o.customer}</span>
            <StatusPill status={o.status} style={{ height: 24, borderRadius: 12 }} />
          </div>
        ))}
        {orders.length === 0 && <span style={{ fontSize: 12, color: '#9A9A96' }}>No orders for this dish today</span>}
      </Card>
    </Drawer>
  );
}

function Label({ text, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{text}</span>
      {children}
    </div>
  );
}

function PhotoPicker({ img, height, label, onPick, align = 'end' }) {
  const pos = align === 'center' ? 'center' : 'flex-end';
  return (
    <label style={{
      height, flexShrink: 0, borderRadius: align === 'center' ? 20 : 24, overflow: 'hidden', cursor: 'pointer', position: 'relative',
      display: 'flex', alignItems: pos, justifyContent: pos, padding: 12, background: photoPlaceholder,
    }}>
      {img && <img src={img} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
      <span style={{ position: 'relative', height: 34, padding: '0 16px', borderRadius: 17, background: '#fff', color: '#111', display: 'flex', alignItems: 'center', fontSize: 12, fontWeight: 500 }}>{label}</span>
      <input type="file" accept="image/*" onChange={e => { readPhoto(e.target.files[0], onPick); e.target.value = ''; }} style={{ display: 'none' }} />
    </label>
  );
}
