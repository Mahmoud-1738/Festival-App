// ═══════════════════════════════════════════════════════════
// ❤️U Festival — Schedule API + CMS backend
// Express server with a JSON-file store. Serves the public
// schedule and protected admin CRUD endpoints for the CMS.
// ═══════════════════════════════════════════════════════════
import express from 'express';
import cors from 'cors';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { SCHEDULE, STAGES, ARTISTS } from '../src/data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'schedule.json');

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'festival2026';

// ─── Store ────────────────────────────────────────────────────
function seed() {
  // Build the initial store from the bundled frontend data so the
  // CMS starts pre-populated with the real lineup.
  return {
    stages: STAGES.map((name, i) => ({
      name,
      sub: i === 0 ? 'Main' : i === 1 ? 'Talent' : i === 2 ? 'Theater' : 'Dance',
    })),
    schedule: JSON.parse(JSON.stringify(SCHEDULE)),
    artists: JSON.parse(JSON.stringify(ARTISTS)),
  };
}

function load() {
  if (!existsSync(DATA_FILE)) {
    mkdirSync(DATA_DIR, { recursive: true });
    writeFileSync(DATA_FILE, JSON.stringify(seed(), null, 2));
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
}

function save(db) {
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

let db = load();

// ─── Auth ─────────────────────────────────────────────────────
const tokens = new Set();

function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !tokens.has(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// ─── Helpers ──────────────────────────────────────────────────
const VALID_KINDS = ['main', 'talent', 'club', 'dj'];

function findAct(id) {
  for (const day of Object.keys(db.schedule)) {
    const idx = db.schedule[day].findIndex(a => a.id === id);
    if (idx !== -1) return { day, idx, act: db.schedule[day][idx] };
  }
  return null;
}

function sanitizeAct(body) {
  const errors = [];
  const s = Number(body.s);
  if (!Number.isInteger(s) || s < 0 || s >= db.stages.length) errors.push('invalid stage (s)');
  if (!VALID_KINDS.includes(body.k)) errors.push('invalid kind (k)');
  if (!body.name || !String(body.name).trim()) errors.push('name is required');
  if (!/^\d{1,2}:\d{2}$/.test(body.start || '')) errors.push('start must be HH:MM');
  if (!/^\d{1,2}:\d{2}$/.test(body.end || '')) errors.push('end must be HH:MM');
  const act = {
    s,
    k: body.k,
    name: String(body.name).trim(),
    start: body.start,
    end: body.end,
  };
  if (body.genre != null) act.genre = String(body.genre).trim();
  if (body.bio != null) act.bio = String(body.bio).trim();
  return { act, errors };
}

// ─── App ──────────────────────────────────────────────────────
const app = express();
app.use(cors());
app.use(express.json());

// Public: full schedule payload consumed by the app
app.get('/api/schedule', (req, res) => {
  res.json({ stages: db.stages, schedule: db.schedule, artists: db.artists });
});

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Admin login → bearer token
app.post('/api/admin/login', (req, res) => {
  if (req.body?.password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Wrong password' });
  }
  const token = crypto.randomBytes(24).toString('hex');
  tokens.add(token);
  res.json({ token });
});

app.post('/api/admin/logout', requireAuth, (req, res) => {
  const token = req.headers.authorization.slice(7);
  tokens.delete(token);
  res.json({ ok: true });
});

// Create an act on a given day
app.post('/api/admin/acts', requireAuth, (req, res) => {
  const day = String(req.body?.day);
  if (!db.schedule[day]) return res.status(400).json({ error: 'invalid day' });
  const { act, errors } = sanitizeAct(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });
  act.id = 'a_' + crypto.randomBytes(5).toString('hex');
  db.schedule[day].push(act);
  save(db);
  res.status(201).json(act);
});

// Update an act
app.put('/api/admin/acts/:id', requireAuth, (req, res) => {
  const found = findAct(req.params.id);
  if (!found) return res.status(404).json({ error: 'act not found' });
  const { act, errors } = sanitizeAct({ ...found.act, ...req.body });
  if (errors.length) return res.status(400).json({ error: errors.join(', ') });
  act.id = found.act.id;
  // Allow moving an act to a different day
  const targetDay = req.body.day != null ? String(req.body.day) : found.day;
  if (!db.schedule[targetDay]) return res.status(400).json({ error: 'invalid day' });
  db.schedule[found.day].splice(found.idx, 1);
  db.schedule[targetDay].push(act);
  save(db);
  res.json(act);
});

// Delete an act
app.delete('/api/admin/acts/:id', requireAuth, (req, res) => {
  const found = findAct(req.params.id);
  if (!found) return res.status(404).json({ error: 'act not found' });
  db.schedule[found.day].splice(found.idx, 1);
  save(db);
  res.json({ ok: true });
});

// Update stage labels
app.put('/api/admin/stages', requireAuth, (req, res) => {
  if (!Array.isArray(req.body?.stages)) return res.status(400).json({ error: 'stages array required' });
  db.stages = req.body.stages.map(s => ({ name: String(s.name || '').trim(), sub: String(s.sub || '').trim() }));
  save(db);
  res.json(db.stages);
});

// Reset store to the seeded lineup (handy during development/demo)
app.post('/api/admin/reset', requireAuth, (req, res) => {
  db = seed();
  save(db);
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`❤️U Festival API running on http://localhost:${PORT}`);
  console.log(`   Admin password: ${ADMIN_PASSWORD}`);
});
