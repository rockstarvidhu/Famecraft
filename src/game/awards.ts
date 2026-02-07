// src/game/awards.ts

import type { GameState } from './types';

export type AwardBody = 'Filmfare' | 'IIFA' | 'National' | 'Critics' | 'ScreenAwards';
export type AwardCategory = 'BestActor' | 'BestFilm' | 'Critics' | 'Popular';

export interface AwardNomination {
  id: string;
  body: AwardBody;
  category: AwardCategory;
  filmTitle: string;
  year: number;
  nominees: string[]; // Other nominees
  winProbability: number; // 0-100
}

export interface AwardCeremony {
  body: AwardBody;
  bodyName: string;
  year: number;
  month: string;
  nominations: AwardNomination[];
  prestige: number;
}

const AWARD_BODIES = {
  Filmfare: { name: 'Filmfare Awards', prestige: 100, month: 'March', minCritics: 60, minAudience: 70 },
  IIFA: { name: 'IIFA Awards', prestige: 80, month: 'June', minCritics: 55, minAudience: 75 },
  National: { name: 'National Film Awards', prestige: 120, month: 'April', minCritics: 80, minAudience: 60 },
  Critics: { name: 'Critics Choice Awards', prestige: 70, month: 'January', minCritics: 75, minAudience: 50 },
  ScreenAwards: { name: 'Star Screen Awards', prestige: 60, month: 'December', minCritics: 50, minAudience: 70 },
};

const RIVAL_ACTORS = [
  'Shah Rukh Khan', 'Ranbir Kapoor', 'Vicky Kaushal', 'Ranveer Singh',
  'Ayushmann Khurrana', 'Rajkummar Rao', 'Kartik Aaryan', 'Varun Dhawan',
];

const RIVAL_FILMS = [
  'Jawan', 'Animal', 'Pathaan', '12th Fail', 'Brahmastra',
  'Sam Bahadur', 'Rocky Aur Rani', 'Gadar 2', 'OMG 2',
];

export function generateAwardNominations(state: GameState): AwardCeremony[] {
  const ceremonies: AwardCeremony[] = [];
  const previousYear = state.currentYear - 1;
  
  // Get eligible films from previous year
  const eligibleFilms = state.history.filter(f => f.year === previousYear);
  
  if (eligibleFilms.length === 0) return [];

  // Check each award body
  Object.entries(AWARD_BODIES).forEach(([bodyKey, bodyConfig]) => {
    const body = bodyKey as AwardBody;
    const nominations: AwardNomination[] = [];

    eligibleFilms.forEach(film => {
      const { outcome } = film;
      
      // Best Actor nomination
      if (outcome.criticsScore >= bodyConfig.minCritics &&
          outcome.audienceScore >= bodyConfig.minAudience) {
        
        // Calculate win probability
        const baseWin = 
          (outcome.criticsScore * 0.35) +
          (outcome.audienceScore * 0.25) +
          (outcome.boxOfficeMultiplier * 15);
        
        nominations.push({
          id: `${body}-BestActor-${previousYear}-${film.filmTitle}`,
          body,
          category: 'BestActor',
          filmTitle: film.filmTitle,
          year: previousYear,
          nominees: getRandomActors(4),
          winProbability: Math.min(90, Math.max(10, baseWin)),
        });
      }

      // Best Film nomination (if exceptional)
      if (outcome.criticsScore >= 75 && outcome.boxOfficeMultiplier >= 1.5) {
        nominations.push({
          id: `${body}-BestFilm-${previousYear}-${film.filmTitle}`,
          body,
          category: 'BestFilm',
          filmTitle: film.filmTitle,
          year: previousYear,
          nominees: getRandomFilms(4),
          winProbability: Math.min(85, outcome.criticsScore * 0.8),
        });
      }
    });

    if (nominations.length > 0) {
      ceremonies.push({
        body,
        bodyName: bodyConfig.name,
        year: state.currentYear,
        month: bodyConfig.month,
        nominations,
        prestige: bodyConfig.prestige,
      });
    }
  });

  return ceremonies.sort((a, b) => b.prestige - a.prestige);
}

function getRandomActors(count: number): string[] {
  return [...RIVAL_ACTORS].sort(() => Math.random() - 0.5).slice(0, count);
}

function getRandomFilms(count: number): string[] {
  return [...RIVAL_FILMS].sort(() => Math.random() - 0.5).slice(0, count);
}

export function simulateAwardWin(nomination: AwardNomination): boolean {
  return Math.random() * 100 < nomination.winProbability;
}

export function getPrestigeBonus(body: AwardBody, category: AwardCategory): number {
  const basePrestige = AWARD_BODIES[body].prestige;
  const multiplier = category === 'BestFilm' ? 1.2 : 1.0;
  return Math.round(basePrestige * multiplier / 10); // Fame points
}

// Campaign to increase win chance
export interface CampaignOption {
  cost: number;
  boost: number;
  label: string;
}

export const CAMPAIGN_OPTIONS: CampaignOption[] = [
  { cost: 0, boost: 0, label: 'No Campaign' },
  { cost: 20, boost: 10, label: 'Basic PR' },
  { cost: 50, boost: 20, label: 'Full Campaign' },
  { cost: 100, boost: 30, label: 'Aggressive Lobbying' },
];

export function applyCampaign(nomination: AwardNomination, campaign: CampaignOption): AwardNomination {
  return {
    ...nomination,
    winProbability: Math.min(95, nomination.winProbability + campaign.boost),
  };
}