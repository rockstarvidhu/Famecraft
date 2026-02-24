// src/screens/ScriptSelectionScreen.tsx
// Matches reference image: OS window "CHOOSE YOUR NEXT SCRIPT",
// 3 cards side-by-side, each its own mini-window

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import ScriptCard from '../components/ScriptCard';
import Celebration from '../components/Celebration';

const C = {
  parchLight: '#F2E4C4', parchBase: '#E8D5A8', parchMid: '#D9C48E',
  parchDark: '#CCB47A', border: '#8B5A2B', borderDark: '#5C3410',
  ink: '#1E0E04', sepia: '#5C3D1E', faded: '#7A6248',
};

export default function ScriptSelectionScreen() {
  const { currentScripts, acceptScript, rejectScript, generateNewScripts } = useGameStore();
  
  // ✨ JUICE: Celebration state
  const [celebrating, setCelebrating] = useState(false);
  const [celebType, setCelebType] = useState<'accept' | 'reject'>('accept');

  // ✨ JUICE: Wrap accept/reject with celebration
  const handleAccept = (scriptId: string) => {
    setCelebType('accept');
    setCelebrating(true);
    setTimeout(() => {
      acceptScript(scriptId);
      setCelebrating(false);
    }, 1200); // Wait for celebration to finish
  };

  const handleReject = (scriptId: string) => {
    setCelebType('reject');
    setCelebrating(true);
    setTimeout(() => {
      rejectScript(scriptId);
      setCelebrating(false);
    }, 600);
  };

  if (currentScripts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: 36, marginBottom: 12 }}>🎬</div>
        <div style={{ fontFamily: "'IM Fell English',Georgia,serif", fontSize: 18, color: C.ink, marginBottom: 16 }}>
          No scripts available
        </div>
        <button onClick={generateNewScripts} style={{
          padding: '10px 24px',
          background: `linear-gradient(180deg,${C.parchMid},${C.parchDark})`,
          border: `2px solid ${C.border}`, borderBottomWidth: 4, borderRadius: 3,
          fontFamily: "'Libre Baskerville',serif", fontSize: 10, fontWeight: 700,
          textTransform: 'uppercase', letterSpacing: '0.08em', color: C.ink,
          cursor: 'pointer', boxShadow: `0 3px 0 ${C.borderDark}`,
        }}>
          Generate Scripts
        </button>
      </div>
    );
  }

  return (
    <>
      {/* ✨ JUICE: Celebration overlay */}
      <Celebration show={celebrating} type={celebType} />

      <div style={{
        background: 'rgba(242,228,196,0.35)',
        backdropFilter: 'blur(2px)',
        border: `2.5px solid ${C.border}`,
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: `2px 2px 0 ${C.borderDark}, 5px 5px 14px rgba(30,14,4,0.3)`,
      }}>

        {/* ── Outer window title bar ─────────────────── */}
        <div style={{
          background: `linear-gradient(180deg,rgba(217,196,142,0.7) 0%,rgba(204,180,122,0.8) 100%)`,
          backdropFilter: 'blur(2px)',
          borderBottom: `2px solid ${C.border}`,
          padding: '5px 10px',
          display: 'flex', alignItems: 'center', gap: 6,
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
        }}>
          {['#CC3333','#CCAA22','#33AA33'].map((bg, i) => (
            <div key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: bg,
                                  border: '1px solid rgba(0,0,0,0.3)', flexShrink: 0 }} />
          ))}
          <span style={{
            flex: 1, textAlign: 'center',
            fontFamily: "'Libre Baskerville',serif",
            fontSize: 10, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: C.ink,
          }}>
            ✦  Choose Your Next Script  ✦
          </span>
        </div>

        {/* ── 3 script cards ─────────────────────────── */}
        <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {currentScripts.map((script, i) => (
            <motion.div key={script.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200, damping: 22 }}>
              <ScriptCard
                script={script}
                onAccept={() => handleAccept(script.id)}
                onReject={() => handleReject(script.id)}
              />
            </motion.div>
          ))}

          {/* Empty slot placeholders if fewer than 3 scripts */}
          {currentScripts.length < 3 && [...Array(3 - currentScripts.length)].map((_, i) => (
            <div key={`empty-${i}`} style={{
              border: `2px dashed rgba(139,90,43,0.35)`,
              borderRadius: 3, minHeight: 200,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 28, opacity: 0.25 }}>📜</span>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
