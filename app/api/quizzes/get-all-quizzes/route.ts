// app/api/quizzes/get-all-quizzes/route.ts
import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizzes, quizQuestions, quizAttempts, quizResponses } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allQuizzes = await db.select().from(quizzes);

    const quizzesWithDetails = await Promise.all(allQuizzes.map(async (quiz) => {
      const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, quiz.id));
      const attempts = await db.select().from(quizAttempts).where(eq(quizAttempts.quizId, quiz.id));

      const attemptsWithResponses = await Promise.all(attempts.map(async (attempt) => {
        const responses = await db.select().from(quizResponses).where(eq(quizResponses.quizAttemptId, attempt.id));
        return { ...attempt, responses };
      }));

      return {
        ...quiz,
        questions,
        attempts: attemptsWithResponses,
      };
    }));

    return NextResponse.json(quizzesWithDetails);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
  }
}