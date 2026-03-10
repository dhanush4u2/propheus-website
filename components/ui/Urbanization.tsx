'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { motion, animate, AnimatePresence } from 'framer-motion';

// ─── ISO MATH ─────────────────────────────────────────────────────────────────
// Standard isometric: col → right-down, row → left-down, height → up
const TW = 28; // tile width
const TH = 14; // tile height

function iso(col: number, row: number, ox: number, oy: number): { x: number; y: number } {
  return {
    x: ox + (col - row) * (TW / 2),
    y: oy + (col + row) * (TH / 2),
  };
}

// ─── SINGLE BUILDING ──────────────────────────────────────────────────────────
// w/d = footprint in tiles (width along col axis, depth along row axis)
// h   = height in pixels upward
// Renders as one solid extruded box with 3 faces
interface BuildingProps {
  col: number; row: number; w?: number; d?: number; h: number;
  ox: number; oy: number; delay: number; variant?: number;
}
function Building({ col, row, w = 1, d = 1, h, ox, oy, delay, variant = 0 }: BuildingProps) {
  // Four ground corners of the footprint
  const p = (c: number, r: number) => iso(c, r, ox, oy);
  const g = {
    tl: p(col,     row),       // top-left in iso = smallest col+row
    tr: p(col + w, row),       // top-right
    br: p(col + w, row + d),   // bottom-right
    bl: p(col,     row + d),   // bottom-left
  };

  // Roof corners = ground corners shifted up by h
  const r = {
    tl: { x: g.tl.x, y: g.tl.y - h },
    tr: { x: g.tr.x, y: g.tr.y - h },
    br: { x: g.br.x, y: g.br.y - h },
    bl: { x: g.bl.x, y: g.bl.y - h },
  };

  const pt  = (pt: { x: number; y: number }) => `${pt.x},${pt.y}`;
  const pts = (...pp: { x: number; y: number }[]) => pp.map(pt).join(' ');

  // Color variants for visual diversity
  const palettes = [
    { top: '#2dd4bf', right: '#0d6b62', left: '#083d3a', rStroke: '#0f7a70', lStroke: '#0a4f4a' },
    { top: '#14b8a6', right: '#0a5c55', left: '#062e2b', rStroke: '#0c6b63', lStroke: '#083835' },
    { top: '#5eead4', right: '#0f766e', left: '#083d3a', rStroke: '#118077', lStroke: '#0a4f4a' },
  ];
  const pal = palettes[variant % palettes.length];

  // Collapsed roof (for animation start)
  const groundRoof = {
    tl: g.tl, tr: g.tr, br: g.br, bl: g.bl,
  };

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.2 }}
    >
      {/* LEFT face — front-left visible face: bl→br edge going upward */}
      <motion.polygon
        initial={{ points: pts(g.bl, g.br, g.br, g.bl) }}
        animate={{ points: pts(g.bl, g.br, r.br, r.bl) }}
        transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        fill={pal.left}
        stroke={pal.lStroke}
        strokeWidth="0.4"
      />

      {/* RIGHT face — front-right visible face: tr→br edge going upward */}
      <motion.polygon
        initial={{ points: pts(g.tr, g.br, g.br, g.tr) }}
        animate={{ points: pts(g.tr, g.br, r.br, r.tr) }}
        transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        fill={pal.right}
        stroke={pal.rStroke}
        strokeWidth="0.4"
      />

      {/* ROOF */}
      <motion.polygon
        initial={{ points: pts(g.tl, g.tr, g.br, g.bl) }}
        animate={{ points: pts(r.tl, r.tr, r.br, r.bl) }}
        transition={{ delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        fill={pal.top}
        stroke={h > 50 ? '#5eead4' : pal.top}
        strokeWidth="0.5"
        style={h > 55 ? { filter: 'drop-shadow(0 -2px 6px rgba(45,212,191,0.85))' } : {}}
      />

      {/* Window grid on right face for taller buildings */}
      {h > 30 && (
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.7, duration: 0.4 }}
        >
          {Array.from({ length: Math.floor((h - 10) / 12) }).map((_, i) => {
            const wy = g.tr.y - 8 - i * 12;
            return (
              <rect key={i} x={g.tr.x - 8} y={wy}
                width={6} height={4} rx={0.5}
                fill="rgba(180,255,245,0.12)"
              />
            );
          })}
        </motion.g>
      )}
    </motion.g>
  );
}

// ─── ROAD TILE ─────────────────────────────────────────────────────────────
interface RoadProps { col: number; row: number; w: number; d: number; ox: number; oy: number; delay: number; }
function Road({ col, row, w, d, ox, oy, delay }: RoadProps) {
  const p = (c: number, r: number) => iso(c, r, ox, oy);
  const corners = [
    p(col,     row),
    p(col + w, row),
    p(col + w, row + d),
    p(col,     row + d),
  ];
  const pts = corners.map(c => `${c.x},${c.y}`).join(' ');
  return (
    <motion.polygon
      points={pts}
      fill="rgba(45,212,191,0.06)"
      stroke="rgba(45,212,191,0.12)"
      strokeWidth="0.3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.6 }}
    />
  );
}

// ─── COUNTER ──────────────────────────────────────────────────────────────────
const Counter = ({ to, decimals = 1 }: { to: number; decimals?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const ctrl = animate(0, to, {
      duration: 2.4, ease: [0.16, 1, 0.3, 1],
      onUpdate: v => { if (ref.current) ref.current.textContent = v.toFixed(decimals); },
    });
    return () => ctrl.stop();
  }, [to, decimals]);
  return <span ref={ref}>0.0</span>;
};

// ─── GLOW CARD ────────────────────────────────────────────────────────────────
const GlowCard = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      ref.current.style.setProperty('--x', (e.clientX - r.left).toFixed(2));
      ref.current.style.setProperty('--xp', (e.clientX / window.innerWidth).toFixed(2));
      ref.current.style.setProperty('--y', (e.clientY - r.top).toFixed(2));
      ref.current.style.setProperty('--yp', (e.clientY / window.innerHeight).toFixed(2));
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return (
    <div ref={ref} data-glow style={{
      '--base': '150', '--spread': '30', '--radius': '20', '--border': '2',
      '--backdrop': 'rgba(0, 0, 0, 0.97)',
      '--backup-border': 'rgba(255, 255, 255, 0.08)',
      '--size': '300', '--outer': '1',
      '--border-size': 'calc(var(--border, 2) * 1px)',
      '--spotlight-size': 'calc(var(--size, 300) * 1px)',
      '--hue': 'calc(var(--base, 150) + (var(--xp, 0) * var(--spread, 30)))',
      '--saturation': '100', '--lightness': '50',
      '--border-spot-opacity': '1', '--border-light-opacity': '0.4',
      '--bg-spot-opacity': '0.02',
      backgroundImage: `radial-gradient(var(--spotlight-size) var(--spotlight-size) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 50) * 1%) / var(--bg-spot-opacity, 0.02)), transparent)`,
      backgroundColor: 'var(--backdrop)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      borderRadius: 20,
      backdropFilter: 'blur(80px)',
      boxShadow: '0 20px 60px -10px rgba(0,0,0,0.95)',
      overflow: 'hidden',
      position: 'relative',
      touchAction: 'none',
    } as React.CSSProperties}>
      <div data-glow-inner style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: 'none', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  );
};

// ─── CITY LAYOUT ──────────────────────────────────────────────────────────────
// This defines a real city: downtown core, mid-rise district, residential, roads
// Format: { col, row, w, d, h, variant }
// Roads are gap tiles — buildings are placed around them
function useCityLayout() {
  return useMemo(() => {
    const buildings = [
      // ── Downtown core: tall landmark towers ──
      { col: 0,  row: 0,  w: 2, d: 2, h: 110, v: 2 },
      { col: 3,  row: 1,  w: 2, d: 1, h: 95,  v: 0 },
      { col: -1, row: 3,  w: 1, d: 2, h: 88,  v: 1 },
      { col: 2,  row: -1, w: 1, d: 2, h: 80,  v: 2 },
      { col: -3, row: 1,  w: 2, d: 1, h: 75,  v: 0 },
      { col: 1,  row: 4,  w: 2, d: 1, h: 70,  v: 1 },
      { col: 4,  row: -1, w: 1, d: 1, h: 65,  v: 2 },
      { col: -2, row: -1, w: 2, d: 1, h: 60,  v: 0 },

      // ── Mid-rise district: medium blocks ──
      { col: 5,  row: 1,  w: 1, d: 2, h: 48,  v: 1 },
      { col: -4, row: 3,  w: 2, d: 1, h: 44,  v: 0 },
      { col: 2,  row: 5,  w: 1, d: 2, h: 42,  v: 2 },
      { col: -1, row: -3, w: 2, d: 1, h: 40,  v: 1 },
      { col: 4,  row: 3,  w: 2, d: 1, h: 38,  v: 0 },
      { col: -3, row: 5,  w: 1, d: 2, h: 36,  v: 2 },
      { col: 6,  row: -1, w: 1, d: 1, h: 35,  v: 1 },
      { col: 0,  row: -4, w: 2, d: 1, h: 34,  v: 0 },
      { col: -5, row: 0,  w: 1, d: 2, h: 32,  v: 2 },
      { col: 3,  row: 6,  w: 1, d: 1, h: 30,  v: 1 },
      { col: 5,  row: -2, w: 2, d: 1, h: 28,  v: 0 },
      { col: -2, row: 6,  w: 2, d: 1, h: 28,  v: 2 },

      // ── Residential / low-rise: small footprints, shorter ──
      { col: 6,  row: 2,  w: 1, d: 1, h: 22,  v: 0 },
      { col: -5, row: 4,  w: 1, d: 1, h: 20,  v: 1 },
      { col: 1,  row: 7,  w: 1, d: 1, h: 20,  v: 2 },
      { col: 7,  row: 0,  w: 1, d: 1, h: 18,  v: 0 },
      { col: -6, row: 2,  w: 1, d: 1, h: 18,  v: 1 },
      { col: 4,  row: 5,  w: 1, d: 1, h: 16,  v: 2 },
      { col: -4, row: -1, w: 1, d: 1, h: 16,  v: 0 },
      { col: 2,  row: -5, w: 1, d: 1, h: 15,  v: 1 },
      { col: -1, row: 7,  w: 1, d: 1, h: 14,  v: 2 },
      { col: 6,  row: 4,  w: 1, d: 1, h: 14,  v: 0 },
      { col: -6, row: 5,  w: 1, d: 1, h: 12,  v: 1 },
      { col: 7,  row: 2,  w: 1, d: 1, h: 12,  v: 2 },
      { col: 3,  row: -4, w: 1, d: 1, h: 12,  v: 0 },
      { col: -3, row: -3, w: 1, d: 1, h: 11,  v: 1 },
      { col: 5,  row: 6,  w: 1, d: 1, h: 10,  v: 2 },
      { col: -5, row: 6,  w: 1, d: 1, h: 10,  v: 0 },
      { col: 7,  row: -2, w: 1, d: 1, h: 9,   v: 1 },
      { col: 0,  row: 8,  w: 1, d: 1, h: 9,   v: 2 },
      { col: -7, row: 1,  w: 1, d: 1, h: 8,   v: 0 },
      { col: 4,  row: -5, w: 1, d: 1, h: 8,   v: 1 },
      { col: -4, row: 7,  w: 1, d: 1, h: 7,   v: 2 },
      { col: 6,  row: -3, w: 1, d: 1, h: 7,   v: 0 },
      { col: -2, row: -5, w: 1, d: 1, h: 6,   v: 1 },
      { col: 7,  row: 4,  w: 1, d: 1, h: 6,   v: 2 },
      { col: -7, row: 4,  w: 1, d: 1, h: 6,   v: 0 },
      { col: 2,  row: 8,  w: 1, d: 1, h: 5,   v: 1 },
      { col: 5,  row: -5, w: 1, d: 1, h: 5,   v: 2 },
      { col: -5, row: -3, w: 1, d: 1, h: 5,   v: 0 },
    ];

    // Road grid lines — thin iso planes between building clusters
    const roads = [
      { col: -8, row: 2, w: 16, d: 1 },   // horizontal road
      { col: 2, row: -7, w: 1,  d: 16 },  // vertical road
    ];

    // Assign delays — distance from center, staggered outward
    return {
      buildings: buildings.map(b => ({
        ...b,
        delay: 0.3 + Math.sqrt(b.col * b.col + b.row * b.row) * 0.08 + Math.random() * 0.15,
      })),
      roads: roads.map((r, i) => ({ ...r, delay: 0.1 + i * 0.1 })),
    };
  }, []);
}

// ─── URBANIZATION OVER TIME CHART ────────────────────────────────────────────
const URBAN_DATA = [
  { year: '00', value: 47 },
  { year: '02', value: 49 },
  { year: '04', value: 51 },
  { year: '06', value: 54 },
  { year: '08', value: 57 },
  { year: '10', value: 61 },
  { year: '12', value: 64 },
  { year: '14', value: 67 },
  { year: '16', value: 70 },
  { year: '18', value: 73 },
  { year: '20', value: 76 },
  { year: '22', value: 79 },
  { year: '24', value: 83 },
];

function UrbanizationChart() {
  const W = 294, H = 130;
  const PAD = { top: 12, right: 6, bottom: 30, left: 42 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const minV = 40, maxV = 90;
  const xStep = chartW / (URBAN_DATA.length - 1);

  const toX = (i: number) => PAD.left + i * xStep;
  const toY = (v: number) => PAD.top + chartH - ((v - minV) / (maxV - minV)) * chartH;

  const linePath = URBAN_DATA
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${toX(i).toFixed(1)} ${toY(d.value).toFixed(1)}`)
    .join(' ');

  const areaPath = linePath
    + ` L ${toX(URBAN_DATA.length - 1).toFixed(1)} ${(PAD.top + chartH).toFixed(1)}`
    + ` L ${PAD.left} ${(PAD.top + chartH).toFixed(1)} Z`;

  const [revealed, setRevealed] = useState(false);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(t);
  }, []);

  // Find nearest data point from mouse X
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) * (W / rect.width);
    const relX = mouseX - PAD.left;
    const idx = Math.round(relX / xStep);
    const clamped = Math.max(0, Math.min(URBAN_DATA.length - 1, idx));
    setHoverIdx(clamped);
  };

  const pathLen = 620;

  const hx = hoverIdx !== null ? toX(hoverIdx) : null;
  const hy = hoverIdx !== null ? toY(URBAN_DATA[hoverIdx].value) : null;
  const hd = hoverIdx !== null ? URBAN_DATA[hoverIdx] : null;

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      style={{ cursor: 'crosshair', overflow: 'visible' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
        </linearGradient>
        <clipPath id="chartClip">
          <motion.rect
            x={PAD.left} y={0} height={H}
            initial={{ width: 0 }}
            animate={{ width: revealed ? chartW + PAD.right + 2 : 0 }}
            transition={{ duration: 1.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          />
        </clipPath>
      </defs>

      {/* Y-axis: just 3 labels — 50, 70, 90 */}
      {[50, 70, 90].map(v => (
        <g key={v}>
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={toY(v)} y2={toY(v)}
            stroke="rgba(255,255,255,0.07)" strokeWidth="1"
            strokeDasharray="3 3"
          />
          <text
            x={PAD.left - 8} y={toY(v) + 5}
            textAnchor="end"
            fontSize="12" fontWeight="800"
            fill="rgba(255,255,255,0.75)"
            fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
          >{v}%</text>
        </g>
      ))}

      {/* X-axis: just 3 labels — 2000, 2012, 2024 */}
      {[[0, "'00"], [6, "'12"], [12, "'24"]].map(([i, label]) => (
        <text key={i}
          x={toX(i as number)} y={H - 8}
          textAnchor="middle"
          fontSize="12" fontWeight="800"
          fill="rgba(255,255,255,0.75)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif"
        >{label}</text>
      ))}

      {/* Area */}
      <path d={areaPath} fill="url(#areaFill)" clipPath="url(#chartClip)" />

      {/* Line */}
      <motion.path
        d={linePath}
        fill="none"
        stroke={hoverIdx !== null ? '#5eead4' : '#2dd4bf'}
        strokeWidth={hoverIdx !== null ? 2.2 : 1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={pathLen}
        initial={{ strokeDashoffset: pathLen }}
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        style={{
          filter: hoverIdx !== null
            ? 'drop-shadow(0 0 6px rgba(45,212,191,1))'
            : 'drop-shadow(0 0 3px rgba(45,212,191,0.6))',
          transition: 'stroke 0.15s, stroke-width 0.15s, filter 0.15s',
        }}
      />

      {/* Resting end-dot */}
      {hoverIdx === null && (
        <motion.circle
          cx={toX(URBAN_DATA.length - 1)}
          cy={toY(URBAN_DATA[URBAN_DATA.length - 1].value)}
          r={3} fill="#2dd4bf"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8, duration: 0.3 }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(45,212,191,1))' }}
        />
      )}

      {/* Hover crosshair + dot + tooltip */}
      {hoverIdx !== null && hx !== null && hy !== null && hd !== null && (
        <g>
          {/* Vertical line */}
          <line
            x1={hx} x2={hx}
            y1={PAD.top} y2={PAD.top + chartH}
            stroke="rgba(45,212,191,0.35)" strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Horizontal line */}
          <line
            x1={PAD.left} x2={W - PAD.right}
            y1={hy} y2={hy}
            stroke="rgba(45,212,191,0.35)" strokeWidth="1"
            strokeDasharray="3 3"
          />
          {/* Dot on line */}
          <circle cx={hx} cy={hy} r={4.5}
            fill="#111413" stroke="#2dd4bf" strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 5px rgba(45,212,191,0.9))' }}
          />
          <circle cx={hx} cy={hy} r={2} fill="#2dd4bf" />

          {/* Tooltip box */}
          {(() => {
            const tipW = 64, tipH = 42;
            const tipX = hx + 8 > W - tipW - 4 ? hx - tipW - 8 : hx + 8;
            const tipY = hy - tipH - 6 < PAD.top ? hy + 6 : hy - tipH - 6;
            return (
              <g>
                <rect x={tipX} y={tipY} width={tipW} height={tipH} rx={5}
                  fill="#1a2421" stroke="rgba(45,212,191,0.4)" strokeWidth="1"
                />
                <text x={tipX + tipW / 2} y={tipY + 14}
                  textAnchor="middle" fontSize="11" fontWeight="700"
                  fill="rgba(255,255,255,0.6)"
                  fontFamily="-apple-system, sans-serif">
                  20{hd.year}
                </text>
                <text x={tipX + tipW / 2} y={tipY + 30}
                  textAnchor="middle" fontSize="16" fontWeight="900"
                  fill="#2dd4bf"
                  fontFamily="-apple-system, sans-serif">
                  {hd.value}%
                </text>
              </g>
            );
          })()}
        </g>
      )}
    </svg>
  );
}

// ─── MAIN WIDGET ──────────────────────────────────────────────────────────────
export default function UrbanizationWidget() {
  const { buildings, roads } = useCityLayout();
  const [isVisible, setIsVisible] = useState(false);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    const onEnter = () => { setIsVisible(true); setPlayKey(k => k + 1); };
    const onExit  = () => setIsVisible(false);
    window.addEventListener('propheus:state2',      onEnter);
    window.addEventListener('propheus:state2:exit', onExit);
    return () => {
      window.removeEventListener('propheus:state2',      onEnter);
      window.removeEventListener('propheus:state2:exit', onExit);
    };
  }, []);

  const SVG_W = 540;
  const SVG_H = 500;
  const OX = SVG_W * 0.48;
  const OY = SVG_H * 0.60;

  // Back-to-front paint order
  const sortedBuildings = useMemo(() =>
    [...buildings].sort((a, b) => { const aKey = (a.col + (a.w ?? 1)) + (a.row + (a.d ?? 1)); const bKey = (b.col + (b.w ?? 1)) + (b.row + (b.d ?? 1)); return aKey - bKey; }),
    [buildings]
  );

  const ENTRY_DELAY = 2.0; // seconds after state2 fires before animation begins

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        .urb { font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif; -webkit-font-smoothing: antialiased; }
        [data-glow]::before, [data-glow]::after {
          pointer-events: none; content: ""; position: absolute;
          inset: calc(var(--border-size) * -1); border: var(--border-size) solid transparent;
          border-radius: calc(var(--radius) * 1px);
          background-size: calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)));
          background-repeat: no-repeat; background-position: 50% 50%;
          mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
        }
        [data-glow]::before {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.75) calc(var(--spotlight-size) * 0.75) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(var(--hue, 175) calc(var(--saturation, 85) * 1%) calc(var(--lightness, 48) * 1%) / var(--border-spot-opacity, 1)), transparent 100%);
          filter: brightness(2);
        }
        [data-glow]::after {
          background-image: radial-gradient(calc(var(--spotlight-size) * 0.5) calc(var(--spotlight-size) * 0.5) at calc(var(--x, 0) * 1px) calc(var(--y, 0) * 1px), hsl(0 100% 100% / var(--border-light-opacity, 0.35)), transparent 100%);
        }
        [data-glow] > [data-glow-inner] { position: absolute; inset: 0; will-change: filter; pointer-events: none; }
      `}</style>

      <AnimatePresence>
      {isVisible && (
        <motion.div
          key={playKey}
          exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeIn' } }}
          className="urb" style={{
          width: '100%', maxWidth: 1080,
          display: 'flex', alignItems: 'center',
          userSelect: 'none', padding: '20px 0',
          position: 'relative',
        }}>

          {/* ── CITY SVG ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: ENTRY_DELAY }}
            style={{ flexShrink: 0, width: SVG_W, height: SVG_H, position: 'relative' }}
          >
            <svg width={SVG_W} height={SVG_H} viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ overflow: 'visible' }}>
              <defs>
                <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="rgba(0,0,0,0.18)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </radialGradient>
                <linearGradient id="arcLine" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0" />
                  <stop offset="20%"  stopColor="#2dd4bf" stopOpacity="0.9" />
                  <stop offset="75%"  stopColor="#2dd4bf" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Ground shadow */}
              <ellipse cx={OX} cy={OY + 8} rx={260} ry={75} fill="url(#shadow)" />

              {/* Road planes */}
              {roads.map((r, i) => (
                <Road key={i} {...r} ox={OX} oy={OY} delay={ENTRY_DELAY + r.delay} />
              ))}

              {/* Buildings — back to front, each with 2s offset on top of their natural delays */}
              {sortedBuildings.map((b, i) => (
                <Building
                  key={i}
                  col={b.col} row={b.row}
                  w={b.w} d={b.d} h={b.h}
                  ox={OX} oy={OY}
                  delay={ENTRY_DELAY + b.delay}
                  variant={b.v}
                />
              ))}

              {/* City center pulse */}
              <motion.circle cx={OX} cy={OY} r={3.5} fill="#2dd4bf"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: ENTRY_DELAY + 0.2 }}
                style={{ filter: 'drop-shadow(0 0 5px rgba(45,212,191,1))' }} />
              <motion.circle cx={OX} cy={OY} r={4}
                stroke="#2dd4bf" strokeWidth="1.5" fill="none"
                initial={{ opacity: 0 }}
                animate={{ scale: [1, 10], opacity: [0.7, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: ENTRY_DELAY + 0.5, repeatDelay: 0.5 }}
              />
              <motion.circle cx={OX} cy={OY} r={4}
                stroke="#2dd4bf" strokeWidth="0.8" fill="none"
                initial={{ opacity: 0 }}
                animate={{ scale: [1, 18], opacity: [0.25, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: ENTRY_DELAY + 1.7, repeatDelay: 0.5 }}
              />

              {/* Arc to card */}
              <motion.path
                d={`M ${OX} ${OY - 60} C ${OX + 90} ${OY - 100}, ${OX + 210} ${OY - 130}, ${SVG_W + 60} ${OY - 155}`}
                fill="none" stroke="url(#arcLine)"
                strokeWidth="1.2" strokeLinecap="round"
                strokeDasharray="800"
                initial={{ strokeDashoffset: 800 }}
                animate={{ strokeDashoffset: 0 }}
                transition={{ duration: 2.2, delay: ENTRY_DELAY + 2.5, ease: 'circOut' }}
              />
            </svg>
          </motion.div>

          {/* ── CARD ── */}
          <motion.div
            initial={{ opacity: 0, x: 24, filter: 'blur(12px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: 24, filter: 'blur(12px)' }}
            transition={{ duration: 1.0, delay: ENTRY_DELAY + 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: 370, flexShrink: 0, marginLeft: -44, position: 'relative', zIndex: 20 }}
          >
            <GlowCard>
              <div style={{ padding: '32px 34px 36px' }}>

                {/* Header */}
                <div style={{ marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  <h2 style={{
                    margin: 0, fontSize: 22, fontWeight: 900, color: '#fff',
                    letterSpacing: '0.32em', textTransform: 'uppercase', lineHeight: 1.25,
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                  }}>
                    Urbanization
                  </h2>
                </div>

                {/* Growth Velocity */}
                <div style={{ marginBottom: 24, position: 'relative' }}>
                  <p style={{
                    margin: '0 0 8px', fontSize: 12, fontWeight: 700,
                    color: 'rgba(255,255,255,0.45)', letterSpacing: '0.18em', textTransform: 'uppercase',
                    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                  }}>
                    Growth Velocity
                  </p>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{
                      fontSize: 52, fontWeight: 900, color: '#fff',
                      lineHeight: 0.9, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                    }}>
                      <Counter to={74.8} decimals={1} />
                    </span>
                    <span style={{
                      fontSize: 15, fontWeight: 900, color: '#2dd4bf',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                    }}>
                      Index
                    </span>
                  </div>
                  <motion.div
                    animate={{ opacity: [1, 0.15, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    style={{
                      position: 'absolute', top: 4, right: 0,
                      width: 8, height: 8, borderRadius: '50%',
                      background: '#2dd4bf', boxShadow: '0 0 10px rgba(45,212,191,1)',
                    }}
                  />
                </div>

                {/* Urbanization Over Time chart */}
                <div style={{ paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                    <span style={{
                      fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)',
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif",
                    }}>
                      Urbanization Over Time
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(45,212,191,0.8)', letterSpacing: '0.08em' }}>
                      2000 – 2024
                    </span>
                  </div>
                  <UrbanizationChart />
                </div>

              </div>
            </GlowCard>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </>
  );
}