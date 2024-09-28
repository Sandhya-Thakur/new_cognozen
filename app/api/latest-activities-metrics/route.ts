import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { eq, desc, sql } from "drizzle-orm";
import { 
  chats, 
  quizzes, 
  quizAttempts, 
  flashcards,
  summaries,
  moodData,
  habits,
  habitCompletions,
  emotionalWellbeingGoals
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const latestActivities = await db
      .select({
        title: sql<string>`CASE
          WHEN type = 'Reading' THEN chats.pdf_name
          WHEN type = 'Quiz' THEN quizzes.title
          WHEN type = 'Flashcards' THEN 'Flashcard Review'
          WHEN type = 'Summary' THEN 'Summary Review'
          WHEN type = 'Mood' THEN 'Mood Entry'
          WHEN type = 'Habit' THEN habits.name
          WHEN type = 'Goal' THEN emotional_wellbeing_goals.content
          ELSE 'Unknown'
        END`,
        type: sql<string>`type`,
        date: sql<string>`TO_CHAR(CASE
          WHEN type = 'Reading' THEN chats.created_at
          WHEN type = 'Quiz' THEN quiz_attempts.started_at
          WHEN type = 'Flashcards' THEN flashcards.created_at
          WHEN type = 'Summary' THEN summaries.created_at
          WHEN type = 'Mood' THEN mood_data.timestamp
          WHEN type = 'Habit' THEN habit_completions.completed_at
          WHEN type = 'Goal' THEN emotional_wellbeing_goals.created_at
          ELSE NOW()
        END, 'MM/DD/YYYY')`,
        stage: sql<number>`CASE
          WHEN type = 'Reading' THEN 100
          WHEN type = 'Quiz' THEN COALESCE((quiz_attempts.score::float / quizzes.total_questions::float) * 100, 0)
          WHEN type = 'Flashcards' THEN 100
          WHEN type = 'Summary' THEN 100
          WHEN type = 'Mood' THEN 100
          WHEN type = 'Habit' THEN COALESCE(habit_completions.value, 0)
          WHEN type = 'Goal' THEN CASE WHEN emotional_wellbeing_goals.completed THEN 100 ELSE 50 END
          ELSE 0
        END`,
      })
      .from(
        sql`(
          SELECT 'Reading' as type, id FROM ${chats} WHERE user_id = ${userId}
          UNION ALL
          SELECT 'Quiz' as type, id FROM ${quizAttempts} WHERE quiz_id IN (SELECT id FROM ${quizzes} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId}))
          UNION ALL
          SELECT 'Flashcards' as type, id FROM ${flashcards} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'Summary' as type, id FROM ${summaries} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'Mood' as type, id FROM ${moodData} WHERE user_id = ${userId}
          UNION ALL
          SELECT 'Habit' as type, id FROM ${habitCompletions} WHERE habit_id IN (SELECT id FROM ${habits} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'Goal' as type, id FROM ${emotionalWellbeingGoals} WHERE user_id = ${userId}
        ) as activities`
      )
      .leftJoin(chats, eq(sql`activities.id`, chats.id))
      .leftJoin(quizAttempts, eq(sql`activities.id`, quizAttempts.id))
      .leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .leftJoin(flashcards, eq(sql`activities.id`, flashcards.id))
      .leftJoin(summaries, eq(sql`activities.id`, summaries.id))
      .leftJoin(moodData, eq(sql`activities.id`, moodData.id))
      .leftJoin(habitCompletions, eq(sql`activities.id`, habitCompletions.id))
      .leftJoin(habits, eq(habitCompletions.habitId, habits.id))
      .leftJoin(emotionalWellbeingGoals, eq(sql`activities.id`, emotionalWellbeingGoals.id))
      .orderBy(desc(sql`CASE
        WHEN type = 'Reading' THEN chats.created_at
        WHEN type = 'Quiz' THEN quiz_attempts.started_at
        WHEN type = 'Flashcards' THEN flashcards.created_at
        WHEN type = 'Summary' THEN summaries.created_at
        WHEN type = 'Mood' THEN mood_data.timestamp
        WHEN type = 'Habit' THEN habit_completions.completed_at
        WHEN type = 'Goal' THEN emotional_wellbeing_goals.created_at
        ELSE NOW()
      END`))
      .limit(5);

    if (latestActivities.length > 0) {
      return NextResponse.json(latestActivities);
    } else {
      return NextResponse.json({ error: "No activities found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch latest activities", error);
    return NextResponse.json(
      { error: "Failed to fetch latest activities" },
      { status: 500 },
    );
  }
}