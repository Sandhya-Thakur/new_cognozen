// File: app/api/quizzes/generate-quiz/route.ts
// =============================================================================

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { quizzes, quizQuestions, chats } from "@/lib/db/schema";
import { Configuration, OpenAIApi } from "openai-edge";
import { getContext } from "@/lib/ context"
import { eq } from "drizzle-orm";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, pdfName, difficulty = "medium" } = await req.json();

    // Get the file key from chat to access PDF content
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length != 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }
    const fileKey = _chats[0].fileKey;

    // Get PDF content using the same method as chat API
    const context = await getContext(`Generate quiz questions from this content`, fileKey);

    // Enhanced prompt with actual PDF content
    const prompt = `Based on the following PDF content, create a quiz with 5 multiple choice questions.

    PDF CONTENT:
    ${context}

    Requirements:
    - Create questions that test understanding of the specific content above
    - Each question must have exactly 4 options
    - Use letters A, B, C, D for options
    - correctAnswer should be just the letter (A, B, C, or D)
    - Questions should be ${difficulty} difficulty level
    - Focus on key concepts, facts, and important details from the content

    Return ONLY valid JSON in this exact format:
    {
      "title": "Quiz: ${pdfName}",
      "description": "Test your knowledge of ${pdfName} content",
      "questions": [
        {
          "questionText": "Question based on the PDF content",
          "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
          "correctAnswer": "A",
          "explanation": "Explanation of why this answer is correct based on the PDF",
          "difficulty": "${difficulty}"
        }
      ]
    }`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that creates questions based on provided PDF content. Always return valid JSON format."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content received from OpenAI");
    }

    let quizData;
    try {
      quizData = JSON.parse(content);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", content);
      throw new Error("Invalid JSON response from OpenAI");
    }

    // Validate quiz structure
    if (!quizData.questions || !Array.isArray(quizData.questions)) {
      throw new Error("Invalid quiz structure received");
    }

    // Save quiz to database
    const [quiz] = await db.insert(quizzes).values({
      chatId,
      title: quizData.title,
      description: quizData.description,
      totalQuestions: quizData.questions.length,
      difficulty,
      category: pdfName,
    }).returning();

    // Save questions with validation
    const questionsToInsert = quizData.questions.map((q: any, index: number) => {
      // Ensure correctAnswer is just the letter
      let correctAnswer = q.correctAnswer;
      if (correctAnswer && correctAnswer.length > 1) {
        correctAnswer = correctAnswer.charAt(0).toUpperCase();
      }

      return {
        quizId: quiz.id,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: correctAnswer,
        explanation: q.explanation,
        order: index + 1,
        difficulty: q.difficulty || difficulty,
      };
    });

    await db.insert(quizQuestions).values(questionsToInsert);

    return NextResponse.json({ quizId: quiz.id, quiz });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ 
      error: "Failed to generate quiz. Please try again." 
    }, { status: 500 });
  }
}