import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DISHES, KEYS, U, buildMenu, clockTime, readJSON, unitPrice, writeJSON } from '../shared/data.js';

export const COOKS = [
  { label: 'Rare', t: 52 }, { label: 'Medium rare', t: 57 }, { label: 'Medium', t: 62 },
  { label: 'Medium well', t: 68 }, { label: 'Well done', t: 74 },
];
export const COOK_IMG = ['1657048465421-087063313187', '1703219342277-1a78d6b4a27f', '1668838195568-6a336797587f', '1778851243090-10cec14c7ee7', '1642689690500-f429a042cad1'].map(id => U(id, 200));
export const STEPS = ['Order confirmed', 'On the grill', 'Rider on the way', 'Delivered'];
export const TRACKED_ORDER = 'CB-2047';
export const RIDER = { name: 'Usman Tariq', rating: 4.9, img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=85&auto=format&fit=crop' };

// Minutes after "confirmed" each step is expected at.
const STEP_OFFSET = [0, 5, 17, 27];
const ADMIN_STAGE = { new: 0, prep: 1, out: 2, done: 3 };

// State that survives a reload.
const KEEP = ['screen', 'dishId', 'size', 'cook', 'cat', 'cart', 'favs', 'pay', 'time', 'stage', 'stageAt', 'orders', 'msgs',
  'profName', 'profPhone', 'avatar', 'sort', 'discountPct', 'promo', 'promoMsg'];

const initialState = () => ({
  screen: 'intro', dishId: 'grilled', size: 0, cook: 2, cat: 'All', query: '', sort: 'pop', filterOpen: false,
  cart: [{ key: 'grilled-0', id: 'grilled', size: 0, qty: 1 }, { key: 'peri-1', id: 'peri', size: 1, qty: 1 }],
  promo: '', discountPct: 0, promoMsg: '', favs: {},
  chatOpen: false, callOpen: false, callSec: -1, muted: false, speaker: false, draft: '',
  msgs: [{ me: false, text: 'Hi! I have picked up your order, I will be there in 10 minutes.', time: clockTime(Date.now()) }],
  time: 0, schedDay: 0, schedSlot: null, pay: 0, stage: 0, stageAt: null, cancelled: false, orders: 12, toast: '',
  profName: 'Ayesha Khan', profPhone: '+92 300 1234567', avatar: '', editing: false, draftName: '', draftPhone: '',
  swap: false, now: Date.now(),
  dishes: buildMenu(readJSON(KEYS.menu, null)),
});

export function usePhoneStore() {
  const [s, setS] = useState(() => {
    const saved = readJSON(KEYS.phone, {});
    const init = initialState();
    for (const k of KEEP) if (saved[k] !== undefined && saved[k] !== null) init[k] = saved[k];
    return init;
  });

  // setState with class-component semantics: shallow merge, object or updater fn.
  const set = useCallback(patch => setS(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) })), []);
  const timers = useRef({});

  const flash = useCallback(toast => {
    clearTimeout(timers.current.toast);
    set({ toast });
    timers.current.toast = setTimeout(() => set({ toast: '' }), 1600);
  }, [set]);

  const go = useCallback(screen => set({ screen, filterOpen: false }), [set]);

  const add = useCallback((id, size) => set(p => {
    const key = id + '-' + size, ex = p.cart.find(c => c.key === key);
    return { cart: ex ? p.cart.map(c => (c.key === key ? { ...c, qty: c.qty + 1 } : c)) : [...p.cart, { key, id, size, qty: 1 }] };
  }), [set]);

  const qty = useCallback((key, d) => set(p => ({
    cart: p.cart.map(c => (c.key === key ? { ...c, qty: c.qty + d } : c)).filter(c => c.qty > 0),
  })), [set]);

  const send = useCallback(text => {
    const t = (text || '').trim();
    if (!t) return;
    const tm = clockTime(Date.now());
    set(p => ({ msgs: [...p.msgs, { me: true, text: t, time: tm }], draft: '' }));
    clearTimeout(timers.current.reply);
    timers.current.reply = setTimeout(() => set(p => ({ msgs: [...p.msgs, { me: false, text: 'Okay, noted!', time: tm }] })), 1400);
  }, [set]);

  const startCall = useCallback(() => {
    clearInterval(timers.current.call);
    set({ callOpen: true, callSec: -1, muted: false, speaker: false });
    timers.current.call = setInterval(() => set(p => ({ callSec: p.callSec + 1 })), 1000);
  }, [set]);

  const endCall = useCallback(() => {
    clearInterval(timers.current.call);
    set({ callOpen: false });
    flash('Call ended');
  }, [set, flash]);

  // Persist the durable part of the state.
  const snapRef = useRef('');
  useEffect(() => {
    const snap = Object.fromEntries(KEEP.map(k => [k, s[k]]));
    const json = JSON.stringify(snap);
    if (json === snapRef.current) return;
    snapRef.current = json;
    writeJSON(KEYS.phone, snap);
  }, [s]);

  // Live sync with the admin panel (menu edits + order status), and a 1s clock tick.
  useEffect(() => {
    let lastStatus;
    const syncOrder = () => {
      const st = readJSON(KEYS.orders, {})[TRACKED_ORDER];
      if (st === lastStatus) return;
      lastStatus = st;
      const idx = ADMIN_STAGE[st];
      if (idx != null) {
        set(p => {
          const at = { ...(p.stageAt || {}) };
          for (let i = 0; i <= idx; i++) if (!at[i]) at[i] = Date.now();
          return { stage: idx, cancelled: false, stageAt: at };
        });
      } else if (st === 'cancel') set({ cancelled: true });
    };
    const onStorage = e => {
      if (e.key === KEYS.menu) set({ dishes: buildMenu(readJSON(KEYS.menu, null)) });
      if (e.key === KEYS.orders) syncOrder();
    };
    syncOrder();
    set({ dishes: buildMenu(readJSON(KEYS.menu, null)) });
    window.addEventListener('storage', onStorage);
    const tick = setInterval(() => set({ now: Date.now() }), 1000);
    const t = timers.current;
    return () => {
      window.removeEventListener('storage', onStorage);
      clearInterval(tick);
      clearTimeout(t.toast); clearTimeout(t.reply); clearInterval(t.call); clearTimeout(t.swap); clearTimeout(t.slide);
    };
  }, [set]);

  // ---- Derived values ----
  const derived = useMemo(() => {
    const D = s.dishes;
    const find = id => D.find(d => d.id === id) || DISHES[0];
    const dish = find(s.dishId);
    const cartItems = s.cart.filter(c => D.some(d => d.id === c.id));
    const subtotal = cartItems.reduce((a, c) => a + unitPrice(find(c.id).price, c.size) * c.qty, 0);
    const discount = Math.round((subtotal * s.discountPct) / 100);
    const delivery = subtotal === 0 || subtotal - discount >= 1500 ? 0 : 150;
    const total = subtotal - discount + delivery;
    const count = cartItems.reduce((a, c) => a + c.qty, 0);

    const nowMs = s.now || Date.now();
    const at = s.stageAt || { 0: nowMs };
    const base = at[0] || nowMs;
    const stepMs = i => at[i] || Math.max(base + STEP_OFFSET[i] * 60000, (at[s.stage] || nowMs) + (STEP_OFFSET[i] - STEP_OFFSET[s.stage]) * 60000);

    return { D, find, dish, cartItems, subtotal, discount, delivery, total, count, nowMs, stepMs };
  }, [s.dishes, s.dishId, s.cart, s.discountPct, s.now, s.stageAt, s.stage]);

  return { s, set, go, flash, add, qty, send, startCall, endCall, timers, ...derived };
}
