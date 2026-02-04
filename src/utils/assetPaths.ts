// Asset path helper - makes importing easier

export const PLAYER_SPRITES = {
    young: {
      neutral: '/assets/sprites/player/player-neutral-young.png',
      happy: '/assets/sprites/player/player-happy-young.png',
      sad: '/assets/sprites/player/player-sad-young.png',
      stressed: '/assets/sprites/player/player-stressed-young.png',
    },
    middle: {
      neutral: '/assets/sprites/player/player-neutral-middle.png',
    },
    veteran: {
      neutral: '/assets/sprites/player/player-neutral-veteran.png',
    },
  };
  
  export const COSTAR_PORTRAITS = [
    '/assets/sprites/costars/costar-female-glamorous.png',
    '/assets/sprites/costars/costar-male-formal.png',
    '/assets/sprites/costars/costar-female-urban.png',
    '/assets/sprites/costars/costar-male-character.png',
    '/assets/sprites/costars/costar-female-classic.png',
  ];
  
  export const DIRECTOR_PORTRAITS = [
    '/assets/sprites/directors/director-veteran-serious.png',
    '/assets/sprites/directors/director-young-indie.png',
    '/assets/sprites/directors/director-commercial.png',
    '/assets/sprites/directors/director-female-modern.png',
    '/assets/sprites/directors/director-classic-master.png',
  ];
  
  export const POSTER_BY_GENRE = {
    Action: '/assets/posters/poster-action-01.png',
    Romance: '/assets/posters/poster-romance-01.png',
    Drama: '/assets/posters/poster-drama-01.png',
    Comedy: '/assets/posters/poster-comedy-01.png',
    Thriller: '/assets/posters/poster-thriller-01.png',
    Horror: '/assets/posters/poster-horror-01.png',
    Social: '/assets/posters/poster-social-01.png',
    Biopic: '/assets/posters/poster-biopic-01.png',
  };
  
  export const UI_ICONS = {
    filmReel: '/assets/icons/ui/icon-film-reel.png',
    clapperboard: '/assets/icons/ui/icon-clapperboard.png',
    trophy: '/assets/icons/ui/icon-trophy.png',
    camera: '/assets/icons/ui/icon-camera.png',
    spotlight: '/assets/icons/ui/icon-spotlight.png',
    filmStrip: '/assets/icons/ui/icon-film-strip.png',
  };
  
  export const STATUS_ICONS = {
    heart: '/assets/icons/status/icon-heart.png',
    moneyBag: '/assets/icons/status/icon-money-bag.png',
    stressCloud: '/assets/icons/status/icon-stress-cloud.png',
    star: '/assets/icons/status/icon-star.png',
    brain: '/assets/icons/status/icon-brain.png',
  };
  
  export const CAREER_BADGES = {
    Newcomer: '/assets/icons/badges/badge-newcomer.png',
    'Rising Star': '/assets/icons/badges/badge-rising-star.png',
    Established: '/assets/icons/badges/badge-established.png',
    Superstar: '/assets/icons/badges/badge-superstar.png',
    Veteran: '/assets/icons/badges/badge-veteran.png',
  };
  
  // Helper functions to get random portraits
  export function getRandomCostar(): string {
    return COSTAR_PORTRAITS[Math.floor(Math.random() * COSTAR_PORTRAITS.length)];
  }
  
  export function getRandomDirector(): string {
    return DIRECTOR_PORTRAITS[Math.floor(Math.random() * DIRECTOR_PORTRAITS.length)];
  }
  
  // Helper to get player sprite based on age and mood
  export function getPlayerSprite(age: number, mentalHealth: number): string {
    const ageBracket = age < 30 ? 'young' : age < 45 ? 'middle' : 'veteran';
    
    if (ageBracket === 'young') {
      if (mentalHealth > 60) return PLAYER_SPRITES.young.happy;
      if (mentalHealth < 30) return PLAYER_SPRITES.young.sad;
      if (mentalHealth < 50) return PLAYER_SPRITES.young.stressed;
      return PLAYER_SPRITES.young.neutral;
    }
    
    return PLAYER_SPRITES[ageBracket].neutral;
  }