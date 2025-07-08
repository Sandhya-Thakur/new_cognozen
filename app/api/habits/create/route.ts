// app/api/habits/create/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitDetails } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

// Define types for the schedule and reminder JSONB structures
interface ScheduleData {
  startDate: string;
  selectedDays?: string[];
  repeat: 'daily' | 'everyday' | 'weekly' | 'monthly';
}

interface ReminderData {
  time: number;
  unit: 'minutes_before' | 'hours_before' | 'days_before' | 'at_time_scheduled';
  enabled: boolean;
}

// FIXED: Request body validation schema to match frontend exactly
const createHabitSchema = z.object({
  // Basic Info
  name: z.string().min(1).max(100),
  
  // Habit Type
  habitType: z.enum(['routine', 'challenge']),
  
  // Schedule - FIXED: Match frontend structure
  schedule: z.object({
    startDate: z.string(), // "November 26, 2024 @ 8:00 AM"
    repeat: z.enum(['daily', 'everyday', 'weekly', 'monthly']),
    selectedDays: z.array(z.string()).optional() // Only for weekly
  }),
  
  // Optional fields - FIXED: Match frontend exactly
  endDate: z.string().optional(), // "December 31, 2024"
  challengeLength: z.union([z.string(), z.number(), z.null()]).optional(), // Can be string, number, or null
  timePerSession: z.union([z.string(), z.number()]).optional(), // Can be string or number
  
  // Reminder - FIXED: Frontend sends as separate fields
  reminder: z.string().optional(), // "10" (just the number)
  reminderUnit: z.string().optional().default("Minutes before"), // "Minutes before", "Hours before", etc.
  
  // Display settings
  showOnScheduledTime: z.boolean().default(true),
  
  // Tags
  tags: z.array(z.string()).default([])
});

export async function POST(req: Request) {
  try {
    // Auth check
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse and validate request body
    const body = await req.json();
    console.log("Received body:", JSON.stringify(body, null, 2)); // Debug log
    
    const validatedData = createHabitSchema.parse(body);
    console.log("Validated data:", JSON.stringify(validatedData, null, 2)); // Debug log

    // FIXED: Extract and parse time from startDate
    const extractTimeFromSchedule = (startDate: string) => {
      if (startDate.includes('@')) {
        const [datePart, timePart] = startDate.split('@');
        return {
          date: datePart.trim(),
          time: timePart.trim()
        };
      }
      return {
        date: startDate,
        time: "8:00 AM" // Default time
      };
    };

    const { date, time } = extractTimeFromSchedule(validatedData.schedule.startDate);

    // FIXED: Create schedule data matching database structure
    const scheduleData: ScheduleData = {
      startDate: validatedData.schedule.startDate,
      selectedDays: validatedData.schedule.selectedDays,
      repeat: validatedData.schedule.repeat
    };

    // FIXED: Convert reminder to proper format
    const createReminderData = (): ReminderData | undefined => {
      if (!validatedData.reminder) return undefined;
      
      const reminderTime = parseInt(validatedData.reminder);
      if (isNaN(reminderTime)) return undefined;

      // Convert frontend reminder unit to database format
      let unit: 'minutes_before' | 'hours_before' | 'days_before' | 'at_time_scheduled';
      switch (validatedData.reminderUnit?.toLowerCase()) {
        case 'hours before':
          unit = 'hours_before';
          break;
        case 'days before':
          unit = 'days_before';
          break;
        case 'at time scheduled':
          unit = 'at_time_scheduled';
          break;
        default:
          unit = 'minutes_before';
      }

      return {
        time: reminderTime,
        unit: unit,
        enabled: true
      };
    };

    const reminderData = createReminderData();

    // FIXED: Convert string/number to integers safely
    const parseIntSafe = (value: string | number | null | undefined): number | undefined => {
      if (value === null || value === undefined) return undefined;
      if (typeof value === 'number') return value;
      if (typeof value === 'string') {
        const parsed = parseInt(value);
        return isNaN(parsed) ? undefined : parsed;
      }
      return undefined;
    };

    // FIXED: Extract frequency from schedule.repeat
    const frequency = validatedData.schedule.repeat === 'everyday' ? 'daily' : validatedData.schedule.repeat;

    // FIXED: Remove transaction since neon-http doesn't support it
    // Create main habit record first
    const [newHabit] = await db
      .insert(habits)
      .values({
        userId,
        name: validatedData.name,
        description: undefined, // Frontend doesn't send description
        frequency: frequency, // Use converted frequency
        timeOfDay: time, // Extracted time from schedule
        status: 'upcoming',
        dailyAchieved: false,
        isActive: true
      })
      .returning();

    // Create habit details record
    const [newHabitDetails] = await db
      .insert(habitDetails)
      .values({
        habitId: newHabit.id,
        habitType: validatedData.habitType,
        schedule: scheduleData,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
        challengeLength: parseIntSafe(validatedData.challengeLength),
        timePerSession: parseIntSafe(validatedData.timePerSession),
        reminder: reminderData,
        showOnScheduledTime: validatedData.showOnScheduledTime,
        tags: validatedData.tags
      })
      .returning();

    const habitData = {
      ...newHabit,
      details: newHabitDetails
    };

    return NextResponse.json({
      message: "Habit created successfully",
      habit: habitData
    });

  } catch (error) {
    console.error("Error creating habit:", error);
    
    // Zod validation error handling
    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.errors);
      return NextResponse.json({
        error: "Validation error",
        details: error.errors,
        receivedData: await req.json().catch(() => "Could not parse request body")
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An error occurred while creating the habit" },
      { status: 500 }
    );
  }
}