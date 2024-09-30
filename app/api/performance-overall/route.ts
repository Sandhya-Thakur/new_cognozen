import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  emotionsData, attentionData, quizEmotionsData, quizAttentionData,
  quizAttempts, quizResponses, habits, habitCompletions, goals,
  weeklyChallenge, userChallengeParticipation
} from "@/lib/db/schema";
import { sql, and, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { userId } = await auth();
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { timeframe } = req.query;

    let startDate = new Date();
    const endDate = new Date();

    switch (timeframe) {
      case '24hours':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '12months':
        startDate.setMonth(startDate.getMonth() - 12);
        break;
      default:
        return res.status(400).json({ message: 'Invalid timeframe' });
    }

    const emotionalWellbeing = await calculateEmotionalWellbeing(userId, startDate, endDate);
    const attentionPerformance = await calculateAttentionPerformance(userId, startDate, endDate);
    const quizPerformance = await calculateQuizPerformance(userId, startDate, endDate);
    const habitConsistency = await calculateHabitConsistency(userId, startDate, endDate);
    const goalProgress = await calculateGoalProgress(userId, startDate, endDate);
    const challengeCompletion = await calculateChallengeCompletion(userId, startDate, endDate);

    const overallPerformance = calculateOverallPerformance(
      emotionalWellbeing,
      attentionPerformance,
      quizPerformance,
      habitConsistency,
      goalProgress,
      challengeCompletion
    );

    const chartData = await prepareChartData(timeframe, startDate, endDate, userId);

    return res.status(200).json({
      overallPerformance,
      emotionalWellbeing,
      attentionPerformance,
      quizPerformance,
      habitConsistency,
      goalProgress,
      challengeCompletion,
      chartData
    });

  } catch (error) {
    console.error('Error calculating overall performance:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function calculateEmotionalWellbeing(userId: string, startDate: Date, endDate: Date) {
  const emotionResults = await db.select({
    avgHappiness: sql<number>`AVG(happy)`,
    avgNeutral: sql<number>`AVG(neutral)`,
    avgNegativeEmotions: sql<number>`(AVG(angry) + AVG(disgust) + AVG(fear) + AVG(sad)) / 4`
  })
  .from(emotionsData)
  .where(and(
    eq(emotionsData.userId, userId),
    sql`${emotionsData.timestamp} >= ${startDate.toISOString()}`,
    sql`${emotionsData.timestamp} < ${endDate.toISOString()}`
  ));

  const result = emotionResults[0];
  return ((result.avgHappiness ?? 0) + (result.avgNeutral ?? 0) - (result.avgNegativeEmotions ?? 0)) / 3;
}

async function calculateAttentionPerformance(userId: string, startDate: Date, endDate: Date) {
  const attentionResults = await db.select({
    avgAttention: sql<number>`AVG(level)`
  })
  .from(attentionData)
  .where(and(
    eq(attentionData.userId, userId),
    sql`${attentionData.timestamp} >= ${startDate.toISOString()}`,
    sql`${attentionData.timestamp} < ${endDate.toISOString()}`
  ));

  return attentionResults[0].avgAttention ?? 0;
}

async function calculateQuizPerformance(userId: string, startDate: Date, endDate: Date) {
  const quizResults = await db.select({
    avgScore: sql<number>`AVG(score)`
  })
  .from(quizAttempts)
  .where(and(
    eq(quizAttempts, userId),
    sql`${quizAttempts.startedAt} >= ${startDate.toISOString()}`,
    sql`${quizAttempts.startedAt} < ${endDate.toISOString()}`,
    eq(quizAttempts.completed, true)
  ));

  return quizResults[0].avgScore ?? 0;
}

async function calculateHabitConsistency(userId: string, startDate: Date, endDate: Date) {
  const habitResults = await db.select({
    completionRate: sql<number>`
      COUNT(DISTINCT hc.id) * 100.0 / 
      (EXTRACT(DAY FROM ${endDate.toISOString()}::timestamp - ${startDate.toISOString()}::timestamp) * COUNT(DISTINCT h.id))
    `
  })
  .from(habits)
  .leftJoin(habitCompletions, eq(habits.id, habitCompletions.habitId))
  .where(and(
    eq(habits.userId, userId),
    sql`${habitCompletions.completedAt} >= ${startDate.toISOString()}`,
    sql`${habitCompletions.completedAt} < ${endDate.toISOString()}`
  ));

  return habitResults[0].completionRate ?? 0;
}

async function calculateGoalProgress(userId: string, startDate: Date, endDate: Date) {
  const goalResults = await db.select({
    avgProgress: sql<number>`AVG(current_value * 100.0 / target_value)`
  })
  .from(goals)
  .where(and(
    eq(goals.userId, userId),
    sql`${goals.startDate} >= ${startDate.toISOString()}`,
    sql`${goals.endDate} < ${endDate.toISOString()}`
  ));

  return goalResults[0].avgProgress ?? 0;
}

async function calculateChallengeCompletion(userId: string, startDate: Date, endDate: Date) {
  const challengeResults = await db.select({
    completionRate: sql<number>`
      SUM(CASE WHEN ucp.is_completed THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
    `
  })
  .from(userChallengeParticipation)
  .innerJoin(weeklyChallenge, eq(userChallengeParticipation.challengeId, weeklyChallenge.id))
  .where(and(
    eq(userChallengeParticipation.userId, userId),
    sql`${weeklyChallenge.startDate} >= ${startDate.toISOString()}`,
    sql`${weeklyChallenge.endDate} < ${endDate.toISOString()}`
  ));

  return challengeResults[0].completionRate ?? 0;
}

function calculateOverallPerformance(
  emotionalWellbeing: number,
  attentionPerformance: number,
  quizPerformance: number,
  habitConsistency: number,
  goalProgress: number,
  challengeCompletion: number
) {
  const weights = {
    emotionalWellbeing: 0.2,
    attentionPerformance: 0.2,
    quizPerformance: 0.15,
    habitConsistency: 0.15,
    goalProgress: 0.15,
    challengeCompletion: 0.15
  };

  return (
    emotionalWellbeing * weights.emotionalWellbeing +
    attentionPerformance * weights.attentionPerformance +
    quizPerformance * weights.quizPerformance +
    habitConsistency * weights.habitConsistency +
    goalProgress * weights.goalProgress +
    challengeCompletion * weights.challengeCompletion
  );
}

async function prepareChartData(timeframe: string, startDate: Date, endDate: Date, userId: string) {
  // Implement logic to fetch and prepare data for the chart based on the timeframe
  // This is a placeholder implementation
  return [];
}