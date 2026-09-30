import { IconArrowLeft } from '../../shared/icons.jsx';

// Favourite toggle for a dish, with a toast.
export function useFav({ s, set, flash }, id) {
  const on = !!s.favs[id];
  return {
    on,
    toggle: () => {
      set(p => ({ favs: { ...p.favs, [id]: !on } }));
      flash(on ? 'Removed from favourites' : 'Added to favourites');
    },
  };
}

// Back button + title used at the top of Cart / Checkout / Track.
export function TopBar({ onBack, children }) {
  return (
    <div style={{ position: 'absolute', top: 62, left: 22, right: 22, display: 'flex', alignItems: 'center', gap: 12, zIndex: 5 }}>
      <button className="icon-btn" onClick={onBack} aria-label="Back"><IconArrowLeft /></button>
      {children}
    </div>
  );
}

// Scrollable content area under the TopBar.
export function ScrollBody({ top = 120, children }) {
  return (
    <div className="no-scrollbar" style={{
      position: 'absolute', top, left: 0, right: 0, bottom: 0, overflowY: 'auto', padding: '0 16px 130px',
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>{children}</div>
  );
}

export const Card = ({ style, children }) => (
  <div style={{ padding: 18, borderRadius: 26, background: '#fff', display: 'flex', flexDirection: 'column', gap: 12, ...style }}>{children}</div>
);

export function Row({ label, value, strong }) {
  return strong ? (
    <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid #EDEDEA', fontWeight: 600, fontSize: 15 }}>
      <span>{label}</span><span>{value}</span>
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8A8A86' }}>
      <span>{label}</span><span style={{ color: '#111' }}>{value}</span>
    </div>
  );
}

// Order totals block used in Cart and Checkout.
export function Totals({ app, itemsLabel = 'Subtotal' }) {
  const { subtotal, discount, delivery, total } = app;
  const f = n => Math.round(n).toLocaleString('en-PK');
  return (
    <>
      <Row label={itemsLabel} value={'Rs ' + f(subtotal)} />
      <Row label="Discount" value={'− Rs ' + f(discount)} />
      <Row label="Delivery" value={delivery ? 'Rs ' + delivery : 'Free'} />
      <Row label="Total" value={'Rs ' + f(total)} strong />
    </>
  );
}

export const primaryBtn = {
  position: 'absolute', left: 16, right: 16, bottom: 30, height: 58, borderRadius: 29, border: 'none', background: '#111', color: '#fff',
  fontSize: 16, fontWeight: 500, cursor: 'pointer', zIndex: 6,
};
