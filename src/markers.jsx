// ═══════════════════════════════════════════════════════════
// Brand marker icons — loaded from assets/
// Usage: <BrandMarker kind="ponton" size={40} />
// ═══════════════════════════════════════════════════════════

// Map marker kind → SVG file in assets/
const MARKER_SRCS = {
  ponton:   'assets/marker_stage1_ponton.svg',
  club:     'assets/marker_stage3_the_club.svg',
  hangaar:  'assets/marker_stage4_hangar.svg',
  bar:      'assets/marker_bar.svg',
  food:     'assets/marker_food.svg',
  aid:      'assets/marker_first_aid.svg',
  ice:      'assets/marker_ice_cream.svg',
  locker:   'assets/marker_locker.svg',
  merch:    'assets/marker_merchandise.svg',
  toilet:   'assets/marker_toilet.svg',
  entrance: 'assets/marker_entrance_exit.svg',
};

// lake (stage 2) has no brand SVG — kept inline
const MARKER_PATHS = {
  lake: { vb: '0 0 75 75', bg: '#247BA0', d: 'M38.1,54.13v-8.29h-16.71v-4.9l15.08-22.83h9.02v21.8h5.21v5.93h-5.21v8.29h-7.39ZM29.32,39.9h8.78v-7.57l.3-7.45h-.12l-3.33,6.42-5.63,8.6Z' },
};

function BrandMarker({ kind, size = 40, selected = false, style = {} }) {
  const src = MARKER_SRCS[kind];

  if (src) {
    return (
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
        {selected && (
          <div style={{
            position: 'absolute', inset: -5, borderRadius: '50%',
            background: 'rgba(214,46,57,0.3)',
            animation: 'pulse-dot 1.3s ease infinite',
          }}/>
        )}
        <img
          src={src}
          width={size}
          height={size}
          style={{
            display: 'block',
            transform: selected ? 'scale(1.12)' : 'scale(1)',
            transition: 'transform .2s',
            filter: selected
              ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))'
              : 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))',
          }}
        />
      </div>
    );
  }

  // Inline fallback for lake
  const m = MARKER_PATHS[kind];
  if (!m) return null;
  const [,, vw, vh] = m.vb.split(' ').map(Number);
  const cx = vw / 2, cy = vh / 2, r = Math.min(vw, vh) / 2 - 1;
  return (
    <svg width={size} height={size} viewBox={m.vb} style={{ display: 'block', flexShrink: 0, ...style, filter: selected ? 'drop-shadow(0 3px 8px rgba(0,0,0,0.45))' : 'drop-shadow(0 1px 3px rgba(0,0,0,0.3))' }}>
      {selected && <circle cx={cx} cy={cy} r={r} fill={m.bg} opacity="0.35"><animate attributeName="r" values={`${r};${r+6};${r}`} dur="1.3s" repeatCount="indefinite"/></circle>}
      <circle cx={cx} cy={cy} r={r} fill={m.bg} stroke="#fff" strokeWidth={selected ? 2.5 : 1.8}/>
      <path d={m.d} fill="#fff"/>
    </svg>
  );
}

export { BrandMarker, MARKER_PATHS, MARKER_SRCS };
