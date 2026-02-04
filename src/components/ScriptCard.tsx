import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { Script } from '../game/types';
import { POSTER_BY_GENRE, getRandomDirector, getRandomCostar } from '../utils/assetPaths';
import { useGameStore } from '../store/gameStore';

interface ScriptCardProps {
  script: Script;
  onAccept: () => void;
  onReject: () => void;
}

export default function ScriptCard({ script, onAccept, onReject }: ScriptCardProps) {
  const { history, fame, careerPhase } = useGameStore();
  
  // Memoize random selections
  const directorPortrait = useMemo(() => getRandomDirector(), [script.id]);
  const costarPortrait = useMemo(() => getRandomCostar(), [script.id]);

  // Placeholder when portrait fails to load
  const [directorImgError, setDirectorImgError] = useState(false);
  const [costarImgError, setCostarImgError] = useState(false);

  useEffect(() => {
    setDirectorImgError(false);
    setCostarImgError(false);
  }, [script.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        onAccept();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onReject();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [onAccept, onReject]);

  // Determine recommendation
  const isRecommended = determineRecommendation(script, fame, careerPhase);
  const advice = getContextualAdvice(script, fame, history);

  const certificationColors = {
    U: 'bg-green-500 border-green-700',
    'U-A': 'bg-yellow-500 border-yellow-700',
    A: 'bg-red-500 border-red-700',
  };

  const riskColors = {
    Safe: 'text-green-700 bg-green-100 border-green-600',
    Balanced: 'text-yellow-700 bg-yellow-100 border-yellow-600',
    Risky: 'text-red-700 bg-red-100 border-red-600',
  };

  const riskGlow = {
    Safe: 'shadow-[0_0_30px_rgba(34,197,94,0.4)]',
    Balanced: 'shadow-[0_0_30px_rgba(234,179,8,0.4)]',
    Risky: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-900 rounded-2xl overflow-hidden shadow-[0_16px_32px_rgba(120,53,15,0.6),inset_0_1px_0_rgba(255,255,255,0.3)] max-w-3xl mx-auto ${riskGlow[script.riskProfile]}`}
    >
      {/* PAPER TEXTURE OVERLAY - high opacity aged paper (reference style) */}
      <div className="absolute inset-0 opacity-80 pointer-events-none z-10"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(139, 69, 19, 0.08) 0px, transparent 1px, transparent 2px, rgba(139, 69, 19, 0.08) 3px),
            repeating-linear-gradient(90deg, rgba(139, 69, 19, 0.08) 0px, transparent 1px, transparent 2px, rgba(139, 69, 19, 0.08) 3px),
            radial-gradient(ellipse at 20% 30%, rgba(139, 69, 19, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(139, 69, 19, 0.14) 0%, transparent 50%)
          `
        }}
      />

      {/* FILM GRAIN OVERLAY - static (no animation for performance) */}
      <div 
        className="absolute inset-0 opacity-55 pointer-events-none z-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.6'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }}
      />

      {/* VIGNETTE */}
      <div className="absolute inset-0 pointer-events-none z-30"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.2) 100%)'
        }}
      />

      {/* Header Badge */}
      <div className="relative z-40 bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 px-4 py-2 flex items-center justify-between border-b-4 border-amber-900">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎥</span>
          <span className="text-white font-bold text-sm tracking-wide uppercase">Movie Offer</span>
        </div>
        {isRecommended && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg"
          >
            <span>✨</span>
            RECOMMENDED
          </motion.div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-40 p-6 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-6">
        
        {/* LEFT COLUMN - Visual Elements */}
        <div className="space-y-5">
          {/* Movie Poster - LARGER */}
          <div className="relative">
            <div className="aspect-[2/3] border-4 border-amber-900 rounded-xl overflow-hidden bg-slate-950 shadow-[0_12px_24px_rgba(0,0,0,0.5),inset_0_2px_4px_rgba(255,255,255,0.1)]">
              <img 
                src={POSTER_BY_GENRE[script.genre]} 
                alt={`${script.genre} poster`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Genre & Cert Badges */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <span className="px-3 py-1.5 bg-yellow-400 border-3 border-yellow-700 rounded-lg text-xs font-black text-yellow-900 uppercase shadow-lg">
                {script.genre}
              </span>
              <span className={`px-3 py-1.5 border-3 rounded-lg text-xs font-black text-white uppercase shadow-lg ${certificationColors[script.certification]}`}>
                {script.certification}
              </span>
            </div>
          </div>

          {/* Player Character - vintage paper panel */}
          <div className="relative bg-gradient-to-br from-[#f4e4c1] via-[#e8d5b7] to-[#d4c5a9] border-4 border-amber-700 rounded-xl p-5 text-center shadow-[0_8px_16px_rgba(120,53,15,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '80px 80px' }} />
            <div className="w-40 h-40 mx-auto mb-3 bg-[#e8d5b7] rounded-full border-4 border-amber-600 flex items-center justify-center text-7xl shadow-[inset_0_2px_4px_rgba(139,69,19,0.15),0_4px_12px_rgba(120,53,15,0.25)]">
              🎭
            </div>
            <p className="relative text-base font-black text-amber-900 tracking-wide uppercase">You</p>
          </div>
        </div>

        {/* RIGHT COLUMN - Details */}
        <div className="space-y-4">
          {/* Title with decorative separator */}
          <div>
            <h2 className="text-4xl font-black text-amber-900 mb-3 tracking-tight leading-tight drop-shadow-sm">
              {script.title}
            </h2>
            <div className="h-1.5 w-32 bg-gradient-to-r from-amber-700 via-amber-500 to-transparent rounded-full mb-3 shadow-sm"></div>
            <p className="text-sm text-amber-800 leading-relaxed">
              {script.synopsis}
            </p>
          </div>

          {/* Agent's Advice */}
          {advice && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-gradient-to-r from-blue-100 to-purple-100 border-3 border-blue-700 rounded-xl p-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="flex-1">
                  <div className="font-bold text-sm text-blue-900 mb-1 uppercase tracking-wide">Agent's Advice</div>
                  <p className="text-sm text-blue-800 leading-relaxed">{advice}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Director Section - vintage paper panel */}
          <div className="relative bg-gradient-to-br from-[#f4e4c1] via-[#e8d5b7] to-[#d4c5a9] border-3 border-amber-700 rounded-xl p-5 shadow-[0_8px_16px_rgba(120,53,15,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='nd'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nd)' opacity='0.4'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '80px 80px' }} />
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-600 flex-shrink-0 shadow-[inset_0_2px_4px_rgba(139,69,19,0.15),0_4px_12px_rgba(120,53,15,0.25)] bg-[#e8d5b7] flex items-center justify-center">
                {directorImgError ? (
                  <span className="text-5xl" aria-hidden>🎬</span>
                ) : (
                  <img
                    src={directorPortrait}
                    alt="Director"
                    className="w-full h-full object-cover"
                    onError={() => setDirectorImgError(true)}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎬</span>
                  <span className="font-black text-sm text-amber-800 uppercase tracking-wide">Director</span>
                </div>
                <p className="text-xl font-black text-amber-900 mb-1">
                  {generateDirectorName()}
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  Known for {script.genre.toLowerCase()} masterpieces
                </p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl text-amber-600 drop-shadow-sm">
                      {i < Math.round(script.directorReputation / 20) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Cast Section - vintage paper panel */}
          <div className="relative bg-gradient-to-br from-[#f4e4c1] via-[#e8d5b7] to-[#d4c5a9] border-3 border-amber-700 rounded-xl p-5 shadow-[0_8px_16px_rgba(120,53,15,0.3),inset_0_1px_0_rgba(255,255,255,0.4)] overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='nc'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nc)' opacity='0.4'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat', backgroundSize: '80px 80px' }} />
            <div className="flex items-start gap-5 relative z-10">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-amber-600 flex-shrink-0 shadow-[inset_0_2px_4px_rgba(139,69,19,0.15),0_4px_12px_rgba(120,53,15,0.25)] bg-[#e8d5b7] flex items-center justify-center">
                {costarImgError ? (
                  <span className="text-5xl" aria-hidden>🎭</span>
                ) : (
                  <img
                    src={costarPortrait}
                    alt="Co-star"
                    className="w-full h-full object-cover"
                    onError={() => setCostarImgError(true)}
                  />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎪</span>
                  <span className="font-black text-sm text-amber-800 uppercase tracking-wide">Co-Star</span>
                </div>
                <p className="text-xl font-black text-amber-900 mb-1">
                  {generateCoStarName()}
                </p>
                <p className="text-xs text-amber-700 mb-3">
                  A rising star with massive appeal
                </p>
                <div className="text-sm text-amber-800 font-semibold">
                  Popularity: <span className="text-amber-600 font-black">{script.coStarPopularity}/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Industry Buzz with CLEAR risk */}
          <div className={`border-3 rounded-xl p-4 shadow-md ${riskColors[script.riskProfile]}`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">💬</span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-black text-sm uppercase tracking-wide">Industry Buzz</span>
                  <div className={`px-3 py-1.5 rounded-full font-black text-xs flex items-center gap-1 shadow-md ${getRiskBadgeStyle(script.riskProfile)}`}>
                    {getRiskIcon(script.riskProfile)}
                    {script.riskProfile.toUpperCase()}
                  </div>
                </div>
                <p className="text-sm leading-relaxed mb-3 font-medium">
                  {getBuzzText(script.riskProfile)}
                </p>
                <div className="flex gap-2">
                  <span className="px-4 py-2 bg-green-700 text-white border-2 border-green-900 rounded-lg font-black text-sm shadow-lg">
                    💰 ₹{script.payment}L
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning with paper texture */}
          <div className="relative bg-amber-200 border-3 border-amber-800 rounded-xl p-4 text-center shadow-md overflow-hidden">
            <div className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(139,69,19,0.1) 10px, rgba(139,69,19,0.1) 20px)`
              }}
            />
            <p className="relative text-sm text-amber-900 font-bold mb-1">
              ⚠️ Think carefully. There won't always be a second chance.
            </p>
            <p className="relative text-xs text-amber-700">
              SPACE=Accept • ESC=Decline
            </p>
          </div>

          {/* Action Buttons - LARGER (no hover/tilt for performance) */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onAccept}
              className="bg-gradient-to-b from-green-400 to-green-600 text-white font-black py-5 px-5 rounded-xl border-4 border-green-800 shadow-[0_8px_0_rgb(22,101,52),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-2 active:shadow-[0_2px_0_rgb(22,101,52)] transition-transform flex items-center justify-center gap-2 touch-manipulation min-h-[64px] text-lg"
            >
              <span className="text-2xl">❤️</span>
              <span>Accept Role</span>
            </button>
            
            <button
              onClick={onReject}
              className="bg-gradient-to-b from-amber-200 to-amber-300 text-amber-900 font-black py-5 px-5 rounded-xl border-4 border-amber-800 shadow-[0_8px_0_rgb(120,53,15),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-2 active:shadow-[0_2px_0_rgb(120,53,15)] transition-transform touch-manipulation min-h-[64px] text-lg"
            >
              Pass on Script
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper functions
function determineRecommendation(script: Script, fame: number, careerPhase: string): boolean {
  if (careerPhase === 'Newcomer' && script.riskProfile === 'Safe') return true;
  if (careerPhase === 'Rising Star' && script.directorReputation > 70) return true;
  if (careerPhase === 'Established' && script.riskProfile === 'Balanced' && script.payment > 100) return true;
  return false;
}

function getContextualAdvice(script: Script, fame: number, history: any[]): string | null {
  if (fame < 20 && script.riskProfile === 'Risky') {
    return "Your agent warns: This risky project could hurt your budding career. Consider safer options.";
  }
  if (fame > 60 && script.directorReputation > 80) {
    return "This acclaimed director could elevate your status to superstar level!";
  }
  if (script.payment > 150) {
    return "This is one of the highest-paying offers you've received. Financial security awaits!";
  }
  return null;
}

function getRiskIcon(risk: string): string {
  return { Safe: '✅', Balanced: '⚖️', Risky: '⚠️' }[risk] || '🎯';
}

function getRiskBadgeStyle(risk: string): string {
  return { Safe: 'bg-green-600 text-white', Balanced: 'bg-yellow-600 text-white', Risky: 'bg-red-600 text-white' }[risk] || 'bg-gray-600 text-white';
}

function generateDirectorName(): string {
  const names = ['Raj Mehra', 'Vikram Singh', 'Arjun Kapoor', 'Karan Sharma', 'Sanjay Kumar', 'Rohit Chopra', 'Anurag Kashyap'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateCoStarName(): string {
  const names = ['Priya Kapoor', 'Ananya Sharma', 'Ranbir Malhotra', 'Alia Verma', 'Deepika Rao', 'Vicky Khanna'];
  return names[Math.floor(Math.random() * names.length)];
}

function getBuzzText(risk: Script['riskProfile']): string {
  const buzz = {
    Safe: 'Industry insiders predict a steady performer with broad appeal.',
    Balanced: 'Critics are intrigued. Audiences buzz with curiosity.',
    Risky: 'A bold gamble that could redefine your career—or derail it.',
  };
  return buzz[risk];
}