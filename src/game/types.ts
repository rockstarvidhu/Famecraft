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

export interface Script {
  id: string;
  title: string;
  genre: Genre;
  certification: Certification;
  synopsis: string;
  directorReputation: number; // 0-100
  coStarPopularity: number; // 0-100
  musicDirectorPopularity: number; // 0-100
  riskProfile: RiskProfile;
  payment: number; // in lakhs
}

export interface FilmOutcome {
  boxOfficeMultiplier: number; // 0.5 = flop, 1.5 = hit, 3.0 = blockbuster
  criticsScore: number; // 0-100
  audienceScore: number; // 0-100
  fameChange: number;
  wealthChange: number;
  mentalHealthChange: number;
}

export interface GameState {
  // Core stats
  age: number;
  careerPhase: CareerPhase;
  fame: number; // 0-100
  wealth: number; // in lakhs
  mentalHealth: number; // 0-100
  burnout: number; // 0-100
  fanBase: number; // 0-100
  
  // Current state
  currentYear: number;
  currentScripts: Script[];
  filmsCompleted: number;
  
  // History
  history: {
    year: number;
    filmTitle: string;
    outcome: FilmOutcome;
  }[];
}