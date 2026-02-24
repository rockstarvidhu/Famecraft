// src/components/PlayerAvatar.tsx
import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { getPlayerSprite } from '../utils/assetPaths';

const FALLBACK: Record<string, string> = {
  happy: '😄', neutral: '🙂', stressed: '😤', sad: '😔',
};

export default function PlayerAvatar() {
  const { age, mentalHealth } = useGameStore();
  const [failed, setFailed] = useState(false);

  const src = getPlayerSprite(age, mentalHealth);
  const mood = mentalHealth > 60 ? 'happy' : mentalHealth < 30 ? 'sad' : mentalHealth < 50 ? 'stressed' : 'neutral';

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div style={{
        width: 52, height: 52,
        background: 'linear-gradient(135deg,#F2E4C4,#E8D5A8)',
        border: '3px solid #8B5A2B',
        borderRadius: 4,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: '2px 2px 0 #5C3410, inset 0 1px 0 rgba(255,255,255,0.3)',
        fontSize: 30,
      }}>
        {failed
          ? FALLBACK[mood]
          : <img src={src} alt="player" style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
                 onError={() => setFailed(true)} />
        }
      </div>
      {/* Age pip */}
      <div style={{
        position: 'absolute', bottom: -4, right: -4,
        background: '#5C3410', border: '2px solid #8B5A2B',
        borderRadius: 10, padding: '1px 5px',
        fontFamily: 'Courier Prime, monospace',
        fontSize: 8, fontWeight: 700, color: '#F2E4C4',
      }}>
        {age}
      </div>
    </div>
  );
}
