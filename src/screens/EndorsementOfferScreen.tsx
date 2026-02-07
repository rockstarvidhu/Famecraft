import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';

interface Endorsement {
  id: string;
  brand: string;
  product: string;
  payment: number;
  duration: number;
  requirements: {
    minFame: number;
    imageType: string;
  };
}

export default function EndorsementOfferScreen() {
  const { currentEndorsement, acceptEndorsement, rejectEndorsement } = useGameStore();
  
  if (!currentEndorsement) return null;

  const endorsement = currentEndorsement as Endorsement;
  const totalPayout = endorsement.payment * endorsement.duration;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 border-y-4 border-blue-900 shadow-lg overflow-hidden">
        <motion.div
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <div className="relative py-3 px-6">
          <h2 className="text-3xl font-black text-white text-center">
            💼 BRAND ENDORSEMENT OFFER 💼
          </h2>
        </div>
      </div>

      {/* Main Offer Card */}
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 border-4 border-blue-900 rounded-2xl p-8 shadow-[0_12px_24px_rgba(30,64,175,0.4)] relative overflow-hidden"
      >
        {/* Brand Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white border-4 border-blue-800 rounded-2xl p-8 mb-4 shadow-lg">
            <div className="text-6xl mb-2">{getProductEmoji(endorsement.product)}</div>
            <h1 className="text-4xl font-black text-blue-900">
              {endorsement.brand}
            </h1>
          </div>
          <p className="text-2xl text-blue-700 font-semibold italic">
            "{getTagline(endorsement.product)}"
          </p>
        </div>

        {/* Offer Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Left Column - Financial */}
          <div className="space-y-4">
            <div className="bg-green-100 border-3 border-green-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-green-900 mb-3 uppercase tracking-wide">
                💰 Financial Terms
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-semibold">Annual Payment:</span>
                  <span className="text-2xl font-black text-green-900">
                    ₹{endorsement.payment}L
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-semibold">Contract Duration:</span>
                  <span className="text-xl font-bold text-green-900">
                    {endorsement.duration} years
                  </span>
                </div>
                <div className="h-px bg-green-600/30"></div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-bold">Total Payout:</span>
                  <span className="text-3xl font-black text-green-700">
                    ₹{totalPayout}L
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-100 border-3 border-blue-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-blue-900 mb-3 uppercase tracking-wide">
                ✨ Benefits
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">⭐</span>
                  <span className="text-blue-900">Fame Boost: +5</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🎭</span>
                  <span className="text-blue-900">Image Enhancement: +10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">📸</span>
                  <span className="text-blue-900">2-3 Ad Shoots per year</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-blue-600">🌟</span>
                  <span className="text-blue-900">Premium brand association</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Requirements */}
          <div className="space-y-4">
            <div className="bg-amber-100 border-3 border-amber-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-amber-900 mb-3 uppercase tracking-wide">
                📋 Requirements
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-amber-900">
                    Fame: {endorsement.requirements.minFame}+ (You qualify!)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-amber-900">
                    Image: {endorsement.requirements.imageType}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-amber-900">
                    No major scandals
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-purple-100 border-3 border-purple-700 rounded-xl p-6">
              <h3 className="text-sm font-bold text-purple-900 mb-3 uppercase tracking-wide">
                🎯 Commitment
              </h3>
              <div className="space-y-2 text-sm text-purple-900">
                <p>• Attend 2-3 brand events per year</p>
                <p>• Social media promotion required</p>
                <p>• Cannot criticize brand publicly</p>
                <p>• Early termination penalty applies</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decision Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 0 30px rgba(34,197,94,0.5)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => acceptEndorsement(endorsement)}
            className="bg-gradient-to-b from-green-400 to-green-600 text-white font-black text-xl py-6 px-6 rounded-xl border-4 border-green-800 shadow-[0_8px_0_rgb(22,101,52)] hover:shadow-[0_4px_0_rgb(22,101,52)] active:translate-y-2 transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">✅</span>
              <span>SIGN CONTRACT</span>
            </div>
            <div className="text-sm font-normal mt-1 text-green-100">
              Accept ₹{totalPayout}L deal
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => rejectEndorsement()}
            className="bg-gradient-to-b from-gray-400 to-gray-600 text-white font-black text-xl py-6 px-6 rounded-xl border-4 border-gray-800 shadow-[0_8px_0_rgb(75,85,99)] hover:shadow-[0_4px_0_rgb(75,85,99)] active:translate-y-2 transition-all"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🚫</span>
              <span>DECLINE OFFER</span>
            </div>
            <div className="text-sm font-normal mt-1 text-gray-200">
              Pass on this deal
            </div>
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Helper functions
function getProductEmoji(product: string): string {
  const emojiMap: Record<string, string> = {
    'Luxury Timepieces': '⌚',
    'Smartphones': '📱',
    'Soft Drinks': '🥤',
    'Luxury Cars': '🏎️',
    'Designer Clothing': '👔',
  };
  return emojiMap[product] || '🎁';
}

function getTagline(product: string): string {
  const taglines: Record<string, string> = {
    'Luxury Timepieces': 'Be Timeless, Be Legendary',
    'Smartphones': 'Innovation in Your Hands',
    'Soft Drinks': 'Quench Your Thirst for Life',
    'Luxury Cars': 'Drive Your Dreams',
    'Designer Clothing': 'Fashion Forward, Always',
  };
  return taglines[product] || 'Excellence Awaits';
}