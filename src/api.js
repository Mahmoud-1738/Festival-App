// ═══════════════════════════════════════════════════════════
// Schedule API client for the ❤️U Festival app.
// Fetches the live schedule from the PHP/MySQL API and falls
// back to the bundled data when offline / the server is down.
// ═══════════════════════════════════════════════════════════
import { SCHEDULE, STAGES, ARTISTS } from './data.js';

// API lives next to the app: <base>/api/*.php (e.g. /festivalapp/api/).
export const API_BASE = import.meta.env.BASE_URL + 'api/';

// Bundled fallback, normalized to the same shape the API returns.
const FALLBACK = {
  stages: STAGES.map((name, i) => ({
    name,
    sub: i === 0 ? 'Main' : i === 1 ? 'Talent' : i === 2 ? 'Theater' : 'Dance',
  })),
  schedule: SCHEDULE,
  artists: ARTISTS,
};

export async function fetchSchedule() {
  try {
    const res = await fetch(API_BASE + 'schedule.php', { headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data?.schedule || !data?.stages) throw new Error('bad payload');
    return { ...data, offline: false };
  } catch (err) {
    console.warn('[schedule] using bundled fallback:', err.message);
    return { ...FALLBACK, offline: true };
  }
}
