// ═══════════════════════════════════════════════════════════
// SCREENS for ❤️U Festival App
// ═══════════════════════════════════════════════════════════
import { useState, useEffect, useRef } from 'react';
import { BRAND, ARTISTS, KIND_COLOR, STAGES, SCHEDULE, timeToY, dur } from './data.js';
import { fetchSchedule } from './api.js';

// Load the schedule from the API once, with bundled-data fallback.
function useSchedule() {
  const [data, setData] = useState(null);
  useEffect(() => {
    let alive = true;
    fetchSchedule().then(d => { if (alive) setData(d); });
    return () => { alive = false; };
  }, []);
  return data;
}

// ─── COUNTDOWN HOOK ───────────────────────────────────────────
function useCountdown() {
  const [diff, setDiff] = useState(0);
  useEffect(() => {
    const target = new Date('2026-08-15T12:00:00');
    const tick = () => setDiff(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return {
    d: Math.floor(diff / 864e5),
    h: Math.floor((diff % 864e5) / 36e5),
    m: Math.floor((diff % 36e5) / 6e4),
    s: Math.floor((diff % 6e4) / 1e3),
    live: diff === 0,
  };
}

// ═════════════════ HOME ═══════════════════════════════════════
function CdTile({ v, l, live }) {
  return (
    <div style={{
      position: 'relative', flex: 1,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.035) 100%)',
      border: '1px solid rgba(255,255,255,0.16)', borderRadius: 14,
      padding: '12px 4px 9px', display: 'flex', flexDirection: 'column', alignItems: 'center',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.16), 0 10px 18px -8px rgba(0,0,0,0.6)',
      overflow: 'hidden',
    }}>
      {live && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: BRAND.vermilion }} />}
      <span key={v} style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 29, color: '#fff', lineHeight: 1, fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.5px', display: 'block', animation: live ? 'tick .45s ease' : 'none' }}>{String(v).padStart(2, '0')}</span>
      <span style={{ fontFamily: 'Sansation', fontWeight: 400, fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 7, textTransform: 'uppercase', letterSpacing: 1.5 }}>{l}</span>
    </div>
  );
}

function HomeScreen({ t, th, dark }) {
  const cd = useCountdown();
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(0);
  const [showNews, setShowNews] = useState(true);
  const startY = useRef(null);
  const scrollRef = useRef(null);

  // simulated pull-to-refresh
  const onTouchStart = (e) => {
    if (scrollRef.current?.scrollTop === 0) startY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (startY.current == null) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy > 0) { e.preventDefault(); setPullY(Math.min(dy * 0.5, 80)); }
  };
  const onTouchEnd = () => {
    if (pullY > 50) {
      setRefreshing(1);
      setTimeout(() => { setRefreshing(0); setPullY(0); }, 1200);
    } else setPullY(0);
    startY.current = null;
  };

  const news = [
    { urgent: true,  title: t.newsTitle2, body: t.newsBody2, time: t.newsTime2, icon: 'campaign', accent: BRAND.vermilion },
    { urgent: false, title: t.newsTitle1, body: t.newsBody1, time: t.newsTime1, icon: 'wb_sunny', accent: BRAND.saffron },
    { urgent: false, title: t.newsTitle3, body: t.newsBody3, time: t.newsTime3, icon: 'favorite', accent: BRAND.cerulean },
  ];

  return (
    <div ref={scrollRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      className="screen-enter" style={{ height: '100%', overflowY: 'auto', position: 'relative', transform: `translateY(${refreshing ? 40 : pullY}px)`, transition: refreshing || pullY === 0 ? 'transform .3s' : 'none' }}>
      {/* pull-to-refresh indicator */}
      <div style={{ position: 'absolute', top: -48, left: 0, right: 0, height: 48, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, color: th.text2 }}>
        <span className="material-icons" style={{ fontSize: 18, transition: 'transform .2s', transform: pullY > 50 ? 'rotate(180deg)' : 'rotate(0)', animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>{refreshing ? 'autorenew' : 'arrow_downward'}</span>
        <span style={{ fontFamily: 'Sansation', fontSize: 11 }}>{refreshing ? t.refreshing : (pullY > 50 ? t.releaseToRefresh : t.pullToRefresh)}</span>
      </div>

      {/* ─── HERO ─────────────────────────────────────── */}
      <div style={{
        margin: '16px 16px 0', borderRadius: 26, overflow: 'hidden', position: 'relative',
        background: 'radial-gradient(125% 90% at 50% -12%, rgba(240,50,40,0.55) 0%, rgba(240,50,40,0.10) 38%, transparent 64%), radial-gradient(95% 70% at 108% 112%, rgba(36,123,160,0.42) 0%, transparent 58%), linear-gradient(180deg, #1A100F 0%, #050505 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 22px 50px -16px rgba(240,50,40,0.42), 0 10px 30px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: '26px 20px 22px',
      }}>
        {/* decorative floating glow orbs */}
        <div style={{ position: 'absolute', top: -42, right: -34, width: 150, height: 150, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,50,40,0.62), transparent 70%)', filter: 'blur(34px)', animation: 'float-y 7s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -54, left: -42, width: 165, height: 165, borderRadius: '50%', background: 'radial-gradient(circle, rgba(36,123,160,0.5), transparent 70%)', filter: 'blur(36px)', animation: 'float-y 9s ease-in-out infinite 1.2s', pointerEvents: 'none' }} />
        {/* light sweep */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 64, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.11), transparent)', animation: 'sheen 8s ease-in-out infinite 2.5s', pointerEvents: 'none' }} />

        {/* logo + glow halo */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 112, height: 112 }}>
            <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,50,40,0.6), transparent 70%)', filter: 'blur(20px)', animation: 'hero-glow 5s ease-in-out infinite' }} />
            <img src="assets/logoBlack.webp" alt="❤️U" style={{ width: 112, height: 112, display: 'block', borderRadius: 8, position: 'relative', filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.55))' }}/>
          </div>
          <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, color: 'rgba(255,255,255,0.78)', marginTop: 13, letterSpacing: 4, textTransform: 'uppercase' }}>Festival · Utrecht</div>
          {/* date pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, padding: '6px 13px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
            <span className="material-icons" style={{ fontSize: 13, color: BRAND.saffron }}>event</span>
            <span style={{ fontFamily: 'Sansation', fontWeight: 400, fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>{t.appDates}</span>
          </div>
        </div>

        {/* countdown / live */}
        <div style={{ position: 'relative', zIndex: 1, marginTop: 20 }}>
          {!cd.live && <>
            <div style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 10, color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 2 }}>{t.festivalStarts}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <CdTile v={cd.d} l={t.days} />
              <CdTile v={cd.h} l={t.hours} />
              <CdTile v={cd.m} l={t.minutes} />
              <CdTile v={cd.s} l={t.seconds} live />
            </div>
          </>}
          {cd.live && (
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: `linear-gradient(135deg, ${BRAND.vermilion}, #ff5a4d)`, borderRadius: 999, padding: '10px 20px', boxShadow: `0 0 28px ${BRAND.vermilion}cc` }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#fff', animation: 'pulse-dot 1s ease infinite' }} />
                <span style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: 1 }}>LIVE NOW</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── LIVE UPDATES ─────────────────────────────── */}
      <div style={{ padding: '20px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 19, borderRadius: 2, background: `linear-gradient(${BRAND.cerulean}, ${BRAND.vermilion})` }} />
        <span style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 19, color: th.text, letterSpacing: '-0.4px' }}>{t.liveUpdates}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 5, background: BRAND.vermilion + '1c', borderRadius: 999, padding: '4px 9px 4px 8px' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: BRAND.vermilion, animation: 'pulse-dot 1.8s ease infinite' }} />
          <span style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 10, color: BRAND.vermilion, letterSpacing: 0.6 }}>{t.liveBadge}</span>
        </div>
      </div>

      {/* News cards */}
      {showNews && (
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 11 }}>
          {news.map((n, i) => {
            const acc = n.accent;
            const onSaffron = acc === BRAND.saffron;
            return (
              <div key={i} style={{
                position: 'relative', borderRadius: 18, overflow: 'hidden',
                background: n.urgent
                  ? (dark ? 'linear-gradient(135deg, rgba(240,50,40,0.20), rgba(240,50,40,0.05))' : 'linear-gradient(135deg, rgba(240,50,40,0.10), rgba(240,50,40,0.02))')
                  : th.cardBg,
                border: `1px solid ${n.urgent ? BRAND.vermilion + '59' : th.border}`,
                boxShadow: n.urgent ? `0 14px 30px -14px ${BRAND.vermilion}88` : th.shadow,
                padding: '14px', display: 'flex', gap: 13, alignItems: 'flex-start',
                animation: `fade-in 0.4s ease ${i * 0.07}s both`,
              }}>
                <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: `linear-gradient(155deg, ${acc}, ${acc}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 14px -3px ${acc}99` }}>
                  <span className="material-icons" style={{ fontSize: 23, color: onSaffron ? '#1A1A1A' : '#fff' }}>{n.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                    <span style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 14, color: th.text, flex: 1, letterSpacing: '-0.2px' }}>{n.title}</span>
                    {n.urgent && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3, background: BRAND.saffron, color: '#1A1A1A', fontFamily: 'Sansation', fontWeight: 700, fontSize: 9, padding: '3px 7px', borderRadius: 6, letterSpacing: 0.5, boxShadow: `0 0 12px ${BRAND.saffron}88` }}>
                        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1A1A1A' }} />{t.urgent}
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'Sansation', fontSize: 13, color: th.text2, lineHeight: 1.5 }}>{n.body}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 9 }}>
                    <span className="material-icons" style={{ fontSize: 12, color: th.text3 }}>schedule</span>
                    <span style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 10, color: th.text3 }}>{n.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toggle empty state */}
      <div style={{ padding: '14px 16px 4px', textAlign: 'center' }}>
        <button onClick={() => setShowNews(!showNews)} style={{ background: 'none', border: 'none', color: th.text3, fontFamily: 'Sansation', fontSize: 11, fontStyle: 'italic', cursor: 'pointer' }}>
          {showNews ? '(Preview: show empty state)' : '(Preview: show news)'}
        </button>
      </div>

      {!showNews && (
        <div style={{ margin: '8px 16px 0', borderRadius: 18, background: th.cardBg, border: `1px dashed ${th.borderHi}`, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto', background: th.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="material-icons" style={{ fontSize: 32, color: th.text3 }}>notifications_none</span>
          </div>
          <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 15, color: th.text2, marginTop: 14 }}>{t.noNewsTitle}</div>
          <div style={{ fontFamily: 'Sansation', fontSize: 12, color: th.text3, marginTop: 8, lineHeight: 1.6 }}>{t.noNewsDesc}</div>
        </div>
      )}

      <div style={{ height: 24 }} />
    </div>
  );
}

// ═════════════════ INFO ═══════════════════════════════════════
function InfoScreen({ t, th, dark }) {
  const [open, setOpen] = useState('sec1');
  const sections = [
    { key: 'sec1', icon: 'info',           title: t.sec1Title, body: t.sec1Body },
    { key: 'sec2', icon: 'directions_bus', title: t.sec2Title, items: t.sec2Items,
      itemIcons: ['directions_bike', 'directions_car', 'directions_transit', 'airport_shuttle', 'local_taxi'] },
    { key: 'sec3', icon: 'lock',           title: t.sec3Title, body: t.sec3Body },
    { key: 'sec4', icon: 'help_outline',   title: t.sec4Title, items: t.sec4Items, faq: true },
    { key: 'sec5', icon: 'stars',          title: t.sec5Title, body: t.sec5Body, accent: BRAND.saffron, gold: true },
  ];

  return (
    <div className="screen-enter" style={{ padding: '18px 16px', overflowY: 'auto', height: '100%' }}>
      {/* title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{ width: 4, height: 24, borderRadius: 2, background: `linear-gradient(${BRAND.cerulean}, ${BRAND.vermilion})` }} />
        <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 23, color: th.text, letterSpacing: '-0.5px' }}>{t.infoTitle}</div>
      </div>

      {/* key facts panel */}
      <div style={{
        borderRadius: 18, padding: '15px 16px', marginBottom: 16,
        background: 'radial-gradient(130% 120% at 50% -10%, rgba(240,50,40,0.34) 0%, transparent 62%), linear-gradient(180deg, #1A100F 0%, #060606 100%)',
        border: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 16px 34px -16px rgba(240,50,40,0.45), 0 8px 20px rgba(0,0,0,0.5)',
        display: 'flex', flexDirection: 'column', gap: 11,
      }}>
        {t.infoFacts.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.13)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span className="material-icons" style={{ fontSize: 19, color: BRAND.saffron }}>{f.icon}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'Sansation', fontSize: 9.5, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1.3, marginBottom: 2 }}>{f.label}</div>
              <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 14, color: '#fff' }}>{f.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {sections.map(sec => {
          const isOpen = open === sec.key;
          const accent = sec.accent || BRAND.cerulean;
          const onSaffron = accent === BRAND.saffron;
          return (
            <div key={sec.key} style={{
              borderRadius: 16,
              background: sec.gold ? `linear-gradient(160deg, ${accent}${dark ? '26' : '1f'}, ${accent}0a)` : th.cardBg,
              border: `1px solid ${isOpen ? accent + '66' : (sec.gold ? accent + '44' : th.border)}`,
              overflow: 'hidden', transition: 'border-color .25s, box-shadow .25s',
              boxShadow: isOpen ? `0 12px 28px -12px ${accent}88` : th.shadow,
            }}>
              <button onClick={() => setOpen(isOpen ? null : sec.key)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px', background: 'none', border: 'none', cursor: 'pointer',
                }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, background: `linear-gradient(155deg, ${accent}, ${accent}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 5px 12px -3px ${accent}88` }}>
                  <span className="material-icons" style={{ fontSize: 20, color: onSaffron ? '#1A1A1A' : '#fff' }}>{sec.icon}</span>
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 15, color: th.text, letterSpacing: '-0.2px' }}>{sec.title}</div>
                  {sec.gold && <div style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 10, color: accent, marginTop: 2 }}>{t.infoVipTag}</div>}
                </div>
                <span className="material-icons" style={{ fontSize: 22, color: isOpen ? accent : th.text3, transition: 'transform .3s, color .2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>expand_more</span>
              </button>
              <div style={{ maxHeight: isOpen ? 900 : 0, overflow: 'hidden', transition: 'max-height .35s cubic-bezier(.4,0,.2,1)' }}>
                <div style={{ padding: '0 14px 15px' }}>
                  {sec.body && (
                    <div style={{ fontFamily: 'Sansation', fontSize: 13, color: th.text2, lineHeight: 1.7, whiteSpace: 'pre-line' }}>{sec.body}</div>
                  )}
                  {sec.items && sec.faq && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {sec.items.map((item, i) => (
                        <div key={i} style={{ background: th.bg2, borderRadius: 12, padding: '11px 12px' }}>
                          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                            <span style={{ width: 20, height: 20, borderRadius: 6, background: accent, color: '#fff', fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>Q</span>
                            <div style={{ flex: 1, fontFamily: 'Sansation', fontWeight: 700, fontSize: 13, color: th.text, lineHeight: 1.4 }}>{item.t}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start', marginTop: 7 }}>
                            <span style={{ width: 20, height: 20, borderRadius: 6, background: th.borderHi, color: th.text2, fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>A</span>
                            <div style={{ flex: 1, fontFamily: 'Sansation', fontSize: 12, color: th.text2, lineHeight: 1.6 }}>{item.b}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {sec.items && !sec.faq && (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {sec.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start', padding: '10px 0', borderBottom: i < sec.items.length - 1 ? `1px solid ${th.border}` : 'none' }}>
                          <div style={{ width: 32, height: 32, borderRadius: 9, background: accent + '1f', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-icons" style={{ fontSize: 18, color: accent }}>{sec.itemIcons[i]}</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 13, color: th.text, marginBottom: 2 }}>{item.t}</div>
                            <div style={{ fontFamily: 'Sansation', fontSize: 12, color: th.text2, lineHeight: 1.55 }}>{item.b}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ height: 24 }} />
    </div>
  );
}

// ═════════════════ SCHEDULE ═══════════════════════════════════
function ScheduleScreen({ t, th, dark, favorites, toggleFav, nowPlayingId }) {
  const [day, setDay] = useState(1);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);
  const [remindersSet, setRemindersSet] = useState({});
  const data = useSchedule();

  const PX_PER_HOUR = 80;
  const HOURS = 14; // 10 -> 24
  const STAGE_H = 82;
  const LABEL_W = 76;

  // Loading state while the schedule is fetched from the API.
  if (!data) {
    return (
      <div className="screen-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: th.text3 }}>
        <span className="material-icons" style={{ fontSize: 30, animation: 'spin 0.9s linear infinite' }}>autorenew</span>
        <span style={{ fontFamily: 'Sansation', fontSize: 12 }}>{t.scheduleTitle}…</span>
      </div>
    );
  }

  const stages = data.stages;
  const artists = data.artists;
  const acts = data.schedule[day] || [];
  const stageActs = (i) => acts.filter(a => a.s === i);

  const act = selected;

  const fireToast = (act) => {
    setToast({ name: act.name, stage: stages[act.s]?.name });
    setRemindersSet(prev => ({ ...prev, [act.id]: true }));
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 300, background: `linear-gradient(135deg, ${BRAND.saffron}, #f5c842)`, color: '#1A1A1A', borderRadius: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 14px 30px -8px rgba(227,181,5,0.6)', animation: 'fade-in 0.3s ease' }}>
          <span className="material-icons" style={{ fontSize: 22 }}>schedule</span>
          <div style={{ flex: 1, fontFamily: 'Sansation', fontWeight: 700, fontSize: 13 }}>⏰ <b>{toast.name}</b> {t.toastMsg.replace('Ponton', toast.stage)}</div>
          <button onClick={() => setToast(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <span className="material-icons" style={{ fontSize: 18 }}>close</span>
          </button>
        </div>
      )}

      {/* Day tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '14px 16px 10px', flexShrink: 0 }}>
        {[1, 2].map(d => {
          const on = day === d;
          return (
            <button key={d} onClick={() => setDay(d)} style={{
              flex: 1, padding: '12px', borderRadius: 13, cursor: 'pointer',
              border: `1px solid ${on ? 'transparent' : th.border}`,
              background: on ? `linear-gradient(135deg, ${BRAND.vermilion}, #ff5247)` : th.cardBg,
              color: on ? '#fff' : th.text2,
              fontFamily: 'Sansation', fontWeight: on ? 700 : 400, fontSize: 13,
              transition: 'all .2s', boxShadow: on ? `0 8px 18px -6px ${BRAND.vermilion}aa` : th.shadow,
            }}>{d === 1 ? t.day1 : t.day2}</button>
          );
        })}
      </div>

      {data.offline && (
        <div style={{ margin: '0 16px 8px', display: 'flex', alignItems: 'center', gap: 6, color: th.text3, fontFamily: 'Sansation', fontSize: 10, fontStyle: 'italic' }}>
          <span className="material-icons" style={{ fontSize: 13 }}>cloud_off</span>
          {t.scheduleOffline}
        </div>
      )}

      {/* Scrollable grid — horizontal time + vertical stages */}
      <div style={{ flex: 1, overflow: 'auto', background: th.bg2, position: 'relative' }}>
        <div style={{ position: 'relative', width: LABEL_W + HOURS * PX_PER_HOUR, height: stages.length * STAGE_H + 28 }}>
          {/* Time header */}
          <div style={{ position: 'sticky', top: 0, zIndex: 5, display: 'flex', height: 28, background: th.surface, borderBottom: `1px solid ${th.border}` }}>
            <div style={{ width: LABEL_W, flexShrink: 0, background: th.surface, borderRight: `1px solid ${th.border}`, position: 'sticky', left: 0, zIndex: 2 }} />
            {Array.from({ length: HOURS }, (_, i) => i + 10).map(h => (
              <div key={h} style={{ width: PX_PER_HOUR, flexShrink: 0, fontFamily: 'Sansation', fontSize: 10, color: th.text2, paddingLeft: 4, paddingTop: 8, borderLeft: `1px solid ${th.border}` }}>{h}:00</div>
            ))}
          </div>
          {/* 15-min vertical lines */}
          {Array.from({ length: HOURS * 4 }, (_, i) => (
            <div key={i} style={{ position: 'absolute', top: 28, bottom: 0, left: LABEL_W + i * (PX_PER_HOUR / 4), width: 1, background: i % 4 === 0 ? th.border : (dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)') }} />
          ))}
          {/* Stage rows */}
          {stages.map((stage, si) => (
            <div key={si} style={{ position: 'absolute', top: 28 + si * STAGE_H, left: 0, right: 0, height: STAGE_H, borderBottom: `1px solid ${th.border}` }}>
              {/* Sticky label */}
              <div style={{ position: 'sticky', left: 0, width: LABEL_W, height: STAGE_H, background: th.surface, borderRight: `1px solid ${th.border}`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 10px', zIndex: 3 }}>
                <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 12, color: th.text }}>{stage.name}</div>
                <div style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 9, color: th.text3, marginTop: 2 }}>
                  {stage.sub}
                </div>
              </div>
              {/* Blocks */}
              {stageActs(si).map(a => {
                const left = LABEL_W + timeToY(a.start) / 80 * PX_PER_HOUR;
                const width = dur(a.start, a.end) * PX_PER_HOUR - 4;
                const color = KIND_COLOR(a.k);
                const isFav = favorites.has(a.id);
                const isNow = nowPlayingId === a.id;
                return (
                  <button key={a.id} onClick={() => setSelected(a)}
                    style={{
                      position: 'absolute', top: 4, left, width, height: STAGE_H - 8,
                      borderRadius: 9, background: color, color: '#fff',
                      border: isNow ? `2px solid ${BRAND.vermilion}` : (isFav ? `2px solid ${BRAND.saffron}` : 'none'),
                      padding: '6px 8px', textAlign: 'left', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'hidden',
                      boxShadow: isFav ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 2px ${BRAND.saffron}88, 0 4px 10px rgba(0,0,0,0.35)` : isNow ? `inset 0 1px 0 rgba(255,255,255,0.25), 0 0 0 2px ${BRAND.vermilion}, 0 0 12px rgba(240,50,40,0.5)` : 'inset 0 1px 0 rgba(255,255,255,0.22), 0 3px 8px rgba(0,0,0,0.28)',
                      animation: isNow ? 'now-pulse 1.8s ease infinite' : 'none',
                    }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {isNow && <span style={{ background: '#fff', color: BRAND.vermilion, fontFamily: 'Sansation', fontWeight: 700, fontSize: 8, padding: '1px 4px', borderRadius: 3, letterSpacing: 0.5 }}>{t.nowPlaying}</span>}
                      {isFav && !isNow && <span style={{ fontSize: 11 }}>❤️</span>}
                    </div>
                    <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, lineHeight: 1.2, marginTop: 2 }}>{a.name.replace('Talent · ', '').replace('DJ · ', '').replace('Comedy · ', '').replace('Theater · ', '').replace('Lecture · ', '').replace('Movie · ', '').replace('Performance · ', '')}</div>
                    <div style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 9, marginTop: 'auto', opacity: 0.85 }}>{a.start}–{a.end}</div>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: th.surface, borderTop: `1px solid ${th.border}`, flexShrink: 0, justifyContent: 'space-between', fontSize: 10 }}>
        {[{c:BRAND.vermilion,l:'Main'},{c:BRAND.cerulean,l:'Talent'},{c:BRAND.saffron,l:'Club'},{c:BRAND.dark,l:'DJ'}].map(x=>(
          <div key={x.l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: x.c }} />
            <span style={{ fontFamily: 'Sansation', fontWeight: 400, fontSize: 10, color: th.text2 }}>{x.l}</span>
          </div>
        ))}
      </div>

      {/* Act detail bottom sheet */}
      {act && (
        <ActSheet act={act} t={t} th={th} dark={dark} stages={stages} artists={artists} onClose={() => setSelected(null)}
          isFav={favorites.has(act.id)} toggleFav={() => toggleFav(act.id)}
          reminderSet={remindersSet[act.id]}
          onSetReminder={() => fireToast(act)} />
      )}
    </div>
  );
}

function ActSheet({ act, t, th, dark, stages = STAGES, artists = ARTISTS, onClose, isFav, toggleFav, reminderSet, onSetReminder }) {
  const [playing, setPlaying] = useState(false);
  const stageName = (typeof stages[act.s] === 'string' ? stages[act.s] : stages[act.s]?.name) || '';
  // Bundled ARTISTS holds the rich media (image, video); the API artist
  // record is a fallback. Per-act CMS fields override genre/bio when set.
  const meta = { ...(artists?.[act.name] || {}), ...(ARTISTS[act.name] || {}) };
  const artistData = {
    genre: act.genre || meta.genre || (act.k === 'talent' ? 'Talent' : act.k === 'club' ? act.name.split(' · ')[0] : act.k === 'dj' ? 'DJ Set' : 'Live'),
    bio: act.bio || meta.bio || 'An exciting act you don\'t want to miss. Full lineup info coming soon.',
  };
  const img = meta.img ? encodeURI(meta.img) : null;
  const yt = meta.yt || null;
  const color = KIND_COLOR(act.k);
  const onSaffron = color === BRAND.saffron;
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', animation: 'fade-in 0.2s' }} onClick={onClose} />
      <div className="sheet-enter" style={{ position: 'relative', width: '100%', background: th.bg, borderRadius: '24px 24px 0 0', maxHeight: '88%', overflowY: 'auto', zIndex: 1, boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}>
        {/* Drag handle */}
        <div style={{ width: 38, height: 5, borderRadius: 3, background: th.borderHi, margin: '10px auto 6px' }} />
        {/* Artist photo (falls back to a patterned placeholder) */}
        <div style={{ height: 168, margin: '6px 14px', borderRadius: 18, background: `linear-gradient(140deg, ${color} 0%, ${color}88 100%)`, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {img ? (
            <img src={img} alt={act.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.18 }}>
              <defs><pattern id="p1" width="22" height="22" patternUnits="userSpaceOnUse"><line x1="0" y1="0" x2="22" y2="22" stroke="#fff" strokeWidth="1.2"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#p1)"/>
            </svg>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.55) 100%)' }} />
          {!img && (
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '1.5px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-icons" style={{ fontSize: 34, color: '#fff' }}>music_note</span>
            </div>
          )}
        </div>
        {/* Name + genre */}
        <div style={{ padding: '14px 18px 0' }}>
          <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 23, color: th.text, letterSpacing: '-0.5px' }}>{act.name}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
            <span style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: onSaffron ? '#1A1A1A' : '#fff', borderRadius: 999, padding: '4px 11px', fontFamily: 'Sansation', fontWeight: 700, fontSize: 11 }}>{artistData.genre}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: th.text2, fontFamily: 'Sansation', fontSize: 11 }}>
              <span className="material-icons" style={{ fontSize: 14 }}>location_on</span>{stageName}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: th.text2, fontFamily: 'Sansation', fontSize: 11 }}>
              <span className="material-icons" style={{ fontSize: 14 }}>schedule</span>{act.start} – {act.end}
            </span>
          </div>
        </div>
        {/* Bio */}
        <div style={{ padding: '14px 18px 0', fontFamily: 'Sansation', fontSize: 13, color: th.text2, lineHeight: 1.7 }}>{artistData.bio}</div>
        {/* YouTube — click the thumbnail to load the embedded player */}
        {yt && (
          <div style={{ padding: '14px 18px 0' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', background: '#000', border: `1px solid ${th.border}`, position: 'relative', aspectRatio: '16/9' }}>
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`}
                  title={act.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div onClick={() => setPlaying(true)} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <img src={`https://img.youtube.com/vi/${yt}/hqdefault.jpg`} alt={act.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.28)' }} />
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 6px 18px rgba(0,0,0,0.5)' }}>
                    <span className="material-icons" style={{ color: '#fff', fontSize: 32, marginLeft: 3 }}>play_arrow</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 9, left: 12, color: '#fff', fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, zIndex: 1, textShadow: '0 1px 4px rgba(0,0,0,0.7)' }}>{t.watchVideo}</div>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Favorite */}
        <div style={{ padding: '14px 18px 8px' }}>
          <button onClick={toggleFav} style={{
            width: '100%', padding: '13px', borderRadius: 13, cursor: 'pointer',
            border: `1px solid ${isFav ? 'transparent' : th.border}`,
            background: isFav ? `linear-gradient(135deg, ${BRAND.vermilion}, #ff5247)` : th.cardBg,
            color: isFav ? '#fff' : th.text,
            fontFamily: 'Sansation', fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, transition: 'all .2s',
            boxShadow: isFav ? `0 8px 20px -8px ${BRAND.vermilion}aa` : 'none',
          }}>
            <span style={{ fontSize: 16 }}>{isFav ? '❤️' : '🤍'}</span>
            {isFav ? t.favorited : t.favorite}
          </button>
        </div>
        {/* Reminders */}
        <div style={{ padding: '0 18px 14px' }}>
          <div style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 11, color: th.text3, marginBottom: 7 }}>{t.setReminder} · {t.before}</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[t.min15, t.min10, t.min5].map(label => (
              <button key={label} onClick={onSetReminder} style={{
                flex: 1, padding: '10px', borderRadius: 11,
                border: `1px solid ${reminderSet ? BRAND.saffron + '88' : th.border}`,
                background: reminderSet ? BRAND.saffron + '22' : th.cardBg, color: reminderSet ? BRAND.saffron : th.text,
                fontFamily: 'Sansation', fontSize: 12, fontWeight: 400, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                <span className="material-icons" style={{ fontSize: 14 }}>notifications</span>
                {label}
              </button>
            ))}
          </div>
          {reminderSet && <div style={{ textAlign: 'center', fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, color: BRAND.saffron, marginTop: 9 }}>{t.reminderSet}</div>}
        </div>
        <div style={{ padding: '0 18px 26px' }}>
          <button onClick={onClose} style={{ width: '100%', padding: '13px', borderRadius: 13, border: `1px solid ${th.border}`, cursor: 'pointer', background: th.cardBg, color: th.text2, fontFamily: 'Sansation', fontWeight: 700, fontSize: 13 }}>{t.close}</button>
        </div>
      </div>
    </div>
  );
}

export { HomeScreen, InfoScreen, ScheduleScreen };
