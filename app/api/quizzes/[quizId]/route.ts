// =============================================================================
// Missing API: Get Quiz with Questions
// File: app/api/quizzes/[quizId]/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizzes, quizQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { quizId: string } }) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizId = parseInt(params.quizId);

    // Get quiz details
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId));

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Get questions (don't send correct answers to frontend for security)
    const questions = await db
      .select({
        id: quizQuestions.id,
        questionText: quizQuestions.questionText,
        options: quizQuestions.options,
        order: quizQuestions.order,
        difficulty: quizQuestions.difficulty,
        // Don't include correctAnswer for security
      })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      totalQuestions: quiz.totalQuestions,
      difficulty: quiz.difficulty,
      category: quiz.category,
      questions: questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        order: q.order,
        difficulty: q.difficulty
      }))
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
  }
}