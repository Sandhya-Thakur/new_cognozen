// File: /api/quizzes/regenerate-quiz/route.ts

import { Configuration, OpenAIApi } from "openai-edge";
import { ChatCompletionRequestMessage } from "openai-edge";
import { getContext } from "@/lib/ context";
import { db } from "@/lib/db";
import { chats, quizzes, quizQuestions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { chatId, pdfName } = await req.json();
    console.log("Received request to regenerate quiz with chatId:", chatId, "and pdfName:", pdfName);

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    console.log("Retrieving context for fileKey:", fileKey);
    const context = await getContext("Generate a fresh quiz about this PDF", fileKey);
    console.log("Context retrieved, length:", context.length);

    if (context.length < 100) {
      console.log("Context too short:", context);
      return NextResponse.json({ error: "Not enough context to generate a quiz." }, { status: 400 });
    }

    const prompt: ChatCompletionRequestMessage = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain and is able to generate quizzes from any text.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI will use the following CONTEXT: ${context} to create a fresh quiz with 5 multiple-choice questions.
      Each question should have 4 options, with one correct answer.
      These questions will be used for revision, so it is essential your response is accurate and different from any previous quizzes.
      If the context does not provide enough content to generate a quiz, the AI assistant will say, "I'm sorry, but I don't have enough information to generate a quiz."
      AI assistant will not apologize for previous responses but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant will always respond with a JSON array of exactly 5 question objects.
      Each question object should have the following structure:
      {"questionText": "What is the capital of France?", "options": ["London", "Berlin", "Paris", "Madrid"], "correctAnswer": "Paris", "explanation": "Paris is the capital and largest city of France."}
      `,
    };

    console.log("Sending request to OpenAI for fresh quiz");
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [prompt],
    });

    console.log("Received response from OpenAI");
    const data = await response.json();
    console.log("OpenAI response:", data);

    if (!data.choices || data.choices.length === 0) {
      console.error("Unexpected OpenAI response structure:", data);
      return NextResponse.json({ error: "Unexpected response from AI model." }, { status: 500 });
    }

    const assistantMessage = data.choices[0].message.content;

    if (assistantMessage.includes("I'm sorry, but I don't have enough information to generate a quiz.")) {
      return NextResponse.json({ error: "Not enough information to generate a fresh quiz." }, { status: 400 });
    }

    let quizData;
    try {
      quizData = JSON.parse(assistantMessage);
      console.log("Parsed fresh quiz data:", quizData);
    } catch (err) {
      console.error("Error parsing fresh quiz data:", err);
      return NextResponse.json({ error: "Error parsing fresh quiz data." }, { status: 500 });
    }

    if (!Array.isArray(quizData) || quizData.length !== 5) {
      console.error("Unexpected fresh quiz data structure:", quizData);
      return NextResponse.json({ error: "Unexpected fresh quiz data structure." }, { status: 500 });
    }

    console.log("Saving fresh quiz to database");
    // Save fresh quiz data in the database
    const newQuiz = await db.insert(quizzes).values({
      chatId,
      title: `Fresh Quiz for ${pdfName}`,
      description: "Regenerated quiz based on the PDF content",
      totalQuestions: 5,
      createdAt: new Date(),
    }).returning();

    for (let i = 0; i < quizData.length; i++) {
      const question = quizData[i];
      await db.insert(quizQuestions).values({
        quizId: newQuiz[0].id,
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        order: i + 1,
      });
    }

    console.log("Fresh quiz saved successfully");
    return NextResponse.json({ success: true, quizId: newQuiz[0].id });
  } catch (error) {
    console.error("Unhandled error in fresh quiz generation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}