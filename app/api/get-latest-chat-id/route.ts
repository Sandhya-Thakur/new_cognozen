import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export const runtime = "edge"; // specify the runtime to be edge

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  try {
    // Fetch the latest chat id
    const data = await db.select().from(chats).where(eq(chats.userId, userId)).orderBy(desc(chats.id)).limit(1);
    if (data.length > 0) {
      //return NextResponse.json({ chatId: data[0].id, message: 'success' });
      return NextResponse.json(data[0].id);
    } else {
      return NextResponse.json({ error: "No chat IDs found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch chat IDs", error);
    return NextResponse.json(
      { error: "Failed to fetch chat IDs" },
      { status: 500 },
    );
  }
}
