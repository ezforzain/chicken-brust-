import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DISHES, KEYS, U, readJSON, unitPrice, writeJSON } from '../shared/data.js';

export const RIDERS = [
  { id: 'r1', name: 'Usman Tariq', bike: 'Honda 125 · LEA-4471', rating: 4.9, trips: 11, avg: 22, img: U('1507003211169-0a1dd7228f2d', 160) },
  { id: 'r2', name: 'Hamza Ali', bike: 'Yamaha YBR · LEB-2210', rating: 4.8, trips: 9, avg: 24, img: U('1500648767791-00dcc994a43e', 160) },
  { id: 'r3', name: 'Faisal Raza', bike: 'Honda 70 · LEC-9083', rating: 4.7, trips: 7, avg: 26, img: U('1506794778202-cad84cf45f1d', 160) },
  { id: 'r4', name: 'Kamran Sheikh', bike: 'Suzuki GD · LED-1156', rating: 4.6, trips: 0, avg: 25, img: U('1472099645785-5658abf4ff4e', 160), offline: true },
];

// items: [dishId, sizeIndex, qty]
const ORDERS = [
  { id: 'CB-2047', customer: 'Ayesha Khan', phone: '+92 300 1234567', area: 'DHA Phase 5', items: [['grilled', 0, 1], ['peri', 1, 1]], pay: 'Cash', status: 'new', time: '9:41 PM' },
  { id: 'CB-2046', customer: 'Zain Malik', phone: '+92 321 4455667', area: 'Gulberg III', items: [['bowl', 0, 2]], pay: 'JazzCash', status: 'new', time: '9:38 PM' },
  { id: 'CB-2045', customer: 'Sana Iqbal', phone: '+92 333 9087612', area: 'Model Town', items: [['tray', 0, 1], ['fries', 0, 2]], pay: 'Card', status: 'prep', time: '9:30 PM' },
  { id: 'CB-2044', customer: 'Ahmed Raza', phone: '+92 345 1122334', area: 'DHA Phase 6', items: [['bbq', 1, 1]], pay: 'Cash', status: 'prep', time: '9:24 PM' },
  { id: 'CB-2043', customer: 'Hira Nadeem', phone: '+92 300 7766554', area: 'Johar Town', items: [['mixed', 0, 1], ['wrap', 0, 1]], pay: 'Easypaisa', status: 'out', time: '9:12 PM', rider: 'r1' },
  { id: 'CB-2042', customer: 'Omar Farooq', phone: '+92 322 3344556', area: 'Cantt', items: [['peririce', 0, 1]], pay: 'Card', status: 'out', time: '9:05 PM', rider: 'r2' },
  { id: 'CB-2041', customer: 'Maryam Aslam', phone: '+92 301 2233445', area: 'DHA Phase 5', items: [['saladbowl', 0, 2], ['lemon', 0, 1]], pay: 'Cash', status: 'done', time: '8:48 PM', rider: 'r1' },
  { id: 'CB-2040', customer: 'Bilal Hassan', phone: '+92 334 5566778', area: 'Gulberg II', items: [['grilled', 2, 1]], pay: 'JazzCash', status: 'done', time: '8:31 PM', rider: 'r3' },
  { id: 'CB-2039', customer: 'Fatima Noor', phone: '+92 300 8899001', area: 'Faisal Town', items: [['roast', 0, 1]], pay: 'Card', status: 'cancel', time: '8:20 PM' },
  { id: 'CB-2038', customer: 'Ali Shah', phone: '+92 321 6677889', area: 'DHA Phase 4', items: [['peri', 0, 3], ['fries', 0, 1]], pay: 'Cash', status: 'done', time: '8:02 PM', rider: 'r2' },
];

export const ST = {
  new: { label: 'New', bg: '#FCE7DD', color: '#A63A12', next: 'Accept' },
  prep: { label: 'On grill', bg: '#FBEFD3', color: '#7A5000', next: 'Hand to rider' },
  out: { label: 'On the way', bg: '#E2EAF8', color: '#234C94', next: 'Mark delivered' },
  done: { label: 'Delivered', bg: '#E0F0E4', color: '#2A6B40' },
  cancel: { label: 'Cancelled', bg: '#EDEDEA', color: '#6E6E6A' },
};
export const FLOW = ['new', 'prep', 'out', 'done'];
export const HOURS = [['12p', 4], ['1p', 9], ['2p', 7], ['3p', 5], ['4p', 6], ['5p', 10], ['6p', 14], ['7p', 19], ['8p', 22], ['9p', 17], ['10p', 0], ['11p', 0]];

export const CFG = {
  name: 'Chicken Brust', branch: 'DHA Phase 5, Lahore', phone: '+92 42 111 278 787', hours: '11am – 2am',
  fee: '150', freeOver: '1500', radius: '6', prep: '15',
  autoAccept: false, sound: true, sms: true, cod: true, wallet: true, card: true,
};

const defaultPrices = () => Object.fromEntries(DISHES.map(d => [d.id, String(d.price)]));
const defaultAvail = () => Object.fromEntries(DISHES.map(d => [d.id, d.id !== 'roast']));

const initialState = () => {
  const m = readJSON(KEYS.menu, null) || {};
  const saved = readJSON(KEYS.admin, {});
  return {
    page: 'dash', query: '', orders: ORDERS, filter: 'all', selId: null, confirmId: null, store: true, toast: '', cat: 'All',
    promos: [{ code: 'BRUST10', pct: 10, uses: 184, on: true }, { code: 'FIRSTBITE', pct: 20, uses: 62, on: true }, { code: 'RAMZAN15', pct: 15, uses: 410, on: false }],
    newCode: '', newPct: 10,
    cfg: CFG, savedCfg: CFG,
    editId: null, edDraft: null, addOpen: false, ndName: '', ndCat: 'Grilled', ndPrice: '', ndImg: '',
    extra: m.extra || [], imgs: m.imgs || {}, meta: m.meta || {},
    prices: { ...defaultPrices(), ...m.prices },
    avail: { ...defaultAvail(), ...m.avail },
    ...saved,
    cfg: saved.savedCfg || CFG,
  };
};

// Downscale an uploaded photo so it fits in localStorage.
export const readPhoto = (file, cb) => {
  if (!file) return;
  const r = new FileReader();
  r.onload = () => {
    const im = new Image();
    im.onload = () => {
      const sc = Math.min(1, 600 / Math.max(im.width, im.height));
      const c = document.createElement('canvas');
      c.width = im.width * sc; c.height = im.height * sc;
      c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
      cb(c.toDataURL('image/jpeg', 0.8));
    };
    im.src = r.result;
  };
  r.readAsDataURL(file);
};

export function useAdminStore() {
  const [s, setS] = useState(initialState);
  const set = useCallback(patch => setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })), []);
  const timers = useRef({});
  const [, tick] = useState(0);

  const flash = useCallback(toast => {
    clearTimeout(timers.current.toast);
    set({ toast });
    timers.current.toast = setTimeout(() => set({ toast: '' }), 1800);
  }, [set]);

  useEffect(() => {
    const clk = setInterval(() => tick(n => n + 1), 30000); // keeps the header clock fresh
    const t = timers.current;
    return () => { clearInterval(clk); clearTimeout(t.toast); clearTimeout(t.confirm); };
  }, []);

  // Persist admin UI state.
  useEffect(() => {
    writeJSON(KEYS.admin, { page: s.page, orders: s.orders, filter: s.filter, cat: s.cat, store: s.store, promos: s.promos, savedCfg: s.savedCfg });
  }, [s.page, s.orders, s.filter, s.cat, s.store, s.promos, s.savedCfg]);

  // Publish menu changes to the customer app.
  const menuFailed = useRef(false);
  useEffect(() => {
    const ok = writeJSON(KEYS.menu, { extra: s.extra, prices: s.prices, avail: s.avail, imgs: s.imgs, meta: s.meta });
    if (!ok && !menuFailed.current) flash('Photo too large to save');
    menuFailed.current = !ok;
  }, [s.extra, s.prices, s.avail, s.imgs, s.meta, flash]);

  // Publish order statuses to the customer app (drives its tracking screen).
  useEffect(() => {
    writeJSON(KEYS.orders, Object.fromEntries(s.orders.map(o => [o.id, o.status])));
  }, [s.orders]);

  // ---- Derived ----
  const derived = useMemo(() => {
    const ALL = [...s.extra, ...DISHES].map(d => ({ ...d, ...(s.meta[d.id] || {}), ...(s.imgs[d.id] ? { img: s.imgs[d.id] } : {}) }));
    const dish = id => ALL.find(d => d.id === id) || DISHES[0];
    const price = d => Number(s.prices[d.id]) || d.price;
    const total = o => o.items.reduce((a, [id, sz, q]) => a + unitPrice(price(dish(id)), sz) * q, 0);
    const summary = o => o.items.map(([id, , q]) => q + '× ' + dish(id).name).join(', ');
    const busy = new Set(s.orders.filter(o => o.status === 'out' && o.rider).map(o => o.rider));
    const counts = Object.fromEntries(Object.keys(ST).map(k => [k, s.orders.filter(o => o.status === k).length]));
    const live = s.orders.filter(o => o.status !== 'cancel');
    const sales = live.reduce((a, o) => a + total(o), 0);
    return { ALL, dish, price, total, summary, busy, counts, live, sales };
  }, [s.extra, s.meta, s.imgs, s.prices, s.orders]);

  // ---- Actions ----
  const patchOrder = useCallback((id, p) => set(st => ({ orders: st.orders.map(o => (o.id === id ? { ...o, ...p } : o)) })), [set]);

  const advance = useCallback(o => {
    const nx = FLOW[FLOW.indexOf(o.status) + 1];
    if (!nx) return;
    if (nx === 'out' && !o.rider) {
      const free = RIDERS.find(r => !r.offline && !derived.busy.has(r.id));
      if (!free) { set({ selId: o.id }); flash('No rider available right now'); return; }
      patchOrder(o.id, { status: 'out', rider: free.id });
      flash(o.id + ' → ' + free.name + ' (On the way)');
      return;
    }
    patchOrder(o.id, { status: nx });
    flash(o.id + ' → ' + ST[nx].label);
  }, [derived.busy, patchOrder, set, flash]);

  const cancel = useCallback(o => {
    patchOrder(o.id, { status: 'cancel', rider: null });
    set({ confirmId: null });
    flash(o.id + ' cancelled');
  }, [patchOrder, set, flash]);

  // Two-step cancel from list rows: first click arms, second click confirms (auto-disarms after 3s).
  const armCancel = useCallback(o => {
    if (s.confirmId !== o.id) {
      clearTimeout(timers.current.confirm);
      set({ confirmId: o.id });
      timers.current.confirm = setTimeout(() => set({ confirmId: null }), 3000);
      return;
    }
    cancel(o);
  }, [s.confirmId, set, cancel]);

  const toggleAvail = useCallback(d => {
    set(st => ({ avail: { ...st.avail, [d.id]: !st.avail[d.id] } }));
    flash(d.name + (s.avail[d.id] ? ' sold out' : ' back in stock'));
  }, [s.avail, set, flash]);

  const setPrice = useCallback((id, v) => set(st => ({ prices: { ...st.prices, [id]: v.replace(/\D/g, '') } })), [set]);

  const setPhoto = useCallback((d, img) => set(st => (d.isNew
    ? { extra: st.extra.map(x => (x.id === d.id ? { ...x, img } : x)) }
    : { imgs: { ...st.imgs, [d.id]: img } })), [set]);

  return { s, set, flash, patchOrder, advance, cancel, armCancel, toggleAvail, setPrice, setPhoto, ...derived };
}
