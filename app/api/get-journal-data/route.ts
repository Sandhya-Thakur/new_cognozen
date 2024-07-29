import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";

export const runtime = "edge";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entries = await db
      .select()
      .from(journalEntries)
      .where(eq(journalEntries.userId, userId))
      .orderBy(desc(journalEntries.createdAt))
      .limit(50); // Limit to the most recent 50 entries, adjust as needed

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching journal entries:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}