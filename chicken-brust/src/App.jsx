import { Link, Navigate, Route, Routes } from 'react-router-dom';
import PhoneApp from './phone/PhoneApp.jsx';
import AdminApp from './admin/AdminApp.jsx';
import { IconArrowRight } from './shared/icons.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app" element={<PhoneApp />} />
      <Route path="/admin" element={<AdminApp />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function Landing() {
  const cards = [
    { to: '/app', title: 'Customer app', sub: 'Browse the menu, order and track delivery', dark: true },
    { to: '/admin', title: 'Admin panel', sub: 'Live orders, menu, riders, promos and settings' },
  ];
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px' }}>
      <div style={{ width: '100%', maxWidth: 720, display: 'flex', flexDirection: 'column', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#E0521B', color: '#fff', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>CB</div>
          <span style={{ fontSize: 17, fontWeight: 600 }}>Chicken Brust</span>
        </div>
        <div style={{ fontSize: 44, lineHeight: 1.05, fontWeight: 600, letterSpacing: '-0.035em' }}>
          Grilled <span style={{ color: '#A5A5A1', fontWeight: 500 }}>chicken</span><br />breast, delivered.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          {cards.map(c => (
            <Link key={c.to} to={c.to} style={{
              textDecoration: 'none', padding: 24, borderRadius: 28, background: c.dark ? '#111' : '#fff', color: c.dark ? '#fff' : '#111',
              display: 'flex', flexDirection: 'column', gap: 28,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{c.title}</span>
                <span style={{ fontSize: 13, opacity: 0.65 }}>{c.sub}</span>
              </div>
              <span style={{ alignSelf: 'flex-end', width: 48, height: 48, borderRadius: '50%', background: '#E0521B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <IconArrowRight stroke="#fff" width={2.4} size={20} />
              </span>
            </Link>
          ))}
        </div>
        <span style={{ fontSize: 12, color: '#9A9A96' }}>Tip: open the app and the admin in two tabs — menu, price and order-status changes sync live.</span>
      </div>
    </div>
  );
}
