import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { gratitudeEntries } from "@/lib/db/schema";
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
      .from(gratitudeEntries)
      .where(eq(gratitudeEntries.userId, userId))
      .orderBy(desc(gratitudeEntries.createdAt))
      .limit(50);

    return NextResponse.json({ entries });
  } catch (error) {
    console.error("Error fetching gratitude entries:", error);
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
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: "Missing entry ID" }, { status: 400 });
    }

    const result = await db
      .delete(gratitudeEntries)
      .where(
        and(
          eq(gratitudeEntries.id, parseInt(id)),
          eq(gratitudeEntries.userId, userId)
        )
      );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Entry not found or not authorized to delete" }, { status: 404 });
    }

    return NextResponse.json({ message: "Entry deleted successfully" });
  } catch (error) {
    console.error("Error deleting gratitude entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}