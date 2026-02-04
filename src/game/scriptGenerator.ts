import type { Script, CareerPhase, Genre, RiskProfile } from './types';
import { INDIAN_FILM_TITLES } from './constants';

const GENRES: Genre[] = ['Action', 'Romance', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Social', 'Biopic'];

function generateTitle(): string {
  const useCompound = Math.random() > 0.5;
  
  if (useCompound) {
    const prefix = INDIAN_FILM_TITLES.prefixes[Math.floor(Math.random() * INDIAN_FILM_TITLES.prefixes.length)];
    const suffix = INDIAN_FILM_TITLES.suffixes[Math.floor(Math.random() * INDIAN_FILM_TITLES.suffixes.length)];
    return `${prefix} ${suffix}`;
  } else {
    return INDIAN_FILM_TITLES.single[Math.floor(Math.random() * INDIAN_FILM_TITLES.single.length)];
  }
}

export function generateScripts(_careerPhase: CareerPhase, currentFame: number): Script[] {
  const scripts: Script[] = [];
  
  for (let i = 0; i < 3; i++) {
    const genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    const riskProfiles: RiskProfile[] = ['Safe', 'Balanced', 'Risky'];
    const riskProfile = riskProfiles[Math.floor(Math.random() * riskProfiles.length)];
    
    // Payment scales with fame
    const basePayment = 20;
    const payment = basePayment + (currentFame * 2);
    
    scripts.push({
      id: `script-${Date.now()}-${i}`,
      title: generateTitle(),
      genre,
      certification: genre === 'Horror' || genre === 'Thriller' ? 'A' : 'U-A',
      synopsis: `A ${genre.toLowerCase()} film with a ${riskProfile.toLowerCase()} approach to storytelling.`,
      directorReputation: 30 + Math.floor(Math.random() * 70),
      coStarPopularity: 20 + Math.floor(Math.random() * 80),
      musicDirectorPopularity: 40 + Math.floor(Math.random() * 60),
      riskProfile,
      payment: Math.round(payment),
    });
  }
  
  return scripts;
}