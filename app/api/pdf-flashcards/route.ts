import { Configuration, OpenAIApi } from "openai-edge";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import { getContext } from "@/lib/ context";
import { db } from "@/lib/db";
import { chats, messages as _messages, flashcards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { streamText } from "ai";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json();
    console.log(
      "Received request with messages:",
      messages,
      "and chatId:",
      chatId,
    );

    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
    if (_chats.length !== 1) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const fileKey = _chats[0].fileKey;
    const lastMessage = messages[messages.length - 1];
    const context = await getContext(lastMessage.content, fileKey);

    const prompt = {
      role: "system",
      content: `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain and is able to generate flashcards from any text.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI will use the following CONTEXT:${context} to create Questions and Answers for flashcards. 
      These Flashcards will be used to revise, so it is essential your response is accurate.
      If the context does not provide the content to generate flashcards, the AI assistant will say, "I'm sorry, but I don't have enough information to generate flashcards."
      AI assistant will not apologize for previous responses but instead will indicate new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
      AI assistant always generate 10 flashcards from the ${context}.
      AI assistant will always responds a JSON object.
      for example {"question": "What is the capital of France?", "answer": "Paris"}
      
        `,
    };

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        prompt,
        ...messages.filter((message: Message) => message.role === "user"),
      ],
      stream: true,
    });

    const stream = OpenAIStream(response, {
      onStart: async () => {
        // save summary into db
        await db.insert(flashcards).values({
          chatId,
          content: lastMessage.content,
          role: "user",
        });
      },
      onCompletion: async (completion) => {
        // save ai message into db
        await db.insert(flashcards).values({
          chatId,
          content: completion,
          role: "system",
        });
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
