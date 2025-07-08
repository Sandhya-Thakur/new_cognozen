//app/api/habits/all/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitDetails, habitCompletions } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq, and, desc, gte } from "drizzle-orm";
import { startOfDay, format, addDays } from 'date-fns';

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all user habits with their details
    const userHabits = await db
      .select({
        // Main habit info
        id: habits.id,
        name: habits.name,
        description: habits.description,
        frequency: habits.frequency,
        timeOfDay: habits.timeOfDay,
        isActive: habits.isActive,
        status: habits.status,
        dailyAchieved: habits.dailyAchieved,
        createdAt: habits.createdAt,
        updatedAt: habits.updatedAt,
        // Habit details
        habitType: habitDetails.habitType,
        schedule: habitDetails.schedule,
        endDate: habitDetails.endDate,
        challengeLength: habitDetails.challengeLength,
        timePerSession: habitDetails.timePerSession,
        reminder: habitDetails.reminder,
        showOnScheduledTime: habitDetails.showOnScheduledTime,
        tags: habitDetails.tags,
      })
      .from(habits)
      .leftJoin(habitDetails, eq(habits.id, habitDetails.habitId))
      .where(eq(habits.userId, userId))
      .orderBy(desc(habits.createdAt));

    // Get completion data for each habit to calculate streaks and progress
    const habitsWithProgress = await Promise.all(
      userHabits.map(async (habit) => {
        // Get recent completions for streak calculation
        const thirtyDaysAgo = format(addDays(new Date(), -30), 'yyyy-MM-dd');
        const completions = await db
          .select()
          .from(habitCompletions)
          .where(
            and(
              eq(habitCompletions.habitId, habit.id),
              gte(habitCompletions.completedAt, thirtyDaysAgo)
            )
          )
          .orderBy(desc(habitCompletions.completedAt));

        // Calculate current streak
        const calculateStreak = (completions: any[]) => {
          if (completions.length === 0) return 0;
          
          let streak = 0;
          let currentDate = new Date();
          
          for (let i = 0; i < completions.length; i++) {
            const completionDate = new Date(completions[i].completedAt);
            const daysDiff = Math.floor(
              (currentDate.getTime() - completionDate.getTime()) / (1000 * 60 * 60 * 24)
            );
            
            if (daysDiff === streak) {
              streak++;
            } else {
              break;
            }
          }
          
          return streak;
        };

        const currentStreak = calculateStreak(completions);

        // Calculate progress based on habit type
        let progress = { current: 0, total: 30 }; // Default 30-day goal
        
        if (habit.habitType === "challenge" && habit.challengeLength) {
          progress.total = habit.challengeLength;
          progress.current = completions.length;
        } else {
          // For routine habits, use 30-day progress
          progress.current = completions.length;
        }

        // Determine status based on recent activity
        let status = "Check-in";
        const today = format(new Date(), 'yyyy-MM-dd');
        const todayCompletion = completions.find(
          c => format(new Date(c.completedAt), 'yyyy-MM-dd') === today
        );

        if (todayCompletion) {
          status = "Daily Achieved";
        } else if (currentStreak > 0) {
          status = "On Track";
        } else {
          status = "Check-in";
        }

        // Calculate next occurrence
        const getNextOccurrence = (schedule: any, timeOfDay: string) => {
          if (!schedule) return "Not scheduled";
          
          const time = timeOfDay || "8:00 AM";
          
          switch (schedule.repeat) {
            case "daily":
            case "everyday":
              return `Tomorrow, ${time}`;
            case "weekly":
              if (schedule.selectedDays && schedule.selectedDays.length > 0) {
                return `Next ${schedule.selectedDays[0]}, ${time}`;
              }
              return `Weekly, ${time}`;
            case "monthly":
              return `Monthly, ${time}`;
            default:
              return "Not scheduled";
          }
        };

        // Get frequency days for weekly habits
        const getFrequencyDays = (schedule: any, frequency: string) => {
          if (frequency === "daily" || frequency === "everyday") {
            return ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
          } else if (frequency === "weekly" && schedule?.selectedDays) {
            return schedule.selectedDays;
          } else if (frequency === "monthly") {
            return ["Monthly"];
          }
          return [];
        };

        return {
          id: habit.id,
          name: habit.name,
          status: status,
          progress: progress,
          streak: currentStreak,
          frequency: habit.frequency?.charAt(0).toUpperCase() + habit.frequency?.slice(1) || "Daily",
          frequencyDays: getFrequencyDays(habit.schedule, habit.frequency || "daily"),
          nextOccurrence: getNextOccurrence(habit.schedule, habit.timeOfDay || "8:00 AM"),
          habitType: habit.habitType === "routine" ? "Routine Habit" : "Challenge Habit",
          isActive: habit.isActive,
          tags: habit.tags || [],
          timePerSession: habit.timePerSession,
          reminder: habit.reminder,
          endDate: habit.endDate,
          createdAt: habit.createdAt
        };
      })
    );

    return NextResponse.json({ 
      habits: habitsWithProgress,
      total: habitsWithProgress.length,
      active: habitsWithProgress.filter(h => h.isActive).length
    });

  } catch (error) {
    console.error("Error fetching all habits:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching habits" },
      { status: 500 }
    );
  }
}