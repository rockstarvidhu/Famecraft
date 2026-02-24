// src/game/types.ts

export type Genre = 'Action' | 'Romance' | 'Drama' | 'Comedy' | 'Thriller' | 'Horror' | 'Social' | 'Biopic';
export type Certification = 'U' | 'U-A' | 'A';
export type RiskProfile = 'Safe' | 'Balanced' | 'Risky';
export type CareerPhase = 'Newcomer' | 'Rising Star' | 'Established' | 'Superstar' | 'Veteran';
export type AwardBody = 'Filmfare' | 'National' | 'IIFA' | 'Screen';
export type AwardCategory = 'BestActor' | 'BestActress' | 'BestFilm' | 'BestDirector';

// ADDED: Navigation type including the Title screen
export type GameScreen = 'title' | 'scripts' | 'filmRelease' | 'personalEvent' | 'awardCeremony' | 'endorsementOffer';

export interface Script {
  id: string;
  title: string;
  genre: Genre;
  synopsis: string;
  directorReputation: number;
  coStarPopularity: number;
  payment: number; 
  certification: Certification;
  riskProfile: RiskProfile;
}

export interface FilmOutcome {
  boxOfficeMultiplier: number;
  criticsScore: number;
  audienceScore: number;
  fameChange: number;
  wealthChange: number;
  mentalHealthChange: number;
}

export interface FilmRecord {
  year: number;
  filmTitle: string;
  outcome: FilmOutcome;
}

export interface AwardNomination {
  id: string;
  body: AwardBody;
  category: AwardCategory;
  filmTitle: string;
  year: number;
  nominees: string[];
  winProbability: number;
}

export interface AwardCeremony {
  body: AwardBody;
  bodyName: string;
  year: number;
  month: string;
  prestige: number;
  nominations: AwardNomination[];
}

export interface AwardWon {
  body: AwardBody;
  category: AwardCategory;
  year: number;
  filmTitle: string;
}

export interface EndorsementDeal {
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

export interface ActiveEndorsement {
  endorsementId: string;
  startYear: number;
  yearsRemaining: number;
}

export interface PersonalEventChoice {
  label: string;
  fameChange?: number;
  wealthChange?: number;
  mentalHealthChange?: number;
  burnoutChange?: number;
  publicImageChange?: number;
  consequence: string;
}

export interface PersonalEvent {
  title: string;
  description: string;
  emoji: string;
  choices: PersonalEventChoice[];
}

export interface GameState {
  fame: number;
  wealth: number;
  mentalHealth: number;
  burnout: number;
  publicImage: number;
  age: number;
  currentYear: number;
  careerPhase: CareerPhase;
  filmsCompleted: number;
  currentScripts: Script[];
  
  // Navigation & Active State
  currentScreen: GameScreen; 
  currentEvent: PersonalEvent | null;
  currentCeremony: AwardCeremony | null;
  currentEndorsement: EndorsementDeal | null;

  history: FilmRecord[];
  awardsWon: AwardWon[];
  totalAwards: number;
  activeEndorsements: ActiveEndorsement[];
  endorsementIncome: number;
  currentAgent: string;
  agentHiredYear: number;
  eventsThisYear: number;
  lastEventId: string | null;
}
