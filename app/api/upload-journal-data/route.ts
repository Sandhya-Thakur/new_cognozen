import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { journalEntries } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { content } = await req.json();
    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const result = await db
      .insert(journalEntries)
      .values({
        userId,
        content,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({ message: "Journal entry saved successfully", entry: result[0] });
  } catch (error) {
    console.error("Error saving journal entry:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}