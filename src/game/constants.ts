// src/game/constants.ts - COMPLETE AND CORRECT

import type { GameState } from './types';

export const INITIAL_STATE: GameState = {
  // Player Info
  currentYear: 2024,
  age: 22,
  
  // Stats
  fame: 5,
  wealth: 50,
  mentalHealth: 80,
  burnout: 10,
  publicImage: 50,
  
  // Career
  careerPhase: 'Newcomer',
  filmsCompleted: 0,
  history: [],
  
  // Current State
  currentScripts: [],
  
  // Awards
  awardsWon: [],
  totalAwards: 0,
  
  // Endorsements
  activeEndorsements: [],
  endorsementIncome: 0,
  
  // Agent
  currentAgent: 'rookie',
  agentHiredYear: 2024,
  
  // Personal Events
  eventsThisYear: 0,
  lastEventId: null,
};

export const CAREER_PHASE_THRESHOLDS = {
  'Rising Star': { fame: 20, films: 3 },
  'Established': { fame: 50, films: 8 },
  'Superstar': { fame: 75, films: 15 },
  'Veteran': { fame: 30, films: 25 },
};

export const GENRE_TRAITS = {
  Action: { baseRisk: 0.6, famePotential: 0.8, criticsWeight: 0.4 },
  Romance: { baseRisk: 0.3, famePotential: 0.6, criticsWeight: 0.5 },
  Drama: { baseRisk: 0.4, famePotential: 0.7, criticsWeight: 0.8 },
  Comedy: { baseRisk: 0.5, famePotential: 0.7, criticsWeight: 0.5 },
  Thriller: { baseRisk: 0.6, famePotential: 0.7, criticsWeight: 0.7 },
  Horror: { baseRisk: 0.7, famePotential: 0.5, criticsWeight: 0.4 },
  Social: { baseRisk: 0.8, famePotential: 0.6, criticsWeight: 0.9 },
  Biopic: { baseRisk: 0.5, famePotential: 0.8, criticsWeight: 0.8 },
};