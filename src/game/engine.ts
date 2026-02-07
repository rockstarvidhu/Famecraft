// src/game/engine.ts
import type { Script, FilmOutcome, GameState } from './types';
import { GENRE_TRAITS } from './constants';

export function simulateFilmOutcome(script: Script, state: GameState): FilmOutcome {
  const genreTrait = GENRE_TRAITS[script.genre];
  
  const directorFactor = script.directorReputation / 100;
  const coStarFactor = script.coStarPopularity / 100;
  const fameFactor = state.fame / 100;
  
  const riskMultiplier = script.riskProfile === 'Safe' ? 0.8 : script.riskProfile === 'Balanced' ? 1.0 : 1.3;
  const luck = 0.7 + Math.random() * 0.6;
  
  // Adjusted calculation without musicFactor
  const boxOfficeBase = (directorFactor + coStarFactor + fameFactor) / 3;
  const boxOfficeMultiplier = boxOfficeBase * riskMultiplier * luck;
  
  const criticsScore = Math.round((directorFactor * 60 + genreTrait.criticsWeight * 40) * luck);
  const audienceScore = Math.round((coStarFactor * 60 + fameFactor * 40) * luck);
  
  return {
    boxOfficeMultiplier,
    criticsScore: Math.min(100, criticsScore),
    audienceScore: Math.min(100, audienceScore),
    fameChange: boxOfficeMultiplier > 1.5 ? 10 : boxOfficeMultiplier > 1.0 ? 5 : -5,
    wealthChange: Math.round(script.payment * boxOfficeMultiplier),
    mentalHealthChange: boxOfficeMultiplier > 1.5 ? 5 : boxOfficeMultiplier < 0.8 ? -15 : -5,
  };
}