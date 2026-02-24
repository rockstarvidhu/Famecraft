// src/store/gameStore.ts

import { create } from 'zustand';
import type { GameState, PersonalEvent, PersonalEventChoice, AwardCeremony, EndorsementDeal } from '../game/types';
import { INITIAL_STATE } from '../game/constants';
import { generateScripts } from '../game/scriptGenerator';
import { getRandomEvent } from '../game/personalevents';

type GameScreen =
  | 'title'
  | 'scripts'
  | 'filmRelease'
  | 'personalEvent'
  | 'awardCeremony'
  | 'endorsementOffer'
  | 'persona';

interface FilmOutcome {
  boxOfficeMultiplier: number;
  criticsScore: number;
  audienceScore: number;
  fameChange: number;
  wealthChange: number;
  mentalHealthChange: number;
}

interface GameStore {
  // Include all GameState properties
  fame: number;
  wealth: number;
  mentalHealth: number;
  burnout: number;
  publicImage: number;
  age: number;
  currentYear: number;
  careerPhase: import('../game/types').CareerPhase;
  filmsCompleted: number;
  currentScripts: import('../game/types').Script[];
  history: import('../game/types').FilmRecord[];
  awardsWon: import('../game/types').AwardWon[];
  totalAwards: number;
  activeEndorsements: import('../game/types').ActiveEndorsement[];
  endorsementIncome: number;
  currentAgent: string;
  agentHiredYear: number;
  eventsThisYear: number;
  lastEventId: string | null;

  // UI state (not in GameState)
  currentScreen: GameScreen;
  setCurrentScreen: (screen: GameScreen) => void;

  currentEvent: PersonalEvent | null;
  handleEventChoice: (choice: PersonalEventChoice) => void;

  currentCeremony: AwardCeremony | null;
  completeAwardCeremony: (won: boolean, speechIndex?: number) => void;

  currentEndorsement: EndorsementDeal | null;
  acceptEndorsement: (deal: EndorsementDeal) => void;
  rejectEndorsement: () => void;

  generateNewScripts: () => void;
  acceptScript: (scriptId: string) => void;
  rejectScript: (scriptId: string) => void;
  advanceYear: () => void;
  resetGame: () => void;
  updateCareerPhase: () => void;
}

function simulateFilmOutcome(script: any, state: any): FilmOutcome {
  const baseScore = 40 + (script.directorReputation * 0.3) + (script.coStarPopularity * 0.1);
  const variance = (Math.random() - 0.5) * 30;
  const criticsScore = Math.max(10, Math.min(100, Math.round(baseScore + variance)));
  const audienceScore = Math.max(10, Math.min(100, Math.round(baseScore + variance * 0.8 + 5)));

  const riskMultipliers: Record<string, number[]> = {
    Safe:     [0.8, 1.4],
    Balanced: [0.5, 2.2],
    Risky:    [0.2, 3.5],
  };
  const [minMult, maxMult] = riskMultipliers[script.riskProfile] ?? [0.5, 2.0];
  const boxOfficeMultiplier = minMult + Math.random() * (maxMult - minMult);

  const isHit = boxOfficeMultiplier >= 1.5;
  const isFlop = boxOfficeMultiplier < 0.8;

  const fameChange = isHit
    ? Math.round(8 + script.directorReputation * 0.1 + Math.random() * 5)
    : isFlop
    ? Math.round(-10 - Math.random() * 5)
    : Math.round(2 + Math.random() * 4);

  const wealthChange = Math.round(script.payment * boxOfficeMultiplier);
  const mentalHealthChange = isFlop ? -15 : isHit ? 5 : -5;

  return { boxOfficeMultiplier, criticsScore, audienceScore, fameChange, wealthChange, mentalHealthChange };
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  currentScreen: 'title',

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

  // ── Screen ────────────────────────────────────
  setCurrentScreen: (screen) => set({ currentScreen: screen }),

  // ── Scripts ───────────────────────────────────
  generateNewScripts: () => {
    const { careerPhase, fame } = get();
    const scripts = generateScripts(careerPhase, fame);
    set({ currentScripts: scripts, currentScreen: 'scripts' });
  },

  acceptScript: (scriptId) => {
    const state = get();
    const script = state.currentScripts.find(s => s.id === scriptId);
    if (!script) return;

    const outcome = simulateFilmOutcome(script, state);

    set({
      fame: Math.max(0, Math.min(100, state.fame + outcome.fameChange)),
      wealth: state.wealth + outcome.wealthChange,
      mentalHealth: Math.max(0, Math.min(100, state.mentalHealth + outcome.mentalHealthChange)),
      burnout: Math.max(0, Math.min(100, state.burnout + 10)),
      filmsCompleted: state.filmsCompleted + 1,
      history: [
        ...state.history,
        { year: state.currentYear, filmTitle: script.title, outcome },
      ],
      currentScripts: [],
      currentScreen: 'filmRelease',
    });

    get().updateCareerPhase();
  },

  rejectScript: (scriptId) => {
    const state = get();
    const remaining = state.currentScripts.filter(s => s.id !== scriptId);
    set({ currentScripts: remaining, fame: Math.max(0, state.fame - 1) });
    if (remaining.length === 0) {
      setTimeout(() => get().advanceYear(), 800);
    }
  },

  // ── Year Advance ──────────────────────────────
  advanceYear: () => {
    const state = get();

    // Endorsement income + age them
    const endorsementEarnings = state.activeEndorsements.length * 100;
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

    const newState = get();

    // 1. Check for award ceremony
    const prevYear = state.currentYear;
    const eligible = state.history.filter(f => f.year === prevYear);
    const qualifies = eligible.some(f => f.outcome.criticsScore >= 60 && f.outcome.audienceScore >= 70);

    if (eligible.length > 0 && qualifies && Math.random() < 0.35) {
      const film = eligible[0];
      set({
        currentCeremony: {
          body: 'Filmfare',
          bodyName: 'Filmfare Awards',
          year: newState.currentYear,
          month: 'March',
          prestige: 100,
          nominations: [{
            id: 'nom-1',
            body: 'Filmfare',
            category: 'BestActor',
            filmTitle: film.filmTitle,
            year: prevYear,
            nominees: ['Shah Rukh Khan', 'Ranbir Kapoor', 'Vicky Kaushal'],
            winProbability: Math.min(90, film.outcome.criticsScore * 0.85),
          }],
        },
        currentScreen: 'awardCeremony',
      });
      return;
    }

    // 2. Personal event (30% if fame > 15)
    if (Math.random() < 0.3 && newState.fame > 15) {
      const event = getRandomEvent(state.lastEventId);
      set({
        currentEvent: event,
        currentScreen: 'personalEvent',
        eventsThisYear: newState.eventsThisYear + 1,
        lastEventId: event.title,
      });
      return;
    }

    // 3. Endorsement offer (20% if fame > 30)
    if (Math.random() < 0.2 && newState.fame > 30) {
      set({
        currentEndorsement: {
          id: `deal-${Date.now()}`,
          brand: 'Swiss Time Watches',
          product: 'Luxury Timepieces',
          payment: 80 + Math.round(newState.fame * 1.5),
          duration: 2 + Math.floor(Math.random() * 3),
          requirements: { minFame: 30, imageType: 'glamorous' },
        },
        currentScreen: 'endorsementOffer',
      });
      return;
    }

    // Default → new scripts
    get().generateNewScripts();
  },

  // ── Personal Events ───────────────────────────
  handleEventChoice: (choice) => {
    const state = get();
    set({
      fame: Math.max(0, Math.min(100, state.fame + (choice.fameChange ?? 0))),
      wealth: state.wealth + (choice.wealthChange ?? 0),
      mentalHealth: Math.max(0, Math.min(100, state.mentalHealth + (choice.mentalHealthChange ?? 0))),
      burnout: Math.max(0, Math.min(100, state.burnout + (choice.burnoutChange ?? 0))),
      publicImage: Math.max(0, Math.min(100, state.publicImage + (choice.publicImageChange ?? 0))),
      currentEvent: null,
    });
    get().generateNewScripts();
  },

  // ── Awards ────────────────────────────────────
  completeAwardCeremony: (won, speechIndex) => {
    const state = get();
    const ceremony = state.currentCeremony;
    if (!ceremony) return;

    if (won) {
      const nomination = ceremony.nominations[0];
      const prestigeBonus = Math.round(ceremony.prestige / 10);
      const speechBonuses = [5, 12, 8];
      const extraFame = speechIndex !== undefined ? (speechBonuses[speechIndex] ?? 5) : 5;

      set({
        fame: Math.min(100, state.fame + prestigeBonus + extraFame),
        awardsWon: [
          ...state.awardsWon,
          { body: ceremony.body, category: nomination.category, year: ceremony.year, filmTitle: nomination.filmTitle },
        ],
        totalAwards: state.totalAwards + 1,
        currentCeremony: null,
      });
    } else {
      const reactionBonuses = [5, -8];
      const fameChange = speechIndex !== undefined ? (reactionBonuses[speechIndex] ?? 0) : 0;
      set({ fame: Math.max(0, state.fame + fameChange), currentCeremony: null });
    }

    get().generateNewScripts();
  },

  // ── Endorsements ──────────────────────────────
  acceptEndorsement: (deal) => {
    const state = get();
    set({
      activeEndorsements: [
        ...state.activeEndorsements,
        { endorsementId: deal.id, startYear: state.currentYear, yearsRemaining: deal.duration },
      ],
      endorsementIncome: state.endorsementIncome + deal.payment,
      fame: Math.min(100, state.fame + 5),
      publicImage: Math.min(100, state.publicImage + 10),
      currentEndorsement: null,
    });
    get().generateNewScripts();
  },

  rejectEndorsement: () => {
    set({ currentEndorsement: null });
    get().generateNewScripts();
  },

  // ── Career Phase ──────────────────────────────
  updateCareerPhase: () => {
    const { fame, filmsCompleted } = get();
    if (fame >= 75 && filmsCompleted >= 15)     set({ careerPhase: 'Superstar' });
    else if (fame >= 50 && filmsCompleted >= 8)  set({ careerPhase: 'Established' });
    else if (fame >= 20 && filmsCompleted >= 3)  set({ careerPhase: 'Rising Star' });
    else if (filmsCompleted >= 25)               set({ careerPhase: 'Veteran' });
  },

  // ── Reset ─────────────────────────────────────
  resetGame: () => {
    set({
      ...INITIAL_STATE,
      currentScreen: 'title',
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
  },
}));
