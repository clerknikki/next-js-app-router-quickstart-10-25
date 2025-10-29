import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("🪝 Webhook endpoint hit!");
  const payload = await req.text();

  // ✅ Await headers() (new Next.js behavior)
  const headerData = await headers();

  // 🧩 Helper to read headers in any runtime
  const getHeader = (key: string) => {
    if (typeof headerData.get === "function") {
      return headerData.get(key);
    }
    // fallback: plain object
    return (headerData as any)[key] || (headerData as any)[key.toLowerCase()];
  };

  const svix_id = getHeader("svix-id");
  const svix_timestamp = getHeader("svix-timestamp");
  const svix_signature = getHeader("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers", { svix_id, svix_timestamp, svix_signature });
    return new NextResponse("Missing Svix headers", { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  const { id, email_addresses } = evt.data as any;
  const email = email_addresses?.[0]?.email_address || "unknown@example.com";

  try {
    await prisma.user.create({
      data: {
        clerkId: id,
        email,
      },
    });
    console.log(`✅ User inserted: ${id} (${email})`);
  } catch (err) {
    console.error("❌ Database error:", err);
    return new NextResponse("Database error", { status: 500 });
  }
  
  console.log("✅ Webhook verified and handled successfully");
  return NextResponse.json({ success: true });
}