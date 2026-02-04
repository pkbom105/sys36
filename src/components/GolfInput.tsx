"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, Divider, Chip } from "@heroui/react";
import { calculateGolfResult } from "@/lib/golf-logic";

export default function ScoreInput() {
  // ในอนาคตส่วนนี้จะดึงมาจาก Database (Tab: ข้อมูลสนาม)
  const [coursePars] = useState<number[]>(new Array(18).fill(4));
  
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState<number[]>(new Array(18).fill(4));
  const [result, setResult] = useState({ grossScore: 0, handicap: 0, netScore: 0, flight: "-" });

  // คำนวณผลลัพธ์อัตโนมัติเมื่อมีการเปลี่ยนแปลงคะแนน
  useEffect(() => {
    const res = calculateGolfResult(scores, coursePars);
    setResult({ ...res });
  }, [scores, coursePars]);

  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = parseInt(value) || 0;
    setScores(newScores);
  };

  const renderInputRow = (startIdx: number, label: string) => (
    <div className="mb-4">
      <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</p>
      <div className="grid grid-cols-9 gap-1 md:gap-2">
        {scores.slice(startIdx, startIdx + 9).map((s, i) => {
          const actualIdx = startIdx + i;
          return (
            <div key={actualIdx} className="flex flex-col items-center">
              <span className="text-[10px] font-bold text-gray-400 mb-1">H{actualIdx + 1}</span>
              <Input
                type="number"
                variant="flat"
                size="sm"
                classNames={{ 
                  input: "text-center font-bold text-lg",
                  inputWrapper: "p-0 h-12" 
                }}
                value={s.toString()}
                onChange={(e) => handleScoreChange(actualIdx, e.target.value)}
              />
              <span className="text-[10px] text-blue-500 mt-1">P:{coursePars[actualIdx]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  const handleSave = async () => {
    if (!playerName) return alert("กรุณาระบุชื่อผู้เล่น");
    
    const response = await fetch("/api/scores", {
      method: "POST",
      body: JSON.stringify({ playerName, scores, coursePars }),
    });

    if (response.ok) {
      alert("บันทึกคะแนนสำเร็จ!");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ส่วนหัว: ชื่อผู้เล่น และ สรุปคะแนน */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <Input
          label="ชื่อนักกอล์ฟ"
          placeholder="ระบุชื่อ-นามสกุล"
          variant="bordered"
          className="max-w-xs"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        
        <div className="flex gap-4 items-center bg-gray-50 px-6 py-2 rounded-lg border border-gray-200">
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase">Gross</p>
            <p className="text-xl font-black text-gray-800">{result.grossScore}</p>
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase">HDC</p>
            <p className="text-xl font-black text-blue-600">{result.handicap}</p>
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase">Net</p>
            <p className="text-xl font-black text-red-600">{result.netScore}</p>
          </div>
          <Divider orientation="vertical" className="h-8" />
          <div className="text-center">
            <p className="text-[10px] text-gray-400 uppercase">Flight</p>
            <Chip color="success" variant="solid" size="sm" className="font-bold text-white uppercase">
              {result.flight}
            </Chip>
          </div>
        </div>
      </div>

      <Divider />

      {/* ตารางกรอกคะแนน 2 แถว */}
      <Card shadow="none" className="border border-gray-100 bg-gray-50/50">
        <CardBody className="p-4">
          {renderInputRow(0, "Out Course (Hole 1-9)")}
          <Divider className="my-4" />
          {renderInputRow(9, "In Course (Hole 10-18)")}
        </CardBody>
      </Card>

      <Button 
        color="success" 
        className="w-full font-bold text-black shadow-lg h-12 text-lg"
        onPress={handleSave}
      >
        บันทึกคะแนนเข้าสู่ระบบ 🏆
      </Button>
    </div>
  );
}