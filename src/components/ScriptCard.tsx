import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import type { Script } from '../game/types';
import { POSTER_BY_GENRE, getRandomDirector, getRandomCostar } from '../utils/assetPaths';
import { useGameStore } from '../store/gameStore';

interface ScriptCardProps {
  script: Script;
  onAccept: () => void;
  onReject: () => void;
}

export default function ScriptCardArcade({ script, onAccept, onReject }: ScriptCardProps) {
  const { history, fame, careerPhase } = useGameStore();
  
  const directorPortrait = useMemo(() => getRandomDirector(), [script.id]);
  const costarPortrait = useMemo(() => getRandomCostar(), [script.id]);

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

  const isRecommended = determineRecommendation(script, fame, careerPhase);
  const advice = getContextualAdvice(script, fame, history);

  const riskColors = {
    Safe: 'from-green-500 to-green-600',
    Balanced: 'from-yellow-500 to-yellow-600',
    Risky: 'from-red-500 to-red-600',
  };

  const riskBg = {
    Safe: 'bg-green-50',
    Balanced: 'bg-yellow-50',
    Risky: 'bg-red-50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative max-w-6xl mx-auto"
    >
      {/* FILM STRIP BORDER - TOP */}
      <div className="relative h-8 bg-black border-4 border-black rounded-t-2xl overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex items-center"
          animate={{ x: [0, -40] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-white mx-1 flex-shrink-0 rounded-sm" />
          ))}
        </motion.div>
      </div>

      {/* MAIN CARD */}
      <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-8 border-black relative overflow-hidden shadow-[0_0_60px_rgba(138,43,226,0.5)]">
        
        {/* Scanline effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
          animate={{ y: [0, 8] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
        />

        {/* CRT glow */}
        <div className="absolute inset-0 bg-gradient-radial from-purple-500/10 via-transparent to-transparent pointer-events-none" />

        {/* HEADER - ARCADE STYLE */}
        <div className="relative bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 p-4 border-b-4 border-black">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <motion.span 
                className="text-5xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                🎬
              </motion.span>
              <div>
                <h3 className="text-2xl font-black text-black tracking-wider uppercase" 
                    style={{ textShadow: '2px 2px 0 #fff, 4px 4px 0 rgba(0,0,0,0.3)' }}>
                  SCRIPT OFFER
                </h3>
                <p className="text-sm font-bold text-black/70">INSERT COIN TO CONTINUE</p>
              </div>
            </motion.div>

            {/* Genre Badge - Pixel Style */}
            <div className="relative">
              <div className={`px-6 py-3 bg-black border-4 border-white font-black text-2xl text-yellow-400 uppercase tracking-widest shadow-[4px_4px_0_rgba(255,215,0,0.5)]`}
                   style={{ imageRendering: 'pixelated' }}>
                {getGenreEmoji(script.genre)} {script.genre}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="p-8 grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8">
          
          {/* LEFT - POSTER & PLAYER */}
          <div className="space-y-6">
            
            {/* Movie Poster - Arcade Cabinet Style */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative"
            >
              {/* CRT Screen Frame */}
              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-4 rounded-3xl border-8 border-gray-700 shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
                <div className="aspect-[2/3] rounded-2xl overflow-hidden border-4 border-black shadow-[0_0_40px_rgba(138,43,226,0.6)] relative bg-black">
                  <img 
                    src={POSTER_BY_GENRE[script.genre]} 
                    alt={script.title}
                    className="w-full h-full object-cover"
                    style={{ imageRendering: 'pixelated' }}
                  />
                  {/* CRT glow overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 via-transparent to-blue-500/20 mix-blend-screen" />
                </div>
              </div>

              {/* "NOW SHOWING" Sign */}
              <motion.div
                className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-600 px-6 py-2 border-4 border-yellow-400 font-black text-white text-sm tracking-widest shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ⭐ NOW SHOWING ⭐
              </motion.div>
            </motion.div>

            {/* PLAYER SPRITE - PURE CUTOUT */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              {/* Pixel Art Container - NO BACKGROUND */}
              <div className="relative flex flex-col items-center">
                {/* Spotlight effect behind sprite */}
                <motion.div
                  className="absolute w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                
                {/* Player Sprite - Large, No Background Circle! */}
                <motion.div 
                  className="relative w-32 h-32 flex items-center justify-center"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ 
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 20px rgba(255,215,0,0.4))'
                  }}
                >
                  <span className="text-8xl" style={{ imageRendering: 'pixelated' }}>
                    🎭
                  </span>
                  
                  {/* Sparkle particles */}
                  <motion.div
                    className="absolute -top-2 -right-2 text-3xl"
                    animate={{ scale: [0, 1, 0], rotate: [0, 180, 360] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </motion.div>

                {/* Player Label - Arcade Style */}
                <div className="mt-4 relative">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-2 border-4 border-white font-black text-2xl text-white uppercase tracking-widest shadow-lg"
                       style={{ imageRendering: 'pixelated' }}>
                    PLAYER 1
                  </div>
                  <motion.div
                    className="absolute -inset-1 border-2 border-yellow-400 rounded"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>

                {/* Player Stats - Pixel Bars */}
                <div className="mt-4 space-y-2 w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold text-sm uppercase w-16">Fame:</span>
                    <div className="flex-1 h-4 bg-black border-2 border-white">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-yellow-500 to-amber-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${fame}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <span className="text-white font-bold text-sm w-12">{fame}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT - DETAILS */}
          <div className="space-y-6">
            
            {/* Title - Retro Game Style */}
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-400 mb-2 uppercase tracking-tight leading-none"
                  style={{ 
                    textShadow: '4px 4px 0 rgba(0,0,0,0.8), 2px 2px 0 rgba(255,215,0,0.3)',
                    imageRendering: 'pixelated' 
                  }}>
                {script.title}
              </h1>
              
              {/* Pixel divider */}
              <div className="flex gap-1 mt-3">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-4 h-4 bg-yellow-400"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.03 }}
                    style={{ imageRendering: 'pixelated' }}
                  />
                ))}
              </div>

              <p className="text-white/90 text-lg mt-4 leading-relaxed">
                {script.synopsis}
              </p>
            </motion.div>

            {/* Agent Advice - VHS Style */}
            {advice && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 border-4 border-white p-5 relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-20" 
                     style={{
                       backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, white 1px, white 2px)'
                     }} 
                />
                <div className="relative flex items-start gap-3">
                  <motion.span 
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    💡
                  </motion.span>
                  <div className="flex-1">
                    <div className="font-black text-white text-sm uppercase mb-2 tracking-wider">
                      ▶ AGENT MESSAGE
                    </div>
                    <p className="text-white font-semibold leading-relaxed">{advice}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* CHARACTERS - PURE SPRITE CUTOUTS */}
            <div className="grid grid-cols-2 gap-6">
              
              {/* DIRECTOR SPRITE */}
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className={`${riskBg[script.riskProfile]} border-4 border-black p-6 relative overflow-hidden`}
              >
                <div className="absolute top-2 left-2 right-2 h-1 bg-black/20" />
                
                <div className="text-center">
                  <div className="font-black text-xs text-black uppercase tracking-widest mb-3">
                    🎬 DIRECTOR
                  </div>
                  
                  {/* Director Sprite - NO BACKGROUND! */}
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    style={{ 
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                    }}
                  >
                    <img 
                      src={directorPortrait}
                      alt="Director"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </motion.div>

                  <p className="font-black text-black text-lg mb-2">
                    {generateDirectorName()}
                  </p>
                  
                  {/* Star Rating - Pixel Style */}
                  <div className="flex justify-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="text-2xl"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.6 + i * 0.1, type: 'spring' }}
                        style={{ imageRendering: 'pixelated' }}
                      >
                        {i < Math.round(script.directorReputation / 20) ? '⭐' : '☆'}
                      </motion.span>
                    ))}
                  </div>
                  
                  <div className="font-bold text-black text-sm">
                    REP: {script.directorReputation}/100
                  </div>
                </div>
              </motion.div>

              {/* CO-STAR SPRITE */}
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className={`${riskBg[script.riskProfile]} border-4 border-black p-6 relative overflow-hidden`}
              >
                <div className="absolute top-2 left-2 right-2 h-1 bg-black/20" />
                
                <div className="text-center">
                  <div className="font-black text-xs text-black uppercase tracking-widest mb-3">
                    🎭 CO-STAR
                  </div>
                  
                  {/* Co-Star Sprite - NO BACKGROUND! */}
                  <motion.div
                    className="relative w-24 h-24 mx-auto mb-3"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    style={{ 
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
                    }}
                  >
                    <img 
                      src={costarPortrait}
                      alt="Co-star"
                      className="w-full h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </motion.div>

                  <p className="font-black text-black text-lg mb-2">
                    {generateCoStarName()}
                  </p>
                  
                  {/* Popularity Bar - Pixel Style */}
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-black uppercase">Popularity</div>
                    <div className="h-3 bg-black border-2 border-black/30">
                      <motion.div 
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${script.coStarPopularity}%` }}
                        transition={{ duration: 1, delay: 0.8 }}
                        style={{ imageRendering: 'pixelated' }}
                      />
                    </div>
                    <div className="font-bold text-black text-sm">
                      {script.coStarPopularity}%
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* STATS PANEL - Arcade Style */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="bg-black border-4 border-yellow-400 p-6"
            >
              <div className="grid grid-cols-3 gap-4 text-center">
                
                {/* Payment */}
                <div>
                  <div className="text-green-400 font-black text-3xl mb-1">
                    ₹{script.payment}L
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-wider font-bold">
                    Payment
                  </div>
                </div>

                {/* Risk Meter */}
                <div>
                  <div className={`text-3xl font-black mb-1 bg-gradient-to-r ${riskColors[script.riskProfile]} bg-clip-text text-transparent`}>
                    {getRiskIcon(script.riskProfile)}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-wider font-bold">
                    {script.riskProfile}
                  </div>
                </div>

                {/* Certification */}
                <div>
                  <div className={`text-3xl font-black mb-1 ${getCertColor(script.certification)}`}>
                    {script.certification}
                  </div>
                  <div className="text-white/60 text-xs uppercase tracking-wider font-bold">
                    Rating
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ACTION BUTTONS - MARQUEE STYLE */}
            <div className="grid grid-cols-2 gap-4 pt-4">
              
              {/* ACCEPT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAccept}
                className="relative bg-gradient-to-b from-green-400 to-green-600 border-4 border-white py-6 font-black text-2xl text-white uppercase tracking-widest shadow-[0_8px_0_rgba(0,100,0,1)] hover:shadow-[0_4px_0_rgba(0,100,0,1)] active:translate-y-2 transition-all overflow-hidden group"
              >
                {/* Marquee lights */}
                <div className="absolute top-0 left-0 right-0 flex justify-around p-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-yellow-300 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, delay: i * 0.125, repeat: Infinity }}
                    />
                  ))}
                </div>

                <span className="relative" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  ▶ ACCEPT
                </span>

                {/* Bottom lights */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-around p-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-yellow-300 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, delay: i * 0.125 + 0.5, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.button>

              {/* REJECT BUTTON */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReject}
                className="relative bg-gradient-to-b from-red-400 to-red-600 border-4 border-white py-6 font-black text-2xl text-white uppercase tracking-widest shadow-[0_8px_0_rgba(100,0,0,1)] hover:shadow-[0_4px_0_rgba(100,0,0,1)] active:translate-y-2 transition-all overflow-hidden"
              >
                {/* Marquee lights */}
                <div className="absolute top-0 left-0 right-0 flex justify-around p-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-300 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, delay: i * 0.125, repeat: Infinity }}
                    />
                  ))}
                </div>

                <span className="relative" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.5)' }}>
                  ✖ REJECT
                </span>

                <div className="absolute bottom-0 left-0 right-0 flex justify-around p-1">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-blue-300 rounded-full"
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1, delay: i * 0.125 + 0.5, repeat: Infinity }}
                    />
                  ))}
                </div>
              </motion.button>
            </div>

            {/* Keyboard Hint */}
            <p className="text-center text-white/50 text-sm font-bold uppercase tracking-wider">
              SPACE = Accept • ESC = Reject
            </p>
          </div>
        </div>
      </div>

      {/* FILM STRIP BORDER - BOTTOM */}
      <div className="relative h-8 bg-black border-4 border-black rounded-b-2xl overflow-hidden">
        <motion.div 
          className="absolute inset-0 flex items-center"
          animate={{ x: [0, -40] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          {[...Array(30)].map((_, i) => (
            <div key={i} className="w-6 h-6 bg-white mx-1 flex-shrink-0 rounded-sm" />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

// Helper functions
function determineRecommendation(script: any, fame: number, careerPhase: string): boolean {
  if (careerPhase === 'Newcomer' && script.riskProfile === 'Safe') return true;
  if (careerPhase === 'Rising Star' && script.directorReputation > 70) return true;
  return false;
}

function getContextualAdvice(script: any, fame: number, history: any[]): string | null {
  if (fame < 20 && script.riskProfile === 'Risky') {
    return "⚠️ WARNING: This risky project could damage your reputation. Your agent recommends safer options.";
  }
  if (fame > 60 && script.directorReputation > 80) {
    return "⭐ OPPORTUNITY: This acclaimed director could elevate you to superstar status!";
  }
  if (script.payment > 150) {
    return "💰 HIGH PAYOUT: One of your best-paying offers. Financial security awaits!";
  }
  return null;
}

function getGenreEmoji(genre: string): string {
  const emojis: Record<string, string> = {
    Action: '⚔️', Romance: '💕', Drama: '🎭', Comedy: '🎪',
    Thriller: '🔪', Horror: '👻', Social: '📢', Biopic: '📖'
  };
  return emojis[genre] || '🎬';
}

function getRiskIcon(risk: string): string {
  return { Safe: '✅', Balanced: '⚖️', Risky: '⚠️' }[risk] || '🎯';
}

function getCertColor(cert: string): string {
  return {
    U: 'text-green-400',
    'U-A': 'text-yellow-400',
    A: 'text-red-400'
  }[cert] || 'text-white';
}

function generateDirectorName(): string {
  const names = ['Raj Kapoor', 'Guru Dutt', 'Satyajit Ray', 'Mani Ratnam', 'S.S. Rajamouli'];
  return names[Math.floor(Math.random() * names.length)];
}

function generateCoStarName(): string {
  const names = ['Madhubala', 'Nargis', 'Waheeda Rehman', 'Deepika Padukone', 'Alia Bhatt'];
  return names[Math.floor(Math.random() * names.length)];
}

