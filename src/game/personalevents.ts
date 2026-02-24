// src/game/personalEvents.ts

import type { PersonalEvent } from './types';

export const PERSONAL_EVENTS: PersonalEvent[] = [
  {
    title: 'Private Photos Leaked!',
    description: 'A paparazzi has leaked your vacation photos online. The media is in a frenzy — your phone won\'t stop buzzing.',
    emoji: '📸',
    choices: [
      { label: '🙏 Issue a Public Apology', fameChange: -10, mentalHealthChange: -15, publicImageChange: 5,
        consequence: 'You apologized publicly. Reactions were mixed, but at least you controlled the narrative.' },
      { label: '🤐 Stay Silent and Let It Pass', fameChange: -5, mentalHealthChange: -10,
        consequence: 'You stayed quiet. The story fades in a week, but people remember.' },
    ],
  },
  {
    title: 'Sparks on Set!',
    description: 'You and your co-star have undeniable chemistry — and the crew has definitely noticed.',
    emoji: '💕',
    choices: [
      { label: '💑 Ask Them Out', mentalHealthChange: 15, publicImageChange: 5, fameChange: 8,
        consequence: 'You took the leap. You\'re now dating secretly — and happier than you\'ve been in years.' },
      { label: '😊 Stay Professional', mentalHealthChange: -5,
        consequence: 'You kept it professional. It was the sensible choice. Mostly.' },
    ],
  },
  {
    title: 'Collapse on Set!',
    description: 'The burnout finally caught up with you. You collapsed on set today. The director sent everyone home.',
    emoji: '😵',
    choices: [
      { label: '🏠 Take a 6-Month Break', wealthChange: -100, mentalHealthChange: 50, burnoutChange: -80, fameChange: -15,
        consequence: 'You stepped away completely. It cost you financially, but you feel human again.' },
      { label: '💊 Push Through With Medication', mentalHealthChange: -40, burnoutChange: 30, fameChange: 5,
        consequence: 'You pushed through. The film wrapped. At what cost, you\'re not yet sure.' },
    ],
  },
  {
    title: 'Journalist Wants Your Story',
    description: 'A respected journalist wants to write an in-depth profile on you. This could shape your public image for years.',
    emoji: '📰',
    choices: [
      { label: '🎤 Give a Candid Interview', fameChange: 15, publicImageChange: 20, mentalHealthChange: -5,
        consequence: 'Your honesty resonated deeply with the public. A new wave of fans found you.' },
      { label: '🚫 Decline — Stay Mysterious', fameChange: -5, publicImageChange: 10,
        consequence: 'You declined. Some say the mystery makes you more intriguing.' },
    ],
  },
  {
    title: 'Rivalry on Set',
    description: 'Your co-star has been openly undermining you in interviews. The crew has split into factions.',
    emoji: '⚔️',
    choices: [
      { label: '💬 Confront Them Directly', fameChange: 10, mentalHealthChange: -20, publicImageChange: -5,
        consequence: 'You had it out backstage. The air is cleared, but the tension lingers.' },
      { label: '🎭 Rise Above It Publicly', fameChange: 20, mentalHealthChange: -10, publicImageChange: 15,
        consequence: 'You took the high road in every interview. The public noticed your class.' },
    ],
  },
  {
    title: 'Fan Mob Outside Your Home!',
    description: 'A crowd of fans has gathered outside your building. Security is overwhelmed. You haven\'t slept properly in two days.',
    emoji: '🏠',
    choices: [
      { label: '👋 Go Out and Meet the Fans', fameChange: 15, mentalHealthChange: -20, publicImageChange: 20,
        consequence: 'You spent two hours with fans. They\'ll never forget it. Neither will you.' },
      { label: '🚗 Quietly Leave Through the Basement', fameChange: -5, mentalHealthChange: 10,
        consequence: 'You slipped away. Rest was more important than optics today.' },
    ],
  },
];

export function getRandomEvent(excludeTitle?: string | null): PersonalEvent {
  const available = excludeTitle
    ? PERSONAL_EVENTS.filter(e => e.title !== excludeTitle)
    : PERSONAL_EVENTS;
  return available[Math.floor(Math.random() * available.length)];
}
