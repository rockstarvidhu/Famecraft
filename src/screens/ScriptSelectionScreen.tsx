import { AnimatePresence, motion, PanInfo } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import ScriptCard from '../components/ScriptCard';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function ScriptSelectionScreen() {
  const { currentScripts, acceptScript, rejectScript, generateNewScripts, fame } = useGameStore();
  const [isLoading, setIsLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Force script generation if none exist
  useEffect(() => {
    if (currentScripts.length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        generateNewScripts();
        setIsLoading(false);
      }, 500);
    }
  }, [currentScripts.length, generateNewScripts]);

  const handleAccept = (scriptId: string) => {
    const script = currentScripts.find(s => s.id === scriptId);
    
    // Confetti-style success toast
    toast.success(`🎬 Accepted "${script?.title}"!`, {
      duration: 3000,
      style: {
        background: '#16a34a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '16px',
        padding: '16px',
        borderRadius: '12px',
        border: '3px solid #15803d',
      },
      icon: '✨',
    });
    
    acceptScript(scriptId);
  };

  const handleReject = (scriptId: string) => {
    const script = currentScripts.find(s => s.id === scriptId);
    
    toast(`Declined "${script?.title}"`, {
      duration: 2000,
      style: {
        background: '#f59e0b',
        color: '#78350f',
        fontWeight: 'bold',
        fontSize: '14px',
        padding: '12px',
        borderRadius: '12px',
        border: '3px solid #d97706',
      },
      icon: '👋',
    });
    
    rejectScript(scriptId);
    
    // Small fame penalty notification
    if (currentScripts.length > 1) {
      setTimeout(() => {
        toast('⚠️ Rejecting scripts affects your reputation', {
          duration: 2000,
          style: {
            background: '#ef4444',
            color: '#fff',
            fontSize: '12px',
          },
        });
      }, 500);
    }
  };

  // Mobile swipe handling
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, scriptId: string) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // Swiped right = accept
      handleAccept(scriptId);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left = decline
      handleReject(scriptId);
    }
  };

  // Loading state with rotating film reel
  if (isLoading || currentScripts.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-amber-100 border-4 border-amber-900 rounded-lg p-8 shadow-[0_8px_0_rgba(120,53,15,0.3)] max-w-md mx-auto">
          {/* Rotating film reel loader */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="text-6xl mb-4 inline-block"
          >
            🎬
          </motion.div>
          <p className="text-xl text-amber-900 font-semibold mb-2">
            Loading scripts...
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              className="w-3 h-3 bg-amber-600 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              className="w-3 h-3 bg-amber-600 rounded-full"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              className="w-3 h-3 bg-amber-600 rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  const currentScript = currentScripts[currentIndex];

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-center" />
      
      <div className="space-y-6">
        {/* Ribbon banner with smooth transition */}
        <motion.div 
          className="relative"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          <div className="bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 border-y-4 border-yellow-800 shadow-lg">
            <div className="max-w-4xl mx-auto py-3 px-6">
              <h2 className="text-2xl font-bold text-yellow-900 text-center tracking-wide">
                Script Offer
              </h2>
            </div>
          </div>
          
          {/* Ribbon tails */}
          <div className="absolute -left-4 top-0 w-8 h-full bg-yellow-600 border-l-4 border-yellow-800 transform -skew-x-12" />
          <div className="absolute -right-4 top-0 w-8 h-full bg-yellow-600 border-r-4 border-yellow-800 transform skew-x-12" />
        </motion.div>

        {/* Subtitle with fade in */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xl text-amber-900 font-semibold">
            A new script has landed on your desk.
          </p>
          <p className="text-sm text-amber-700 mt-1">
            Swipe right to accept • Swipe left to decline
          </p>
        </motion.div>

        {/* Script cards with swipe support */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {currentScript && (
              <motion.div
                key={currentScript.id}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onDragEnd={(e, info) => handleDragEnd(e, info, currentScript.id)}
                whileDrag={{ scale: 1.05, rotate: info => info.offset.x / 20 }}
              >
                <ScriptCard
                  script={currentScript}
                  onAccept={() => handleAccept(currentScript.id)}
                  onReject={() => handleReject(currentScript.id)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Script counter - Mobile friendly */}
          <div className="text-center text-sm text-amber-800">
            Script {currentIndex + 1} of {currentScripts.length}
          </div>
        </div>

        {/* Warning banner with fade in */}
        {currentScripts.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-amber-200 border-4 border-amber-800 rounded-lg p-4 shadow-[0_4px_0_rgba(120,53,15,0.3)] max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <p className="text-amber-900 font-bold">
                Refusing too many scripts cools your stardom.
              </p>
            </div>
          </motion.div>
        )}

        {/* Career progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-100 to-pink-100 border-3 border-purple-600 rounded-lg p-4 max-w-2xl mx-auto"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-purple-900">CAREER PROGRESS</span>
            <span className="text-xs text-purple-700">Fame: {fame}/100</span>
          </div>
          <div className="h-3 bg-purple-200 rounded-full overflow-hidden border-2 border-purple-700">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${fame}%` }}
              transition={{ duration: 1, delay: 0.8 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            />
          </div>
          <div className="mt-2 text-xs text-purple-700 text-center">
            {getProgressMessage(fame)}
          </div>
        </motion.div>
      </div>
    </>
  );
}

function getProgressMessage(fame: number): string {
  if (fame < 20) return "Keep taking roles to build your reputation";
  if (fame < 50) return "You're gaining recognition in the industry";
  if (fame < 75) return "You're becoming a household name";
  return "You're at the peak of stardom!";
}