import { useState as uS, useEffect as uE } from 'react';
import { createRoot } from 'react-dom/client';
import { BRAND, LANG } from './data.js';
import { HomeScreen, InfoScreen, ScheduleScreen } from './screens.jsx';
import { MapScreen } from './map.jsx';

function getTheme(dark) {
  return dark ? {
    bg: '#000', bg2: '#0E0E0E', surface: '#1A1A1A',
    cardBg: 'linear-gradient(180deg, #202021 0%, #161617 100%)',
    border: 'rgba(255,255,255,0.08)', borderHi: 'rgba(255,255,255,0.16)',
    text: '#FFF', text2: 'rgba(255,255,255,0.66)', text3: 'rgba(255,255,255,0.40)',
    headerBg: 'rgba(8,8,9,0.82)', navBg: 'rgba(15,15,16,0.92)',
    shadow: '0 12px 30px -14px rgba(0,0,0,0.85)',
  } : {
    bg: '#FFF', bg2: '#F1F2F4', surface: '#FFF',
    cardBg: 'linear-gradient(180deg, #FFFFFF 0%, #F7F8F9 100%)',
    border: 'rgba(0,0,0,0.08)', borderHi: 'rgba(0,0,0,0.14)',
    text: '#0B0B0C', text2: 'rgba(0,0,0,0.6)', text3: 'rgba(0,0,0,0.36)',
    headerBg: 'rgba(255,255,255,0.82)', navBg: 'rgba(255,255,255,0.92)',
    shadow: '0 12px 30px -16px rgba(0,0,0,0.25)',
  };
}

function Header({ dark, setDark, lang, setLang, t, th }) {
  const btn = { background: th.surface, border: `1px solid ${th.border}`, borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: th.text2, height: 34 };
  return (
    <div style={{ position: 'sticky', top: 0, zIndex: 100, height: 58, background: th.headerBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${th.border}`, padding: '0 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
      {/* Official ❤️U logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
        <img src="assets/logoBlack.webp" alt="❤️U" style={{ width: 38, height: 38, borderRadius: 9, display: 'block', objectFit: 'cover', boxShadow: `0 0 0 1px ${th.border}` }}/>
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
          <span style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 15, color: th.text, letterSpacing: '-0.3px' }}>Festival</span>
          <span style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 9, color: BRAND.vermilion, marginTop: 3, letterSpacing: '0.2px' }}>Utrecht 2026</span>
        </div>
      </div>
      <button onClick={() => setDark(!dark)} style={{ ...btn, width: 38 }}>
        <span className="material-icons" style={{ fontSize: 18 }}>{dark ? 'light_mode' : 'dark_mode'}</span>
      </button>
      <button onClick={() => setLang(lang === 'en' ? 'nl' : 'en')} style={{ ...btn, padding: '0 9px', fontSize: 16 }}>
        {lang === 'en' ? '🇳🇱' : '🇬🇧'}
      </button>
    </div>
  );
}

function BottomNav({ active, setActive, t, th }) {
  const tabs = [
    { id: 'home', icon: 'home', label: t.home },
    { id: 'info', icon: 'info', label: t.info },
    { id: 'schedule', icon: 'calendar_month', label: t.schedule },
    { id: 'map', icon: 'map', label: t.map },
  ];
  return (
    <div style={{ position: 'sticky', bottom: 0, zIndex: 100, background: th.navBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', display: 'flex', height: 66, borderTop: `1px solid ${th.border}` }}>
      {tabs.map(tab => {
        const on = active === tab.id;
        return (
          <button key={tab.id} onClick={() => setActive(tab.id)} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: on ? BRAND.vermilion : th.text3, position: 'relative', transition: 'color .15s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 48, height: 27, borderRadius: 999, background: on ? BRAND.vermilion + '22' : 'transparent', transition: 'background .2s' }}>
              <span className="material-icons" style={{ fontSize: 23, transition: 'transform .15s', transform: on ? 'scale(1.06)' : 'scale(1)' }}>{tab.icon}</span>
            </div>
            <span style={{ fontFamily: 'Sansation', fontWeight: on ? 700 : 400, fontSize: 10, fontStyle: 'italic' }}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "dark": true,
  "lang": "nl",
  "tab": "map"
}/*EDITMODE-END*/;

function App() {
  const [dark, setDark] = uS(TWEAK_DEFAULTS.dark);
  const [lang, setLang] = uS(TWEAK_DEFAULTS.lang);
  const [tab, setTab] = uS(TWEAK_DEFAULTS.tab || 'home');
  const [tweakOpen, setTweakOpen] = uS(false);
  const [favs, setFavs] = uS(new Set(['s1a2', 's2a3'])); // Kensington + Chef'Special pre-favorited
  const nowPlayingId = 's1a2'; // Kensington "live" for demo

  uE(() => {
    const h = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweakOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweakOpen(false);
    };
    window.addEventListener('message', h);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', h);
  }, []);

  const applyTweak = (k, v) => {
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
    if (k === 'dark') setDark(v);
    if (k === 'lang') setLang(v);
    if (k === 'tab') setTab(v);
  };

  const th = getTheme(dark);
  const t = LANG[lang];

  const toggleFav = (id) => setFavs(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const screens = { home: HomeScreen, info: InfoScreen, schedule: ScheduleScreen, map: MapScreen };
  const Screen = screens[tab];

  return (
    <div>
      <div style={{ width: 375, height: 812, background: th.bg, borderRadius: 40, boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)' : '0 30px 80px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.12)', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', fontFamily: 'Sansation', transition: 'background .3s' }}>
        <Header dark={dark} setDark={(v)=>applyTweak('dark',v)} lang={lang} setLang={(v)=>applyTweak('lang',v)} t={t} th={th} />
        <div key={tab+dark+lang} style={{ flex: 1, overflow: 'hidden', position: 'relative', background: th.bg }}>
          <Screen t={t} th={th} dark={dark} favorites={favs} toggleFav={toggleFav} nowPlayingId={nowPlayingId} />
        </div>
        <BottomNav active={tab} setActive={(v)=>applyTweak('tab',v)} t={t} th={th} />
      </div>

      {tweakOpen && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#1e1e1e', borderRadius: 12, padding: 18, width: 240, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 14, color: '#fff', marginBottom: 14 }}>Tweaks</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TwGroup label="Mode" th>
              {[['Light',false],['Dark',true]].map(([l,v])=>(<TwBtn key={l} on={dark===v} onClick={()=>applyTweak('dark',v)}>{l}</TwBtn>))}
            </TwGroup>
            <TwGroup label="Language">
              {[['🇬🇧 EN','en'],['🇳🇱 NL','nl']].map(([l,v])=>(<TwBtn key={v} on={lang===v} color={BRAND.cerulean} onClick={()=>applyTweak('lang',v)}>{l}</TwBtn>))}
            </TwGroup>
            <TwGroup label="Tab" wrap>
              {['home','info','schedule','map'].map(x=>(<TwBtn key={x} on={tab===x} color={BRAND.saffron} onClick={()=>applyTweak('tab',x)}>{x}</TwBtn>))}
            </TwGroup>
          </div>
        </div>
      )}
    </div>
  );
}

function TwGroup({ label, children, wrap }) {
  return (<div>
    <div style={{ fontFamily: 'Sansation', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{label}</div>
    <div style={{ display: 'flex', gap: 6, flexWrap: wrap ? 'wrap' : 'nowrap' }}>{children}</div>
  </div>);
}
function TwBtn({ on, color, children, onClick }) {
  const c = color || BRAND.vermilion;
  return <button onClick={onClick} style={{ flex: 1, padding: '7px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: on ? c : '#333', color: on && c === BRAND.saffron ? '#000' : '#fff', fontFamily: 'Sansation', fontWeight: on ? 700 : 400, fontSize: 11, textTransform: 'capitalize' }}>{children}</button>;
}

createRoot(document.getElementById('root')).render(<App />);
