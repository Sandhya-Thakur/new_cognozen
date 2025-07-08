// =============================================================================
// API: Get Quiz Results After Completion
// File: app/api/quizzes/[quizId]/results/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizAttempts, quizResponses, quizAnalysis } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get userId from query params if provided (for compatibility)
    const url = new URL(req.url);
    const queryUserId = url.searchParams.get('userId');
    const targetUserId = queryUserId || userId;

    const quizId = parseInt(params.quizId);

    // Get latest completed attempt for this user and quiz
    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.userId, targetUserId),
        eq(quizAttempts.completed, true)
      ))
      .orderBy(desc(quizAttempts.completedAt))
      .limit(1);

    if (!attempt) {
      return NextResponse.json({ 
        error: "No completed attempts found for this quiz",
        message: "Please complete the quiz first to see results"
      }, { status: 404 });
    }

    // Get all responses for this attempt
    const responses = await db
      .select()
      .from(quizResponses)
      .where(eq(quizResponses.quizAttemptId, attempt.id))
      .orderBy(quizResponses.questionId);

    // Get analysis data if available
    const [analysis] = await db
      .select()
      .from(quizAnalysis)
      .where(eq(quizAnalysis.quizAttemptId, attempt.id))
      .limit(1);

    // Calculate final score if not already calculated
    let finalScore = attempt.score;
    if (!finalScore && responses.length > 0) {
      const totalPartialCredit = responses.reduce((sum, r) => sum + (r.partialCredit || 0), 0);
      finalScore = Math.round((totalPartialCredit / responses.length) * 100);
    }

    // Format response data to match QuizGenerator expectations
    const formattedResponses = responses.map(r => ({
      questionId: r.questionId,
      questionText: r.questionText || "Question text not available",
      userAnswer: r.userAnswer,
      correctAnswer: r.correctAnswer || "Correct answer not available",
      isCorrect: r.isCorrect,
      partialCredit: r.partialCredit || 0,
      analysis: r.answerAnalysis,
      timeSpent: r.timeSpent || 0
    }));

    // Prepare analysis data with proper type checking
    const analysisData: any = analysis?.analysisData || {};
    const overallPerformance: any = analysisData.overallPerformance || {};
    
    const responseData = {
      // Match QuizResult interface from QuizGenerator
      attemptId: attempt.id,
      finalScore: finalScore || 0,
      totalQuestions: responses.length,
      correctAnswers: attempt.correctAnswers || responses.filter(r => r.isCorrect).length,
      responses: formattedResponses,
      
      // Enhanced analysis data
      analysis: {
        overallPerformance: {
          score: finalScore || 0,
          ranking: overallPerformance.ranking || (
            (finalScore || 0) >= 80 ? "excellent" : 
            (finalScore || 0) >= 60 ? "good" : "needs_improvement"
          ),
          timeSpent: attempt.totalTimeSpent || 0,
          ...overallPerformance
        },
        recommendedActions: analysis?.recommendations || [],
        questionAnalysis: (analysisData as any).questionAnalysis || [],
        ...analysisData
      },
      
      // Additional metadata
      attempt: {
        id: attempt.id,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        totalTimeSpent: attempt.totalTimeSpent,
        averageTimePerQuestion: attempt.averageTimePerQuestion
      }
    };

    console.log("Returning quiz results for attempt:", attempt.id, "Score:", finalScore);
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch quiz results",
        message: "An error occurred while retrieving your quiz results. Please try again."
      },
      { status: 500 }
    );
  }
}