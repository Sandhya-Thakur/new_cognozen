// File: app/api/quizzes/[quizId]/results/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizzes, quizQuestions, quizAttempts, quizResponses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const quizId = parseInt(params.quizId);
  const userId = request.nextUrl.searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);

    if (quiz.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
      ))
      .orderBy(quizAttempts.startedAt)
      .limit(1);

    if (!attempt) {
      return NextResponse.json({ error: "No attempt found for this quiz" }, { status: 404 });
    }

    // Fetch all questions for this quiz
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    // Fetch all responses for this attempt
    const responses = await db
      .select({
        questionId: quizResponses.questionId,
        userAnswer: quizResponses.userAnswer,
        isCorrect: quizResponses.isCorrect,
      })
      .from(quizResponses)
      .where(eq(quizResponses.quizAttemptId, attempt.id));

    // Create a map of responses for easy lookup
    const responseMap = new Map(responses.map(r => [r.questionId, r]));

    // Combine questions with responses
    const fullResults = questions.map(question => {
      const response = responseMap.get(question.id);
      return {
        questionId: question.id,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer: response?.userAnswer || null,
        isCorrect: response?.isCorrect || false,
      };
    });

    const totalQuestions = questions.length;
    const correctAnswers = responses.filter(r => r.isCorrect).length;
    const score = attempt.score || Math.round((correctAnswers / totalQuestions) * 100);

    return NextResponse.json({
      quizId,
      attemptId: attempt.id,
      score,
      totalQuestions,
      correctAnswers,
      completed: attempt.completed,
      startedAt: attempt.startedAt,
      completedAt: attempt.completedAt,
      responses: fullResults
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}