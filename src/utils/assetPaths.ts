// src/utils/assetPaths.ts
import type { CareerPhase } from '../game/types';

const BASE = '/cinema-simulator';

export const PLAYER_SPRITES = {
  young: {
    neutral: `${BASE}/assets/sprites/player/player-neutral-young.png`,
    happy: `${BASE}/assets/sprites/player/player-happy-young.png`,
    sad: `${BASE}/assets/sprites/player/player-sad-young.png`,
    stressed: `${BASE}/assets/sprites/player/player-stressed-young.png`,
  },
  middle: {
    neutral: `${BASE}/assets/sprites/player/player-neutral-middle.png`,
  },
  veteran: {
    neutral: `${BASE}/assets/sprites/player/player-neutral-veteran.png`,
  },
};

const PHASE_TO_ASSET_KEY: Record<CareerPhase, keyof typeof PLAYER_SPRITES> = {
  'Newcomer': 'young',
  'Rising Star': 'young',
  'Established': 'middle',
  'Superstar': 'middle',
  'Veteran': 'veteran'
};

export function getPlayerSpriteByPhase(
  phase: CareerPhase, 
  mood: 'neutral' | 'happy' | 'sad' | 'stressed' = 'neutral'
): string {
  const category = PHASE_TO_ASSET_KEY[phase] || 'young';
  const sprites = PLAYER_SPRITES[category];
  return (sprites as any)[mood] || sprites.neutral;
}

export const COSTAR_PORTRAITS = [
  `${BASE}/assets/sprites/costars/costar-female-glamorous.png`,
  `${BASE}/assets/sprites/costars/costar-male-formal.png`,
  `${BASE}/assets/sprites/costars/costar-female-urban.png`,
  `${BASE}/assets/sprites/costars/costar-male-character.png`,
  `${BASE}/assets/sprites/costars/costar-female-classic.png`,
];

export const DIRECTOR_PORTRAITS = [
  `${BASE}/assets/sprites/directors/director-veteran-serious.png`,
  `${BASE}/assets/sprites/directors/director-young-indie.png`,
  `${BASE}/assets/sprites/directors/director-commercial.png`,
  `${BASE}/assets/sprites/directors/director-female-modern.png`,
  `${BASE}/assets/sprites/directors/director-classic-master.png`,
];

export const POSTER_BY_GENRE = {
  Action: `${BASE}/assets/posters/poster-action-01.png`,
  Romance: `${BASE}/assets/posters/poster-romance-01.png`,
  Drama: `${BASE}/assets/posters/poster-drama-01.png`,
  Comedy: `${BASE}/assets/posters/poster-comedy-01.png`,
  Thriller: `${BASE}/assets/posters/poster-thriller-01.png`,
  Horror: `${BASE}/assets/posters/poster-horror-01.png`,
  Social: `${BASE}/assets/posters/poster-social-01.png`,
  Biopic: `${BASE}/assets/posters/poster-biopic-01.png`,
};

export const UI_ICONS = {
  filmReel: `${BASE}/assets/icons/ui/icon-film-reel.png`,
  clapperboard: `${BASE}/assets/icons/ui/icon-clapperboard.png`,
  trophy: `${BASE}/assets/icons/ui/icon-trophy.png`,
  camera: `${BASE}/assets/icons/ui/icon-camera.png`,
  spotlight: `${BASE}/assets/icons/ui/icon-spotlight.png`,
  filmStrip: `${BASE}/assets/icons/ui/icon-film-strip.png`,
};

export const STATUS_ICONS = {
  heart: `${BASE}/assets/icons/status/icon-heart.png`,
  moneyBag: `${BASE}/assets/icons/status/icon-money-bag.png`,
  stressCloud: `${BASE}/assets/icons/status/icon-stress-cloud.png`,
  star: `${BASE}/assets/icons/status/icon-star.png`,
  brain: `${BASE}/assets/icons/status/icon-brain.png`,
};

export const CAREER_BADGES = {
  Newcomer: `${BASE}/assets/icons/badges/badge-newcomer.png`,
  'Rising Star': `${BASE}/assets/icons/badges/badge-rising-star.png`,
  Established: `${BASE}/assets/icons/badges/badge-established.png`,
  Superstar: `${BASE}/assets/icons/badges/badge-superstar.png`,
  Veteran: `${BASE}/assets/icons/badges/badge-veteran.png`,
};

export function getRandomCostar(): string {
  return COSTAR_PORTRAITS[Math.floor(Math.random() * COSTAR_PORTRAITS.length)];
}

export function getRandomDirector(): string {
  return DIRECTOR_PORTRAITS[Math.floor(Math.random() * DIRECTOR_PORTRAITS.length)];
}