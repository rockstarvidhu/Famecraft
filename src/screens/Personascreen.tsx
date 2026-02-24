// src/screens/PersonaScreen.tsx
// Career overview: stats, filmography summary, mental health, public image
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import VintageOverlay from '../components/VintageOverlay';
import { getPlayerSprite } from '../utils/assetPaths';
import { useState } from 'react';

const C = {
  parchLight:'#F2E4C4', parchBase:'#E8D5A8', parchMid:'#D9C48E',
  parchDark:'#CCB47A', parchDeep:'#B89A60',
  ink:'#1E0E04', border:'#8B5A2B', borderDark:'#5C3410',
  sepia:'#5C3D1E', faded:'#7A6248', gold:'#B8860B', goldLight:'#D4AF37',
};
const NOISE = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='0 0 0 0 0.32 0 0 0 0 0.22 0 0 0 0 0.10 0 0 0 0.09 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`;

function StatRow({ icon, label, value, max=100, color }: { icon:string; label:string; value:number; max?:number; color:string }) {
  const pct = Math.min(100, Math.max(0, (value/max)*100));
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
      <span style={{ fontSize:14, width:20, textAlign:'center', flexShrink:0 }}>{icon}</span>
      <span style={{ fontFamily:"'Libre Baskerville',serif", fontSize:9, fontWeight:700,
                     textTransform:'uppercase', letterSpacing:'0.07em', color:C.faded, width:70, flexShrink:0 }}>
        {label}
      </span>
      <div style={{ flex:1, height:10, background:'rgba(0,0,0,0.18)',
                    border:`1.5px solid ${C.border}`, borderRadius:2, overflow:'hidden',
                    boxShadow:'inset 0 1px 2px rgba(0,0,0,0.2)' }}>
        <motion.div initial={{ width:0 }} animate={{ width:`${pct}%` }}
          transition={{ duration:0.9, ease:'easeOut' }}
          style={{ height:'100%', background:`linear-gradient(90deg,${color}AA,${color})`,
                   boxShadow:`0 0 6px ${color}66` }}/>
      </div>
      <span style={{ fontFamily:'Courier Prime,monospace', fontSize:10, color:C.sepia,
                     width:30, textAlign:'right', flexShrink:0 }}>
        {value}
      </span>
    </div>
  );
}

function InfoChip({ label, value }: { label:string; value:string }) {
  return (
    <div style={{ flex:1, minWidth:100, background:'rgba(0,0,0,0.05)',
                  border:`1.5px solid ${C.border}`, borderRadius:3, padding:'8px 10px',
                  boxShadow:'inset 0 1px 2px rgba(0,0,0,0.06)' }}>
      <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:7, fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'0.08em', color:C.faded, marginBottom:3 }}>
        {label}
      </div>
      <div style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:14, fontWeight:700, color:C.ink }}>
        {value}
      </div>
    </div>
  );
}

export default function PersonaScreen() {
  const { fame, wealth, mentalHealth, burnout, age, currentYear, careerPhase,
          filmsCompleted, totalAwards, endorsementIncome } = useGameStore();
  const [imgFailed, setImgFailed] = useState(false);
  const spriteSrc = getPlayerSprite(age, mentalHealth);
  const moodEmoji = mentalHealth > 60 ? '😄' : mentalHealth < 30 ? '😔' : mentalHealth < 50 ? '😤' : '🙂';
  const wealthFmt = wealth >= 100 ? `₹${(wealth/100).toFixed(1)}Cr` : `₹${wealth}L`;

  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        transition={{ type:'spring', stiffness:200, damping:24 }}
        style={{
          position:'relative', overflow:'hidden',
          background:`${NOISE}, linear-gradient(160deg,${C.parchLight} 0%,${C.parchBase} 50%,${C.parchMid} 100%)`,
          backgroundBlendMode:'multiply,normal',
          border:`2.5px solid ${C.border}`, borderRadius:3,
          boxShadow:`2px 2px 0 ${C.borderDark}, 5px 5px 14px rgba(30,14,4,0.35)`,
          fontFamily:"'Crimson Text','Lora',Georgia,serif",
        }}>
        <VintageOverlay stainStrength={0.75} stains={['tl','br']} />

        {/* Window title bar */}
        <div style={{ background:`linear-gradient(180deg,${C.parchMid},${C.parchDark})`,
                      borderBottom:`2px solid ${C.border}`, padding:'5px 10px',
                      display:'flex', alignItems:'center', gap:6 }}>
          {['#CC3333','#CCAA22','#33AA33'].map((bg,i)=>(
            <div key={i} style={{ width:9, height:9, borderRadius:'50%', background:bg, border:'1px solid rgba(0,0,0,0.3)' }}/>
          ))}
          <span style={{ flex:1, textAlign:'center', fontFamily:"'Libre Baskerville',serif",
                          fontSize:9, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em', color:C.ink }}>
            😄  Persona &amp; Career Stats
          </span>
        </div>

        <div style={{ padding:'18px 22px', position:'relative', zIndex:2 }}>

          {/* Top: Avatar + identity */}
          <div style={{ display:'flex', gap:16, marginBottom:18, alignItems:'flex-start' }}>

            {/* Player portrait */}
            <div style={{ flexShrink:0, position:'relative' }}>
              <div style={{
                width:80, height:80, borderRadius:4, overflow:'hidden',
                border:`3px solid ${C.border}`,
                boxShadow:`2px 2px 0 ${C.borderDark}`,
                background:C.parchMid,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:44,
              }}>
                {imgFailed
                  ? moodEmoji
                  : <img src={spriteSrc} alt="player" onError={()=>setImgFailed(true)}
                         style={{ width:'100%', height:'100%', objectFit:'cover', imageRendering:'pixelated' }}/>
                }
              </div>
              {/* Mood pip */}
              <div style={{ position:'absolute', bottom:-6, right:-6,
                            background:C.borderDark, border:`2px solid ${C.border}`,
                            borderRadius:10, padding:'2px 6px',
                            fontFamily:'Courier Prime,monospace', fontSize:8, fontWeight:700, color:C.parchLight }}>
                {moodEmoji}
              </div>
            </div>

            {/* Identity info */}
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:8, fontWeight:700,
                            textTransform:'uppercase', letterSpacing:'0.12em', color:C.faded, marginBottom:3 }}>
                Career Identity
              </div>
              <div style={{ fontFamily:"'IM Fell English',Georgia,serif", fontSize:20, fontWeight:700,
                            color:C.ink, lineHeight:1.1, marginBottom:6 }}>
                {careerPhase}
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' as const }}>
                {[
                  { label:'Age', value:String(age) },
                  { label:'Year', value:String(currentYear) },
                  { label:'Films', value:String(filmsCompleted) },
                  { label:'Awards', value:String(totalAwards) },
                ].map(chip => (
                  <div key={chip.label} style={{ padding:'3px 8px', background:'rgba(0,0,0,0.06)',
                                                 border:`1.5px solid ${C.border}`, borderRadius:2 }}>
                    <span style={{ fontFamily:"'Libre Baskerville',serif", fontSize:7, color:C.faded }}>{chip.label}: </span>
                    <span style={{ fontFamily:'Courier Prime,monospace', fontSize:9, fontWeight:700, color:C.ink }}>{chip.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ height:1, background:C.border, opacity:0.28, marginBottom:14 }}/>

          {/* Stat bars */}
          <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:8, fontWeight:700,
                        textTransform:'uppercase', letterSpacing:'0.1em', color:C.faded, marginBottom:10 }}>
            Career Stats
          </div>

          <StatRow icon="⭐" label="Fame"        value={fame}        color="#D4AF37" />
          <StatRow icon="💰" label="Mental"      value={mentalHealth} color="#5A7AB8" />
          <StatRow icon="🔥" label="Burnout"     value={burnout}     color="#B85A3A" />

          <div style={{ height:1, background:C.border, opacity:0.28, margin:'10px 0 14px' }}/>

          {/* Financial summary */}
          <div style={{ fontFamily:"'Libre Baskerville',serif", fontSize:8, fontWeight:700,
                        textTransform:'uppercase', letterSpacing:'0.1em', color:C.faded, marginBottom:8 }}>
            Financials
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' as const }}>
            <InfoChip label="Total Wealth"    value={wealthFmt} />
            <InfoChip label="Passive Income"  value={endorsementIncome > 0 ? `₹${endorsementIncome}L/yr` : '—'} />
            <InfoChip label="Career Phase"    value={careerPhase} />
          </div>

        </div>
      </motion.div>
    </div>
  );
}
