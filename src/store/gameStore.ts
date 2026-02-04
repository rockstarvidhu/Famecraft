import { create } from 'zustand';
import type { GameState, Script } from '../game/types';
import { INITIAL_STATE, CAREER_PHASE_THRESHOLDS } from '../game/constants';
import { generateScripts } from '../game/scriptGenerator';
import { simulateFilmOutcome } from '../game/engine';

type GameScreen = 'scripts' | 'filmRelease';

interface GameStore extends GameState {
  // UI State
  currentScreen: GameScreen;
  setCurrentScreen: (screen: GameScreen) => void;
  
  // Actions
  generateNewScripts: () => void;
  acceptScript: (scriptId: string) => void;
  rejectScript: (scriptId: string) => void;
  advanceYear: () => void;
  resetGame: () => void;
  updateCareerPhase: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  currentScreen: 'scripts',

  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  generateNewScripts: () => {
    const state = get();
    const scripts = generateScripts(state.careerPhase, state.fame);
    set({ currentScripts: scripts, currentScreen: 'scripts' });
  },

  acceptScript: (scriptId: string) => {
    const state = get();
    const script = state.currentScripts.find(s => s.id === scriptId);
    
    if (!script) return;

    // Simulate outcome
    const outcome = simulateFilmOutcome(script, state);
    
    // Update state
    set({
      fame: Math.max(0, Math.min(100, state.fame + outcome.fameChange)),
      wealth: state.wealth + outcome.wealthChange,
      mentalHealth: Math.max(0, Math.min(100, state.mentalHealth + outcome.mentalHealthChange)),
      burnout: Math.max(0, Math.min(100, state.burnout + 10)),
      filmsCompleted: state.filmsCompleted + 1,
      history: [
        ...state.history,
        {
          year: state.currentYear,
          filmTitle: script.title,
          outcome,
        },
      ],
      currentScripts: [],
      currentScreen: 'filmRelease', // Show release screen
    });

    // Check career phase progression
    get().updateCareerPhase();
  },

  rejectScript: (scriptId: string) => {
    const state = get();
    const remainingScripts = state.currentScripts.filter(s => s.id !== scriptId);
    
    set({
      currentScripts: remainingScripts,
      // Small fame penalty for rejecting
      fame: Math.max(0, state.fame - 1),
    });

    // If all scripts rejected, advance year
    if (remainingScripts.length === 0) {
      setTimeout(() => get().advanceYear(), 1000);
    }
  },

  advanceYear: () => {
    const state = get();
    set({
      currentYear: state.currentYear + 1,
      age: state.age + 1,
      burnout: Math.max(0, state.burnout - 5), // Recover a bit each year
      mentalHealth: Math.min(100, state.mentalHealth + 3), // Slight recovery
    });
    
    // Generate new scripts for next year
    get().generateNewScripts();
  },

  updateCareerPhase: () => {
    const state = get();
    const { fame, filmsCompleted } = state;

    if (fame >= 75 && filmsCompleted >= 15) {
      set({ careerPhase: 'Superstar' });
    } else if (fame >= 50 && filmsCompleted >= 8) {
      set({ careerPhase: 'Established' });
    } else if (fame >= 20 && filmsCompleted >= 3) {
      set({ careerPhase: 'Rising Star' });
    } else if (filmsCompleted >= 25) {
      set({ careerPhase: 'Veteran' });
    }
  },

  resetGame: () => {
    set({ ...INITIAL_STATE, currentScreen: 'scripts' });
    get().generateNewScripts();
  },
}));