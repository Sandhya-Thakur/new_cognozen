// File: app/api/quizzes/complete-quiz/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizAttempts, quizResponses, quizAnalysis, userQuizProgress } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId } = await req.json();

    // Get all responses for this attempt
    const responses = await db
      .select()
      .from(quizResponses)
      .where(eq(quizResponses.quizAttemptId, attemptId));

    // Calculate final score
    const totalQuestions = responses.length;
    const exactCorrect = responses.filter(r => r.isCorrect).length;
    const partialScore = responses.reduce((sum, r) => sum + (r.partialCredit || 0), 0);
    const finalScore = Math.round((partialScore / totalQuestions) * 100);

    // Calculate time spent
    const totalTime = responses.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
    const avgTimePerQuestion = totalTime / totalQuestions;

    // Update quiz attempt
    const [updatedAttempt] = await db.update(quizAttempts)
      .set({
        completed: true,
        completedAt: new Date(),
        score: finalScore,
        correctAnswers: exactCorrect,
        wrongAnswers: totalQuestions - exactCorrect,
        totalTimeSpent: totalTime,
        averageTimePerQuestion: avgTimePerQuestion,
      })
      .where(eq(quizAttempts.id, attemptId))
      .returning();

    // Generate analysis
    const analysisData = {
      overallPerformance: {
        score: finalScore,
        exactCorrect,
        partialScore,
        totalQuestions,
        timeSpent: totalTime,
        ranking: finalScore >= 80 ? "excellent" : finalScore >= 60 ? "good" : "needs_improvement"
      },
      questionAnalysis: responses.map(r => ({
        questionId: r.questionId,
        correct: r.isCorrect,
        partialCredit: r.partialCredit,
        timeSpent: r.timeSpent,
        analysis: r.answerAnalysis
      })),
      recommendedActions: generateRecommendations(responses, finalScore)
    };

    // Save analysis
    await db.insert(quizAnalysis).values({
      quizAttemptId: attemptId,
      userId,
      quizId: updatedAttempt.quizId,
      analysisType: "performance",
      analysisData,
      recommendations: generateRecommendations(responses, finalScore),
      isProcessed: true,
    });

    // Update user progress
    await updateUserProgress(userId, updatedAttempt.quizId, finalScore);

    return NextResponse.json({
      attemptId,
      finalScore,
      totalQuestions,
      correctAnswers: exactCorrect,
      responses: responses.map(r => ({
        questionId: r.questionId,
        questionText: r.questionText,
        userAnswer: r.userAnswer,
        correctAnswer: r.correctAnswer,
        isCorrect: r.isCorrect,
        partialCredit: r.partialCredit,
        analysis: r.answerAnalysis
      })),
      analysis: analysisData
    });
  } catch (error) {
    console.error("Error completing quiz:", error);
    return NextResponse.json({ error: "Failed to complete quiz" }, { status: 500 });
  }
}

function generateRecommendations(responses: any[], score: number): string[] {
  const recommendations = [];
  
  if (score < 60) {
    recommendations.push("Review the material and retake the quiz");
    recommendations.push("Focus on understanding key concepts");
  } else if (score < 80) {
    recommendations.push("Good progress! Review incorrect answers");
    recommendations.push("Practice similar questions");
  } else {
    recommendations.push("Excellent work! You've mastered this topic");
    recommendations.push("Consider moving to more advanced material");
  }
  
  return recommendations;
}

async function updateUserProgress(userId: string, quizId: number, score: number) {
  const [progress] = await db
    .select()
    .from(userQuizProgress)
    .where(and(
      eq(userQuizProgress.userId, userId),
      eq(userQuizProgress.quizId, quizId)
    ));

  if (progress) {
    // Handle null values with defaults
    const currentBestScore = progress.bestScore || 0;
    const currentAverageScore = progress.averageScore || 0;
    const currentTotalAttempts = progress.totalAttempts || 1;
    
    const newBestScore = Math.max(currentBestScore, score);
    const newAverage = ((currentAverageScore * (currentTotalAttempts - 1)) + score) / currentTotalAttempts;
    
    await db.update(userQuizProgress)
      .set({
        bestScore: newBestScore,
        averageScore: newAverage,
        lastAttemptDate: new Date(),
      })
      .where(eq(userQuizProgress.id, progress.id));
  }
}