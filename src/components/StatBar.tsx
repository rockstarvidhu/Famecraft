import { useGameStore } from '../store/gameStore';

export default function StatBar() {
  const { age, fame, wealth, mentalHealth, burnout, currentYear } = useGameStore();

  const stats = [
    { label: 'Fame', value: fame, max: 100, color: 'from-yellow-400 to-yellow-600' },
    { label: 'Wealth', value: Math.min(100, (wealth / 500) * 100), max: 100, color: 'from-green-400 to-green-600', display: `₹${wealth}L` },
    { label: 'Mental Health', value: mentalHealth, max: 100, color: 'from-blue-400 to-blue-600' },
    { label: 'Burnout', value: burnout, max: 100, color: 'from-red-400 to-red-600' },
  ];

  return (
    <div className="bg-amber-50 border-4 border-amber-800 rounded-lg p-4 shadow-[0_4px_0_rgba(120,53,15,0.3)]">
      {/* Year and Age */}
      <div className="flex justify-between mb-3 text-sm font-bold text-amber-900">
        <span>Year: {currentYear}</span>
        <span>Age: {age}</span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label}>
            <div className="flex justify-between text-xs font-semibold text-amber-900 mb-1">
              <span>{stat.label}</span>
              <span>{stat.display || `${Math.round(stat.value)}%`}</span>
            </div>
            
            {/* Progress bar with vintage styling */}
            <div className="h-4 bg-amber-200 border-2 border-amber-900 rounded-sm overflow-hidden relative">
              {/* Notches for vintage look */}
              <div className="absolute inset-0 flex">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="flex-1 border-r border-amber-900/20" />
                ))}
              </div>
              
              {/* Actual progress */}
              <div
                className={`h-full bg-gradient-to-r ${stat.color} transition-all duration-500 relative z-10`}
                style={{ width: `${(stat.value / stat.max) * 100}%` }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
