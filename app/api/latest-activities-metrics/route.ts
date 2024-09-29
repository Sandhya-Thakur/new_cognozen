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
  habitInsights
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const latestActivities = await db
      .select({
        title: sql<string>`CASE
          WHEN type = 'Reading' THEN chats.pdf_name
          WHEN type = 'Quiz' THEN quizzes.title
          WHEN type = 'Flashcards' THEN 'Flashcard Review'
          WHEN type = 'Summary' THEN 'Summary Review'
          WHEN type = 'Mood' THEN CONCAT('Mood: ', "moodData".mood)
          WHEN type = 'Habit' THEN habits.name
          WHEN type = 'HabitInsight' THEN 'Habit Insight Generated'
          ELSE 'Unknown'
        END`,
        type: sql<string>`type`,
        date: sql<string>`TO_CHAR(CASE
          WHEN type = 'Reading' THEN chats.created_at
          WHEN type = 'Quiz' THEN COALESCE(quiz_attempts.completed_at, quiz_attempts.started_at)
          WHEN type = 'Flashcards' THEN flashcards.created_at
          WHEN type = 'Summary' THEN summaries.created_at
          WHEN type = 'Mood' THEN "moodData".timestamp
          WHEN type = 'Habit' THEN habit_completions.completed_at
          WHEN type = 'HabitInsight' THEN habit_insights.created_at
          ELSE NOW()
        END, 'MM/DD/YYYY')`,
        stage: sql<number>`CASE
          WHEN type = 'Reading' THEN 100
          WHEN type = 'Quiz' THEN 
            CASE 
              WHEN quiz_attempts.completed THEN 100
              ELSE COALESCE((quiz_attempts.score::float / quizzes.total_questions::float) * 100, 0)
            END
          WHEN type = 'Flashcards' THEN 100
          WHEN type = 'Summary' THEN 100
          WHEN type = 'Mood' THEN 100
          WHEN type = 'Habit' THEN COALESCE(habit_completions.value, 0)
          WHEN type = 'HabitInsight' THEN 100
          ELSE 0
        END`,
        status: sql<string>`CASE
          WHEN type = 'Quiz' THEN 
            CASE 
              WHEN quiz_attempts.completed THEN 'Completed'
              ELSE 'Started'
            END
          WHEN type = 'Reading' THEN 'Completed'
          ELSE 'Completed'
        END`,
      })
      .from(
        sql`(
          SELECT 'Reading' as type, id, created_at as timestamp FROM ${chats} WHERE user_id = ${userId}
          UNION ALL
          SELECT 'Quiz' as type, id, COALESCE(completed_at, started_at) as timestamp FROM ${quizAttempts} WHERE quiz_id IN (SELECT id FROM ${quizzes} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId}))
          UNION ALL
          SELECT 'Flashcards' as type, id, created_at as timestamp FROM ${flashcards} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'Summary' as type, id, created_at as timestamp FROM ${summaries} WHERE chat_id IN (SELECT id FROM ${chats} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'Mood' as type, id, timestamp FROM ${moodData} WHERE user_id = ${userId}
          UNION ALL
          SELECT 'Habit' as type, id, completed_at as timestamp FROM ${habitCompletions} WHERE habit_id IN (SELECT id FROM ${habits} WHERE user_id = ${userId})
          UNION ALL
          SELECT 'HabitInsight' as type, id, created_at as timestamp FROM ${habitInsights} WHERE user_id = ${userId}
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
      .leftJoin(habitInsights, eq(sql`activities.id`, habitInsights.id))
      .orderBy(desc(sql`activities.timestamp`))
      .limit(5);

    if (latestActivities.length > 0) {
      return NextResponse.json(latestActivities);
    } else {
      return NextResponse.json({ error: "No activities found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Failed to fetch latest activities", error);
    
    if (error instanceof Error) {
      console.error(error.stack);
    }

    return NextResponse.json(
      { 
        error: "Failed to fetch latest activities",
        details: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}