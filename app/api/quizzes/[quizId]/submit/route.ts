//api/quizzes/[quizId]/submit/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizzes, quizQuestions, quizAttempts, quizResponses } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  const quizId = parseInt(params.quizId);
  const { userId, answers } = await request.json();

  try {
    // Get the quiz attempt
    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.completed, false)
      ))
      .limit(1);

    if (!attempt) {
      return NextResponse.json({ error: "No active attempt found" }, { status: 404 });
    }

    // Get all questions for this quiz
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));

    // Calculate the score
    let correctAnswers = 0;
    for (const question of questions) {
      if (answers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    }

    const score = Math.round((correctAnswers / questions.length) * 100);

    // Update the attempt
    await db
      .update(quizAttempts)
      .set({
        score,
        completed: true,
        completedAt: new Date(),
      })
      .where(eq(quizAttempts.id, attempt.id));

    // Get all responses for this attempt
    const responses = await db
      .select({
        questionId: quizResponses.questionId,
        questionText: quizQuestions.questionText,
        userAnswer: quizResponses.userAnswer,
        correctAnswer: quizQuestions.correctAnswer,
        isCorrect: quizResponses.isCorrect,
      })
      .from(quizResponses)
      .leftJoin(quizQuestions, eq(quizResponses.questionId, quizQuestions.id))
      .where(eq(quizResponses.quizAttemptId, attempt.id));

    return NextResponse.json({
      quizId,
      attemptId: attempt.id,
      score,
      totalQuestions: questions.length,
      correctAnswers,
      responses
    });
  } catch (error) {
    console.error("Error submitting quiz:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}