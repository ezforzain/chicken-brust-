# Chicken Brust

A web app for grilled chicken breast delivery. It has two parts:

- **Customer app** (`#/app`): intro, menu, dish detail, cart, checkout, live order tracking, rider chat and call, and profile.
- **Admin panel** (`#/admin`): dashboard, live order queue, orders table, menu management, riders, promo codes, and settings.

The UI is built from the design in `../design-source/` (the root `Chicken Brust Phone/Admin.dc.html` files).
It replaces the earlier mockup in `design-source/uploads/App design layout mockup/`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
npm run preview  # serve the build
```

## Structure

```
src/
  App.jsx               routes: / (landing), /app, /admin
  styles.css            global styles, phone frame, admin layout, responsive rules
  shared/
    data.js             dish catalog, sizes, price helpers, localStorage keys
    icons.jsx           SVG icons
  phone/
    usePhoneStore.js    customer app state (cart, promo, tracking, chat, call, persistence)
    PhoneApp.jsx        device frame, status bar, tab bar, chat sheet, call screen, toast
    screens/            Intro, Home, Detail, Cart, Checkout, Track, Profile
  admin/
    useAdminStore.js    admin state (orders flow, riders, menu, promos, settings)
    AdminApp.jsx        sidebar and header layout
    pages.jsx           Dashboard, Orders, Menu, Riders, Promos, Settings
    drawers.jsx         order details, add dish, and edit dish drawers
    ui.jsx              Switch, StatusPill, Field, Drawer, and so on
```

## How the app and admin stay in sync

There is no backend yet. The admin writes to `localStorage`, and the customer app listens for changes,
including changes made in another browser tab:

| Key                     | Written by | Used for                                                   |
|-------------------------|------------|------------------------------------------------------------|
| `chicken-brust-menu`    | Admin      | Prices, sold-out dishes, photos, renamed or new dishes     |
| `chicken-brust-orders`  | Admin      | Order status. `CB-2047` drives the app's Track screen      |
| `cb_phone_main`         | App        | Saved app state (cart, screen, profile, etc.)              |
| `cb_admin_state`        | Admin      | Saved admin state (orders, promos, settings)               |

To try it, open `#/app` and `#/admin` in two tabs. In the admin, accept order CB-2047 and hand it to a rider.
The app's tracking screen follows along.

To connect a real API later, replace the `readJSON` / `writeJSON` calls in the two `use*Store.js` files.

## Notes

- On screens up to 480px wide, the customer app fills the whole screen. On wider screens it shows inside a phone frame.
- On screens up to 1000px wide, the admin sidebar collapses to icons only.
- Promo code for testing: `BRUST10` (10% off).
- To reset the demo data, clear the site's localStorage.
