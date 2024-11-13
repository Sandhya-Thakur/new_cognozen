// app/api/habits/create/route.ts

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { habits, habitDetails } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { z } from "zod"; // For validation

// Define types for the schedule and reminder JSONB structures
interface ScheduleData {
  startDate: string;
  selectedDays?: string[];
  time: string;
  repeat: 'daily' | 'weekly' | 'monthly';
}

interface ReminderData {
  time: number;
  unit: 'minutes_before' | 'hours_before' | 'days_before';
  enabled: boolean;
}

// Request body validation schema
const createHabitSchema = z.object({
  // Basic Info
  name: z.string().min(1).max(100),
  description: z.string().optional(),
  
  // Habit Type and Schedule
  habitType: z.enum(['routine', 'challenge']),
  frequency: z.enum(['daily', 'weekly', 'monthly']),
  schedule: z.object({
    startDate: z.string(),
    selectedDays: z.array(z.string()).optional(),
    time: z.string(),
    repeat: z.enum(['daily', 'weekly', 'monthly'])
  }),
  
  // Optional fields
  endDate: z.string().optional(),
  challengeLength: z.number().optional(),
  timePerSession: z.number().min(1).optional(),
  timeOfDay: z.string().optional(),
  
  // Reminder settings
  reminder: z.object({
    time: z.number(),
    unit: z.enum(['minutes_before', 'hours_before', 'days_before']),
    enabled: z.boolean()
  }).optional(),
  
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
    const validatedData = createHabitSchema.parse(body);

    // Extract schedule data
    const scheduleData: ScheduleData = {
      startDate: validatedData.schedule.startDate,
      selectedDays: validatedData.schedule.selectedDays,
      time: validatedData.schedule.time,
      repeat: validatedData.schedule.repeat
    };

    // Extract reminder data if provided
    const reminderData: ReminderData | undefined = validatedData.reminder ? {
      time: validatedData.reminder.time,
      unit: validatedData.reminder.unit,
      enabled: validatedData.reminder.enabled
    } : undefined;

    // Create transaction for atomic operation
    const habitData = await db.transaction(async (tx) => {
      // Create main habit record
      const [newHabit] = await tx
        .insert(habits)
        .values({
          userId,
          name: validatedData.name,
          description: validatedData.description,
          frequency: validatedData.frequency,
          timeOfDay: validatedData.timeOfDay,
          status: 'upcoming', // Default status
          dailyAchieved: false,
          isActive: true
        })
        .returning();

      // Create habit details record
      const [newHabitDetails] = await tx
        .insert(habitDetails)
        .values({
          habitId: newHabit.id,
          habitType: validatedData.habitType,
          schedule: scheduleData,
          endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
          challengeLength: validatedData.challengeLength,
          timePerSession: validatedData.timePerSession,
          reminder: reminderData,
          showOnScheduledTime: validatedData.showOnScheduledTime,
          tags: validatedData.tags
        })
        .returning();

      return {
        ...newHabit,
        details: newHabitDetails
      };
    });

    return NextResponse.json({
      message: "Habit created successfully",
      habit: habitData
    });

  } catch (error) {
    console.error("Error creating habit:", error);
    
    // Zod validation error handling
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Validation error",
        details: error.errors
      }, { status: 400 });
    }

    return NextResponse.json(
      { error: "An error occurred while creating the habit" },
      { status: 500 }
    );
  }
}