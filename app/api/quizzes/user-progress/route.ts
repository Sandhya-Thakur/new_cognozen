// File: app/api/quizzes/user-progress/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { userQuizProgress, quizzes } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const progress = await db
      .select({
        id: userQuizProgress.id,
        quizId: userQuizProgress.quizId,
        bestScore: userQuizProgress.bestScore,
        averageScore: userQuizProgress.averageScore,
        totalAttempts: userQuizProgress.totalAttempts,
        lastAttemptDate: userQuizProgress.lastAttemptDate,
        masteryLevel: userQuizProgress.masteryLevel,
        quizTitle: quizzes.title,
        quizCategory: quizzes.category,
      })
      .from(userQuizProgress)
      .leftJoin(quizzes, eq(userQuizProgress.quizId, quizzes.id))
      .where(eq(userQuizProgress.userId, userId));

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching user progress:", error);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}