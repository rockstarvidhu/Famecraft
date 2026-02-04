import type { CareerPhase } from './types';

export const INITIAL_STATE = {
  age: 22,
  careerPhase: 'Newcomer' as CareerPhase,
  fame: 5,
  wealth: 50, // 50 lakhs starting
  mentalHealth: 80,
  burnout: 10,
  fanBase: 2,
  currentYear: 2024,
  currentScripts: [],
  filmsCompleted: 0,
  history: [],
};

export const CAREER_PHASE_THRESHOLDS = {
  Newcomer: { minFame: 0, minFilms: 0 },
  'Rising Star': { minFame: 20, minFilms: 3 },
  Established: { minFame: 50, minFilms: 8 },
  Superstar: { minFame: 75, minFilms: 15 },
  Veteran: { minFame: 60, minFilms: 25 },
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

export const INDIAN_FILM_TITLES = {
  prefixes: ['Mere', 'Dil', 'Pyaar', 'Zindagi', 'Rang', 'Kal', 'Aaj'],
  suffixes: ['Ka Safar', 'Ki Kahani', 'Aur Pyaar', 'Ho Gaya', 'Se Pehle'],
  single: ['Pathaan', 'Jawan', 'Dunki', 'Fighter', 'Singham', 'Raanjhanaa'],
};
