// src/lib/golf-logic.ts

export interface CalculationResult {
  grossScore: number;
  handicap: number;
  netScore: number;
  flight: 'A' | 'B' | 'C';
}

export const calculateGolfResult = (scores: number[], pars: number[]): CalculationResult => {
  let penaltyPoints = 0;
  let grossScore = 0;

  scores.forEach((score, i) => {
    // รวมคะแนน Gross
    grossScore += score;
    
    // คำนวณแต้มสำหรับ System 36
    const par = pars[i] || 4;
    const diff = score - par;

    if (diff >= 2) {
      penaltyPoints += 2;      // Double Bogey or worse
    } else if (diff === 1) {
      penaltyPoints += 1;      // Bogey
    }
    // Par หรือดีกว่า (Birdie/Eagle) = 0 แต้ม
  });

  const handicap = penaltyPoints;
  const netScore = grossScore - handicap;

  // แบ่ง Flight ตาม Handicap
  let flight: 'A' | 'B' | 'C' = 'C';
  if (handicap <= 12) {
    flight = 'A';
  } else if (handicap <= 18) {
    flight = 'B';
  } else {
    flight = 'C';
  }

  return { grossScore, handicap, netScore, flight };
};