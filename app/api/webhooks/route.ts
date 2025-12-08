// app/api/webhooks/route.ts

import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";


export async function POST(req: Request) {
  // 1. Get the body as text (important for signature verification)
  const payload = await req.text();

  // 2. Read Clerk webhook headers
  const hdrs = await headers();
  const headerPayload = {
    "svix-id": hdrs.get("svix-id") ?? "",
    "svix-timestamp": hdrs.get("svix-timestamp") ?? "",
    "svix-signature": hdrs.get("svix-signature") ?? "",
  };

  // 3. Load Clerk Webhook Secret
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing Clerk Webhook Secret");
    return NextResponse.json({ error: "Missing secret" }, { status: 400 });
  }

  // 4. Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);

  let event: any;
  try {
    event = wh.verify(payload, headerPayload);
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // 5. Handle different events
  const { type, data } = event;

  switch (type) {
    case "user.created":
      console.log("User created:", data);

      // Example: Sync to DB
      await connectDB();
      await User.create({
        clerkId: data.id,
        email: data.emailAddresses[0].emailAddress,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.imageUrl,
      });
      break;

    case "user.updated":
      console.log("User updated:", data);

      // Example: Update DB
      await connectDB();
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.emailAddresses[0].emailAddress,
          firstName: data.firstName,
          lastName: data.lastName,
          image: data.imageUrl,
        }
      );

      break;

    case "user.deleted":
      console.log("User deleted:", data);

      // Example: Soft delete or hard delete
        await connectDB();
        await User.findOneAndDelete({ clerkId: data.id });
      break;

    default:
      console.log("Unhandled event type:", type);
  }

  return NextResponse.json({ message: "Webhook received" }, { status: 200 });
}
