// File: app/api/performance-overall/route.ts
import { db } from "@/lib/db";
import { quizzes, quizAttempts, quizResponses, habits, habitCompletions, chats } from "@/lib/db/schema";
import { eq, and, count, sql } from "drizzle-orm";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const interval = searchParams.get('interval') as '24hours' | '7days' | '30days' | '12months';

  let startDate = new Date();
  switch (interval) {
    case '24hours':
      startDate.setHours(startDate.getHours() - 24);
      break;
    case '7days':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30days':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '12months':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      return NextResponse.json({ error: "Invalid interval" }, { status: 400 });
  }

  try {
    // Fetch quiz data
    const quizSummaries = await db.select({
      id: quizzes.id,
      title: quizzes.title,
      totalQuestions: quizzes.totalQuestions,
      attemptId: quizAttempts.id,
      completed: quizAttempts.completed,
      score: quizAttempts.score,
      startedAt: quizAttempts.startedAt,
      completedAt: quizAttempts.completedAt,
    })
    .from(quizzes)
    .leftJoin(chats, eq(quizzes.chatId, chats.id))
    .leftJoin(quizAttempts, eq(quizzes.id, quizAttempts.quizId))
    .where(
      and(
        eq(chats.userId, userId),
        sql`${quizAttempts.startedAt} >= ${startDate}`
      )
    )
    .orderBy(quizzes.createdAt);

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

        return {
          ...quiz,
          progress,
          totalAnswered: totalAnswered.count,
          correctAnswers: correctAnswers.count,
          score,
        };
      }
      return {
        ...quiz,
        progress: 0,
        totalAnswered: 0,
        correctAnswers: 0,
        score: null,
      };
    }));

    // Fetch habit data
    const habitData = await db.select({
      id: habits.id,
      name: habits.name,
      completions: count(habitCompletions.id),
    })
    .from(habits)
    .leftJoin(habitCompletions, 
      and(
        eq(habits.id, habitCompletions.habitId),
        sql`${habitCompletions.completedAt} >= ${startDate}`
      )
    )
    .where(eq(habits.userId, userId))
    .groupBy(habits.id, habits.name)
    .orderBy(habits.name);

    return NextResponse.json({
      quizzes: quizzesWithDetails,
      habits: habitData,
    });

  } catch (error) {
    console.error("Error fetching performance data:", error);
    return NextResponse.json(
      { error: "Failed to fetch performance data" },
      { status: 500 }
    );
  }
}