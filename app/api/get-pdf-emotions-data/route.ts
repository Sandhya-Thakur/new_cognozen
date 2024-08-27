import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { emotionsData } from "@/lib/db/schema";
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
      .from(emotionsData)
      .where(eq(emotionsData.userId, userId))
      .orderBy(desc(emotionsData.timestamp))
      .limit(100); // Limit to last 100 entries for performance

    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: "No emotion data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch emotion data", error);
    return NextResponse.json(
      { error: "Failed to fetch emotion data" },
      { status: 500 },
    );
  }
}