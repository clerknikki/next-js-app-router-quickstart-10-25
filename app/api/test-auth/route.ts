// app/api/test-auth/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = auth();
  console.log("🔐 auth() result:", session);
  return NextResponse.json(session);
}
