"use client";
import React, { useState, useEffect } from "react";
import { 
  Input, Button, Card, CardBody, Divider, 
  Select, SelectItem, Chip, Spinner 
} from "@heroui/react";
import { calculateGolfResult, CalculationResult } from "@/lib/golf-logic";

export default function ScoreInput() {
  // --- States สำหรับข้อมูลระบบ ---
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // --- States สำหรับข้อมูลผู้เล่น ---
  const [playerName, setPlayerName] = useState("");
  const [scores, setScores] = useState<number[]>(new Array(18).fill(0));
  const [result, setResult] = useState<CalculationResult>({ 
    grossScore: 0, handicap: 0, netScore: 0, flight: "C" 
  });

  // 1. ดึงข้อมูลสนามจาก MongoDB มาแสดงใน Dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        const courseList = Array.isArray(data) ? data : [data];
        const validCourses = courseList.filter(c => c !== null);
        setCourses(validCourses);
        
        // เลือกสนามแรกให้อัตโนมัติเป็น Default
        if (validCourses.length > 0) {
          setSelectedCourse(validCourses[0]);
        }
      } catch (error) {
        console.error("Fetch courses error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // 2. คำนวณผลลัพธ์อัตโนมัติเมื่อ Score หรือ สนามที่เลือกมีการเปลี่ยนแปลง
  useEffect(() => {
    if (selectedCourse?.pars) {
      const res = calculateGolfResult(scores, selectedCourse.pars);
      setResult(res);
    }
  }, [scores, selectedCourse]);

  // ฟังก์ชันจัดการการกรอกคะแนน
  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    newScores[index] = parseInt(value) || 0;
    setScores(newScores);
  };

  // ฟังก์ชันจัดการการเปลี่ยนสนามผ่าน Dropdown
  const handleCourseChange = (courseName: string) => {
    const course = courses.find(c => c.courseName === courseName);
    if (course) {
      setSelectedCourse(course);
    }
  };

  // 3. ฟังก์ชันบันทึกข้อมูลลง Database
  const saveScore = async () => {
    if (!playerName) return alert("❌ กรุณาระบุชื่อนักกอล์ฟ");
    if (!selectedCourse) return alert("❌ กรุณาเลือกสนามกอล์ฟ");
  
    setIsSaving(true);
    try {
      const response = await fetch("/api/scores", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json" // *** ต้องมีบรรทัดนี้ ***
        },
        body: JSON.stringify({ 
          playerName, 
          scores, 
          coursePars: selectedCourse.pars,
          courseName: selectedCourse.courseName 
        }),
      });
  
      const data = await response.json();
  
      if (data.success) {
        alert(`✅ บันทึกคะแนนของ ${playerName} สำเร็จ!`);
        setPlayerName(""); 
        setScores(new Array(18).fill(0)); 
      } else {
        alert("❌ บันทึกไม่สำเร็จ: " + (data.error || "Unknown Error"));
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ ไม่สามารถเชื่อมต่อ API ได้ (เช็ก Terminal ของคุณ)");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Spinner color="success" /></div>;

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      
      {/* ส่วน Header: ชื่อผู้เล่น (H2) และ สรุปคะแนน (สีดำเข้ม) */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl border-b-4 border-black shadow-sm">
        <div className="flex flex-col w-full">
          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Player Name Display</p>
          <h2 className="text-4xl font-black text-black uppercase break-words">
            {playerName || "Waiting for Name..."}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-400 text-sm italic">สนามที่เลือก:</span>
            <span className="text-blue-600 font-black">{selectedCourse?.courseName || "ยังไม่ได้เลือกสนาม"}</span>
          </div>
        </div>

        {/* กล่องสรุปคะแนนสีดำ */}
        <div className="grid grid-cols-4 gap-4 bg-black p-5 rounded-2xl w-full md:w-auto shadow-xl">
          <div className="text-center min-w-[60px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Gross</p>
            <p className="text-2xl font-black text-white">{result.grossScore}</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase">HDC</p>
            <p className="text-2xl font-black text-blue-400">{result.handicap}</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Net</p>
            <p className="text-2xl font-black text-red-500">{result.netScore}</p>
          </div>
          <div className="text-center min-w-[60px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Flight</p>
            <p className="text-2xl font-black text-green-400">{result.flight}</p>
          </div>
        </div>
      </div>

      {/* ส่วนควบคุม: กรอกชื่อและเลือกสนาม */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
        <Input 
          label="ระบุชื่อผู้เล่น" 
          variant="bordered"
          className="font-bold text-black"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
        <Select 
          label="เลือกสนามกอล์ฟจากฐานข้อมูล" 
          variant="bordered"
          className="font-bold"
          selectedKeys={selectedCourse ? [selectedCourse.courseName] : []}
          onChange={(e) => handleCourseChange(e.target.value)}
        >
          {courses.map((course) => (
            <SelectItem key={course.courseName} textValue={course.courseName}>
              {course.courseName}
            </SelectItem>
          ))}
        </Select>
      </div>

      <Divider />

      {/* ตารางลงคะแนนแนวตั้ง 2 แถว (แถวละ 9 หลุม) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[0, 9].map((startIdx) => (
          <Card key={startIdx} shadow="none" className="border border-gray-200 bg-white overflow-hidden">
            <CardBody className="p-0">
              <table className="w-full">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr className="text-[10px] font-black text-gray-500 uppercase">
                    <th className="py-3 px-2 text-center">Hole</th>
                    <th className="py-3 px-2 text-center bg-blue-50 text-blue-700">Par</th>
                    <th className="py-3 px-4 text-center text-black">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {scores.slice(startIdx, startIdx + 9).map((s, i) => {
                    const idx = startIdx + i;
                    const par = selectedCourse?.pars[idx] || 0;
                    return (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="py-2 text-center font-bold text-gray-400 w-16">#{idx + 1}</td>
                        {/* ค่า Par ที่อัปเดตตามสนามที่เลือก */}
                        <td className="py-2 text-center font-black text-blue-700 bg-blue-50/30 w-16">
                          {par}
                        </td>
                        <td className="py-2 px-6">
                          <Input 
                            type="number"
                            size="sm"
                            variant="flat"
                            classNames={{ input: "text-center font-black text-2xl text-black" }}
                            value={s === 0 ? "" : s.toString()}
                            onChange={(e) => handleScoreChange(idx, e.target.value)}
                            placeholder="-"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* ปุ่มบันทึกขนาดใหญ่ */}
      <Button 
        color="success" 
        className="w-full font-black text-black h-16 text-xl shadow-2xl mb-10 mt-4"
        onPress={saveScore}
        isLoading={isSaving}
      >
        บันทึกคะแนนเข้าสู่ระบบ MongoDB 💾
      </Button>
    </div>
  );
}