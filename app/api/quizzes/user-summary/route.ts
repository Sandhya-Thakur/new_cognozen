// =============================================================================
// API: Get User Quiz Summary
// File: app/api/quizzes/user-summary/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizzes, quizAttempts, userQuizProgress } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all quizzes with their latest attempts and progress data
    const quizzesWithData = await db
      .select({
        // Quiz info
        quizId: quizzes.id,
        chatId: quizzes.chatId,
        title: quizzes.title,
        description: quizzes.description,
        totalQuestions: quizzes.totalQuestions,
        difficulty: quizzes.difficulty,
        category: quizzes.category,
        quizCreatedAt: quizzes.createdAt,
        
        // Latest attempt info
        attemptId: quizAttempts.id,
        attemptScore: quizAttempts.score,
        attemptCompleted: quizAttempts.completed,
        attemptStartedAt: quizAttempts.startedAt,
        attemptCompletedAt: quizAttempts.completedAt,
        attemptTotalTimeSpent: quizAttempts.totalTimeSpent,
        attemptCorrectAnswers: quizAttempts.correctAnswers,
        attemptWrongAnswers: quizAttempts.wrongAnswers,
        attemptCurrentQuestionOrder: quizAttempts.currentQuestionOrder,
        
        // Progress info
        bestScore: userQuizProgress.bestScore,
        averageScore: userQuizProgress.averageScore,
        totalAttempts: userQuizProgress.totalAttempts,
        masteryLevel: userQuizProgress.masteryLevel,
        lastAttemptDate: userQuizProgress.lastAttemptDate,
      })
      .from(quizzes)
      .leftJoin(
        userQuizProgress,
        and(
          eq(userQuizProgress.quizId, quizzes.id),
          eq(userQuizProgress.userId, userId)
        )
      )
      .leftJoin(
        quizAttempts,
        and(
          eq(quizAttempts.quizId, quizzes.id),
          eq(quizAttempts.userId, userId)
        )
      )
      .orderBy(desc(quizAttempts.startedAt));

    // Group by quiz and get the latest attempt for each
    const groupedQuizzes = new Map();
    
    for (const row of quizzesWithData) {
      const quizId = row.quizId;
      
      if (!groupedQuizzes.has(quizId)) {
        groupedQuizzes.set(quizId, {
          quiz: {
            id: row.quizId,
            chatId: row.chatId,
            title: row.title,
            description: row.description,
            totalQuestions: row.totalQuestions,
            difficulty: row.difficulty,
            category: row.category,
            createdAt: row.quizCreatedAt,
          },
          latestAttempt: row.attemptId ? {
            id: row.attemptId,
            quizId: row.quizId,
            userId: userId,
            score: row.attemptScore,
            completed: row.attemptCompleted,
            startedAt: row.attemptStartedAt,
            completedAt: row.attemptCompletedAt,
            totalTimeSpent: row.attemptTotalTimeSpent,
            correctAnswers: row.attemptCorrectAnswers || 0,
            wrongAnswers: row.attemptWrongAnswers || 0,
            currentQuestionOrder: row.attemptCurrentQuestionOrder || 1,
          } : null,
          bestScore: row.bestScore,
          averageScore: row.averageScore,
          totalAttempts: row.totalAttempts || 0,
          masteryLevel: row.masteryLevel,
          progress: row.attemptId ? 
            ((row.attemptCurrentQuestionOrder || 1) / row.totalQuestions) * 100 : 0,
        });
      }
    }

    // Convert map to array and sort by latest activity
    const result = Array.from(groupedQuizzes.values()).sort((a, b) => {
      const aDate = a.latestAttempt?.startedAt || a.quiz.createdAt;
      const bDate = b.latestAttempt?.startedAt || b.quiz.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching quiz summary:", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz summary" },
      { status: 500 }
    );
  }
}