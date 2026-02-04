import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("golf_system");
    
    // ลองสั่งปิง Database
    const status = await db.command({ ping: 1 });
    
    return NextResponse.json({ 
      message: "Database is online!", 
      status: status 
    });
  } catch (error: any) {
    return NextResponse.json({ 
      message: "Database connection failed", 
      error: error.message 
    }, { status: 500 });
  }
}