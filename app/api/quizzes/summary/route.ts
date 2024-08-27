// File: app/api/quizzes/summary/route.ts

import { db } from "@/lib/db";
import { quizzes, quizAttempts, quizResponses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const quizSummaries = await db.select({
      id: quizzes.id,
      chatId: quizzes.chatId, // Add this line to include chatId
      title: quizzes.title,
      totalQuestions: quizzes.totalQuestions,
      attemptId: quizAttempts.id,
      completed: quizAttempts.completed,
      score: quizAttempts.score,
      startedAt: quizAttempts.startedAt,
      completedAt: quizAttempts.completedAt,
    })
    .from(quizzes)
    .leftJoin(quizAttempts, and(
      eq(quizzes.id, quizAttempts.quizId),
    ))
    .orderBy(quizzes.id);

    // Calculate progress for each quiz
    const quizzesWithProgress = await Promise.all(quizSummaries.map(async (quiz) => {
      if (quiz.attemptId) {
        const answeredQuestions = await db.select({ count: quizResponses.id })
          .from(quizResponses)
          .where(eq(quizResponses.quizAttemptId, quiz.attemptId));
        
        const progress = Math.round((answeredQuestions[0].count / quiz.totalQuestions) * 100);
        return { ...quiz, progress };
      }
      return { ...quiz, progress: 0 };
    }));

    if (quizzesWithProgress.length > 0) {
      return NextResponse.json(quizzesWithProgress);
    } else {
      return NextResponse.json({ error: "No quizzes found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error fetching quiz summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz summaries" },
      { status: 500 }
    );
  }
}