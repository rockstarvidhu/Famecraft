// src/components/VintageOverlay.tsx
// Reusable vintage paper effects matching the reference image:
// • Film grain noise texture
// • Coffee ring stains (SVG circles with radial gradients)
// • Ink bleed / darkened edges
// • Paper yellowing vignette
// • Subtle horizontal scan lines
// Usage: wrap any panel with <VintageOverlay> or use the CSS vars directly

import React from 'react';

// ── All effects as a single stacked overlay div ──────
// Drop this as the FIRST child inside any positioned container.
// It sits at z-index 0 with pointer-events:none so it never blocks clicks.

interface Props {
  /** 0–1, how strong the coffee stains are. Default 0.7 */
  stainStrength?: number;
  /** 0–1, grain intensity. Default 0.5 */
  grainStrength?: number;
  /** Which stain positions to show. Default: all */
  stains?: Array<'tl' | 'tr' | 'bl' | 'br' | 'center'>;
  /** Additional inline style on the wrapper */
  style?: React.CSSProperties;
}

export default function VintageOverlay({
  stainStrength = 0.7,
  grainStrength = 0.5,
  stains = ['tl', 'tr', 'bl', 'br'],
  style = {},
}: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 10,
        overflow: 'hidden',
        borderRadius: 'inherit',
        ...style,
      }}
    >
      {/* Subtle film grain only */}
      {grainStrength > 0 && (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: grainStrength * 0.4,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.28 0 0 0 0 0.18 0 0 0 0 0.08 0 0 0 0.12 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px',
          mixBlendMode: 'multiply',
        }} />
      )}

      {/* Very subtle edge darkening only */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 60%, rgba(44,20,6,0.08) 95%)`,
        mixBlendMode: 'multiply',
      }} />
    </div>
  );
}

// ── Also export a hook for getting the parchment background style ──
export function useParchmentBg() {
  const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.22 0 0 0 0 0.10 0 0 0 0.10 0'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E")`;

  return {
    background: `${NOISE}, linear-gradient(160deg, #F5E8C2 0%, #E8D5A4 40%, #D9C38A 100%)`,
    backgroundBlendMode: 'multiply, normal' as const,
  };
}
