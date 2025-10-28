import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    console.error("❌ Missing CLERK_WEBHOOK_SECRET");
    return NextResponse.json({ error: "Missing secret" }, { status: 500 });
  }

  const payload = await req.text();
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("❌ Missing Svix headers");
    return NextResponse.json({ error: "Missing headers" }, { status: 400 });
  }

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Verification failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("✅ Event received:", evt.type);
  console.log("🧾 Event data:", JSON.stringify(evt.data, null, 2));

  if (evt.type === "user.created") {
    const { id, email_addresses } = evt.data;
    const email = email_addresses?.[0]?.email_address || null;

    console.log("📨 Inserting user:", { id, email });

    try {
      await prisma.user.create({
        data: {
          clerkId: id,
          email: email || "unknown@noemail.com",
        },
      });
      console.log("✅ User inserted successfully!");
    } catch (error) {
      console.error("❌ Prisma insert failed:", error);
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
