// File: /api/quizzes/[quizId]/route.ts

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { quizzes, quizQuestions } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export const runtime = "edge"; // specify the runtime to be edge

export async function GET(
  request: Request,
  { params }: { params: { quizId: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const quizId = parseInt(params.quizId);

  try {
    const quiz = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (quiz.length === 0) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    return NextResponse.json({
      id: quiz[0].id,
      title: quiz[0].title,
      description: quiz[0].description,
      totalQuestions: quiz[0].totalQuestions,
      createdAt: quiz[0].createdAt,
      questions: questions.map(q => ({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        order: q.order,
        // Note: We're not sending the correct answer to the client for security reasons
      }))
    });
  } catch (error) {
    console.error("Failed to fetch quiz data", error);
    return NextResponse.json(
      { error: "Failed to fetch quiz data" },
      { status: 500 }
    );
  }
}