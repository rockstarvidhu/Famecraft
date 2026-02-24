// src/screens/FilmReleaseScreen.tsx
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import VintageOverlay from '../components/VintageOverlay';
import { useScreenShake } from '../hooks/useScreenShake';

const C = {
  parchLight:'#F2E4C4', parchBase:'#E8D5A8', parchMid:'#D9C48E',
  parchDark:'#CCB47A', parchDeep:'#B89A60',
  ink:'#1E0E04', border:'#8B5A2B', borderDark:'#5C3410',
  sepia:'#5C3D1E', faded:'#7A6248', gold:'#B8860B',
};
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.22 0 0 0 0 0.10 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

export default function FilmReleaseScreen() {
  const { history, advanceYear } = useGameStore();
  const latestFilm = history[history.length - 1];
  
  // ✨ JUICE: Screen shake hook
  const { shake } = useScreenShake();
  
  if (!latestFilm) return null;

  const { filmTitle, outcome } = latestFilm;
  const isHit = outcome.boxOfficeMultiplier >= 1.5;
  const isFlop = outcome.boxOfficeMultiplier < 0.8;
  
  const resultEmoji = isHit ? '🎉' : isFlop ? '😔' : '👍';
  const resultLabel = isHit ? 'BLOCKBUSTER HIT!' : isFlop ? 'Box Office Flop' : 'Moderate Success';
  const resultColor = isHit ? C.gold : isFlop ? '#8B1A0A' : C.sepia;

  const wealthFmt = (v:number) => v >= 100 ? `₹${(v/100).toFixed(1)}Cr` : `₹${v}L`;

  // ✨ JUICE: Shake screen on mount based on result
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isHit) {
        shake('large'); // BIG SHAKE for hits!
      } else if (isFlop) {
        shake('small'); // Small sad shake
      } else {
        shake('medium'); // Medium for moderate
      }
    }, 300); // Delay slightly so screen loads first
    
    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.3 }}
        style={{
          position:'relative', overflow:'hidden',
          background:`${NOISE}, linear-gradient(160deg,${C.parchLight} 0%,${C.parchBase} 50%,${C.parchMid} 100%)`,
          backgroundBlendMode:'multiply,normal',
          border:`2.5px solid ${C.border}`, borderRadius:3,
          boxShadow:`2px 2px 0 ${C.borderDark}, 5px 5px 14px rgba(30,14,4,0.35)`,
          fontFamily:"'Crimson Text','Lora',Georgia,serif",
        }}>
        <VintageOverlay stainStrength={0.8} stains={['tl','br']} />

        {/* Window title bar */}
        <div style={{ background:`linear-gradient(180deg,${C.parchMid},${C.parchDark})`,
                      borderBottom:`2px solid ${C.border}`, padding:'5px 10px',
                      display:'flex', alignItems:'center', gap:6 }}>
          {['#CC3333','#CCAA22','#33AA33'].map((bg,i)=>(
            <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:bg, border:'1px solid rgba(0,0,0,0.3)' }}/>
          ))}
          <span style={{ flex:1, textAlign:'center', fontFamily:"'Libre Baskerville',serif",
                        fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:C.ink }}>
            🎬  Box Office Results
          </span>
        </div>

        <div style={{ padding:'20px 24px', position:'relative', zIndex:2 }}>

          {/* Film title */}
          <div style={{ textAlign:'center', marginBottom:16 }}>
            <div style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:24, fontWeight:700,
                          color:C.ink, lineHeight:1.2, marginBottom:6 }}>
              "{filmTitle}"
            </div>
            <div style={{ fontFamily:'Courier Prime,monospace', fontSize:10, color:C.faded }}>
              {latestFilm.year}
            </div>
          </div>

          {/* Result banner */}
          <div style={{
            background: isHit ? 'rgba(184,134,11,0.2)' : isFlop ? 'rgba(139,26,10,0.15)' : 'rgba(0,0,0,0.08)',
            border:`2px solid ${resultColor}`,
            borderRadius:3, padding:'14px 18px', marginBottom:16,
            display:'flex', alignItems:'center', justifyContent:'center', gap:12,
          }}>
            <span style={{ fontSize:36 }}>{resultEmoji}</span>
            <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:14, fontWeight:700,
                          textTransform:'uppercase', letterSpacing:'0.1em', color:resultColor }}>
              {resultLabel}
            </div>
          </div>

          <div style={{ height:1, background:C.border, opacity:0.28, marginBottom:14 }}/>

          {/* Stats grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
            <StatBox label="Box Office" value={`${outcome.boxOfficeMultiplier.toFixed(1)}x`} />
            <StatBox label="Critics" value={`${outcome.criticsScore}/100`} />
            <StatBox label="Audience" value={`${outcome.audienceScore}/100`} />
            <StatBox label="Earnings" value={wealthFmt(outcome.wealthChange)} gold />
          </div>

          {/* Impact chips */}
          <div style={{ display:'flex', gap:8, marginBottom:16, flexWrap:'wrap' as const, justifyContent:'center' }}>
            {outcome.fameChange !== 0 && (
              <Chip label="Fame" value={outcome.fameChange} />
            )}
            {outcome.mentalHealthChange !== 0 && (
              <Chip label="Mental" value={outcome.mentalHealthChange} />
            )}
          </div>

          <div style={{ height:1, borderTop:'1.5px dashed rgba(139,90,43,0.4)', marginBottom:14 }}/>

          {/* Continue button */}
          <motion.button onClick={advanceYear}
            whileHover={{ y:-1 }} whileTap={{ y:1 }}
            style={{
              width:'100%', padding:'12px 14px', cursor:'pointer', borderRadius:3,
              background:`linear-gradient(180deg,${C.parchMid},${C.parchDark})`,
              border:`2px solid ${C.border}`, borderBottomWidth:4,
              boxShadow:`0 3px 0 ${C.borderDark}`,
              fontFamily:"'Libre Baskerville',serif", fontSize:11, fontWeight:700,
              textTransform:'uppercase', letterSpacing:'0.07em', color:C.ink,
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            } as React.CSSProperties}>
            <span>→</span> Continue to Next Year
          </motion.button>

        </div>
      </motion.div>
    </div>
  );
}

function StatBox({ label, value, gold=false }: { label:string; value:string; gold?:boolean }) {
  return (
    <div style={{
      padding:'10px 12px', borderRadius:3,
      background: gold ? 'rgba(184,134,11,0.12)' : 'rgba(0,0,0,0.05)',
      border:`2px solid ${gold ? C.gold : C.border}`,
      boxShadow:'inset 0 1px 2px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:8, fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'0.08em', color:C.faded, marginBottom:3 }}>
        {label}
      </div>
      <div style={{ fontFamily:'Courier Prime,monospace', fontSize:16, fontWeight:700,
                    color: gold ? C.gold : C.ink }}>
        {value}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label:string; value:number }) {
  const isPositive = value > 0;
  return (
    <div style={{
      padding:'4px 10px', borderRadius:2,
      background: isPositive ? 'rgba(42,90,26,0.12)' : 'rgba(139,26,10,0.12)',
      border:`1.5px solid ${isPositive ? '#2A5A1A' : '#8B1A0A'}`,
      display:'flex', alignItems:'center', gap:4,
    }}>
      <span style={{ fontFamily:"'Libre Baskerville',serif", fontSize:8, fontWeight:700,
                     textTransform:'uppercase', color: isPositive ? '#2A5A1A' : '#8B1A0A' }}>
        {label}:
      </span>
      <span style={{ fontFamily:'Courier Prime,monospace', fontSize:10, fontWeight:700,
                     color: isPositive ? '#2A5A1A' : '#8B1A0A' }}>
        {value > 0 ? '+' : ''}{value}
      </span>
    </div>
  );
}
