import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    clerkSecretKey: process.env.CLERK_SECRET_KEY ? "✅ Loaded" : "❌ Missing",
  });
}
