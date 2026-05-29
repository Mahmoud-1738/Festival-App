# ❤️U Festival App — Utrecht 2026

A pocket-guide PWA (React + Vite) for the ❤️U Festival, with a live map and a
content-managed schedule.

## Features

- **Home** — countdown, live news updates.
- **Info** — accordion with practical festival info.
- **Schedule** — timetable per stage/day, fetched live from the API. Favorites & reminders.
- **Map** — festival-grounds illustration with a **real GPS dot** driven by the
  browser Geolocation API.
- **Schedule CMS** — password-protected admin page to add/edit/delete acts; changes
  persist server-side and show up in the app instantly.

## Running locally

Install once:

```bash
npm install
```

Run the app **and** the API together:

```bash
npm run dev:all
```

- App:   http://localhost:5180
- Admin CMS: http://localhost:5180/admin.html
- API:   http://localhost:3001

Or run them separately: `npm run dev` (web) and `npm run server` (API).

### Admin password

Default: `festival2026`. Override with the `ADMIN_PASSWORD` env var when starting
the server, e.g. `ADMIN_PASSWORD=secret npm run server`.

## How it works

- **Backend** (`server/index.js`): Express + a JSON store at `server/data/schedule.json`,
  auto-seeded from `src/data.js` on first run (the store is git-ignored). Public
  endpoint `GET /api/schedule`; admin endpoints are protected by a bearer token.
- **Frontend** (`src/api.js`): fetches `/api/schedule`, falling back to the bundled
  data when the server is unreachable (offline-friendly).
- **Map geo-referencing** (`src/map.jsx`): the `MAP_BOUNDS` constant maps GPS
  latitude/longitude onto the 320×380 map image. Calibrate those four corner
  coordinates to align the GPS dot precisely with the real artwork.

## Build

```bash
npm run build      # builds both index.html and admin.html
npm run preview
```
