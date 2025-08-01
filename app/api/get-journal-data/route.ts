import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { desc, eq, and } from "drizzle-orm";

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

export async function DELETE(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const entryId = searchParams.get('id');

    if (!entryId) {
      return NextResponse.json({ error: "Entry ID is required" }, { status: 400 });
    }

    const result = await db
      .delete(journalEntries)
      .where(
        and(
          eq(journalEntries.id, parseInt(entryId)),
          eq(journalEntries.userId, userId)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json({ error: "Entry not found or not authorized to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting journal entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}