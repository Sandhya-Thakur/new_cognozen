// File: /app/api/notifications/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { eq, and, lte, gte, desc, sql } from "drizzle-orm";
import { 
  notifications,
  chats,
  quizzes,
  quizAttempts,
  habits,
  goals,
  weeklyChallenge,
  userChallengeParticipation,
  moodData,
  emotionalWellbeingGoals,
  journalEntries,
  gratitudeEntries
} from "@/lib/db/schema";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  try {
    const unseenNotifications = await db
      .select()
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.seen, false)
      ))
      .orderBy(desc(notifications.createdAt))
      .limit(5);

    if (unseenNotifications.length > 0) {
      return NextResponse.json(unseenNotifications);
    }

    const newNotifications = await generateNotifications(userId);

    for (const notification of newNotifications) {
      await db.insert(notifications).values({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        seen: false,
        createdAt: new Date()
      });
    }

    return NextResponse.json(newNotifications);
  } catch (error) {
    console.error("Failed to fetch notifications", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const { id } = await request.json();

  try {
    // Mark the notification as seen and then delete it
    await db
      .delete(notifications)
      .where(and(
        eq(notifications.id, id),
        eq(notifications.userId, userId)
      ));

    return NextResponse.json({ message: "Notification removed" });
  } catch (error) {
    console.error("Failed to remove notification", error);
    return NextResponse.json(
      { error: "Failed to remove notification" },
      { status: 500 },
    );
  }
}

async function generateNotifications(userId: string) {
  const generatedNotifications = [];
  const today = new Date();
  const todayISO = today.toISOString().split('T')[0]; // YYYY-MM-DD

  // 1. Incomplete quizzes
  const incompleteQuiz = await db
    .select({
      quiz: quizzes,
      attempt: quizAttempts
    })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .innerJoin(chats, eq(quizzes.chatId, chats.id))
    .where(and(
      eq(quizAttempts.completed, false),
      eq(chats.userId, userId)
    ))
    .orderBy(desc(quizAttempts.startedAt))
    .limit(1);

  if (incompleteQuiz.length > 0) {
    generatedNotifications.push({
      type: 'quiz',
      title: 'Unfinished Quiz',
      message: `Continue your quiz: "${incompleteQuiz[0].quiz.title}"`
    });
  }

  // 2. Today's habits
  const todaysHabits = await db
    .select()
    .from(habits)
    .where(and(
      eq(habits.userId, userId),
      eq(habits.isActive, true)
    ));

  if (todaysHabits.length > 0) {
    generatedNotifications.push({
      type: 'habit',
      title: 'Daily Habits',
      message: `You have ${todaysHabits.length} habits to work on today.`
    });
  }

  // 3. Goals nearing deadline (within 3 days)
  const threeDaysFromNow = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
  const threeDaysFromNowISO = threeDaysFromNow.toISOString().split('T')[0];
  const nearingGoals = await db
    .select()
    .from(goals)
    .where(and(
      eq(goals.userId, userId),
      eq(goals.status, 'in_progress'),
      lte(goals.endDate, sql`${threeDaysFromNowISO}`)
    ));

  nearingGoals.forEach(goal => {
    generatedNotifications.push({
      type: 'goal',
      title: 'Goal Deadline Soon',
      message: `Your goal "${goal.title}" is due in 3 days or less!`
    });
  });

  // 4. Active challenge
  const activeChallenge = await db
    .select({
      challenge: weeklyChallenge,
      participation: userChallengeParticipation
    })
    .from(userChallengeParticipation)
    .innerJoin(weeklyChallenge, eq(userChallengeParticipation.challengeId, weeklyChallenge.id))
    .where(and(
      eq(userChallengeParticipation.userId, userId),
      eq(userChallengeParticipation.isCompleted, false),
      lte(weeklyChallenge.startDate, sql`${todayISO}`),
      gte(weeklyChallenge.endDate, sql`${todayISO}`)
    ))
    .limit(1);

  if (activeChallenge.length > 0) {
    generatedNotifications.push({
      type: 'challenge',
      title: 'Active Challenge',
      message: `Keep working on the "${activeChallenge[0].challenge.title}" challenge!`
    });
  }

  // 5. Mood entry reminder (if no entry today)
  const todaysMood = await db
    .select()
    .from(moodData)
    .where(and(
      eq(moodData.userId, userId),
      gte(moodData.timestamp, sql`${todayISO}`)
    ))
    .limit(1);

  if (todaysMood.length === 0) {
    generatedNotifications.push({
      type: 'mood',
      title: 'Daily Mood Check',
      message: `How are you feeling today? Don't forget to log your mood.`
    });
  }

  // 6. Journal reminder (if no entry in last 2 days)
  const recentJournalEntry = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt))
    .limit(1);

  if (recentJournalEntry.length > 0) {
    const daysSinceLastEntry = Math.floor((today.getTime() - new Date(recentJournalEntry[0].createdAt).getTime()) / (1000 * 3600 * 24));
    if (daysSinceLastEntry >= 2) {
      generatedNotifications.push({
        type: 'journal',
        title: 'Journal Reminder',
        message: `It's been a couple of days since your last journal entry. How about writing a new one?`
      });
    }
  }

  // 7. Gratitude reminder (if no entry today)
  const todaysGratitude = await db
    .select()
    .from(gratitudeEntries)
    .where(and(
      eq(gratitudeEntries.userId, userId),
      gte(gratitudeEntries.createdAt, sql`${todayISO}`)
    ))
    .limit(1);

  if (todaysGratitude.length === 0) {
    generatedNotifications.push({
      type: 'gratitude',
      title: 'Daily Gratitude',
      message: `What are you grateful for today? Take a moment to reflect and log your gratitude.`
    });
  }

  // 8. Emotional wellbeing goals reminder (if any incomplete)
  const incompleteEmotionalGoals = await db
    .select()
    .from(emotionalWellbeingGoals)
    .where(and(
      eq(emotionalWellbeingGoals.userId, userId),
      eq(emotionalWellbeingGoals.completed, false)
    ))
    .limit(1);

  if (incompleteEmotionalGoals.length > 0) {
    generatedNotifications.push({
      type: 'emotionalGoal',
      title: 'Emotional Wellbeing Check',
      message: `You have incomplete emotional wellbeing goals. Take some time to work on them today.`
    });
  }

  // Limit to a maximum of 5 notifications to avoid overwhelming the user
  return generatedNotifications.slice(0, 5);
}