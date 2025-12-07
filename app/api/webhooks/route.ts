import { Webhook } from "svix";
import { headers } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const body = await req.text();
  const headerPayload = await headers();

  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(SIGNING_SECRET);

  let event: any;

  try {
    event = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const { type, data } = event;

  await connectDB();

  if (type === "user.created") {
    await User.create({
      clerkId: data.id,
      email: data.email_addresses[0].email_address,
      name: `${data.first_name || ""} ${data.last_name || ""}`,
      image: data.image_url,
    });
  }

  if (type === "user.deleted") {
    await User.findOneAndDelete({ clerkId: data.id });
  }

  return new Response("OK", { status: 200 });
}
