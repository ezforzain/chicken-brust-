import { Link } from 'react-router-dom';
import { useAdminStore } from './useAdminStore.js';
import { IconBell, IconGear, IconLogout, IconPath, IconSearch } from '../shared/icons.jsx';
import { Switch } from './ui.jsx';
import { Dashboard, Menu, Orders, Promos, Riders, Settings } from './pages.jsx';
import { AddDishDrawer, DishDrawer, OrderDrawer } from './drawers.jsx';

const NAV = [
  ['dash', 'Dashboard', 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z'],
  ['orders', 'Orders', 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6'],
  ['menu', 'Menu', 'M5 3v8a3 3 0 0 0 6 0V3M8 3v18M17 3c-2 2-2 7 0 9v9'],
  ['riders', 'Riders', 'M5 17a2 2 0 1 0 0 .1M19 17a2 2 0 1 0 0 .1M7 17h8l3-6h-5l-2-4H8M14 7h3'],
  ['promos', 'Promos', 'M3 12l9-9h8v8l-9 9zM16 8h.01'],
];
const TITLES = { dash: 'Dashboard', orders: 'Orders', menu: 'Menu', riders: 'Riders', promos: 'Promo codes', settings: 'Settings' };
const PAGES = { dash: Dashboard, orders: Orders, menu: Menu, riders: Riders, promos: Promos, settings: Settings };

// Sidebar palette (dark theme from the design).
const SB = { bg: '#111', text: '#fff', muted: '#8A8A86', card: '#1E1E1D', line: '#262625', navText: '#A5A5A1' };

export default function AdminApp() {
  const admin = useAdminStore();
  const { s, set, flash, counts } = admin;
  const Page = PAGES[s.page] || Dashboard;
  const now = new Date();
  const today = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' }) + ' · ' + now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const navBtn = active => ({ background: active ? '#fff' : 'transparent', color: active ? '#111' : SB.navText });

  return (
    <div className="admin">
      <aside className="admin-sidebar" style={{ background: SB.bg, color: SB.text }}>
        <Link to="/" className="admin-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px', textDecoration: 'none', color: 'inherit' }}>
          <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: '#E0521B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>CB</div>
          <div className="hide-collapsed" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>Chicken Brust</span>
            <span style={{ fontSize: 11, color: SB.muted }}>Admin panel</span>
          </div>
        </Link>

        <div className="hide-collapsed" style={{ padding: 14, borderRadius: 22, background: SB.card, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.store ? '#3BB26B' : '#8A8A86', boxShadow: '0 0 0 4px ' + (s.store ? 'rgba(59,178,107,0.22)' : 'transparent') }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{s.store ? 'Store open' : 'Store closed'}</span>
            </div>
            <Switch on={s.store} label="Store open" activeColor="#E0521B" offColor="#555" onToggle={() => {
              set({ store: !s.store });
              flash(s.store ? 'Store closed — new orders paused' : 'Store is open');
            }} />
          </div>
          <span style={{ fontSize: 11, lineHeight: 1.4, color: SB.muted }}>{s.savedCfg.branch} · {s.savedCfg.hours}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="hide-collapsed" style={{ padding: '0 16px', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: SB.muted }}>Manage</span>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {NAV.map(([k, label, icon]) => {
              const badge = k === 'orders' ? counts.new : 0;
              return (
                <button key={k} className="nav-btn" title={label} aria-current={k === s.page ? 'page' : undefined}
                  onClick={() => set({ page: k, query: '' })} style={navBtn(k === s.page)}>
                  <IconPath d={icon} stroke="currentColor" />
                  <span className="hide-collapsed" style={{ flex: 1 }}>{label}</span>
                  {badge > 0 && (
                    <span className="nav-badge" style={{ minWidth: 20, height: 20, borderRadius: 10, background: '#E0521B', color: '#fff', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 6px' }}>{badge}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 16, borderTop: '1px solid ' + SB.line }}>
          <button className="nav-btn" title="Settings" onClick={() => set({ page: 'settings', query: '' })} style={{ ...navBtn(s.page === 'settings'), height: 42 }}>
            <IconGear stroke="currentColor" /><span className="hide-collapsed">Settings</span>
          </button>
          <button className="nav-btn" title="Log out" onClick={() => flash('Logged out (demo)')} style={{ height: 42, background: 'transparent', color: '#E0521B' }}>
            <IconLogout stroke="currentColor" /><span className="hide-collapsed">Log out</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontSize: 12, color: '#9A9A96' }}>{today}</span>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: '-0.035em' }}>{TITLES[s.page]}</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="admin-search" style={{ width: 280, maxWidth: '100%', height: 46, borderRadius: 23, background: '#fff', display: 'flex', alignItems: 'center', gap: 10, padding: '0 18px' }}>
              <IconSearch size={16} />
              <input value={s.query} aria-label="Search"
                onChange={e => set({ query: e.target.value, page: ['menu', 'orders'].includes(s.page) ? s.page : 'orders' })}
                placeholder="Search orders, customers or dishes" style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 13, minWidth: 0 }} />
            </div>
            <button onClick={() => set({ page: 'orders', filter: 'new' })} aria-label="New orders" style={{ position: 'relative', width: 46, height: 46, borderRadius: '50%', border: 'none', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <IconBell />
              {counts.new > 0 && <span style={{ position: 'absolute', top: 9, right: 10, width: 9, height: 9, borderRadius: '50%', background: '#E0521B', border: '2px solid #fff', boxSizing: 'content-box' }} />}
            </button>
            <div className="admin-user" style={{ display: 'flex', alignItems: 'center', gap: 10, height: 46, padding: '0 16px 0 5px', borderRadius: 23, background: '#fff' }}>
              <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=120&q=70&auto=format&fit=crop" alt="Bilal Ahmed" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }} />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Bilal Ahmed</span>
                <span style={{ fontSize: 11, color: '#9A9A96' }}>Branch manager</span>
              </div>
            </div>
          </div>
        </header>

        <Page admin={admin} />
      </main>

      {s.selId && <OrderDrawer admin={admin} />}
      {s.addOpen && <AddDishDrawer admin={admin} />}
      {s.editId && <DishDrawer admin={admin} />}

      {s.toast && (
        <div role="status" style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', zIndex: 60, background: '#111', color: '#fff', fontSize: 13, padding: '12px 20px', borderRadius: 22, whiteSpace: 'nowrap' }}>
          {s.toast}
        </div>
      )}
    </div>
  );
}
