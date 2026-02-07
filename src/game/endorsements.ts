// src/game/endorsements.ts - FIXED

export interface Endorsement {
  id: string;
  brand: string;
  product: string;
  payment: number; // CHANGED from annualPayment
  duration: number;
  requirements: {
    minFame: number;
    imageType: string; // CHANGED from array to string for simplicity
  };
}

export const ENDORSEMENTS: Endorsement[] = [
  {
    id: 'swiss_watches',
    brand: 'Swiss Time Watches',
    product: 'Luxury Timepieces',
    payment: 100,
    duration: 3,
    requirements: {
      minFame: 50,
      imageType: 'glamorous',
    },
  },
  {
    id: 'tech_phone',
    brand: 'TechPhone India',
    product: 'Smartphones',
    payment: 200,
    duration: 2,
    requirements: {
      minFame: 60,
      imageType: 'youth',
    },
  },
  {
    id: 'soft_drink',
    brand: 'ThirstQuench Cola',
    product: 'Soft Drinks',
    payment: 150,
    duration: 4,
    requirements: {
      minFame: 40,
      imageType: 'wholesome',
    },
  },
  {
    id: 'luxury_car',
    brand: 'Premium Motors',
    product: 'Luxury Cars',
    payment: 250,
    duration: 3,
    requirements: {
      minFame: 70,
      imageType: 'glamorous',
    },
  },
  {
    id: 'fashion_brand',
    brand: 'Bollywood Fashion House',
    product: 'Designer Clothing',
    payment: 80,
    duration: 2,
    requirements: {
      minFame: 35,
      imageType: 'glamorous',
    },
  },
];

export function getRandomEndorsement(): Endorsement {
  return ENDORSEMENTS[Math.floor(Math.random() * ENDORSEMENTS.length)];
}