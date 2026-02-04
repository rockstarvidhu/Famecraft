import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useEffect } from 'react';

export default function FilmReleaseScreen() {
  const { history, currentYear, advanceYear } = useGameStore();
  
  // Get the most recent film
  const latestFilm = history[history.length - 1];
  
  useEffect(() => {
    // Auto-advance after 5 seconds
    const timer = setTimeout(() => {
      advanceYear();
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [advanceYear]);

  if (!latestFilm) return null;

  const { filmTitle, outcome } = latestFilm;
  const { boxOfficeMultiplier, criticsScore, audienceScore, fameChange, wealthChange } = outcome;

  // Determine box office category
  let boxOfficeCategory = 'DISASTER';
  let boxOfficeColor = 'text-red-600';
  let boxOfficeEmoji = '💀';
  
  if (boxOfficeMultiplier >= 2.5) {
    boxOfficeCategory = 'BLOCKBUSTER';
    boxOfficeColor = 'text-green-600';
    boxOfficeEmoji = '🎉';
  } else if (boxOfficeMultiplier >= 1.5) {
    boxOfficeCategory = 'SUPERHIT';
    boxOfficeColor = 'text-green-500';
    boxOfficeEmoji = '🎊';
  } else if (boxOfficeMultiplier >= 1.0) {
    boxOfficeCategory = 'HIT';
    boxOfficeColor = 'text-blue-600';
    boxOfficeEmoji = '✨';
  } else if (boxOfficeMultiplier >= 0.7) {
    boxOfficeCategory = 'AVERAGE';
    boxOfficeColor = 'text-yellow-600';
    boxOfficeEmoji = '😐';
  } else if (boxOfficeMultiplier >= 0.5) {
    boxOfficeCategory = 'FLOP';
    boxOfficeColor = 'text-orange-600';
    boxOfficeEmoji = '😞';
  }

  return (
    <div className="space-y-6">
      {/* Film Release Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-y-4 border-red-800 shadow-lg">
          <div className="max-w-4xl mx-auto py-3 px-6">
            <h2 className="text-2xl font-bold text-white text-center tracking-wide">
              🎬 FILM RELEASED - {currentYear}
            </h2>
          </div>
        </div>
        <div className="absolute -left-4 top-0 w-8 h-full bg-red-600 border-l-4 border-red-800 transform -skew-x-12" />
        <div className="absolute -right-4 top-0 w-8 h-full bg-red-600 border-r-4 border-red-800 transform skew-x-12" />
      </motion.div>

      {/* Main Results Card - vintage paper with grain */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-900 rounded-2xl p-8 shadow-[0_8px_0_rgba(120,53,15,0.4)] max-w-3xl mx-auto overflow-hidden"
      >
        {/* Paper texture - high opacity to match reference */}
        <div className="absolute inset-0 opacity-75 pointer-events-none" style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(139,69,19,0.08) 0px, transparent 1px, transparent 2px, rgba(139,69,19,0.08) 3px), repeating-linear-gradient(90deg, rgba(139,69,19,0.08) 0px, transparent 1px, transparent 2px, rgba(139,69,19,0.08) 3px)`
        }} />
        {/* Film grain overlay */}
        <div className="absolute inset-0 opacity-50 pointer-events-none mix-blend-overlay" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px'
        }} />
        {/* Film Title */}
        <div className="relative z-10 text-center mb-6">
          <h3 className="text-4xl font-bold text-amber-900 mb-2">{filmTitle}</h3>
          <div className="h-1 w-32 bg-amber-600 mx-auto rounded-full"></div>
        </div>

        {/* Box Office Result - BIG */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="relative z-10 text-center mb-8"
        >
          <div className="text-6xl mb-2">{boxOfficeEmoji}</div>
          <div className={`text-5xl font-black ${boxOfficeColor} mb-2`}>
            {boxOfficeCategory}
          </div>
          <div className="text-lg text-amber-800">
            Box Office: {boxOfficeMultiplier.toFixed(1)}x multiplier
          </div>
        </motion.div>

        {/* Scores Grid */}
        <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
          {/* Critics Score */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-100 border-3 border-amber-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📰</span>
              <span className="font-bold text-amber-900">CRITICS</span>
            </div>
            <div className="text-4xl font-black text-amber-900">
              {criticsScore}
              <span className="text-xl text-amber-700">/100</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl text-yellow-500">
                  {i < Math.round(criticsScore / 20) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Audience Score */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-amber-100 border-3 border-amber-700 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎭</span>
              <span className="font-bold text-amber-900">AUDIENCE</span>
            </div>
            <div className="text-4xl font-black text-amber-900">
              {audienceScore}
              <span className="text-xl text-amber-700">/100</span>
            </div>
            <div className="flex gap-0.5 mt-2">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl text-yellow-500">
                  {i < Math.round(audienceScore / 20) ? '⭐' : '☆'}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Career Impact */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="relative z-10 bg-gradient-to-r from-purple-100 to-pink-100 border-3 border-purple-700 rounded-lg p-4"
        >
          <div className="font-bold text-purple-900 mb-3 text-center">CAREER IMPACT</div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-sm text-purple-700 font-semibold">Fame Change</div>
              <div className={`text-3xl font-black ${fameChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {fameChange > 0 ? '+' : ''}{fameChange}
              </div>
            </div>
            <div>
              <div className="text-sm text-purple-700 font-semibold">Earnings</div>
              <div className="text-3xl font-black text-green-600">
                ₹{wealthChange}L
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="relative z-10 mt-6 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={advanceYear}
            className="bg-gradient-to-b from-blue-400 to-blue-600 text-white font-bold py-4 px-8 rounded-lg border-3 border-blue-800 shadow-[0_4px_0_rgb(30,64,175)] hover:shadow-[0_2px_0_rgb(30,64,175)] active:translate-y-1 transition-all text-lg"
          >
            Continue to Next Year →
          </motion.button>
          <p className="text-xs text-amber-700 mt-2">Auto-advancing in 5 seconds...</p>
        </motion.div>
      </motion.div>
    </div>
  );
}