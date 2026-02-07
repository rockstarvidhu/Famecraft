// src/components/PlayerAvatar.tsx
import { useGameStore } from '../store/gameStore';
import { getPlayerSpriteByPhase } from '../utils/assetPaths';

export default function PlayerAvatar() {
  const { age, mentalHealth, careerPhase } = useGameStore();
  
  // Logic to determine mood for the sprite selection
  const mood = mentalHealth > 60 ? 'happy' : mentalHealth < 30 ? 'sad' : mentalHealth < 50 ? 'stressed' : 'neutral';
  
  // Use the phase-based helper instead of the old age-based one
  const sprite = getPlayerSpriteByPhase(careerPhase, mood);
  
  return (
    <div className="relative">
      <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 border-amber-800 bg-gradient-to-br from-amber-100 to-orange-200 shadow-lg">
        <img 
          src={sprite} 
          alt="Your character"
          className="w-full h-full object-contain"
          loading="eager"
          onError={(e) => {
            // Error fallback to a generic placeholder
            e.currentTarget.style.display = 'none';
            if (e.currentTarget.parentElement) {
              e.currentTarget.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-6xl">🎭</div>';
            }
          }}
        />
      </div>
      
      <div className="absolute -bottom-2 -right-2 bg-amber-900 text-amber-100 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold border-2 border-amber-700">
        {age}
      </div>
    </div>
  );
}