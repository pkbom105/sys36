"use client";
import React, { useState } from 'react';

interface Props {
  coursePars: number[];
  onSave: (scores: number[]) => void;
}

export const Scorecard: React.FC<Props> = ({ coursePars, onSave }) => {
  const [scores, setScores] = useState<number[]>(new Array(18).fill(0));

  const handleInputChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = parseInt(value) || 0;
    setScores(newScores);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="grid grid-cols-6 gap-2">
        {scores.map((s, i) => (
          <div key={i} className="flex flex-col">
            <label className="text-xs font-bold text-gray-500">Hole {i+1}</label>
            <input
              type="number"
              className="border p-2 rounded text-center focus:ring-2 focus:ring-green-500 outline-none"
              value={s || ''}
              onChange={(e) => handleInputChange(i, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button 
        onClick={() => onSave(scores)}
        className="w-full mt-4 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
      >
        บันทึกคะแนน
      </button>
    </div>
  );
};