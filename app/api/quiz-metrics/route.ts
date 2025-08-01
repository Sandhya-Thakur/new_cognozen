import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { quizzes, quizAttempts, chats } from "@/lib/db/schema";
import { sql, and, eq, gt, inArray } from "drizzle-orm";

export const dynamic = "force-dynamic";
// Removing Edge runtime for broader compatibility
// export const runtime = "edge";

interface QuizMetric {
  totalQuizzes: number;
  averageScore: number | null;
  completionRate: number;
  topPerformingQuiz: {
    quizId: number;
    score: number;
  } | null;
}

export async function GET(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Get all chatIds for this user
    const userChats = await db
      .select({ id: chats.id })
      .from(chats)
      .where(eq(chats.userId, userId));

    const chatIds = userChats.map(chat => chat.id);

    // Get all quizIds associated with the user's chats
    const userQuizzes = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(inArray(quizzes.chatId, chatIds));

    const quizIds = userQuizzes.map(quiz => quiz.id);

    // Total quizzes attempted
    const totalQuizzes = await db
      .select({ count: sql<number>`CAST(COUNT(DISTINCT ${quizAttempts.id}) AS INTEGER)` })
      .from(quizAttempts)
      .where(
        and(
          inArray(quizAttempts.quizId, quizIds),
          gt(quizAttempts.startedAt, thirtyDaysAgo)
        )
      );

    // Average score of completed quizzes
    const avgScore = await db
      .select({ avg: sql<number>`CAST(AVG(${quizAttempts.score}) AS FLOAT)` })
      .from(quizAttempts)
      .where(
        and(
          inArray(quizAttempts.quizId, quizIds),
          gt(quizAttempts.startedAt, thirtyDaysAgo),
          eq(quizAttempts.completed, true)
        )
      );

    // Completion rate
    const completedQuizzes = await db
      .select({ count: sql<number>`CAST(COUNT(*) AS INTEGER)` })
      .from(quizAttempts)
      .where(
        and(
          inArray(quizAttempts.quizId, quizIds),
          gt(quizAttempts.startedAt, thirtyDaysAgo),
          eq(quizAttempts.completed, true)
        )
      );

    // Top performing quiz
    const topQuiz = await db
      .select({
        quizId: quizAttempts.quizId,
        score: quizAttempts.score,
      })
      .from(quizAttempts)
      .where(
        and(
          inArray(quizAttempts.quizId, quizIds),
          gt(quizAttempts.startedAt, thirtyDaysAgo),
          eq(quizAttempts.completed, true),
          sql`${quizAttempts.score} IS NOT NULL`
        )
      )
      .orderBy(sql`${quizAttempts.score} DESC`)
      .limit(1);

    const totalQuizzesCount = totalQuizzes[0]?.count || 0;
    const completedQuizzesCount = completedQuizzes[0]?.count || 0;
    const completionRate = totalQuizzesCount > 0 
      ? (completedQuizzesCount / totalQuizzesCount) * 100 
      : 0;

    const rawAverageScore = avgScore[0]?.avg;
    let processedAverageScore: number | null = null;
    if (rawAverageScore !== null && rawAverageScore !== undefined && !isNaN(rawAverageScore)) {
      processedAverageScore = Number(rawAverageScore.toFixed(2));
    }

    const quizMetric: QuizMetric = {
      totalQuizzes: totalQuizzesCount,
      averageScore: processedAverageScore,
      completionRate: Number(completionRate.toFixed(2)),
      topPerformingQuiz: topQuiz[0] && topQuiz[0].score !== null
        ? {
            quizId: topQuiz[0].quizId,
            score: Number(topQuiz[0].score)
          }
        : null,
    };

    console.log('Quiz metric:', JSON.stringify(quizMetric, null, 2));

    return NextResponse.json(quizMetric);
  } catch (error) {
    console.error("Failed to fetch quiz metrics", error);
    return NextResponse.json(
      {
        error: "Failed to fetch quiz metrics",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}