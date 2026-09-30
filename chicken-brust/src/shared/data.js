// Shared catalog + helpers used by both the customer app and the admin panel.

export const U = (id, w = 600) =>
  'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + w + '&q=70';

export const BRAND = '#E0521B';

// One catalog for both sides. `sold` = today's sales shown in admin, `side` = shows under "Often ordered with".
export const DISHES = [
  { id: 'grilled', name: 'Grilled Breast', cat: 'Grilled', price: 890, kcal: 350, rating: 4.8, reviews: 312, sold: 64, tag: 'Herb & garlic, charcoal grilled', desc: 'Boneless chicken breast, marinated overnight in herb-garlic, then grilled over charcoal. Juicy, lean and packed with protein — healthy comfort food.', img: U('1532550907401-a500c9a57435', 1000) },
  { id: 'peri', name: 'Peri Peri Breast', cat: 'Peri peri', price: 950, kcal: 380, rating: 4.7, reviews: 208, sold: 51, tag: 'Spicy peri peri glaze', desc: 'Flame-grilled breast with a bold peri peri sauce. Smoky, tangy and a little spicy.', img: U('1643594462181-7667928d072e') },
  { id: 'lemon', name: 'Lemon Pepper', cat: 'Grilled', price: 920, kcal: 340, rating: 4.6, reviews: 164, sold: 22, tag: 'Zesty lemon, black pepper', desc: 'Pan-seared breast with fresh lemon and crushed black pepper. Light and fresh.', img: U('1670398564097-0762e1b30b3a') },
  { id: 'bowl', name: 'Tikka Breast Bowl', cat: 'Bowls', price: 780, kcal: 520, rating: 4.9, reviews: 421, sold: 58, tag: 'Rice, salad, mint raita', desc: 'Tikka-style breast slices, cumin rice, fresh salad and mint raita — a complete meal bowl.', img: U('1762631934518-f75e233413ca') },
  { id: 'bbq', name: 'BBQ Glazed Breast', cat: 'Grilled', price: 990, kcal: 410, rating: 4.7, reviews: 256, sold: 31, tag: 'Smoky BBQ glaze, charred edges', desc: 'Breast glazed in sweet-smoky BBQ sauce and charred over high heat. Served with coleslaw.', img: U('1657048465421-087063313187') },
  { id: 'roast', name: 'Roast Breast & Potatoes', cat: 'Grilled', price: 1090, kcal: 540, rating: 4.8, reviews: 198, sold: 18, tag: 'Oven roast, herb potatoes', desc: 'Oven-roasted breast with rosemary and garlic, served with crispy herb potatoes.', img: U('1703219342277-1a78d6b4a27f') },
  { id: 'tray', name: 'Family Grill Tray', cat: 'Grilled', price: 2450, kcal: 1480, rating: 4.9, reviews: 344, sold: 12, tag: '4 breasts, 3 sides, 2 dips', desc: 'Four grilled breasts, fries, salad, rice and two dips — for the whole family.', img: U('1668838195568-6a336797587f') },
  { id: 'polenta', name: 'Creamy Polenta Breast', cat: 'Bowls', price: 1150, kcal: 590, rating: 4.6, reviews: 87, sold: 9, tag: 'Polenta, mushrooms, jus', desc: 'Sliced grilled breast and sautéed mushrooms on soft, creamy polenta.', img: U('1778851243090-10cec14c7ee7') },
  { id: 'mushroom', name: 'Mushroom Sauce Breast', cat: 'Grilled', price: 1050, kcal: 470, rating: 4.7, reviews: 152, sold: 14, tag: 'Creamy mushroom sauce', desc: 'Pan-seared breast with creamy mushroom sauce and steamed veggies.', img: U('1642689690500-f429a042cad1') },
  { id: 'bruschetta', name: 'Chicken Bruschetta', cat: 'Sides', price: 480, kcal: 290, rating: 4.4, reviews: 73, sold: 8, tag: 'Toasted bread, tomato, chicken', desc: 'Shredded chicken, fresh tomato and basil on crispy toast.', img: U('1612871689804-26a67131416e') },
  { id: 'mixed', name: 'Mixed Grill Platter', cat: 'Peri peri', price: 1850, kcal: 1120, rating: 4.8, reviews: 221, sold: 15, tag: 'Peri breast, kebabs, grilled veg', desc: 'Peri peri breast, chicken kebabs and grilled vegetables — a big platter.', img: U('1777195132418-a4c365717f2e') },
  { id: 'peririce', name: 'Peri Peri Rice Bowl', cat: 'Bowls', price: 850, kcal: 610, rating: 4.7, reviews: 176, sold: 27, tag: 'Spicy rice, peri breast, salad', desc: 'Sliced breast, corn and salad on peri peri spiced rice.', img: U('1781334266250-a7e72fdf539f') },
  { id: 'saladbowl', name: 'Chicken Salad Bowl', cat: 'Bowls', price: 720, kcal: 330, rating: 4.6, reviews: 134, sold: 20, tag: 'Greens, nuts, grilled strips', desc: 'Fresh greens, roasted nuts and grilled breast strips with lemon dressing.', img: U('1781332149415-f420708ab98f') },
  { id: 'periwrap', name: 'Peri Peri Wrap Plate', cat: 'Peri peri', price: 690, kcal: 520, rating: 4.5, reviews: 118, sold: 17, tag: 'Flatbread, peri strips, veggies', desc: 'Warm flatbread with peri peri chicken strips and crunchy vegetables.', img: U('1777891258069-454e66f8bedc') },
  { id: 'fries', name: 'Crispy strips', cat: 'Sides', price: 390, kcal: 410, rating: 4.6, reviews: 188, sold: 44, tag: 'Crumb-fried breast strips', desc: 'Thin breast strips, golden-fried in a crispy crumb coating. Served with garlic mayo dip.', img: U('1598515214211-89d3c73ae83b', 300), side: true },
  { id: 'salad', name: 'Garden salad', cat: 'Sides', price: 250, kcal: 160, rating: 4.5, reviews: 96, sold: 16, tag: 'Fresh greens, nuts, lemon dressing', desc: 'Fresh lettuce, cucumber, tomato and roasted nuts with a light lemon dressing.', img: U('1781332149415-f420708ab98f', 300), side: true },
  { id: 'wrap', name: 'Flatbread plate', cat: 'Sides', price: 450, kcal: 480, rating: 4.7, reviews: 142, sold: 19, tag: 'Grilled strips, flatbread, veggies', desc: 'Warm flatbread, grilled chicken strips and roasted vegetables — perfect for sharing.', img: U('1777891258069-454e66f8bedc', 300), side: true },
  { id: 'rice', name: 'Rice platter', cat: 'Sides', price: 520, kcal: 560, rating: 4.8, reviews: 203, sold: 21, tag: 'Zeera rice, roast chicken, salad', desc: 'Fragrant cumin rice, roast chicken pieces and salad — a hearty meal.', img: U('1781334266250-a7e72fdf539f', 300), side: true },
];

export const CATEGORIES = ['Grilled', 'Peri peri', 'Bowls', 'Sides'];
export const SIZES = [{ label: 'Regular', m: 1 }, { label: 'Large', m: 1.35 }, { label: 'Double', m: 1.8 }];
export const FALLBACK_IMG = U('1532550907401-a500c9a57435');

// Portion price, rounded to the nearest Rs 10.
export const unitPrice = (price, size) => Math.round((price * SIZES[size].m) / 10) * 10;
export const fmt = n => Math.round(n).toLocaleString('en-PK');

// Selected / unselected chip colours.
export const chip = (sel, border = '#E0E0DC') =>
  sel ? { background: '#111', color: '#fff', borderColor: '#111' } : { background: 'transparent', color: '#111', borderColor: border };

// ---- localStorage (shared between the app and the admin, also across tabs) ----
export const KEYS = {
  menu: 'chicken-brust-menu', // admin → app: prices, availability, photos, new dishes
  orders: 'chicken-brust-orders', // admin → app: order id → status
  phone: 'cb_phone_main',
  admin: 'cb_admin_state',
};

export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// Customer-facing menu = base catalog + admin overrides.
export const buildMenu = m => {
  const extra = ((m && m.extra) || []).map(x => ({
    kcal: 400, reviews: 0, tag: x.cat, desc: x.name + ' — our newest dish.', ...x,
    img: x.img || FALLBACK_IMG, rating: x.rating || 4.5,
  }));
  return [...extra, ...DISHES].map(d => {
    const p = m && m.prices && Number(m.prices[d.id]);
    return {
      ...d,
      ...((m && m.meta && m.meta[d.id]) || {}),
      img: (m && m.imgs && m.imgs[d.id]) || d.img,
      price: p || d.price,
      off: !!(m && m.avail && m.avail[d.id] === false),
    };
  });
};

export const clockTime = (ms, ampm) => {
  const d = new Date(ms), h = d.getHours();
  return ((h % 12) || 12) + ':' + String(d.getMinutes()).padStart(2, '0') + (ampm ? (h < 12 ? ' AM' : ' PM') : '');
};
