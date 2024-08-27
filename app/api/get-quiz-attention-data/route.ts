import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { quizAttentionData } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

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
      .from(quizAttentionData)
      .where(eq(quizAttentionData.userId, userId));

    if (data.length > 0) {
      return NextResponse.json(data);
    } else {
      return NextResponse.json({ message: "No quiz attention data found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch quiz attention data", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz attention data" },
      { status: 500 },
    );
  }
}