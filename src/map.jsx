// ═══════════════════════════════════════════════════════════
// MAP SCREEN — real map: assets/kaart_losse_lagen.png
// Marker x/y are percentages of the map image (0-100).
// ═══════════════════════════════════════════════════════════

// Map coordinates: x/y as % of map (0–100). Adjust to match real map.
// Map coordinates on a 320×380 viewBox. Stages placed near paths and water.
import { useState, useRef } from 'react';
import { BRAND } from './data.js';
import { BrandMarker, MARKER_PATHS } from './markers.jsx';

const MARKERS = [
  // Stages
  { id: 'ponton',   kind: 'stage', mk: 'ponton',   x: 58,  y: 108, tKey: 'markerPonton',   descKey: 'mPontonD',   live: true },
  { id: 'lake',     kind: 'stage', mk: 'lake',     x: 158, y: 168, tKey: 'markerLake',     descKey: 'mLakeD',     live: false },
  { id: 'club',     kind: 'stage', mk: 'club',     x: 220, y: 128, tKey: 'markerClub',     descKey: 'mClubD',     live: false },
  { id: 'hangaar',  kind: 'stage', mk: 'hangaar',  x: 268, y: 58,  tKey: 'markerHangaar',  descKey: 'mHangaarD',  live: false },
  // Facilities
  { id: 't1',    kind: 'fac', mk: 'toilet',   x: 35,  y: 65,  tKey: 'markerToilet', descKey: 'mToiletD' },
  { id: 't2',    kind: 'fac', mk: 'toilet',   x: 200, y: 225, tKey: 'markerToilet', descKey: 'mToiletD' },
  { id: 't3',    kind: 'fac', mk: 'toilet',   x: 290, y: 170, tKey: 'markerToilet', descKey: 'mToiletD' },
  { id: 'ice',   kind: 'fac', mk: 'ice',      x: 115, y: 60,  tKey: 'markerIce',    descKey: 'mIceD' },
  { id: 'bar1',  kind: 'fac', mk: 'bar',      x: 100, y: 160, tKey: 'markerBar',    descKey: 'mBarD' },
  { id: 'bar2',  kind: 'fac', mk: 'bar',      x: 225, y: 195, tKey: 'markerBar',    descKey: 'mBarD' },
  { id: 'food1', kind: 'fac', mk: 'food',     x: 135, y: 115, tKey: 'markerFood',   descKey: 'mFoodD' },
  { id: 'food2', kind: 'fac', mk: 'food',     x: 250, y: 92,  tKey: 'markerFood',   descKey: 'mFoodD' },
  { id: 'merch', kind: 'fac', mk: 'merch',    x: 75,  y: 240, tKey: 'markerMerch',  descKey: 'mMerchD' },
  { id: 'lock',  kind: 'fac', mk: 'locker',   x: 110, y: 285, tKey: 'markerLocker', descKey: 'mLockerD' },
  { id: 'aid',   kind: 'fac', mk: 'aid',      x: 178, y: 68,  tKey: 'markerAid',    descKey: 'mAidD' },
  { id: 'entry', kind: 'fac', mk: 'entrance', x: 158, y: 335, tKey: 'markerEntry',  descKey: 'mEntryD' },
];

const LEGEND_KEYS = ['ponton','lake','club','hangaar','toilet','ice','bar','food','merch','locker','aid','entrance'];
const LEGEND_LABEL_MAP = { ponton:'markerPonton', lake:'markerLake', club:'markerClub', hangaar:'markerHangaar', toilet:'markerToilet', ice:'markerIce', bar:'markerBar', food:'markerFood', merch:'markerMerch', locker:'markerLocker', aid:'markerAid', entrance:'markerEntry' };

function MapScreen({ t, th, dark }) {
  const [selected, setSelected] = useState(null);
  const [legendOpen, setLegendOpen] = useState(false);
  const [gpsEnabled, setGpsEnabled] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragStart = useRef(null);

  const onPanStart = (e) => {
    const touch = e.touches ? e.touches[0] : e;
    dragStart.current = { x: touch.clientX, y: touch.clientY, panX: pan.x, panY: pan.y };
  };
  const onPanMove = (e) => {
    if (!dragStart.current) return;
    const touch = e.touches ? e.touches[0] : e;
    setPan({
      x: dragStart.current.panX + (touch.clientX - dragStart.current.x),
      y: dragStart.current.panY + (touch.clientY - dragStart.current.y),
    });
  };
  const onPanEnd = () => { dragStart.current = null; };

  const sel = selected ? MARKERS.find(m => m.id === selected) : null;
  const selMk = sel ? MARKER_PATHS[sel.mk] : null;

  return (
    <div className="screen-enter" style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Top control strip */}
      <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, background: th.bg }}>
        <span className="material-icons" style={{ fontSize: 16, color: th.text3 }}>touch_app</span>
        <span style={{ fontFamily: 'Sansation', fontWeight: 300, fontStyle: 'italic', fontSize: 11, color: th.text3, flex: 1 }}>{t.tapForDetails}</span>
        <button onClick={() => setLegendOpen(!legendOpen)} style={{ background: legendOpen ? `linear-gradient(135deg, ${BRAND.cerulean}, #2e93bd)` : th.cardBg, color: legendOpen ? '#fff' : th.text2, border: `1px solid ${legendOpen ? 'transparent' : th.border}`, borderRadius: 10, padding: '7px 12px', fontFamily: 'Sansation', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, boxShadow: legendOpen ? `0 6px 14px -5px ${BRAND.cerulean}aa` : th.shadow }}>
          <span className="material-icons" style={{ fontSize: 14 }}>layers</span>{t.showLegend}
        </button>
      </div>

      {!gpsEnabled && (
        <div style={{ margin: '0 16px 10px', background: BRAND.saffron + '1e', border: `1px solid ${BRAND.saffron}55`, borderRadius: 14, padding: '11px 13px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span className="material-icons" style={{ color: BRAND.saffron, fontSize: 18 }}>location_off</span>
          <div style={{ flex: 1, fontFamily: 'Sansation', fontSize: 12, color: th.text2 }}>{t.enableGPS}</div>
          <button onClick={() => setGpsEnabled(true)} style={{ background: BRAND.saffron, color: '#1A1A1A', border: 'none', borderRadius: 9, padding: '6px 13px', fontFamily: 'Sansation', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>On</button>
        </div>
      )}

      {/* Map canvas */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', background: '#000' }}
        onMouseDown={onPanStart} onMouseMove={onPanMove} onMouseUp={onPanEnd} onMouseLeave={onPanEnd}
        onTouchStart={onPanStart} onTouchMove={onPanMove} onTouchEnd={onPanEnd}>
        <div style={{ position: 'absolute', inset: 0, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center', transition: dragStart.current ? 'none' : 'transform .3s' }}>
          <svg viewBox="0 0 320 380" style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid meet">

            {/* Real festival map */}
            <image
              href="assets/kaart_losse_lagen.png"
              x="0" y="0" width="320" height="380"
              preserveAspectRatio="xMidYMid slice"
              style={{ filter: dark ? 'brightness(0.75) saturate(0.85)' : 'none' }}
            />

            {/* Markers — render each as foreignObject for clean scaling */}
            {MARKERS.map(m => {
              const isStage = m.kind === 'stage';
              const size = isStage ? 32 : 22;
              const isSel = selected === m.id;
              return (
                <g key={m.id} onClick={(e)=>{e.stopPropagation(); setSelected(isSel ? null : m.id);}} style={{ cursor: 'pointer' }}>
                  <foreignObject x={m.x - size/2} y={m.y - size/2} width={size} height={size}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ width: '100%', height: '100%', transform: isSel ? 'scale(1.18)' : 'scale(1)', transition: 'transform .2s' }}>
                      <BrandMarker kind={m.mk} size={size} selected={isSel}/>
                    </div>
                  </foreignObject>
                  {isStage && (
                    <g>
                      <rect x={m.x-30} y={m.y+size/2+3} width="60" height="13" rx="3" fill="#000" opacity="0.88"/>
                      <text x={m.x} y={m.y+size/2+12} textAnchor="middle" fontSize="8" fontFamily="Sansation" fontWeight="700" fill="#fff">{t[m.tKey]}</text>
                      {m.live && (
                        <g>
                          <rect x={m.x+12} y={m.y-size/2-14} width="28" height="11" rx="5.5" fill={BRAND.vermilion}>
                            <animate attributeName="opacity" values="1;0.45;1" dur="1.2s" repeatCount="indefinite"/>
                          </rect>
                          <text x={m.x+26} y={m.y-size/2-6} textAnchor="middle" fontSize="7" fontFamily="Sansation" fontWeight="700" fill="#fff">● LIVE</text>
                        </g>
                      )}
                    </g>
                  )}
                </g>
              );
            })}

            {/* GPS user dot */}
            {gpsEnabled && (
              <g>
                <circle cx="140" cy="262" r="10" fill={BRAND.cerulean} opacity="0.25">
                  <animate attributeName="r" values="8;18;8" dur="2s" repeatCount="indefinite"/>
                  <animate attributeName="opacity" values="0.35;0;0.35" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="140" cy="262" r="6" fill={BRAND.cerulean} stroke="#fff" strokeWidth="2.2"/>
              </g>
            )}
          </svg>
        </div>
      </div>

      {/* Floating controls */}
      <div style={{ position: 'absolute', right: 10, bottom: legendOpen ? 260 : 80, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 4, transition: 'bottom .3s' }}>
        <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} style={zBtn(th)}><span className="material-icons" style={{ fontSize: 20, color: th.text }}>add</span></button>
        <button onClick={() => setZoom(z => Math.max(0.8, z - 0.2))} style={zBtn(th)}><span className="material-icons" style={{ fontSize: 20, color: th.text }}>remove</span></button>
        <button onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} style={zBtn(th)}><span className="material-icons" style={{ fontSize: 18, color: th.text }}>center_focus_strong</span></button>
        <button onClick={() => setGpsEnabled(!gpsEnabled)} style={{...zBtn(th), background: gpsEnabled ? BRAND.cerulean : th.surface}}><span className="material-icons" style={{ fontSize: 18, color: gpsEnabled ? '#fff' : th.text }}>my_location</span></button>
      </div>

      {/* Legend */}
      {legendOpen && (
        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 12, background: th.bg, borderRadius: 18, padding: '14px 16px', boxShadow: '0 -4px 30px rgba(0,0,0,0.4)', border: `1px solid ${th.border}`, animation: 'slide-up 0.28s cubic-bezier(.32,.72,0,1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 14, color: th.text }}>{t.legend}</div>
            <button onClick={() => setLegendOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: th.text3 }}><span className="material-icons" style={{ fontSize: 18 }}>close</span></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, rowGap: 10 }}>
            {LEGEND_KEYS.map(k => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <BrandMarker kind={k} size={22} />
                <span style={{ fontFamily: 'Sansation', fontSize: 11, color: th.text2 }}>{t[LEGEND_LABEL_MAP[k]]}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detail sheet */}
      {sel && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 200, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }} onClick={() => setSelected(null)} />
          <div className="sheet-enter" style={{ position: 'relative', width: '100%', background: th.bg, borderRadius: '24px 24px 0 0', padding: '14px 18px 26px', zIndex: 1, boxShadow: '0 -10px 40px rgba(0,0,0,0.5)' }}>
            <div style={{ width: 38, height: 5, borderRadius: 3, background: th.borderHi, margin: '0 auto 14px' }} />
            <div style={{ display: 'flex', gap: 13, alignItems: 'center', marginBottom: 12 }}>
              <BrandMarker kind={sel.mk} size={50} />
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Sansation', fontWeight: 700, fontSize: 18, color: th.text, letterSpacing: '-0.3px' }}>{t[sel.tKey]}</div>
                {sel.live && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ background: BRAND.vermilion, color: '#fff', fontFamily: 'Sansation', fontWeight: 700, fontSize: 9, padding: '2px 7px', borderRadius: 5, animation: 'pulse-dot 1.5s ease infinite' }}>● {t.liveBadge}</span>
                    <span style={{ fontFamily: 'Sansation', fontSize: 11, color: th.text2 }}>Kensington</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ fontFamily: 'Sansation', fontSize: 13, color: th.text2, lineHeight: 1.6, marginBottom: 16 }}>{t[sel.descKey]}</div>
            <button onClick={() => setSelected(null)} style={{ width: '100%', padding: '13px', borderRadius: 13, border: `1px solid ${th.border}`, cursor: 'pointer', background: th.cardBg, color: th.text2, fontFamily: 'Sansation', fontWeight: 700, fontSize: 13 }}>{t.close}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function zBtn(th) {
  return { width: 38, height: 38, borderRadius: 11, border: `1px solid ${th.border}`, background: th.surface, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)' };
}

export { MapScreen };
