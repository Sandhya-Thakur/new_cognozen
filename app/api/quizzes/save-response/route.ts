import { NextRequest, NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizResponses, quizAttempts, quizQuestions } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { quizId, userId, questionId, userAnswer, isLastQuestion } = await request.json();

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

    // Update the attempt
    const updateValues: {
      currentQuestionOrder: number;
      score?: number;
      completed?: boolean;
      completedAt?: Date;
    } = {
      currentQuestionOrder: attempt.currentQuestionOrder + 1,
    };

    // Update score if the answer is correct
    if (isCorrect) {
      updateValues.score = (attempt.score || 0) + 1;
    }

    // If it's the last question, mark as completed
    if (isLastQuestion) {
      updateValues.completed = true;
      updateValues.completedAt = new Date();
    }

    // Perform the update
    await db
      .update(quizAttempts)
      .set(updateValues)
      .where(eq(quizAttempts.id, attempt.id));

    return NextResponse.json({ 
      success: true, 
      responseId: response.id, 
      isCorrect,
      attemptCompleted: isLastQuestion
    });
  } catch (error) {
    console.error("Error saving quiz response:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}