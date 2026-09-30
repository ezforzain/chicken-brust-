import { chip, fmt } from '../../shared/data.js';
import { IconChevronLeft, IconFilter, IconSearch } from '../../shared/icons.jsx';

const CATS = ['All', 'Grilled', 'Peri peri', 'Bowls', 'Sides'];
const SORTS = [['pop', 'Popular'], ['low', 'Price: low to high'], ['high', 'Price: high to low'], ['rating', 'Top rated']];

export default function Home({ app }) {
  const { s, set, go, add, flash, D } = app;
  const q = s.query.trim().toLowerCase();
  const sort = s.sort || 'pop';
  const menu = D
    .filter(d => !d.off && (s.cat === 'All' || d.cat === s.cat) && (!q || d.name.toLowerCase().includes(q)))
    .sort((a, b) => (sort === 'low' ? a.price - b.price : sort === 'high' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0));

  return (
    <div className="no-scrollbar" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '0 20px 130px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <button className="icon-btn" onClick={() => go('intro')} aria-label="Back" style={{ marginTop: 62, marginBottom: -6 }}><IconChevronLeft /></button>
      <div style={{ fontSize: 30, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.035em' }}>
        Which <span style={{ color: '#A5A5A1', fontWeight: 500 }}>chicken</span><br />breast today?
      </div>

      {/* Sticky search + sort */}
      <div style={{ position: 'sticky', top: 0, zIndex: 4, margin: '-8px -20px', padding: '52px 20px 8px', background: '#F4F4F3', display: 'flex', gap: 10 }}>
        <div style={{ flex: 1, height: 52, borderRadius: 26, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
          <IconSearch size={17} />
          <input value={s.query} onChange={e => set({ query: e.target.value })} placeholder="Search dishes" aria-label="Search dishes"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 14, minWidth: 0 }} />
        </div>
        {s.filterOpen && (
          <div style={{
            position: 'absolute', top: 118, right: 20, width: 220, padding: 8, borderRadius: 24, background: '#fff',
            boxShadow: '0 18px 40px rgba(0,0,0,0.14)', display: 'flex', flexDirection: 'column', gap: 2, zIndex: 8,
          }}>
            <span style={{ padding: '8px 12px 6px', fontSize: 11, fontWeight: 600, color: '#9A9A96', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Sort by</span>
            {SORTS.map(([k, label]) => (
              <button key={k} onClick={() => set({ sort: k, filterOpen: false })} style={{
                height: 42, padding: '0 12px', borderRadius: 14, border: 'none', background: k === sort ? '#F4F4F3' : '#fff', color: '#111',
                fontSize: 13.5, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left',
              }}>{label}<span style={{ color: '#E0521B', fontWeight: 700 }}>{k === sort ? '✓' : ''}</span></button>
            ))}
          </div>
        )}
        <button onClick={() => set({ filterOpen: !s.filterOpen })} aria-label="Sort" aria-expanded={s.filterOpen} style={{
          position: 'relative', width: 52, height: 52, borderRadius: 18, background: s.filterOpen ? '#111' : '#fff', border: '1px solid #E6E6E3',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, padding: 0,
        }}>
          <IconFilter size={20} stroke={s.filterOpen ? '#fff' : '#111'} />
          {sort !== 'pop' && <span style={{ position: 'absolute', top: 9, right: 9, width: 8, height: 8, borderRadius: '50%', background: '#E0521B', border: '2px solid #fff', boxSizing: 'content-box' }} />}
        </button>
      </div>

      <div className="no-scrollbar" style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -20px', padding: '0 20px', flexShrink: 0 }}>
        {CATS.map(c => <button key={c} className="chip" onClick={() => set({ cat: c })} style={chip(c === s.cat)}>{c}</button>)}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {menu.map(d => (
          <div key={d.id} onClick={() => set({ dishId: d.id, size: 0, screen: 'detail' })} style={{
            background: '#fff', borderRadius: 26, padding: 10, display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
          }}>
            <div style={{ height: 128, borderRadius: 18, overflow: 'hidden', background: '#F3F3F2' }}>
              <img src={d.img} alt={d.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 18 }} />
            </div>
            <div style={{ padding: '0 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</span>
              <span style={{ fontSize: 11, color: '#9A9A96' }}>{d.kcal} kcal · ★ {d.rating}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 4 }}>
              <span style={{ color: '#E0521B', fontSize: 16, fontWeight: 600 }}><span style={{ fontSize: 11 }}>Rs</span> {fmt(d.price)}</span>
              <button aria-label={'Add ' + d.name} onClick={e => { e.stopPropagation(); add(d.id, 0); flash(d.name + ' added to cart'); }} style={{
                width: 30, height: 30, borderRadius: '50%', border: 'none', background: '#111', color: '#fff', fontSize: 17, cursor: 'pointer',
              }}>+</button>
            </div>
          </div>
        ))}
      </div>
      {menu.length === 0 && <div style={{ padding: '32px 0', textAlign: 'center', color: '#9A9A96', fontSize: 14 }}>No dishes match your search</div>}
    </div>
  );
}
