// app/api/quizzes/get-all-quizzes/route.ts
import { NextResponse } from 'next/server';
import { db } from "@/lib/db";
import { quizzes, quizQuestions, quizAttempts, quizResponses, chats } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs";

export const runtime = "edge";

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all quizzes for the authenticated user
    const userQuizzes = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        description: quizzes.description,
        totalQuestions: quizzes.totalQuestions,
        createdAt: quizzes.createdAt,
        pdfName: chats.pdfName,
        pdfUrl: chats.pdfUrl,
      })
      .from(quizzes)
      .leftJoin(chats, eq(quizzes.chatId, chats.id))
      .where(eq(chats.userId, userId));

    // Fetch details for each quiz
    const quizzesWithDetails = await Promise.all(userQuizzes.map(async (quiz) => {
      // Fetch questions for this quiz
      const questions = await db
        .select({
          id: quizQuestions.id,
          questionText: quizQuestions.questionText,
          options: quizQuestions.options,
          correctAnswer: quizQuestions.correctAnswer,
          explanation: quizQuestions.explanation,
          order: quizQuestions.order,
        })
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quiz.id))
        .orderBy(quizQuestions.order);

      // Fetch attempts for this quiz
      const attempts = await db
        .select({
          id: quizAttempts.id,
          score: quizAttempts.score,
          currentQuestionOrder: quizAttempts.currentQuestionOrder,
          completed: quizAttempts.completed,
          startedAt: quizAttempts.startedAt,
          completedAt: quizAttempts.completedAt,
        })
        .from(quizAttempts)
        .where(eq(quizAttempts.quizId, quiz.id));

      // Fetch responses for each attempt
      const attemptsWithResponses = await Promise.all(attempts.map(async (attempt) => {
        const responses = await db
          .select({
            id: quizResponses.id,
            questionId: quizResponses.questionId,
            userAnswer: quizResponses.userAnswer,
            isCorrect: quizResponses.isCorrect,
            answeredAt: quizResponses.answeredAt,
          })
          .from(quizResponses)
          .where(eq(quizResponses.quizAttemptId, attempt.id));
        
        return { ...attempt, responses };
      }));

      // Combine all the data for this quiz
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