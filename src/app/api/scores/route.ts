import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { calculateGolfResult } from '@/lib/golf-logic';

// บังคับให้ Next.js ไม่เก็บ Cache (ดึงข้อมูลใหม่ทุกครั้งที่เรียก API)
export const dynamic = 'force-dynamic';

/**
 * GET: ดึงคะแนนทั้งหมดมาแสดงใน Leaderboard
 * เรียงลำดับตาม: 
 * 1. Net Score (น้อยไปมาก)
 * 2. Handicap (น้อยไปมาก - กรณี Net เท่ากัน คนที่ HDC น้อยกว่าจะอยู่อันดับดีกว่า)
 */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("golf_system");
    
    const scores = await db.collection("tournament_scores")
      .find({})
      .sort({ netScore: 1, handicap: 1 })
      .toArray();

    return NextResponse.json(scores);
  } catch (error: any) {
    console.error("GET Scores Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST: รับข้อมูลจากหน้า ScoreInput เพื่อบันทึกลง MongoDB
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { playerName, scores, coursePars, courseName } = body;

    // ตรวจสอบข้อมูลเบื้องต้น
    if (!playerName || !scores || !coursePars) {
      return NextResponse.json({ error: "ข้อมูลไม่ครบถ้วน" }, { status: 400 });
    }

    // 1. คำนวณผลลัพธ์ (Gross, HDC, Net, Flight) จาก Logic กลางเพื่อความแม่นยำ
    const result = calculateGolfResult(scores, coursePars);

    // 2. เชื่อมต่อ MongoDB
    const client = await clientPromise;
    const db = client.db("golf_system");

    // 3. เตรียมข้อมูล Document
    const newEntry = {
      playerName,
      courseName: courseName || "Unknown Course",
      scores,      // Array คะแนน 18 หลุม
      coursePars,  // Array ค่า Par 18 หลุม
      ...result,   // นำค่า grossScore, handicap, netScore, flight มาใส่
      createdAt: new Date(),
    };

    // 4. บันทึกลง Collection ชื่อ tournament_scores
    const doc = await db.collection("tournament_scores").insertOne(newEntry);

    return NextResponse.json({ 
      success: true, 
      id: doc.insertedId,
      message: "บันทึกคะแนนเรียบร้อยแล้ว" 
    });
  } catch (error: any) {
    console.error("POST Scores Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}