// src/screens/TitleScreen.tsx
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { WinPanel, VinBtn } from '../app/App';

export default function TitleScreen() {
  const { setCurrentScreen, resetGame } = useGameStore();

  const handleStart = () => {
    resetGame();
    setCurrentScreen('scripts');
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh' 
      }}
    >
      <WinPanel 
        title="Welcome to Famecraft" 
        style={{ width: 400, textAlign: 'center' }}
      >
        <div style={{ padding: '40px 20px' }}>
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 
              style={{ 
                fontFamily: "'Libre Baskerville', serif", 
                fontSize: 36, 
                color: '#221408', 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                margin: '0 0 10px 0'
              }}
            >
              Famecraft
            </h1>
            <p 
              style={{ 
                fontFamily: "'Crimson Text', serif", 
                fontSize: 14, 
                color: '#6B4226', 
                fontStyle: 'italic',
                marginBottom: 40
              }}
            >
              "The path to stardom is written in ink."
            </p>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <VinBtn 
              label="Begin New Career" 
              variant="gold" 
              onClick={handleStart} 
              icon="🎬"
            />
            <VinBtn 
              label="Continue" 
              variant="neutral" 
              onClick={() => setCurrentScreen('scripts')} 
              icon="📜"
            />
          </div>

          <div 
            style={{ 
              marginTop: 40, 
              paddingTop: 20, 
              borderTop: '1.5px solid #8B5A2B33',
              fontSize: 9,
              fontFamily: 'Courier Prime, monospace',
              color: '#CCB47A',
              textTransform: 'uppercase'
            }}
          >
            v1.0.4 • Vintage Engine
          </div>
        </div>
      </WinPanel>
    </div>
  );
}
