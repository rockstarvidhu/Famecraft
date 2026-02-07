// src/game/types.ts

export type Genre = 
  | 'Action'
  | 'Romance'
  | 'Drama'
  | 'Comedy'
  | 'Thriller'
  | 'Horror'
  | 'Social'
  | 'Biopic';

export type Certification = 'U' | 'U-A' | 'A';

export type RiskProfile = 'Safe' | 'Balanced' | 'Risky';

export type CareerPhase = 
  | 'Newcomer'
  | 'Rising Star'
  | 'Established'
  | 'Superstar'
  | 'Veteran';

// The different screens available in the UI
export type GameScreen = 'scripts' | 'filmRelease' | 'event';

export interface Script {
  id: string;
  title: string;
  genre: Genre;
  synopsis: string;
  directorReputation: number; // 0-100
  coStarPopularity: number; // 0-100
  musicDirectorPopularity: number; // 0-100 - Required by engine.ts
  payment: number; // In lakhs
  certification: Certification;
  riskProfile: RiskProfile;
}

export interface FilmOutcome {
  boxOfficeMultiplier: number;
  criticsScore: number; // 0-100
  audienceScore: number; // 0-100
  fameChange: number;
  wealthChange: number;
  mentalHealthChange: number;
}

export interface FilmHistory {
  year: number;
  filmTitle: string;
  outcome: FilmOutcome;
}

// Award tracking
export interface Award {
  body: string;
  category: string;
  year: number;
  filmTitle: string;
}

// Endorsement tracking
export interface ActiveEndorsement {
  endorsementId: string;
  startYear: number;
  yearsRemaining: number;
}

// Personal Life Event structure
export interface PersonalEvent {
  id: string;
  title: string;
  description: string;
  category: 'Scandal' | 'Romance' | 'Health' | 'Family' | 'Controversy';
  options: {
    label: string;
    impact: {
      fame?: number;
      wealth?: number;
      mentalHealth?: number;
      publicImage?: number;
    };
  }[];
}

export interface GameState {
  // Player Info
  currentYear: number;
  age: number;
  
  // Stats
  fame: number; // 0-100
  wealth: number; // In lakhs
  mentalHealth: number; // 0-100
  burnout: number; // 0-100
  publicImage: number; // 0-100
  
  // Career
  careerPhase: CareerPhase;
  filmsCompleted: number;
  history: FilmHistory[];
  
  // Current State
  currentScripts: Script[];
  currentScreen: GameScreen; // Track the active UI screen
  currentEvent: PersonalEvent | null; // The event currently being displayed
  
  // Awards
  awardsWon: Award[];
  totalAwards: number;
  
  // Endorsements
  activeEndorsements: ActiveEndorsement[];
  endorsementIncome: number;
  
  // Agent
  currentAgent: string;
  agentHiredYear: number;
  
  // Personal Events tracking
  eventsThisYear: number;
  lastEventId: string | null;
}