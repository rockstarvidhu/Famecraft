import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { AwardCeremony, AwardNomination } from '../game/awards';
import { simulateAwardWin, getPrestigeBonus } from '../game/awards';

export default function AwardCeremonyScreen() {
  const { currentCeremony, completeAwardCeremony } = useGameStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [won, setWon] = useState(false);
  const [selectedSpeech, setSelectedSpeech] = useState<number | null>(null);

  if (!currentCeremony) return null;

  const ceremony = currentCeremony as AwardCeremony;
  const nomination = ceremony.nominations[currentIndex];
  const isLastNomination = currentIndex >= ceremony.nominations.length - 1;

  const handleReveal = () => {
    const didWin = simulateAwardWin(nomination);
    setWon(didWin);
    setRevealed(true);
  };

  const handleNext = (speechIndex?: number) => {
    if (won && speechIndex !== undefined) {
      setSelectedSpeech(speechIndex);
    }

    if (isLastNomination) {
      // Ceremony complete
      completeAwardCeremony(won, speechIndex);
    } else {
      // Next nomination
      setCurrentIndex(currentIndex + 1);
      setRevealed(false);
      setWon(false);
      setSelectedSpeech(null);
    }
  };

  const speeches = [
    { label: '🙏 Humble & Grateful', fameBonus: 5, consequence: 'Gracious speech loved by all.' },
    { label: '😢 Emotional & Tearful', fameBonus: 10, consequence: 'Heartfelt moment went viral.' },
    { label: '💪 Confident & Bold', fameBonus: 8, consequence: 'Strong statement. Polarizing.' },
  ];

  const lossReactions = [
    { label: '😊 Applaud Gracefully', fameBonus: 5, consequence: 'Class act. Fans respect you.' },
    { label: '😐 Show Disappointment', fameBonus: -10, consequence: 'Honest but called sore loser.' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto space-y-6"
    >
      {/* Red Carpet Header */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-red-900 via-red-700 to-red-900"></div>
        <motion.div
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 opacity-30"
          style={{
            background: 'repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,215,0,0.3) 50px, rgba(255,215,0,0.3) 100px)',
          }}
        />
        <div className="relative border-4 border-yellow-600 rounded-2xl p-8">
          <h1 className="text-5xl font-black text-yellow-300 text-center mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            🏆 {ceremony.bodyName} 🏆
          </h1>
          <p className="text-xl text-yellow-200 text-center">
            {ceremony.month} {ceremony.year}
          </p>
        </div>
      </div>

      {/* Main Award Card */}
      <motion.div
        key={currentIndex}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-4 border-yellow-600 rounded-2xl p-8 shadow-[0_0_40px_rgba(255,215,0,0.3)]"
      >
        {/* Category Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-yellow-400 mb-2">
            {nomination.category === 'BestActor' ? 'BEST ACTOR IN A LEADING ROLE' : 'BEST FILM'}
          </h2>
          <p className="text-yellow-200">Presented by {ceremony.bodyName}</p>
        </div>

        {!revealed ? (
          <>
            {/* Nominees List */}
            <div className="bg-black/40 border-2 border-yellow-600/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-yellow-300 mb-4">NOMINEES:</h3>
              <div className="space-y-3">
                {/* Player's nomination */}
                <motion.div
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4"
                >
                  <span className="text-3xl">⭐</span>
                  <div className="flex-1">
                    <div className="text-yellow-300 font-bold text-lg">YOU</div>
                    <div className="text-yellow-200 text-sm">{nomination.filmTitle}</div>
                  </div>
                  <div className="text-yellow-400 text-sm font-semibold">
                    {Math.round(nomination.winProbability)}% chance
                  </div>
                </motion.div>

                {/* Other nominees */}
                {nomination.nominees.map((nominee, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/5 border border-white/20 rounded-lg p-3"
                  >
                    <span className="text-white/50">•</span>
                    <div className="text-white/80">{nominee}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reveal Button */}
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,215,0,0.5)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleReveal}
              className="w-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-black text-2xl py-6 rounded-xl border-4 border-yellow-600 shadow-[0_8px_0_rgba(202,138,4,1)] hover:shadow-[0_4px_0_rgba(202,138,4,1)] active:translate-y-2 transition-all"
            >
              📨 OPEN ENVELOPE
            </motion.button>
          </>
        ) : (
          <AnimatePresence mode="wait">
            {won ? (
              // YOU WON!
              <motion.div
                key="win"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                className="text-center space-y-6"
              >
                {/* Confetti effect */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-9xl"
                >
                  🎉
                </motion.div>

                <div className="space-y-4">
                  <h3 className="text-6xl font-black text-yellow-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                    YOU WON!
                  </h3>
                  <p className="text-2xl text-yellow-200">
                    {nomination.filmTitle}
                  </p>
                  <div className="text-yellow-400 text-lg">
                    Fame +{getPrestigeBonus(ceremony.body, nomination.category)}
                  </div>
                </div>

                {selectedSpeech === null ? (
                  <>
                    <div className="h-px bg-yellow-600/50 my-6"></div>
                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-yellow-300">ACCEPTANCE SPEECH:</h4>
                      {speeches.map((speech, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02, x: 4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleNext(idx)}
                          className="w-full text-left bg-yellow-600/20 border-2 border-yellow-500 rounded-lg p-4 hover:bg-yellow-600/30 transition-colors"
                        >
                          <div className="font-bold text-yellow-200 mb-1">{speech.label}</div>
                          <div className="text-sm text-yellow-300/80">{speech.consequence}</div>
                          <div className="text-xs text-yellow-400 mt-1">Fame +{speech.fameBonus}</div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleNext()}
                    className="bg-yellow-500 text-black font-bold text-xl py-4 px-8 rounded-lg"
                  >
                    {isLastNomination ? 'Finish Ceremony →' : 'Next Category →'}
                  </motion.button>
                )}
              </motion.div>
            ) : (
              // YOU LOST
              <motion.div
                key="loss"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="text-6xl mb-4">😔</div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-bold text-white/80">
                    Winner: {nomination.nominees[0]}
                  </h3>
                  <p className="text-white/60">Better luck next time</p>
                </div>

                {selectedSpeech === null ? (
                  <>
                    <div className="h-px bg-white/20 my-6"></div>
                    <div className="space-y-4">
                      <h4 className="text-lg font-bold text-white/80">YOUR REACTION:</h4>
                      {lossReactions.map((reaction, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleNext(idx)}
                          className="w-full text-left bg-white/10 border border-white/30 rounded-lg p-4 hover:bg-white/20"
                        >
                          <div className="font-bold text-white mb-1">{reaction.label}</div>
                          <div className="text-sm text-white/70">{reaction.consequence}</div>
                          <div className="text-xs text-white/50 mt-1">
                            Fame {reaction.fameBonus > 0 ? '+' : ''}{reaction.fameBonus}
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => handleNext()}
                    className="bg-white/20 text-white font-bold py-3 px-8 rounded-lg"
                  >
                    {isLastNomination ? 'Leave Ceremony →' : 'Next Category →'}
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center gap-2">
          {ceremony.nominations.map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full ${
                idx < currentIndex ? 'bg-yellow-500' :
                idx === currentIndex ? 'bg-yellow-400 ring-2 ring-yellow-300' :
                'bg-white/20'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}