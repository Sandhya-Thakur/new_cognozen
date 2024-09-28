import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { emotionsData, attentionData, quizEmotionsData, quizAttentionData, chats } from "@/lib/db/schema";
import { sql, and, eq, gte, lt } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

interface EmotionsAttentionMetric {
  readingEmotions: {
    avgHappy: number;
    avgSad: number;
    avgAngry: number;
    avgSurprise: number;
    avgNeutral: number;
  };
  quizEmotions: {
    avgHappy: number;
    avgSad: number;
    avgAngry: number;
    avgSurprise: number;
    avgNeutral: number;
  };
  readingAttention: number;
  quizAttention: number;
  dominantEmotion: string;
  emotionsChange: number;
  attentionChange: number;
}

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Function to fetch emotions data
    const fetchEmotions = async (startDate: Date, endDate: Date) => {
      return await db
        .select({
          avgHappy: sql<number>`AVG(${emotionsData.happy})`,
          avgSad: sql<number>`AVG(${emotionsData.sad})`,
          avgAngry: sql<number>`AVG(${emotionsData.angry})`,
          avgSurprise: sql<number>`AVG(${emotionsData.surprise})`,
          avgNeutral: sql<number>`AVG(${emotionsData.neutral})`,
        })
        .from(emotionsData)
        .where(
          and(
            eq(emotionsData.userId, userId),
            gte(emotionsData.timestamp, sql`${startDate}`),
            lt(emotionsData.timestamp, sql`${endDate}`)
          )
        );
    };

    // Function to fetch attention data
    const fetchAttention = async (startDate: Date, endDate: Date) => {
      return await db
        .select({ avgAttention: sql<number>`AVG(${attentionData.level})` })
        .from(attentionData)
        .where(
          and(
            eq(attentionData.userId, userId),
            gte(attentionData.timestamp, sql`${startDate}`),
            lt(attentionData.timestamp, sql`${endDate}`)
          )
        );
    };

    // Function to fetch quiz emotions data
    const fetchQuizEmotions = async (startDate: Date, endDate: Date) => {
      return await db
        .select({
          avgHappy: sql<number>`AVG(${quizEmotionsData.happy})`,
          avgSad: sql<number>`AVG(${quizEmotionsData.sad})`,
          avgAngry: sql<number>`AVG(${quizEmotionsData.angry})`,
          avgSurprise: sql<number>`AVG(${quizEmotionsData.surprise})`,
          avgNeutral: sql<number>`AVG(${quizEmotionsData.neutral})`,
        })
        .from(quizEmotionsData)
        .where(
          and(
            eq(quizEmotionsData.userId, userId),
            gte(quizEmotionsData.timestamp, sql`${startDate}`),
            lt(quizEmotionsData.timestamp, sql`${endDate}`)
          )
        );
    };

    // Function to fetch quiz attention data
    const fetchQuizAttention = async (startDate: Date, endDate: Date) => {
      return await db
        .select({ avgAttention: sql<number>`AVG(${quizAttentionData.level})` })
        .from(quizAttentionData)
        .where(
          and(
            eq(quizAttentionData.userId, userId),
            gte(quizAttentionData.timestamp, sql`${startDate}`),
            lt(quizAttentionData.timestamp, sql`${endDate}`)
          )
        );
    };

    // Fetch data for last 30 days and previous 30 days
    const [currentEmotions] = await fetchEmotions(thirtyDaysAgo, new Date());
    const [previousEmotions] = await fetchEmotions(sixtyDaysAgo, thirtyDaysAgo);
    const [currentAttention] = await fetchAttention(thirtyDaysAgo, new Date());
    const [previousAttention] = await fetchAttention(sixtyDaysAgo, thirtyDaysAgo);
    const [currentQuizEmotions] = await fetchQuizEmotions(thirtyDaysAgo, new Date());
    const [currentQuizAttention] = await fetchQuizAttention(thirtyDaysAgo, new Date());

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return 100; // If previous value was 0, consider it as 100% increase
      return ((current - previous) / previous) * 100;
    };

    const emotionsChange = calculateChange(
      Object.values(currentEmotions).reduce((a, b) => a + (b || 0), 0),
      Object.values(previousEmotions).reduce((a, b) => a + (b || 0), 0)
    );

    const attentionChange = calculateChange(
      currentAttention?.avgAttention || 0,
      previousAttention?.avgAttention || 0
    );

    // Determine dominant emotion
    const dominantEmotion = Object.entries(currentEmotions)
      .reduce((a, b) => (a[1] || 0) > (b[1] || 0) ? a : b)[0]
      .replace('avg', '');

    const emotionsAttentionMetric: EmotionsAttentionMetric = {
      readingEmotions: {
        avgHappy: Number(currentEmotions?.avgHappy?.toFixed(2) || 0),
        avgSad: Number(currentEmotions?.avgSad?.toFixed(2) || 0),
        avgAngry: Number(currentEmotions?.avgAngry?.toFixed(2) || 0),
        avgSurprise: Number(currentEmotions?.avgSurprise?.toFixed(2) || 0),
        avgNeutral: Number(currentEmotions?.avgNeutral?.toFixed(2) || 0),
      },
      quizEmotions: {
        avgHappy: Number(currentQuizEmotions?.avgHappy?.toFixed(2) || 0),
        avgSad: Number(currentQuizEmotions?.avgSad?.toFixed(2) || 0),
        avgAngry: Number(currentQuizEmotions?.avgAngry?.toFixed(2) || 0),
        avgSurprise: Number(currentQuizEmotions?.avgSurprise?.toFixed(2) || 0),
        avgNeutral: Number(currentQuizEmotions?.avgNeutral?.toFixed(2) || 0),
      },
      readingAttention: Number((currentAttention?.avgAttention || 0).toFixed(2)),
      quizAttention: Number((currentQuizAttention?.avgAttention || 0).toFixed(2)),
      dominantEmotion,
      emotionsChange: Number(emotionsChange.toFixed(2)),
      attentionChange: Number(attentionChange.toFixed(2)),
    };

    // Debug logging
    console.log('Emotions and Attention metric:', JSON.stringify(emotionsAttentionMetric, null, 2));

    return NextResponse.json(emotionsAttentionMetric);
  } catch (error) {
    console.error("Failed to fetch emotions and attention metrics", error);
    return NextResponse.json(
      {
        error: "Failed to fetch emotions and attention metrics",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}