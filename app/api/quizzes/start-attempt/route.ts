// File: app/api/quizzes/start-attempt/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizAttempts, userQuizProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId } = await req.json();

    // Create new quiz attempt
    const [attempt] = await db.insert(quizAttempts).values({
      quizId,
      userId,
      startedAt: new Date(),
    }).returning();

    // Update or create user progress tracking
    const existingProgress = await db
      .select()
      .from(userQuizProgress)
      .where(and(
        eq(userQuizProgress.userId, userId),
        eq(userQuizProgress.quizId, quizId)
      ))
      .limit(1);

    if (existingProgress.length === 0) {
      await db.insert(userQuizProgress).values({
        userId,
        quizId,
        totalAttempts: 1,
        lastAttemptDate: new Date(),
      });
    } else {
      const progress = existingProgress[0];
      if (progress) {
        await db.update(userQuizProgress)
          .set({
            totalAttempts: (progress.totalAttempts || 0) + 1,
            lastAttemptDate: new Date(),
          })
          .where(eq(userQuizProgress.id, progress.id));
      }
    }

    return NextResponse.json({ attemptId: attempt.id, attempt });
  } catch (error) {
    console.error("Error starting quiz attempt:", error);
    return NextResponse.json({ error: "Failed to start quiz" }, { status: 500 });
  }
}