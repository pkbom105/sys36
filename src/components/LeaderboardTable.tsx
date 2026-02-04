"use client";
import React, { useEffect, useState, useCallback } from "react";
import { 
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Chip, Spinner, Button, Card, CardBody 
} from "@heroui/react";

export default function LeaderboardTable() {
  const [allScores, setAllScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchScores = useCallback(async () => {
    try {
      // เพิ่ม timestamp ป้องกัน cache
      const res = await fetch(`/api/scores?t=${Date.now()}`);
      const data = await res.json();
      setAllScores(data);
    } catch (error) {
      console.error("Fetch leaderboard error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  // ฟังก์ชันช่วยสร้างตารางแยกแต่ละ Flight
  const renderFlightTable = (flightName: string, themeColor: "danger" | "primary" | "warning") => {
    // กรองข้อมูลเฉพาะ Flight นั้นๆ
    const players = allScores.filter(p => p.flight === flightName);

    return (
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3">
            <h3 className={`text-2xl font-black uppercase ${
              flightName === 'A' ? 'text-red-600' : flightName === 'B' ? 'text-blue-600' : 'text-yellow-600'
            }`}>
              Flight {flightName}
            </h3>
            <Chip color={themeColor} variant="flat" size="sm" className="font-bold">
              {players.length} Players
            </Chip>
          </div>
        </div>

        <Table 
          aria-label={`Table Flight ${flightName}`}
          shadow="sm"
          classNames={{
            wrapper: "p-0 border border-gray-200 overflow-hidden",
            th: "bg-gray-100 text-black font-bold text-sm h-12",
            td: "py-4 font-medium"
          }}
        >
          <TableHeader>
            <TableColumn width={80}>Rank</TableColumn>
            <TableColumn>Player Name</TableColumn>
            <TableColumn align="center">Gross</TableColumn>
            <TableColumn align="center">HDC</TableColumn>
            <TableColumn align="center" className="text-red-600">Net</TableColumn>
          </TableHeader>
          <TableBody emptyContent={`ไม่มีข้อมูลใน Flight ${flightName}`}>
            {players.map((player, index) => (
              <TableRow key={player._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <TableCell className="font-bold text-gray-400 italic">#{index + 1}</TableCell>
                <TableCell className="font-black text-black uppercase">{player.playerName}</TableCell>
                <TableCell className="text-center">{player.grossScore}</TableCell>
                <TableCell className="text-center font-bold text-blue-600">{player.handicap}</TableCell>
                <TableCell className="text-center font-black text-xl text-black bg-gray-50/50">
                  {player.netScore}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <Spinner color="success" size="lg" />
      <p className="text-black font-bold">กำลังดึงอันดับคะแนนล่าสุด...</p>
    </div>
  );

  return (
    <div className="flex flex-col w-full py-4">
      {/* ส่วนหัว Leaderboard */}
      <div className="flex justify-between items-center mb-8 border-b-2 border-black pb-4">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tighter">Live Leaderboard</h1>
          <p className="text-gray-500 text-xs font-bold">อัปเดตข้อมูลล่าสุดจากสนาม</p>
        </div>
        <Button 
          onPress={fetchScores} 
          color="success" 
          variant="shadow" 
          size="sm" 
          className="font-bold text-black"
        >
          🔄 Refresh Scores
        </Button>
      </div>

      {/* แสดงตาราง 3 Flight */}
      {renderFlightTable("A", "danger")}
      {renderFlightTable("B", "primary")}
      {renderFlightTable("C", "warning")}
    </div>
  );
}