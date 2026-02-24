import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface EventChoice {
  label: string;
  fameChange?: number;
  wealthChange?: number;
  mentalHealthChange?: number;
  burnoutChange?: number;
  consequence: string;
}

interface PersonalEvent {
  title: string;
  description: string;
  emoji: string;
  choices: EventChoice[];
}

export default function PersonalEventScreen() {
  const { currentEvent, handleEventChoice } = useGameStore();
  
  if (!currentEvent) return null;

  const event = currentEvent as PersonalEvent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-4xl mx-auto"
    >
      {/* Newspaper Breaking News Banner */}
      <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-red-600 border-y-4 border-red-900 shadow-lg overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 20px)`
          }}
        />
        <div className="relative py-3 px-6">
          <h2 className="text-3xl font-black text-white text-center tracking-wide animate-pulse">
            📰 BREAKING NEWS! 📰
          </h2>
        </div>
      </div>

      {/* Main Event Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 border-4 border-amber-900 rounded-2xl p-8 shadow-[0_12px_24px_rgba(120,53,15,0.6)] relative overflow-hidden"
      >
        {/* Paper texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(139, 69, 19, 0.03) 0px, transparent 1px, transparent 2px, rgba(139, 69, 19, 0.03) 3px),
              repeating-linear-gradient(90deg, rgba(139, 69, 19, 0.03) 0px, transparent 1px, transparent 2px, rgba(139, 69, 19, 0.03) 3px)
            `
          }}
        />

        {/* Headline */}
        <div className="relative mb-6 text-center">
          <div className="text-6xl mb-4">{event.emoji}</div>
          <h1 className="text-4xl font-black text-amber-900 mb-4 leading-tight">
            {event.title}
          </h1>
          <div className="h-1 w-32 bg-amber-700 mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-amber-800 leading-relaxed max-w-2xl mx-auto">
            {event.description}
          </p>
        </div>

        {/* Choices */}
        <div className="relative space-y-4">
          <h3 className="text-xl font-bold text-amber-900 text-center mb-4">
            HOW DO YOU RESPOND?
          </h3>

          {event.choices.map((choice, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleEventChoice(choice)}
              className="w-full text-left bg-gradient-to-r from-amber-100 to-orange-100 border-3 border-amber-800 rounded-xl p-5 shadow-[0_4px_0_rgba(120,53,15,1)] hover:shadow-[0_2px_0_rgba(120,53,15,1)] active:translate-y-1 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Choice label */}
                  <div className="text-lg font-bold text-amber-900 mb-2">
                    {choice.label}
                  </div>
                  
                  {/* Stats impact */}
                  <div className="flex flex-wrap gap-2 text-sm mb-2">
                    {choice.fameChange !== undefined && choice.fameChange !== 0 && (
                      <span className={`px-2 py-1 rounded font-semibold ${
                        choice.fameChange > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        Fame: {choice.fameChange > 0 ? '+' : ''}{choice.fameChange}
                      </span>
                    )}
                    {choice.mentalHealthChange !== undefined && choice.mentalHealthChange !== 0 && (
                      <span className={`px-2 py-1 rounded font-semibold ${
                        choice.mentalHealthChange > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        Mental: {choice.mentalHealthChange > 0 ? '+' : ''}{choice.mentalHealthChange}
                      </span>
                    )}
                    {choice.wealthChange !== undefined && choice.wealthChange !== 0 && (
                      <span className={`px-2 py-1 rounded font-semibold ${
                        choice.wealthChange > 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        Wealth: {choice.wealthChange > 0 ? '+' : ''}{choice.wealthChange}L
                      </span>
                    )}
                    {choice.burnoutChange !== undefined && choice.burnoutChange !== 0 && (
                      <span className={`px-2 py-1 rounded font-semibold ${
                        choice.burnoutChange < 0 ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                      }`}>
                        Burnout: {choice.burnoutChange > 0 ? '+' : ''}{choice.burnoutChange}
                      </span>
                    )}
                  </div>
                  
                  {/* Consequence preview */}
                  <div className="text-xs text-amber-700 italic">
                    {choice.consequence}
                  </div>
                </div>
                
                <div className="text-3xl">→</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Warning footer */}
        <div className="relative mt-6 text-center">
          <p className="text-sm text-amber-700 font-semibold">
            ⚠️ Your choice will have lasting consequences
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
