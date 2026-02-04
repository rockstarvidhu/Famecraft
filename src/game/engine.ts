import type { Script, FilmOutcome, GameState } from './types';
import { GENRE_TRAITS } from './constants';

export function simulateFilmOutcome(script: Script, state: GameState): FilmOutcome {
  const genreTrait = GENRE_TRAITS[script.genre];
  
  // Base calculation factors
  const directorFactor = script.directorReputation / 100;
  const coStarFactor = script.coStarPopularity / 100;
  const musicFactor = script.musicDirectorPopularity / 100;
  const fameFactor = state.fame / 100;
  
  // Risk affects variance
  const riskMultiplier = script.riskProfile === 'Safe' ? 0.8 : script.riskProfile === 'Balanced' ? 1.0 : 1.3;
  
  // Random factor
  const luck = 0.7 + Math.random() * 0.6; // 0.7 to 1.3
  
  // Box office calculation
  const boxOfficeBase = (directorFactor + coStarFactor + musicFactor + fameFactor) / 4;
  const boxOfficeMultiplier = boxOfficeBase * riskMultiplier * luck;
  
  // Critics vs Audience
  const criticsScore = Math.round((directorFactor * 60 + genreTrait.criticsWeight * 40) * luck);
  const audienceScore = Math.round((coStarFactor * 50 + musicFactor * 30 + fameFactor * 20) * luck);
  
  // Outcomes
  const fameChange = boxOfficeMultiplier > 1.5 ? 10 : boxOfficeMultiplier > 1.0 ? 5 : -5;
  const wealthChange = Math.round(script.payment * boxOfficeMultiplier);
  const mentalHealthChange = boxOfficeMultiplier > 1.5 ? 5 : boxOfficeMultiplier < 0.8 ? -15 : -5;
  
  return {
    boxOfficeMultiplier,
    criticsScore: Math.min(100, criticsScore),
    audienceScore: Math.min(100, audienceScore),
    fameChange,
    wealthChange,
    mentalHealthChange,
  };
}