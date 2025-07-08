// File: app/api/quizzes/save-response/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizResponses, quizQuestions, quizAttempts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Helper function to analyze answer similarity
function analyzeAnswer(userAnswer: string, correctAnswer: string, options: string[] | unknown) {
  const userLower = userAnswer.toLowerCase().trim();
  const correctLower = correctAnswer.toLowerCase().trim();
  
  // Ensure options is an array
  const optionsArray = Array.isArray(options) ? options : [];
  
  // Exact match
  if (userLower === correctLower) {
    return {
      matchType: "exact",
      similarity: 1.0,
      isCorrect: true,
      partialCredit: 1.0,
      reasoning: "Exact match with correct answer"
    };
  }
  
  // Partial match logic
  const userWords = userLower.split(/\s+/);
  const correctWords = correctLower.split(/\s+/);
  const matchedWords = userWords.filter(word => correctWords.includes(word));
  const similarity = matchedWords.length / correctWords.length;
  
  if (similarity >= 0.7) {
    return {
      matchType: "partial",
      similarity,
      isCorrect: false,
      partialCredit: similarity * 0.8, // Give partial credit
      reasoning: `Partial match - ${matchedWords.length}/${correctWords.length} key words matched`,
      keywordsMatched: matchedWords,
      keywordsMissed: correctWords.filter(word => !matchedWords.includes(word))
    };
  }
  
  return {
    matchType: "incorrect",
    similarity,
    isCorrect: false,
    partialCredit: 0.0,
    reasoning: "Answer does not match expected response"
  };
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { attemptId, questionId, userAnswer, timeSpent = 0 } = await req.json();

    // Get question details
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId));

    if (!question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // Analyze the answer
    const analysis = analyzeAnswer(userAnswer, question.correctAnswer, question.options);

    // Save response
    const [response] = await db.insert(quizResponses).values({
      quizAttemptId: attemptId,
      questionId,
      userAnswer,
      isCorrect: analysis.isCorrect,
      questionText: question.questionText,
      correctAnswer: question.correctAnswer,
      allOptions: question.options,
      timeSpent,
      answerAnalysis: analysis,
      partialCredit: analysis.partialCredit,
      answeredAt: new Date(),
    }).returning();

    // Update question statistics with null checks
    const currentTotalCount = question.totalAnswerCount || 0;
    const currentCorrectCount = question.correctAnswerCount || 0;
    const newTotalCount = currentTotalCount + 1;
    const newCorrectCount = analysis.isCorrect ? currentCorrectCount + 1 : currentCorrectCount;
    
    await db.update(quizQuestions)
      .set({
        totalAnswerCount: newTotalCount,
        correctAnswerCount: newCorrectCount,
        successRate: (newCorrectCount / newTotalCount) * 100,
      })
      .where(eq(quizQuestions.id, questionId));

    return NextResponse.json({ 
      response, 
      analysis,
      isCorrect: analysis.isCorrect,
      partialCredit: analysis.partialCredit 
    });
  } catch (error) {
    console.error("Error saving response:", error);
    return NextResponse.json({ error: "Failed to save response" }, { status: 500 });
  }
}
