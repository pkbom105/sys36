"use client";
import React, { useState, useEffect } from "react";
import { Input, Button, Card, CardBody, Divider, Spinner } from "@heroui/react";

export default function CourseProfile() {
  const [courseName, setCourseName] = useState("");
  const [pars, setPars] = useState<number[]>(new Array(18).fill(4));
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // 1. ดึงข้อมูลสนามที่มีอยู่แล้วจาก MongoDB เมื่อเปิดหน้าครั้งแรก
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        if (data && data.pars) {
          setCourseName(data.courseName);
          setPars(data.pars);
        }
      } catch (error) {
        console.error("Failed to fetch course:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  const handleParChange = (index: number, value: string) => {
    const newPars = [...pars];
    newPars[index] = parseInt(value) || 0;
    setPars(newPars);
  };

  const totalPar = pars.reduce((a, b) => a + b, 0);

  // 2. ฟังก์ชันบันทึกลง MongoDB
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseName, pars }),
      });

      if (response.ok) {
        alert("✅ บันทึกข้อมูลสนามลง MongoDB เรียบร้อย!");
      } else {
        alert("❌ เกิดข้อผิดพลาดในการบันทึก");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("❌ ไม่สามารถเชื่อมต่อกับ Database ได้");
    } finally {
      setIsSaving(false);
    }
  };

  const renderRow = (startIdx: number, label: string) => (
    <div className="mb-4">
      <p className="text-sm font-bold text-green-700 mb-3 uppercase tracking-wider">
        {label}
      </p>
      <div className="grid grid-cols-9 gap-1 md:gap-3">
        {pars.slice(startIdx, startIdx + 9).map((p, i) => {
          const actualIdx = startIdx + i;
          return (
            <div key={actualIdx} className="flex flex-col items-center">
              <span className="text-[10px] font-black text-gray-400 mb-1">
                H{actualIdx + 1}
              </span>
              <Input
                type="number"
                variant="flat"
                size="sm"
                className="w-full text-center"
                classNames={{ 
                  input: "text-center font-bold text-lg",
                  inputWrapper: "h-12 border-2 border-transparent focus-within:border-green-500"
                }}
                value={p.toString()}
                onChange={(e) => handleParChange(actualIdx, e.target.value)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );

  if (loading) return <div className="flex justify-center p-10"><Spinner color="success" /></div>;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="w-full md:w-1/2">
          <Input
            label="ชื่อสนามกอล์ฟ"
            placeholder="เช่น Alpine Golf Club"
            variant="bordered"
            labelPlacement="outside"
            className="font-bold"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </div>
        <div className="flex flex-col items-end bg-green-50 px-6 py-2 rounded-xl border border-green-100 min-w-[120px]">
          <p className="text-[10px] text-green-600 font-bold uppercase">Total Par</p>
          <p className="text-3xl font-black text-green-800 leading-none">{totalPar}</p>
        </div>
      </div>

      <Divider />

      {/* Course Structure Table */}
      <Card shadow="none" className="border border-gray-200 bg-gray-50/30">
        <CardBody className="p-6">
          {renderRow(0, "Out Course (Hole 1-9)")}
          
          <div className="my-6 flex items-center gap-4">
            <Divider className="flex-1" />
            <span className="text-[10px] font-bold text-gray-300">HALF TURN</span>
            <Divider className="flex-1" />
          </div>
          
          {renderRow(9, "In Course (Hole 10-18)")}
        </CardBody>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button 
          color="success" 
          variant="shadow"
          className="font-bold text-black px-10 h-12 text-lg"
          onPress={handleSave}
          isLoading={isSaving}
        >
          {isSaving ? "กำลังบันทึก..." : "บันทึกตั้งค่าสนาม ⛳"}
        </Button>
      </div>
    </div>
  );
}