// Key additions to GameState in types.ts:
interface GameState {
    // ... existing fields
    filmsInProgress: {
      scriptId: string;
      title: string;
      progress: number; // 0-100
      releaseMonth: number; // 1-12
    }[];
    maxFilmsPerYear: number; // Based on career phase
  }
  
  // In constants.ts:
  export const FILMS_PER_YEAR_LIMIT = {
    Newcomer: 1,
    'Rising Star': 2,
    Established: 3,
    Superstar: 3,
    Veteran: 2,
  };