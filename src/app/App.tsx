// src/app/App.tsx
// Rebuilt to match reference image exactly:
// • Vintage OS HUD (year/phase/age/season + stat bars + pixel avatar)
// • Right-side icon dock
// • Bottom taskbar
// • Every panel wrapped in vintage window chrome
// • Parchment grain texture throughout

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import PlayerAvatar from '../components/PlayerAvatar';
import VintageOverlay from '../components/VintageOverlay';
import { CAREER_BADGES } from '../utils/assetPaths';
import TitleScreen from '../screens/TitleScreen';
import ScriptSelectionScreen from '../screens/ScriptSelectionScreen';
import FilmReleaseScreen from '../screens/FilmReleaseScreen';
import PersonalEventScreen from '../screens/PersonalEventScreen';
import AwardCeremonyScreen from '../screens/AwardCeremonyScreen';
import EndorsementOfferScreen from '../screens/EndorsementOfferScreen';
import PersonaScreen from '../screens/Personascreen';

// ─── Palette (matched from reference) ────────────────
const C = {
  parchLight:  '#F2E4C4',
  parchBase:   '#E8D5A8',
  parchMid:    '#D9C48E',
  parchDark:   '#CCB47A',
  parchDeep:   '#B89A60',
  ink:         '#221408',
  brown:       '#6B4226',
  border:      '#8B5A2B',
  borderDark:  '#5C3410',
  sepia:       '#5C3D1E',
  faded:       '#7A6248',
  green:       '#3A5A2A',
  greenLight:  '#5A8A4A',
  red:         '#6A1A0A',
  redLight:    '#9A3A2A',
  gold:        '#B8860B',
  goldLight:   '#D4AF37',
};

// ─── Noise texture ────────────────────────────────────
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.35 0 0 0 0 0.25 0 0 0 0 0.12 0 0 0 0.10 0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`;

const GRAIN_BG = `${NOISE}, linear-gradient(160deg, #F5E8C0 0%, ${C.parchBase} 45%, ${C.parchMid} 100%)`;

// ─── Reusable window wrapper ──────────────────────────
export function WinPanel({
  title, children, onClose, style = {}, titleRight,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
  titleRight?: React.ReactNode;
}) {
  return (
    <div style={{
      background: GRAIN_BG,
      backgroundBlendMode: 'multiply, normal',
      border: `2.5px solid ${C.border}`,
      borderRadius: 3,
      boxShadow: `2px 2px 0 ${C.borderDark}, 4px 4px 10px rgba(44,20,8,0.35), inset 0 1px 0 rgba(255,255,255,0.22)`,
      overflow: 'hidden',
      fontFamily: "'Crimson Text', 'Lora', Georgia, serif",
      position: 'relative',
      ...style,
    }}>
      <VintageOverlay stainStrength={0.8} grainStrength={0.5} />
      {/* Title bar */}
      <div style={{
        background: `linear-gradient(180deg, ${C.parchMid} 0%, ${C.parchDark} 100%)`,
        borderBottom: `2px solid ${C.border}`,
        padding: '4px 8px',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.32)',
        minHeight: 26,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {['#CC3333','#CCAA22','#33AA33'].map((bg, i) => (
            <div key={i} style={{
              width: 9, height: 9, borderRadius: '50%', background: bg,
              border: '1px solid rgba(0,0,0,0.3)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.35)',
            }} />
          ))}
        </div>
        <span style={{
          flex: 1, textAlign: 'center',
          fontFamily: "'Libre Baskerville', serif",
          fontSize: 9, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.12em',
          color: C.ink, lineHeight: 1,
        }}>{title}</span>
        {titleRight}
        {onClose && (
          <button onClick={onClose} style={{
            width: 17, height: 17, background: C.parchMid,
            border: `2px solid ${C.border}`, borderRadius: 2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 900, color: C.sepia,
            cursor: 'pointer', flexShrink: 0,
            boxShadow: '1px 1px 0 rgba(0,0,0,0.25)',
            padding: 0, lineHeight: 1,
          }}>×</button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Beveled button ───────────────────────────────────
export function VinBtn({
  label, onClick, variant = 'neutral', small = false, icon,
}: {
  label: string; onClick: () => void;
  variant?: 'accept' | 'reject' | 'neutral' | 'gold';
  small?: boolean; icon?: string;
}) {
  const styles: Record<string, { bg: string; border: string; shadow: string; text: string }> = {
    accept:  { bg: `linear-gradient(180deg,${C.greenLight} 0%,${C.green} 100%)`,  border: '#1A3A0A', shadow: '#0A2A00', text: C.parchLight },
    reject:  { bg: `linear-gradient(180deg,${C.redLight} 0%,${C.red} 100%)`,      border: '#4A0A00', shadow: '#3A0000', text: C.parchLight },
    neutral: { bg: `linear-gradient(180deg,${C.parchMid} 0%,${C.parchDark} 100%)`, border: C.border, shadow: C.borderDark, text: C.ink },
    gold:    { bg: `linear-gradient(180deg,${C.goldLight} 0%,${C.gold} 100%)`,    border: '#7A5A00', shadow: '#5A4000', text: C.ink },
  };
  const s = styles[variant];
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -1, boxShadow: `0 4px 0 ${s.shadow}, 0 6px 12px rgba(0,0,0,0.3)` }}
      whileTap={{ y: 2, boxShadow: `0 0 0 ${s.shadow}` }}
      style={{
        background: s.bg,
        border: `2px solid ${s.border}`,
        borderBottomWidth: 4,
        borderRadius: 3,
        padding: small ? '5px 10px' : '8px 14px',
        fontFamily: "'Libre Baskerville', serif",
        fontSize: small ? 9 : 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: s.text,
        cursor: 'pointer',
        boxShadow: `0 3px 0 ${s.shadow}, 0 4px 8px rgba(0,0,0,0.25)`,
        textShadow: variant !== 'neutral' && variant !== 'gold' ? '0 1px 2px rgba(0,0,0,0.5)' : 'none',
        display: 'flex', alignItems: 'center', gap: 5,
        whiteSpace: 'nowrap',
      } as React.CSSProperties}
    >
      {icon && <span style={{ fontSize: small ? 11 : 13 }}>{icon}</span>}
      {label}
    </motion.button>
  );
}

// ─── HUD stat bar ─────────────────────────────────────
function HudBar({ icon, label, value, max = 100, color, valueLabel }: {
  icon: string; label: string; value: number; max?: number;
  color: string; valueLabel?: string;
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 8, fontWeight: 700,
        textTransform: 'uppercase', color: C.sepia, width: 38, flexShrink: 0,
      }}>{label}:</span>
      <div style={{
        flex: 1, height: 11,
        background: 'rgba(0,0,0,0.22)',
        border: `1.5px solid ${C.border}`,
        borderRadius: 2, overflow: 'hidden',
        boxShadow: 'inset 0 2px 3px rgba(0,0,0,0.3)',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: `linear-gradient(90deg, ${color}BB 0%, ${color} 100%)`,
            boxShadow: `0 0 6px ${color}88`,
          }}
        />
      </div>
      {valueLabel && (
        <span style={{
          fontFamily: 'Courier Prime, monospace', fontSize: 9, color: C.sepia,
          width: 32, textAlign: 'right', flexShrink: 0,
        }}>{valueLabel}</span>
      )}
    </div>
  );
}

// ─── Icon dock button ─────────────────────────────────
function DockBtn({ icon, label, active = false, onClick }: { icon: string; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ y: -1 }}
      whileTap={{ y: 1 }}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
        cursor: 'pointer',
        background: active
          ? `linear-gradient(180deg,${C.parchLight} 0%,${C.parchBase} 100%)`
          : `linear-gradient(180deg,${C.parchBase} 0%,${C.parchMid} 100%)`,
        border: `2px solid ${C.border}`,
        borderRadius: 3,
        padding: '6px 4px',
        width: 48,
        boxShadow: active
          ? `inset 0 2px 4px rgba(0,0,0,0.2)`
          : `1px 1px 0 ${C.borderDark}, inset 0 1px 0 rgba(255,255,255,0.3)`,
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
      <span style={{
        fontFamily: "'Libre Baskerville', serif",
        fontSize: 7, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        color: C.sepia, textAlign: 'center', lineHeight: 1.2,
      }}>{label}</span>
    </motion.div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────
export default function App() {
  const {
    currentScreen, careerPhase, fame, wealth, mentalHealth, burnout,
    currentYear, age, endorsementIncome, totalAwards, filmsCompleted,
    setCurrentScreen,
  } = useGameStore();

  const [activeTab, setActiveTab] = useState<string>('scripts');

  if (currentScreen === 'title') return <TitleScreen />;

  const season = ['SPRING','SUMMER','AUTUMN','WINTER'][(currentYear - 2024) % 4];
  const wealthDisplay = wealth >= 100 ? `₹${(wealth / 100).toFixed(1)}Cr` : `₹${wealth}L`;

  return (
    <div style={{
      minHeight: '100vh',
      // Real texture with gradient fallback (base path adjusted)
      backgroundImage: `url(/cinema-simulator/assets/textures/parchment-base.png), linear-gradient(160deg, ${C.parchLight} 0%, ${C.parchBase} 50%, ${C.parchMid} 100%)`,
      backgroundSize: 'cover, cover',
      backgroundPosition: 'center, center',
      backgroundRepeat: 'no-repeat, no-repeat',
      backgroundAttachment: 'fixed, fixed',
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Crimson Text', 'Lora', Georgia, serif",
      position: 'relative',
    }}>
      {/* Subtle film grain overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `repeating-radial-gradient(circle at 20% 30%, transparent 0, transparent 1px, rgba(0,0,0,0.03) 1px, rgba(0,0,0,0.03) 2px)`,
        opacity: 0.4, pointerEvents: 'none', zIndex: 1,
      }} />
      
      {/* Dark edge vignette */}
      <div style={{
        position: 'fixed', inset: 0,
        background: `radial-gradient(ellipse at center, transparent 40%, rgba(92,61,30,0.15) 80%, rgba(92,61,30,0.3) 100%)`,
        pointerEvents: 'none', zIndex: 1,
      }} />

      {/* Game content wrapper */}
      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>

      {/* ══════════════════════════════════════════════
          TOP HUD BAR  (matches reference exactly)
      ══════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(180deg, ${C.parchMid} 0%, ${C.parchDark} 100%)`,
        borderBottom: `2.5px solid ${C.border}`,
        boxShadow: `0 3px 8px rgba(44,20,8,0.3), inset 0 1px 0 rgba(255,255,255,0.28)`,
        padding: '0 10px',
        display: 'flex', alignItems: 'stretch',
        gap: 0, minHeight: 88,
        position: 'relative',
      }}>
        {/* HUD vintage overlay */}
        <VintageOverlay stainStrength={0.9} grainStrength={0.6} stains={['tl','tr']} />

        {/* Left: player avatar */}
        <div style={{
          padding: '8px 12px 8px 8px',
          display: 'flex', alignItems: 'center',
          borderRight: `2px solid ${C.border}`,
          flexShrink: 0,
        }}>
          <PlayerAvatar />
        </div>

        {/* Center: year/phase/season + stat bars */}
        <div style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {/* Top strip: year | phase | age | season */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 0,
            background: `linear-gradient(180deg,${C.parchDeep} 0%,${C.brown} 100%)`,
            border: `2px solid ${C.borderDark}`,
            borderRadius: 3, overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12)',
            marginBottom: 7,
          }}>
            {[
              { val: String(currentYear), icon: '📅' },
              { val: careerPhase.toUpperCase(), icon: null },
              { val: `Age ${age}`, icon: null },
              { val: season, icon: null },
            ].map(({ val, icon }, i, arr) => (
              <div key={i} style={{
                flex: 1, textAlign: 'center',
                padding: '4px 6px',
                borderRight: i < arr.length - 1 ? `2px solid ${C.borderDark}` : 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                {icon && <span style={{ fontSize: 10 }}>{icon}</span>}
                <span style={{
                  fontFamily: "'Libre Baskerville', serif",
                  fontSize: 9, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                  color: C.parchLight,
                }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Stat bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <HudBar icon="⭐" label="Fame"   value={fame}        color="#D4AF37" valueLabel={`${fame}`} />
            <HudBar icon="💰" label="Wealth" value={Math.min(100, wealth / 10)} color="#5A9A5A" valueLabel={wealthDisplay} />
          </div>
        </div>

        {/* Right: awards / passive income chips */}
        <div style={{
          padding: '8px 10px',
          borderLeft: `2px solid ${C.border}`,
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center', gap: 6,
          minWidth: 110, flexShrink: 0,
        }}>
          <Chip icon="🎬" label="Films" value={String(filmsCompleted)} />
          <Chip icon="🏆" label="Awards" value={String(totalAwards)} />
          {endorsementIncome > 0 && <Chip icon="💼" label="Passive" value={`₹${endorsementIncome}L`} gold />}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          MAIN CONTENT AREA
      ══════════════════════════════════════════════ */}
      <div style={{ flex: 1, display: 'flex', gap: 0, overflow: 'hidden' }}>

        {/* Screen content */}
        <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
          <AnimatePresence mode="wait">

            {currentScreen === 'scripts' && (
              <motion.div key="scripts"
                initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
                <ScriptSelectionScreen />
              </motion.div>
            )}

            {currentScreen === 'filmRelease' && (
              <motion.div key="release"
                initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
                <FilmReleaseScreen />
              </motion.div>
            )}

            {currentScreen === 'personalEvent' && (
              <motion.div key="event"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
                <PersonalEventScreen />
              </motion.div>
            )}

            {currentScreen === 'awardCeremony' && (
              <motion.div key="award"
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 180, damping: 22 }}>
                <AwardCeremonyScreen />
              </motion.div>
            )}

            {currentScreen === 'endorsementOffer' && (
              <motion.div key="endorsement"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
                <EndorsementOfferScreen />
              </motion.div>
            )}

            {currentScreen === 'persona' && (
              <motion.div key="persona"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: 'spring', stiffness: 200, damping: 24 }}>
                <PersonaScreen />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right icon dock */}
        <div style={{
          width: 68,
          background: `linear-gradient(180deg,${C.parchMid} 0%,${C.parchBase} 100%)`,
          borderLeft: `2.5px solid ${C.border}`,
          padding: '10px 6px',
          display: 'flex', flexDirection: 'column', gap: 7,
          overflowY: 'auto',
          boxShadow: 'inset 2px 0 6px rgba(0,0,0,0.08)',
        }}>
          <DockBtn icon="📜" label="Scripts"  active={currentScreen === 'scripts'} />
          <DockBtn icon="🏆" label="Awards"   active={currentScreen === 'awardCeremony'} />
          <DockBtn icon="📰" label="Media"    active={currentScreen === 'personalEvent'} />
          <DockBtn icon="😄" label="Persona"  active={currentScreen === 'persona'} onClick={() => setCurrentScreen('persona')} />
          <DockBtn icon="💼" label="Deals"    active={currentScreen === 'endorsementOffer'} />
          <DockBtn icon="🎬" label="Films"    active={currentScreen === 'filmRelease'} />
          <div style={{ flex: 1 }} />
          {/* Mental health + burnout mini bars at bottom of dock */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, padding: '6px 2px',
                        borderTop: `2px solid ${C.border}`, paddingTop: 8 }}>
            <MiniDockBar icon="🧠" value={mentalHealth} color="#5A7AB8" />
            <MiniDockBar icon="🔥" value={burnout}      color="#B85A3A" />
          </div>
        </div>

      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM TASKBAR
      ══════════════════════════════════════════════ */}
      <div style={{
        background: `linear-gradient(180deg,${C.parchDark} 0%,${C.parchDeep} 100%)`,
        borderTop: `2.5px solid ${C.border}`,
        padding: '4px 12px',
        display: 'flex', alignItems: 'center', gap: 10,
        boxShadow: '0 -2px 8px rgba(44,20,8,0.25), inset 0 1px 0 rgba(255,255,255,0.15)',
        minHeight: 34,
      }}>
        {/* Start-style button */}
        <div style={{
          background: `linear-gradient(180deg,${C.parchLight} 0%,${C.parchMid} 100%)`,
          border: `2px solid ${C.border}`,
          borderRadius: 3, padding: '3px 10px',
          display: 'flex', alignItems: 'center', gap: 5,
          boxShadow: `1px 1px 0 ${C.borderDark}`,
          cursor: 'pointer',
        }}>
          <span style={{ fontSize: 12 }}>🎬</span>
          <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.07em', color: C.ink }}>
            Cinema
          </span>
        </div>

        <div style={{ width: 2, height: 20, background: C.border, opacity: 0.5 }} />

        {/* Active window chip */}
        <div style={{
          background: `linear-gradient(180deg,${C.parchBase} 0%,${C.parchMid} 100%)`,
          border: `2px solid ${C.border}`, borderRadius: 3, padding: '3px 10px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <span style={{ fontSize: 10 }}>📜</span>
          <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.06em', color: C.sepia }}>
            {currentScreen === 'scripts'          ? 'Script Selection'
             : currentScreen === 'filmRelease'    ? 'Box Office'
             : currentScreen === 'personalEvent'  ? 'Breaking News'
             : currentScreen === 'awardCeremony'  ? 'Award Ceremony'
             : currentScreen === 'endorsementOffer' ? 'Endorsement'
             : 'Game'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* Right: year + phase + trophy count */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Courier Prime,monospace', fontSize: 9, color: C.sepia }}>
            📅 {currentYear}
          </span>
          <div style={{ width: 1, height: 14, background: C.border, opacity: 0.5 }} />
          <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.08em', color: C.sepia }}>
            {careerPhase}
          </span>
          <div style={{ width: 1, height: 14, background: C.border, opacity: 0.5 }} />
          <span style={{ fontFamily: 'Courier Prime,monospace', fontSize: 9, color: C.sepia }}>
            🏆 {totalAwards}
          </span>
          <img
            src={CAREER_BADGES[careerPhase]}
            alt={careerPhase}
            style={{ width: 18, height: 18, objectFit: 'contain', imageRendering: 'pixelated' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      </div>

      </div>
    </div> 
  );
}

// ─── Small chip (HUD top-right) ───────────────────────
function Chip({ icon, label, value, gold = false }: {
  icon: string; label: string; value: string; gold?: boolean;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 5,
      background: gold ? 'rgba(184,134,11,0.15)' : 'rgba(0,0,0,0.08)',
      border: `1.5px solid ${gold ? C.gold : C.border}`,
      borderRadius: 3, padding: '3px 7px',
    }}>
      <span style={{ fontSize: 11 }}>{icon}</span>
      <span style={{ fontFamily: "'Libre Baskerville',serif", fontSize: 8, color: C.faded }}>
        {label}:
      </span>
      <span style={{ fontFamily: 'Courier Prime,monospace', fontSize: 9, fontWeight: 700, color: C.ink }}>
        {value}
      </span>
    </div>
  );
}

// ─── Mini vertical bar for dock ───────────────────────
function MiniDockBar({ icon, value, color }: { icon: string; value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      <span style={{ fontSize: 10 }}>{icon}</span>
      <div style={{ flex: 1, height: 6, background: 'rgba(0,0,0,0.2)', border: `1px solid ${C.border}`,
                    borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}