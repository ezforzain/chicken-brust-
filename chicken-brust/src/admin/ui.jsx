import { ST } from './useAdminStore.js';

export function Switch({ on, onToggle, label, activeColor = '#111', offColor = '#D6D6D2' }) {
  return (
    <button type="button" role="switch" aria-checked={!!on} aria-label={label} className="switch"
      onClick={e => { e.stopPropagation(); onToggle(); }} style={{ background: on ? activeColor : offColor }}>
      <span style={{ left: on ? 19 : 3 }} />
    </button>
  );
}

export function StatusPill({ status, style }) {
  const st = ST[status];
  return <span className="status-pill" style={{ background: st.bg, color: st.color, ...style }}>{st.label}</span>;
}

export const Panel = ({ style, children, ...rest }) => (
  <div style={{ padding: 22, borderRadius: 28, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14, ...style }} {...rest}>{children}</div>
);

export function PanelTitle({ title, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
      {sub && <span style={{ fontSize: 12, color: '#9A9A96' }}>{sub}</span>}
    </div>
  );
}

// Rounded grey input field with optional prefix/suffix.
export function Field({ label, pre, post, value, onChange, placeholder, numeric, strong, accent, height = 48, style }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
      {label && <span style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>{label}</span>}
      <div style={{ height, borderRadius: height / 2, background: '#F3F3F2', display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px', ...style }}>
        {pre && <span style={{ fontSize: 12, color: '#9A9A96' }}>{pre}</span>}
        <input value={value} onChange={onChange} placeholder={placeholder} inputMode={numeric ? 'numeric' : undefined} style={{
          flex: 1, border: 'none', background: 'none', outline: 'none', fontSize: strong ? 15 : 14, fontWeight: strong ? 600 : 400,
          color: accent ? '#E0521B' : '#111', minWidth: 0,
        }} />
        {post && <span style={{ fontSize: 12, color: '#9A9A96' }}>{post}</span>}
      </div>
    </label>
  );
}

export function Drawer({ title, sub, onClose, headerExtra, footer, children }) {
  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label={title}>
        <div style={{ padding: '22px 22px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.02em' }}>{title}</span>
            {sub && <span style={{ fontSize: 12, color: '#9A9A96' }}>{sub}</span>}
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {headerExtra}
            <button onClick={onClose} aria-label="Close" style={{ width: 40, height: 40, borderRadius: '50%', border: 'none', background: '#fff', fontSize: 18, cursor: 'pointer' }}>×</button>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', minWidth: 0, padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {children}
        </div>
        {footer && <div style={{ padding: '14px 16px 16px', display: 'flex', gap: 10 }}>{footer}</div>}
      </aside>
    </>
  );
}

export const Card = ({ style, children, ...rest }) => (
  <div style={{ padding: 16, borderRadius: 24, background: '#fff', display: 'flex', flexDirection: 'column', gap: 14, ...style }} {...rest}>{children}</div>
);

export const bigBtn = (variant = 'dark') => ({
  flex: variant === 'dark' || variant === 'brand' ? 2 : 1, height: 54, borderRadius: 27, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
  background: variant === 'dark' ? '#111' : variant === 'brand' ? '#E0521B' : '#fff',
  color: variant === 'dark' || variant === 'brand' ? '#fff' : variant === 'danger' ? '#E0521B' : '#111',
});

// Striped placeholder shown where a dish photo is missing.
export const photoPlaceholder = 'repeating-linear-gradient(135deg,#F3F3F2 0 10px,#EDEDEA 10px 20px)';
