// src/game/scriptGenerator.ts

import type { Script, CareerPhase, Genre, Certification, RiskProfile } from './types';

const FILM_TITLES: Record<Genre, string[]> = {
  Action: [
    'Toofan', 'Sher Khan', 'Iron Fist', 'Phantom Strike', 'Blood and Steel',
    'The Last Warrior', 'Rage of the Tiger', 'Thunder Road', 'Veer',
  ],
  Romance: [
    'Dil Mera', 'Pyaar Ki Raah', 'Ek Mulaqat', 'Saathi', 'Dil Se Dil Tak',
    'Mohabbat', 'Tu Hi Meri Duniya', 'Pehli Nazar', 'Humsafar',
  ],
  Drama: [
    'The Verdict', 'Broken Mirrors', 'Aasman Se Girte', 'Zindagi',
    'The Long Road Home', 'Neeli Aankhein', 'Gehri Khaai', 'Andheron Mein',
  ],
  Comedy: [
    'Pagal Duniya', 'Ulta Pulta', 'Jugaad Junction', 'Nautanki',
    'Haste Raho', 'Dhoom Machao', 'Masti Ka Mausam', 'Comedy Express',
  ],
  Thriller: [
    'Shadow Protocol', 'The Mole', 'Dark Web', 'Double Cross',
    'Conspiracy', 'Raaz-e-Zindagi', 'Silent Witness', 'The Informant',
  ],
  Horror: [
    'Haunted Haveli', 'Bhoot Bangla', 'The Cursed Well', 'Dark Rituals',
    'Raat Ka Darr', 'Chudail', 'The Forgotten Temple', 'Kaali Raat',
  ],
  Social: [
    'Awaaz Uthao', 'Change Makers', 'The Revolution', 'Breaking Chains',
    'Haq Ki Ladai', 'Inquilab', 'Samaj ka Darpan', 'Naya Savera',
  ],
  Biopic: [
    'Legend', 'The Iron Will', 'Unbreakable', 'Born to Win',
    'Champion', 'The Last Stand', 'Immortal', 'Sahib',
  ],
};

const SYNOPSES: Record<Genre, string[]> = {
  Action: [
    'An ex-soldier uncovers a government conspiracy and must fight his way to the truth.',
    'A vigilante cop takes on a crime empire that has corrupted the entire city.',
    'Two rival warriors are forced to team up against a common enemy.',
  ],
  Romance: [
    'Two strangers meet on a train journey and slowly fall hopelessly in love.',
    'A musician and a doctor navigate their busy lives and growing feelings.',
    'Old flames reunite at a wedding, forcing them to confront unfinished business.',
  ],
  Drama: [
    'A working-class family faces a devastating crisis that tests every bond they have.',
    'A lawyer takes on an impossible case that challenges his own moral compass.',
    'A young woman returns to her village and uncovers long-buried secrets.',
  ],
  Comedy: [
    'Three bumbling friends accidentally get tangled in a heist gone hilariously wrong.',
    'A strict father tries desperately to sabotage his daughter\'s unconventional wedding.',
    'A small-town boy moves to Mumbai and navigates city life with comedic results.',
  ],
  Thriller: [
    'A journalist receives anonymous tips that lead her deep into a dangerous conspiracy.',
    'A forensic analyst discovers that the killer she\'s hunting may be someone she trusts.',
    'A witness to a murder goes into hiding, but the past refuses to stay buried.',
  ],
  Horror: [
    'A family moves into a sprawling old haveli — and begins experiencing the unthinkable.',
    'A group of friends spend a night in a supposedly cursed fort. Not all of them leave.',
    'A small mountain village is gripped by an ancient evil that awakens every decade.',
  ],
  Social: [
    'A schoolteacher in rural India fights to bring education to an entire generation.',
    'A young activist battles powerful corporations to protect her community\'s land.',
    'An ordinary man takes a stand against systemic corruption — and pays a heavy price.',
  ],
  Biopic: [
    'The extraordinary true story of a champion who defied every odd stacked against them.',
    'A visionary artist whose greatest struggle was not recognition, but acceptance.',
    'The untold story of a freedom fighter who history nearly forgot.',
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateScript(phase: CareerPhase, fame: number, index: number): Script {
  const genres: Genre[] = ['Action', 'Romance', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Social', 'Biopic'];
  const genre = pickRandom(genres);

  // Risk profile weighted by career phase
  const riskWeights: Record<CareerPhase, RiskProfile[]> = {
    Newcomer:     ['Safe', 'Safe', 'Balanced'],
    'Rising Star': ['Safe', 'Balanced', 'Balanced', 'Risky'],
    Established:  ['Balanced', 'Balanced', 'Risky'],
    Superstar:    ['Balanced', 'Risky', 'Risky'],
    Veteran:      ['Safe', 'Balanced', 'Risky'],
  };
  const riskProfile = pickRandom(riskWeights[phase]);

  // Payment scales with fame and risk
  const basePayment = 20 + Math.round(fame * 1.5);
  const riskMultiplier = { Safe: 0.8, Balanced: 1.0, Risky: 1.4 }[riskProfile];
  const payment = Math.round(basePayment * riskMultiplier * (0.8 + Math.random() * 0.4));

  // Director reputation
  const dirBase = { Safe: 40, Balanced: 60, Risky: 75 }[riskProfile];
  const directorReputation = Math.min(100, dirBase + Math.round(Math.random() * 30) - 10);

  // Co-star popularity
  const coStarPopularity = 20 + Math.round(Math.random() * 70);

  // Certification
  const certOptions: Record<RiskProfile, Certification[]> = {
    Safe:     ['U', 'U', 'U-A'],
    Balanced: ['U-A', 'U-A', 'A'],
    Risky:    ['U-A', 'A', 'A'],
  };
  const certification = pickRandom(certOptions[riskProfile]);

  const usedTitles = new Set<string>();
  let title = pickRandom(FILM_TITLES[genre]);
  // Avoid duplicate titles in same batch
  while (usedTitles.has(title) && usedTitles.size < FILM_TITLES[genre].length) {
    title = pickRandom(FILM_TITLES[genre]);
  }
  usedTitles.add(title);

  return {
    id: `script-${Date.now()}-${index}`,
    title,
    genre,
    synopsis: pickRandom(SYNOPSES[genre]),
    directorReputation,
    coStarPopularity,
    payment,
    certification,
    riskProfile,
  };
}

export function generateScripts(phase: CareerPhase, fame: number): Script[] {
  return [
    generateScript(phase, fame, 0),
    generateScript(phase, fame, 1),
    generateScript(phase, fame, 2),
  ];
}
