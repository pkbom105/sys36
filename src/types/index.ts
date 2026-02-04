export interface ScoreEntry {
    _id?: string;
    playerName: string;
    scores: number[];
    coursePars: number[];
    grossScore: number;
    handicap: number;
    netScore: number;
    flight: 'A' | 'B' | 'C';
    createdAt: Date;
  }
  
  export interface CalculationResult {
    grossScore: number;
    handicap: number;
    netScore: number;
  }