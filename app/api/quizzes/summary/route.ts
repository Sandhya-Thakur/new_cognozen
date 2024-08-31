// File: app/api/quizzes/summary/route.ts
import { db } from "@/lib/db";
import { quizzes, quizAttempts, quizResponses, quizQuestions } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
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
      chatId: quizzes.chatId,
      title: quizzes.title,
      totalQuestions: quizzes.totalQuestions,
      attemptId: quizAttempts.id,
      completed: quizAttempts.completed,
      score: quizAttempts.score,
      startedAt: quizAttempts.startedAt,
      completedAt: quizAttempts.completedAt,
      currentQuestionOrder: quizAttempts.currentQuestionOrder,
    })
    .from(quizzes)
    .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
    .orderBy(quizzes.id);

    const quizzesWithDetails = await Promise.all(quizSummaries.map(async (quiz) => {
      if (quiz.attemptId) {
        const [totalAnswered] = await db
          .select({ count: count() })
          .from(quizResponses)
          .where(eq(quizResponses.quizAttemptId, quiz.attemptId));

        const [correctAnswers] = await db
          .select({ count: count() })
          .from(quizResponses)
          .where(and(
            eq(quizResponses.quizAttemptId, quiz.attemptId),
            eq(quizResponses.isCorrect, true)
          ));

        const progress = Math.round((totalAnswered.count / quiz.totalQuestions) * 100);
        const score = Math.round((correctAnswers.count / quiz.totalQuestions) * 100);
        const completed = totalAnswered.count === quiz.totalQuestions;

        // Update the quizAttempt if it's completed
        if (completed && !quiz.completed) {
          await db.update(quizAttempts)
            .set({ completed: true, score, completedAt: new Date() })
            .where(eq(quizAttempts.id, quiz.attemptId));
        }

        return {
          ...quiz,
          progress,
          totalAnswered: totalAnswered.count,
          correctAnswers: correctAnswers.count,
          score,
          completed,
        };
      }
      return {
        ...quiz,
        progress: 0,
        totalAnswered: 0,
        correctAnswers: 0,
        score: null,
        completed: false,
      };
    }));

    if (quizzesWithDetails.length > 0) {
      return NextResponse.json(quizzesWithDetails);
    } else {
      return NextResponse.json([], { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching quiz summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz summaries" },
      { status: 500 }
    );
  }
}