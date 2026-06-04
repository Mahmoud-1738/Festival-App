// ═══════════════════════════════════════════════════════════
// ❤️U Festival — Schedule CMS (admin)
// Password-gated editor for the lineup. Talks to the Express
// API and persists changes server-side for every visitor.
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useCallback } from 'react';
import { createRoot } from 'react-dom/client';

const BRAND = { vermilion: '#F03228', cerulean: '#247BA0', saffron: '#E3B505', dark: '#3A3A3C' };
const KIND_LABEL = { main: 'Main', talent: 'Talent', club: 'Club / Theater', dj: 'DJ / Dance' };
const KIND_COLOR = { main: BRAND.vermilion, talent: BRAND.cerulean, club: BRAND.saffron, dj: BRAND.dark };
const TOKEN_KEY = 'uf_cms_token';

// ─── API helpers ──────────────────────────────────────────────
function getToken() { return localStorage.getItem(TOKEN_KEY) || ''; }

async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) headers.Authorization = `Bearer ${getToken()}`;
  const res = await fetch(`/api${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ─── Login ────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true); setErr('');
    try {
      const { token } = await api('/admin/login', { method: 'POST', body: { password: pw }, auth: false });
      localStorage.setItem(TOKEN_KEY, token);
      onLogin();
    } catch (e) { setErr(e.message); }
    setBusy(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <form onSubmit={submit} style={{ width: 340, background: '#161617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: 28, animation: 'fade-in .3s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>❤️</span>
          <div style={{ fontWeight: 700, fontSize: 19 }}>Schedule CMS</div>
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>❤️U Festival Utrecht 2026</div>
        <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Admin password</label>
        <input type="password" value={pw} autoFocus onChange={e => setPw(e.target.value)}
          style={inputStyle} placeholder="••••••••" />
        {err && <div style={{ color: BRAND.vermilion, fontSize: 12, marginTop: 10 }}>{err}</div>}
        <button type="submit" disabled={busy} style={{ ...btnPrimary, width: '100%', marginTop: 18, justifyContent: 'center' }}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

// ─── Act editor modal ─────────────────────────────────────────
const BLANK = { s: 0, k: 'main', name: '', start: '12:00', end: '13:00', genre: '', bio: '' };

function ActModal({ initial, day, stages, onClose, onSaved }) {
  const [form, setForm] = useState({ ...BLANK, ...initial });
  const [day2, setDay2] = useState(day);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const editing = Boolean(initial?.id);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    setBusy(true); setErr('');
    try {
      const payload = { ...form, s: Number(form.s), day: Number(day2) };
      if (editing) await api(`/admin/acts/${initial.id}`, { method: 'PUT', body: payload });
      else await api('/admin/acts', { method: 'POST', body: payload });
      onSaved();
    } catch (e) { setErr(e.message); setBusy(false); }
  };

  const remove = async () => {
    if (!confirm(`Delete "${form.name}"?`)) return;
    setBusy(true); setErr('');
    try { await api(`/admin/acts/${initial.id}`, { method: 'DELETE' }); onSaved(); }
    catch (e) { setErr(e.message); setBusy(false); }
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={{ width: 440, maxWidth: '92vw', maxHeight: '90vh', overflowY: 'auto', background: '#161617', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: 24, animation: 'fade-in .2s ease both' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontWeight: 700, fontSize: 18, flex: 1 }}>{editing ? 'Edit act' : 'New act'}</div>
          <button onClick={onClose} style={iconBtn}><span className="material-icons">close</span></button>
        </div>

        <Field label="Name">
          <input value={form.name} onChange={e => set('name', e.target.value)} style={inputStyle} placeholder="Artist or set name" />
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Day" flex>
            <select value={day2} onChange={e => setDay2(e.target.value)} style={inputStyle}>
              <option value={1}>Sat 15 Aug</option>
              <option value={2}>Sun 16 Aug</option>
            </select>
          </Field>
          <Field label="Stage" flex>
            <select value={form.s} onChange={e => set('s', e.target.value)} style={inputStyle}>
              {stages.map((st, i) => <option key={i} value={i}>{st.name}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Type">
          <select value={form.k} onChange={e => set('k', e.target.value)} style={inputStyle}>
            {Object.entries(KIND_LABEL).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
          </select>
        </Field>

        <div style={{ display: 'flex', gap: 12 }}>
          <Field label="Start (HH:MM)" flex>
            <input value={form.start} onChange={e => set('start', e.target.value)} style={inputStyle} placeholder="12:00" />
          </Field>
          <Field label="End (HH:MM)" flex>
            <input value={form.end} onChange={e => set('end', e.target.value)} style={inputStyle} placeholder="13:30" />
          </Field>
        </div>

        <Field label="Genre (optional)">
          <input value={form.genre} onChange={e => set('genre', e.target.value)} style={inputStyle} placeholder="e.g. Indie Rock" />
        </Field>
        <Field label="Bio (optional)">
          <textarea value={form.bio} onChange={e => set('bio', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Short description shown in the app" />
        </Field>

        {err && <div style={{ color: BRAND.vermilion, fontSize: 12, marginBottom: 10 }}>{err}</div>}

        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {editing && <button onClick={remove} disabled={busy} style={btnDanger}><span className="material-icons" style={{ fontSize: 18 }}>delete</span>Delete</button>}
          <div style={{ flex: 1 }} />
          <button onClick={onClose} style={btnGhost}>Cancel</button>
          <button onClick={save} disabled={busy} style={btnPrimary}>{busy ? 'Saving…' : 'Save'}</button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────
function Dashboard({ onLogout }) {
  const [data, setData] = useState(null);
  const [day, setDay] = useState(1);
  const [editing, setEditing] = useState(null); // act object or {} for new
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    try { setData(await api('/schedule', { auth: false })); }
    catch (e) { setError(e.message); }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const onSaved = () => { setEditing(null); reload(); };

  const resetAll = async () => {
    if (!confirm('Reset the whole schedule back to the original lineup? This cannot be undone.')) return;
    try { await api('/admin/reset', { method: 'POST' }); reload(); }
    catch (e) { setError(e.message); }
  };

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)' }}>
        {error ? <div style={{ color: BRAND.vermilion }}>{error}</div>
          : <span className="material-icons" style={{ animation: 'spin 0.9s linear infinite' }}>autorenew</span>}
      </div>
    );
  }

  const acts = (data.schedule[day] || []).slice().sort((a, b) => a.s - b.s || a.start.localeCompare(b.start));

  return (
    <div style={{ minHeight: '100vh', maxWidth: 760, margin: '0 auto', padding: '28px 20px 80px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <span style={{ fontSize: 24 }}>❤️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>Schedule CMS</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Edits go live in the app instantly</div>
        </div>
        <button onClick={resetAll} style={btnGhost}><span className="material-icons" style={{ fontSize: 18 }}>restart_alt</span>Reset</button>
        <button onClick={onLogout} style={btnGhost}><span className="material-icons" style={{ fontSize: 18 }}>logout</span>Sign out</button>
      </div>

      {/* Day tabs + add */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, alignItems: 'center' }}>
        {[1, 2].map(d => (
          <button key={d} onClick={() => setDay(d)} style={{
            padding: '10px 18px', borderRadius: 11, cursor: 'pointer', border: 'none',
            background: day === d ? BRAND.vermilion : '#1e1e20', color: '#fff', fontWeight: day === d ? 700 : 400, fontSize: 14,
          }}>{d === 1 ? 'Sat 15 Aug' : 'Sun 16 Aug'}</button>
        ))}
        <div style={{ flex: 1 }} />
        <button onClick={() => setEditing({})} style={btnPrimary}><span className="material-icons" style={{ fontSize: 18 }}>add</span>Add act</button>
      </div>

      {error && <div style={{ color: BRAND.vermilion, fontSize: 13, marginBottom: 12 }}>{error}</div>}

      {/* Acts grouped by stage */}
      {data.stages.map((stage, si) => {
        const rows = acts.filter(a => a.s === si);
        return (
          <div key={si} style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 10 }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{stage.name}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{stage.sub} · {rows.length} acts</div>
            </div>
            {rows.length === 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontStyle: 'italic', padding: '8px 0' }}>No acts yet.</div>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {rows.map(a => (
                <button key={a.id} onClick={() => setEditing(a)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, textAlign: 'left', cursor: 'pointer',
                  background: '#161617', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px', color: '#fff',
                }}>
                  <div style={{ width: 6, height: 36, borderRadius: 3, background: KIND_COLOR[a.k], flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{a.name}</div>
                    {a.genre && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>{a.genre}</div>}
                  </div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', fontVariantNumeric: 'tabular-nums' }}>{a.start}–{a.end}</div>
                  <span className="material-icons" style={{ fontSize: 18, color: 'rgba(255,255,255,0.35)' }}>edit</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {editing && (
        <ActModal initial={editing} day={day} stages={data.stages} onClose={() => setEditing(null)} onSaved={onSaved} />
      )}
    </div>
  );
}

// ─── Shell ────────────────────────────────────────────────────
function App() {
  const [authed, setAuthed] = useState(Boolean(getToken()));
  const logout = async () => {
    try { await api('/admin/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem(TOKEN_KEY);
    setAuthed(false);
  };
  return authed ? <Dashboard onLogout={logout} /> : <Login onLogin={() => setAuthed(true)} />;
}

// ─── Shared styles ────────────────────────────────────────────
function Field({ label, children, flex }) {
  return (
    <div style={{ marginBottom: 14, flex: flex ? 1 : undefined }}>
      <label style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}
const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.14)', background: '#0c0c0d', color: '#fff', fontSize: 14, marginTop: 4 };
const btnBase = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13 };
const btnPrimary = { ...btnBase, background: BRAND.vermilion, color: '#fff' };
const btnGhost = { ...btnBase, background: '#1e1e20', color: 'rgba(255,255,255,0.8)', fontWeight: 400 };
const btnDanger = { ...btnBase, background: 'transparent', color: BRAND.vermilion, border: `1px solid ${BRAND.vermilion}55` };
const iconBtn = { background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', display: 'flex' };
const overlay = { position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 };

createRoot(document.getElementById('admin-root')).render(<App />);
