"use client";

import React from "react";
import { Tabs, Tab, Card, CardBody } from "@heroui/react";

// มั่นใจว่าไฟล์เหล่านี้ใช้ "export default function" ทั้งหมด
import ScoreInput from "@/components/ScoreInput";
import LeaderboardTable from "@/components/LeaderboardTable";
import CourseProfile from "@/components/CourseProfile";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col w-full">
        
        {/* Header ส่วนหัวหน้าเว็บ */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-4xl font-black text-green-800 tracking-tight">
            GOLF <span className="text-green-600">SYSTEM 36</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            ระบบคำนวณคะแนนกอล์ฟและจัดอันดับ Flight อัตโนมัติ
          </p>
        </div>

        {/* ระบบ Tabs หลัก */}
        <Tabs 
          aria-label="Golf Management Options" 
          color="success" 
          variant="underlined"
          classNames={{
            tabList: "gap-8 w-full relative rounded-none p-0 border-b border-divider flex justify-center",
            cursor: "w-full bg-green-600",
            tab: "max-w-fit px-4 h-12",
            tabContent: "group-data-[selected=true]:text-green-700 font-bold text-lg"
          }}
        >
          {/* TAB 1: ลงคะแนน */}
          <Tab
            key="score-input"
            title={
              <div className="flex items-center space-x-2">
                <span>📝</span>
                <span>ลงคะแนน</span>
              </div>
            }
          >
            <div className="mt-6">
              <Card shadow="sm" className="border border-gray-100">
                <CardBody className="p-6">
                  <ScoreInput />
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* TAB 2: ตารางคะแนน */}
          <Tab
            key="leaderboard"
            title={
              <div className="flex items-center space-x-2">
                <span>🏆</span>
                <span>ตารางคะแนน</span>
              </div>
            }
          >
            <div className="mt-6">
              <Card shadow="sm" className="border border-gray-100">
                <CardBody className="p-6">
                  <LeaderboardTable />
                </CardBody>
              </Card>
            </div>
          </Tab>

          {/* TAB 3: ตั้งค่าสนาม */}
          <Tab
            key="course-page"
            title={
              <div className="flex items-center space-x-2">
                <span>⛳</span>
                <span>ข้อมูลสนาม</span>
              </div>
            }
          >
            <div className="mt-6">
              <Card shadow="sm" className="border border-gray-100">
                <CardBody className="p-6">
                  <CourseProfile />
                </CardBody>
              </Card>
            </div>
          </Tab>
        </Tabs>

        {/* Footer เล็กๆ */}
        <footer className="mt-12 text-center text-gray-400 text-xs">
          © 2026 Golf Tournament Management System | Powered by Next.js & HeroUI
        </footer>
      </div>
    </div>
  );
}