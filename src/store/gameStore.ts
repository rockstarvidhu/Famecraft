// src/store/gameStore.ts - COMPLETE WITH ALL PART 1 FEATURES

import { create } from 'zustand';
import type { GameState } from '../game/types';
import { INITIAL_STATE } from '../game/constants';
import { generateScripts } from '../game/scriptGenerator';
import { simulateFilmOutcome } from '../game/engine';

// Type for all possible screens
type GameScreen = 
  | 'scripts' 
  | 'filmRelease' 
  | 'personalEvent'
  | 'awardCeremony'
  | 'endorsementOffer';

interface GameStore extends GameState {
  // UI State
  currentScreen: GameScreen;
  setCurrentScreen: (screen: GameScreen) => void;
  
  // Personal Events
  currentEvent: any | null;
  handleEventChoice: (choice: any) => void;
  
  // Awards
  currentCeremony: any | null;
  completeAwardCeremony: (won: boolean, speechIndex?: number) => void;
  
  // Endorsements
  currentEndorsement: any | null;
  acceptEndorsement: (endorsement: any) => void;
  rejectEndorsement: () => void;
  
  // Core Actions
  generateNewScripts: () => void;
  acceptScript: (scriptId: string) => void;
  rejectScript: (scriptId: string) => void;
  advanceYear: () => void;
  resetGame: () => void;
  updateCareerPhase: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial State - Existing + New Fields
  ...INITIAL_STATE,
  currentScreen: 'scripts',
  
  // NEW: Personal Events
  eventsThisYear: 0,
  publicImage: 50,
  lastEventId: null,
  currentEvent: null,
  
  // NEW: Awards
  awardsWon: [],
  totalAwards: 0,
  currentCeremony: null,
  
  // NEW: Endorsements
  activeEndorsements: [],
  endorsementIncome: 0,
  currentEndorsement: null,
  
  // NEW: Agent
  currentAgent: 'rookie',
  agentHiredYear: 2024,

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
      currentScreen: 'filmRelease',
    });

    // Check career phase progression
    get().updateCareerPhase();
  },

  rejectScript: (scriptId: string) => {
    const state = get();
    const remainingScripts = state.currentScripts.filter(s => s.id !== scriptId);
    
    set({
      currentScripts: remainingScripts,
      fame: Math.max(0, state.fame - 1),
    });

    if (remainingScripts.length === 0) {
      setTimeout(() => get().advanceYear(), 1000);
    }
  },

  advanceYear: () => {
    const state = get();
    
    // Calculate endorsement income
    const endorsementEarnings = state.activeEndorsements.reduce((total, e) => {
      // You'll need to import ENDORSEMENTS and find the matching one
      // For now, simplified version:
      return total;
    }, 0);
    
    // Age endorsements
    const updatedEndorsements = state.activeEndorsements
      .map(e => ({ ...e, yearsRemaining: e.yearsRemaining - 1 }))
      .filter(e => e.yearsRemaining > 0);
    
    set({
      currentYear: state.currentYear + 1,
      age: state.age + 1,
      wealth: state.wealth + endorsementEarnings,
      activeEndorsements: updatedEndorsements,
      burnout: Math.max(0, state.burnout - 5),
      mentalHealth: Math.min(100, state.mentalHealth + 3),
      eventsThisYear: 0,
    });
    
    // For now, just generate scripts
    // You can add award/event/endorsement checks here later
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

  // NEW: Personal Events Handler
  handleEventChoice: (choice) => {
    const state = get();
    
    set({
      fame: Math.max(0, Math.min(100, state.fame + (choice.fameChange || 0))),
      wealth: state.wealth + (choice.wealthChange || 0),
      mentalHealth: Math.max(0, Math.min(100, state.mentalHealth + (choice.mentalHealthChange || 0))),
      burnout: Math.max(0, Math.min(100, state.burnout + (choice.burnoutChange || 0))),
      publicImage: Math.max(0, Math.min(100, state.publicImage + (choice.publicImageChange || 0))),
      currentEvent: null,
    });
    
    get().generateNewScripts();
  },

  // NEW: Award Ceremony Handler
  completeAwardCeremony: (won, speechIndex) => {
    const state = get();
    const ceremony = state.currentCeremony;
    if (!ceremony) return;
    
    if (won) {
      // Base prestige bonus
      const prestigeBonus = 20; // Simplified, you can calculate from ceremony.prestige
      
      // Speech bonuses
      const speechBonuses = [5, 10, 8]; // Humble, Emotional, Bold
      const extraFame = speechIndex !== undefined ? speechBonuses[speechIndex] : 5;
      
      set({
        fame: Math.min(100, state.fame + prestigeBonus + extraFame),
        totalAwards: state.totalAwards + 1,
        currentCeremony: null,
      });
    } else {
      // Loss reactions
      const reactionBonuses = [5, -10]; // Graceful, Disappointed
      const fameChange = speechIndex !== undefined ? reactionBonuses[speechIndex] : 0;
      
      set({
        fame: Math.max(0, state.fame + fameChange),
        currentCeremony: null,
      });
    }
    
    get().generateNewScripts();
  },

  // NEW: Endorsement Handlers
  acceptEndorsement: (endorsement) => {
    const state = get();
    
    set({
      activeEndorsements: [...state.activeEndorsements, {
        endorsementId: endorsement.id,
        startYear: state.currentYear,
        yearsRemaining: endorsement.duration,
      }],
      endorsementIncome: state.endorsementIncome + (endorsement.annualPayment || 0),
      fame: Math.min(100, state.fame + ((endorsement.benefits?.fameBoost) || 0)),
      publicImage: Math.min(100, state.publicImage + ((endorsement.benefits?.imageBonus) || 0)),
      currentEndorsement: null,
    });
    
    get().generateNewScripts();
  },

  rejectEndorsement: () => {
    set({ currentEndorsement: null });
    get().generateNewScripts();
  },

  resetGame: () => {
    set({ 
      ...INITIAL_STATE, 
      currentScreen: 'scripts',
      eventsThisYear: 0,
      publicImage: 50,
      lastEventId: null,
      currentEvent: null,
      awardsWon: [],
      totalAwards: 0,
      currentCeremony: null,
      activeEndorsements: [],
      endorsementIncome: 0,
      currentEndorsement: null,
      currentAgent: 'rookie',
      agentHiredYear: 2024,
    });
    get().generateNewScripts();
  },
}));