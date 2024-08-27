// File: app/api/quizzes/save-response/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizResponses, quizAttempts, quizQuestions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { quizId, userId, questionId, userAnswer } = await request.json();

    // Check if there's an existing attempt for this user and quiz
    let [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.completed, false)
      ));

    // If no attempt exists, create one
    if (!attempt) {
      [attempt] = await db
        .insert(quizAttempts)
        .values({
          quizId,
          score: 0,
          currentQuestionOrder: 1,
          completed: false,
        })
        .returning();
    }

    // Get the correct answer for this question
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId));

    const isCorrect = question.correctAnswer === userAnswer;

    // Save the user's response
    const [response] = await db
      .insert(quizResponses)
      .values({
        quizAttemptId: attempt.id,
        questionId,
        userAnswer,
        isCorrect,
      })
      .returning();

    // Update the current question order in the attempt
    await db
      .update(quizAttempts)
      .set({ currentQuestionOrder: attempt.currentQuestionOrder + 1 })
      .where(eq(quizAttempts.id, attempt.id));

    return NextResponse.json({ success: true, responseId: response.id, isCorrect });
  } catch (error) {
    console.error("Error saving quiz response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}