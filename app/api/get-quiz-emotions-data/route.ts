import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { quizEmotionsData } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await db
      .select()
      .from(quizEmotionsData)
      .where(eq(quizEmotionsData.userId, userId))
      .orderBy(desc(quizEmotionsData.timestamp))
      .limit(100); // Limit to last 100 entries for performance

    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: "No quiz emotion data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch quiz emotion data", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz emotion data" },
      { status: 500 },
    );
  }
}