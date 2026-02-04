// src/app/leaderboard/page.tsx

export const dynamic = 'force-dynamic';

import clientPromise from "@/lib/mongodb";
import { ScoreEntry } from "@/types";

async function getScores() {
  const client = await clientPromise;
  const db = client.db("golf_system");
  // ดึงคะแนนและเรียงลำดับตาม Net Score (น้อยไปมาก)
  const scores = await db.collection("tournament_scores")
    .find({})
    .sort({ netScore: 1, handicap: 1 })
    .toArray();
  
  return JSON.parse(JSON.stringify(scores)) as ScoreEntry[];
}

export default async function LeaderboardPage() {
  const allScores = await getScores();

  const renderFlightTable = (flightName: 'A' | 'B' | 'C') => {
    const players = allScores.filter(p => p.flight === flightName);
    
    return (
      <div className="mb-10 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className={`px-4 py-3 font-bold text-white ${
          flightName === 'A' ? 'bg-red-600' : flightName === 'B' ? 'bg-blue-600' : 'bg-yellow-500'
        }`}>
          FLIGHT {flightName}
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-xs uppercase text-gray-600">
            <tr>
              <th className="px-4 py-3">Player Name</th>
              <th className="px-4 py-3 text-center">Gross</th>
              <th className="px-4 py-3 text-center">HDC</th>
              <th className="px-4 py-3 text-center">Net</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {players.map((p, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{p.playerName}</td>
                <td className="px-4 py-3 text-center">{p.grossScore}</td>
                <td className="px-4 py-3 text-center">{p.handicap}</td>
                <td className="px-4 py-3 text-center font-bold text-green-700">{p.netScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-10">
        ⛳ Live Leaderboard
      </h1>
      {renderFlightTable('A')}
      {renderFlightTable('B')}
      {renderFlightTable('C')}
    </div>
  );
}