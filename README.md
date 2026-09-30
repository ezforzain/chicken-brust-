# Chicken Brust

A web app for grilled chicken breast delivery, built with **React 18 + Vite 5**.

- **Customer app**: intro, menu with search, sort and categories, dish details, cart with promo codes, checkout with scheduled delivery, live order tracking, rider chat and call, and profile.
- **Admin panel**: dashboard, live order queue, orders table, menu management (prices, availability, photos, new dishes), riders, promo codes, and store settings.

The app and the admin stay in sync live. For example, if you change a price or accept an order in the admin, the customer app updates.

## Requirements

- [Node.js](https://nodejs.org) 18 or newer (LTS recommended)
- npm, which comes with Node.js

Check that they are installed:

```powershell
node -v
npm -v
```

## Run locally

```powershell
git clone https://github.com/ezforzain/chicken-brust-.git
cd chicken-brust-/chicken-brust
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser. If `localhost` does not load, use http://127.0.0.1:5173.

| Page          | URL                                 |
|---------------|-------------------------------------|
| Home          | http://localhost:5173               |
| Customer app  | http://localhost:5173/#/app         |
| Admin panel   | http://localhost:5173/#/admin       |

Keep the terminal open while you use the site. Press `Ctrl + C` to stop the server.

You can also run the same scripts from the repository root: `npm run setup` once, then `npm run dev`.

## Other commands

Run these inside `chicken-brust/`:

| Command           | What it does                                  |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Starts the development server on port 5173    |
| `npm run build`   | Creates a production build in `dist/`         |
| `npm run preview` | Serves the production build on port 4173      |

## Project structure

```
chicken-brust/        the React app (source code, package.json, vite.config.js)
  src/phone/          customer app screens and state
  src/admin/          admin panel pages, drawers and state
  src/shared/         dish catalog, helpers, icons
design-source/        the original design files the UI was built from (reference only)
package.json          shortcut scripts that run the app from the repo root
```

See [chicken-brust/README.md](chicken-brust/README.md) for how the code is organised and how the app and admin sync.

## Troubleshooting

| Problem | Fix |
|---|---|
| `Missing script: "dev"` | You are in the wrong folder. Run `cd chicken-brust` first, or run `npm run dev` from the repo root. |
| `'vite' is not recognized` / `Cannot find module` | Run `npm install` in `chicken-brust/`. |
| `Port 5173 is already in use` | The server is already running, so just open the URL. Otherwise, close the other terminal that is running it. |
| `npm.ps1 cannot be loaded` (PowerShell) | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use Command Prompt instead. |
| Blank page | Hard refresh with `Ctrl + Shift + R`, then check the terminal for errors. |

## Notes

- There is no backend yet. Data is stored in the browser's `localStorage`. Clear the site data to reset the demo.
- Test promo code: `BRUST10` (10% off).
- No API keys or environment variables are needed.
