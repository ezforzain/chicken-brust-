import { IconCamera } from '../../shared/icons.jsx';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80&auto=format&fit=crop';

const input = {
  height: 34, padding: '0 12px', borderRadius: 12, border: '1px solid #E6E6E3', background: '#F7F7F6', fontSize: 14, outline: 'none', minWidth: 0,
};
const pillBtn = { height: 34, padding: '0 14px', borderRadius: 17, fontSize: 12, cursor: 'pointer' };

export default function Profile({ app }) {
  const { s, set, go, flash } = app;

  const onAvatar = e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { set({ avatar: r.result }); flash('Photo updated'); };
    r.readAsDataURL(f);
    e.target.value = '';
  };

  const saveEdit = () => {
    const n = (s.draftName || '').trim(), p = (s.draftPhone || '').trim();
    if (!n) return flash('Name required');
    set({ editing: false, profName: n, profPhone: p || s.profPhone });
    flash('Profile saved');
  };

  const rows = [
    { label: 'My orders', go: () => go('track') }, { label: 'Saved addresses' }, { label: 'Payment methods' },
    { label: 'Favourites', go: () => go('home') }, { label: 'Help & support' }, { label: 'Intro screen', go: () => go('intro') },
    { label: 'Log out', color: '#E0521B', go: () => flash('Logged out (demo)') },
  ];

  return (
    <div className="no-scrollbar" style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '0 20px 130px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      <span style={{ position: 'sticky', top: 0, zIndex: 4, margin: '0 -20px', padding: '66px 22px 14px', background: '#F4F4F3', fontSize: 17, fontWeight: 600 }}>Profile</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, borderRadius: 28, background: '#fff' }}>
        <label title="Change photo" style={{ position: 'relative', width: 64, height: 64, flexShrink: 0, cursor: 'pointer', display: 'block' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', overflow: 'hidden' }}>
            <img src={s.avatar || DEFAULT_AVATAR} alt={s.profName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ position: 'absolute', right: -2, bottom: -2, width: 24, height: 24, borderRadius: '50%', background: '#E0521B', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconCamera size={12} stroke="#fff" width={2.4} />
          </span>
          <input type="file" accept="image/*" onChange={onAvatar} style={{ display: 'none' }} />
        </label>

        {!s.editing ? (
          <>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{s.profName}</span>
              <span style={{ fontSize: 13, color: '#9A9A96' }}>{s.profPhone}</span>
            </div>
            <button onClick={() => set({ editing: true, draftName: s.profName, draftPhone: s.profPhone })}
              style={{ ...pillBtn, border: 'none', background: '#111', color: '#fff' }}>Edit</button>
          </>
        ) : (
          <>
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <input value={s.draftName} onChange={e => set({ draftName: e.target.value })} placeholder="Name" aria-label="Name" style={{ ...input, fontWeight: 600 }} />
              <input value={s.draftPhone} onChange={e => set({ draftPhone: e.target.value })} placeholder="Phone" aria-label="Phone" style={{ ...input, fontSize: 13 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button onClick={saveEdit} style={{ ...pillBtn, border: 'none', background: '#E0521B', color: '#fff' }}>Save</button>
              <button onClick={() => set({ editing: false })} style={{ ...pillBtn, border: '1px solid #E6E6E3', background: '#fff', color: '#111' }}>Cancel</button>
            </div>
          </>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <Stat value={s.orders} label="Orders" />
        <Stat value="Rs 450" label="Wallet balance" color="#E0521B" />
      </div>

      <div style={{ borderRadius: 28, background: '#fff', padding: '6px 16px', display: 'flex', flexDirection: 'column' }}>
        {rows.map(r => (
          <div key={r.label} role="button" onClick={r.go} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 2px', borderBottom: '1px solid #F0F0EE',
            cursor: 'pointer', fontSize: 14, fontWeight: 500, color: r.color || '#111',
          }}><span>{r.label}</span><span style={{ color: '#B5B5B0' }}>›</span></div>
        ))}
      </div>
    </div>
  );
}

function Stat({ value, label, color = '#111' }) {
  return (
    <div style={{ padding: 16, borderRadius: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.03em', color }}>{value}</span>
      <span style={{ fontSize: 12, color: '#9A9A96' }}>{label}</span>
    </div>
  );
}
