// src/app/api/courses/route.ts
export const dynamic = 'force-dynamic';

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { courseName, pars } = body;

    const client = await clientPromise;
    const db = client.db("golf_system");

    // บันทึกข้อมูลสนาม (ใช้ updateOne กับ upsert เพื่อให้มีข้อมูลสนามเดียวที่อัปเดตตลอด)
    const result = await db.collection("courses").updateOne(
      { type: "main_course" }, // identifier สำหรับสนามหลัก
      { 
        $set: { 
          courseName, 
          pars, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// เพิ่ม GET เพื่อให้หน้าลงคะแนนดึงค่า Par ไปใช้ได้อัตโนมัติ
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("golf_system");
    const course = await db.collection("courses").findOne({ type: "main_course" });
    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}