// src/game/script  Generator.ts - COMPLETE FIX

import type { Script, Genre, CareerPhase, Certification, RiskProfile } from './types';

// All Indian film titles by genre - NO EXTERNAL IMPORTS NEEDED
const FILM_TITLES: Record<Genre, string[]> = {
  Action: [
    'Mumbai Nights', 'The Last Stand', 'Border Patrol', 'Warrior\'s Path',
    'Fists of Justice', 'Highway Hero', 'The Encounter', 'Gangster Wars',
    'Mission Kashmir', 'The Avenger', 'Street Fighter', 'Blood Brothers'
  ],
  Romance: [
    'Love in Paris', 'Dil Se', 'Eternal Promise', 'First Love',
    'Monsoon Romance', 'Heartbeat', 'Pyaar Ka Safar', 'Love Story',
    'Kabhi Khushi', 'Mohabbatein', 'Dilwale', 'Jab We Met'
  ],
  Drama: [
    'The Last Letter', 'Broken Dreams', 'Family Ties', 'The Journey',
    'Zindagi Gulzar Hai', 'Masaan', 'Court', 'The Lunchbox',
    'Piku', 'October', 'Ankhon Dekhi', 'Ship of Theseus'
  ],
  Comedy: [
    'Hera Pheri Returns', 'Golmaal Again', 'Welcome Back', 'Hungama House',
    'Dhamaal 3', 'Bhool Bhulaiyaa', 'Chup Chup Ke', 'De Dana Dan',
    'Phir Hera Pheri', 'Total Dhamaal', 'Andaz Apna Apna 2', 'Hulchul'
  ],
  Thriller: [
    'The Shadow', 'Silent Witness', 'Dark Secrets', 'The Chase',
    'Kahaani 2', 'Drishyam Returns', 'Talaash', 'Badla',
    'Ittefaq', 'A Wednesday Returns', 'Ugly Truth', 'Trapped'
  ],
  Horror: [
    'Haunted Mansion', 'The Conjuring House', 'Bhool Bhulaiyaa 3', 'Stree Returns',
    'Pari 2', 'Tumbbad Legacy', 'The Ghost', 'Raaz Reboot',
    '1920: Evil Returns', 'Ek Thi Daayan 2', 'Pizza Returns', 'Phobia 2'
  ],
  Social: [
    'The Revolution', 'Article 370', 'Pink Returns', 'Toilet Revolution',
    'Pad Man 2', 'Bala', 'Ujda Chaman', 'Shubh Mangal',
    'Jolly LLB 3', 'Newton Returns', 'Court 2', 'Jai Bhim'
  ],
  Biopic: [
    'The Legend', 'Rising Star', 'True Hero', 'Against All Odds',
    'Saina', 'Mary Kom Returns', 'Bhaag Milkha Bhaag 2', 'Dangal',
    'MS Dhoni: The Journey', 'Neerja 2', 'Sanju Returns', 'Thackeray'
  ],
};

const SETTINGS = [
  'contemporary Mumbai',
  'rural Punjab',
  'the heart of Delhi',
  'coastal Goa',
  'historic Rajasthan',
  'modern Bangalore',
  'the streets of Kolkata',
  'serene Kerala',
  'bustling Hyderabad',
  'picturesque Kashmir',
  'small-town India',
  'metropolitan Chennai'
];

const CERTIFICATIONS: Certification[] = ['U', 'U-A', 'A'];

export function generateScripts(careerPhase: CareerPhase, fame: number): Script[] {
  const scripts: Script[] = [];

  // Always generate 3 scripts
  for (let i = 0; i < 3; i++) {
    scripts.push(generateSingleScript(careerPhase, fame));
  }

  return scripts;
}

function generateSingleScript(careerPhase: CareerPhase, fame: number): Script {
  const genres: Genre[] = ['Action', 'Romance', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Social', 'Biopic'];
  const genre = genres[Math.floor(Math.random() * genres.length)];
  
  // Get titles for this genre
  const genreTitles = FILM_TITLES[genre];
  const title = genreTitles[Math.floor(Math.random() * genreTitles.length)];

  // Base stats influenced by career phase
  const baseDirectorRep = getBaseDirectorRep(careerPhase, fame);
  const baseCostarPop = getBaseCostarPop(careerPhase, fame);
  const payment = getPayment(careerPhase, fame);
  const riskProfile = determineRiskProfile();

  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];
  const certification = CERTIFICATIONS[Math.floor(Math.random() * CERTIFICATIONS.length)];

  return {
    id: `script-${Date.now()}-${Math.random()}`,
    title,
    genre,
    synopsis: `A ${genre.toLowerCase()} story set in ${setting}.`,
    directorReputation: baseDirectorRep,
    coStarPopularity: baseCostarPop,
    payment,
    certification,
    riskProfile,
    // NO musicDirectorPopularity - removed
  };
}

function getBaseDirectorRep(careerPhase: CareerPhase, fame: number): number {
  const base = {
    Newcomer: 40,
    'Rising Star': 55,
    Established: 70,
    Superstar: 85,
    Veteran: 75,
  };

  const phaseBase = base[careerPhase];
  const variance = Math.floor(Math.random() * 20) - 10; // -10 to +10
  return Math.max(30, Math.min(95, phaseBase + variance + Math.floor(fame * 0.2)));
}

function getBaseCostarPop(careerPhase: CareerPhase, fame: number): number {
  const base = {
    Newcomer: 35,
    'Rising Star': 50,
    Established: 65,
    Superstar: 80,
    Veteran: 70,
  };

  const phaseBase = base[careerPhase];
  const variance = Math.floor(Math.random() * 20) - 10;
  return Math.max(25, Math.min(95, phaseBase + variance + Math.floor(fame * 0.15)));
}

function getPayment(careerPhase: CareerPhase, fame: number): number {
  const base = {
    Newcomer: 30,
    'Rising Star': 60,
    Established: 120,
    Superstar: 200,
    Veteran: 150,
  };

  const phaseBase = base[careerPhase];
  const fameBonus = Math.floor(fame * 0.5);
  const variance = Math.floor(Math.random() * 30) - 15;
  
  return Math.max(20, phaseBase + fameBonus + variance);
}

function determineRiskProfile(): RiskProfile {
  const rand = Math.random();
  if (rand < 0.4) return 'Safe';
  if (rand < 0.8) return 'Balanced';
  return 'Risky';
}


