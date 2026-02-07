// src/app/App.tsx - UPDATED WITH ALL PART 1 SCREENS

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import ScriptSelectionScreen from '../screens/ScriptSelectionScreen';
import FilmReleaseScreen from '../screens/FilmReleaseScreen';
import PersonalEventScreen from '../screens/PersonalEventScreen';
import AwardCeremonyScreen from '../screens/AwardCeremonyScreen';
import EndorsementOfferScreen from '../screens/EndorsementOfferScreen';
import StatBar from '../components/StatBar';
import PlayerAvatar from '../components/PlayerAvatar';
import { UI_ICONS, CAREER_BADGES } from '../utils/assetPaths';

function App() {
  const { 
    generateNewScripts, 
    currentScripts, 
    careerPhase, 
    currentScreen,
    endorsementIncome,
    totalAwards,
  } = useGameStore();

  useEffect(() => {
    if (currentScripts.length === 0 && currentScreen === 'scripts') {
      generateNewScripts();
    }
  }, [currentScripts.length, currentScreen, generateNewScripts]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Vintage Paper Background */}
      <div className="fixed inset-0 bg-[#e8d5b7]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4e4c1] via-[#e8d5b7] to-[#d4c5a9]"></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 200px',
          }}
        />
        <div className="absolute top-20 right-40 w-64 h-64 bg-amber-900/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-60 w-32 h-32 bg-amber-800/5 rounded-full blur-2xl"></div>
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-amber-900/10"></div>
        <motion.div
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%'] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='1' /%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px 128px',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.header 
            className="mb-8"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            <div className="bg-gradient-to-r from-[#f4e4c1] via-[#fef3c7] to-[#f4e4c1] border-4 border-[#78350f] rounded-lg p-4 shadow-[0_8px_0_rgba(120,53,15,0.8),0_12px_24px_rgba(120,53,15,0.3)] relative overflow-hidden">
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-amber-700 opacity-30"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-amber-700 opacity-30"></div>

              <div className="flex items-center gap-4 relative z-10">
                <motion.div 
                  className="w-16 h-16 bg-slate-900 rounded border-4 border-slate-950 flex items-center justify-center p-2 shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <img 
                    src={UI_ICONS.filmReel} 
                    alt="Film Reel"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl text-amber-300">🎬</span>';
                    }}
                  />
                </motion.div>
                
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-amber-900 tracking-tight drop-shadow-sm">
                    Successful. Or Synonym.
                  </h1>
                  
                  {/* NEW: Quick Stats */}
                  <div className="flex gap-4 mt-1 text-xs text-amber-700">
                    {endorsementIncome > 0 && (
                      <span className="font-semibold">💰 ₹{endorsementIncome}L/year passive</span>
                    )}
                    {totalAwards > 0 && (
                      <span className="font-semibold">🏆 {totalAwards} awards</span>
                    )}
                  </div>
                </div>

                <div className="hidden md:block">
                  <PlayerAvatar />
                </div>

                <motion.div 
                  className="bg-yellow-400 border-3 border-yellow-700 rounded-full px-4 py-2 flex items-center gap-2 shadow-[0_4px_0_rgba(161,98,7,1)] hover:shadow-[0_2px_0_rgba(161,98,7,1)] hover:-translate-y-0.5 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="w-8 h-8">
                    <img 
                      src={CAREER_BADGES[careerPhase]} 
                      alt={careerPhase}
                      className="w-full h-full object-contain drop-shadow-md"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = '<span class="text-xl">⭐</span>';
                      }}
                    />
                  </div>
                  <div className="text-sm">
                    <div className="font-bold text-yellow-900">{careerPhase}</div>
                    <div className="text-xs text-yellow-800">Reputation</div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="md:hidden mt-4 flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
            >
              <PlayerAvatar />
            </motion.div>
            
            <motion.div 
              className="mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatBar />
            </motion.div>
          </motion.header>

          {/* Screen Router */}
          <AnimatePresence mode="wait">
            {currentScreen === 'scripts' && (
              <motion.div
                key="scripts"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <ScriptSelectionScreen />
              </motion.div>
            )}
            
            {currentScreen === 'filmRelease' && (
              <motion.div
                key="filmRelease"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              >
                <FilmReleaseScreen />
              </motion.div>
            )}
            
            {currentScreen === 'personalEvent' && (
              <motion.div
                key="personalEvent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <PersonalEventScreen />
              </motion.div>
            )}
            
            {currentScreen === 'awardCeremony' && (
              <motion.div
                key="awardCeremony"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <AwardCeremonyScreen />
              </motion.div>
            )}
            
            {currentScreen === 'endorsementOffer' && (
              <motion.div
                key="endorsementOffer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <EndorsementOfferScreen />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;