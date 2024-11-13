import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  doublePrecision,
  boolean,
  json,
  date,
  time,
  unique,
  jsonb,

} from "drizzle-orm/pg-core";

export const userSystemEnum = pgEnum("user_system_enum", ["system", "user"]);

export const chats = pgTable("chats", {
  id: serial("id").primaryKey(),
  pdfName: text("pdf_name").notNull(),
  pdfUrl: text("pdf_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  fileKey: text("file_key").notNull(),
});

export type DrizzleChat = typeof chats.$inferSelect;

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export const summaries = pgTable("summaries", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
    .references(() => chats.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});


// Existing tables (chats, messages, etc.) remain unchanged

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  chatId: integer("chat_id")
  .references(() => chats.id)
  .notNull(),
  title: text("title").notNull(),
  description: text("description"),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  questionText: text("question_text").notNull(),
  options: json("options").notNull(), // Array of options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  order: integer("order").notNull(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id).notNull(),
  score: integer("score"),
  currentQuestionOrder: integer("current_question_order").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const quizResponses = pgTable("quiz_responses", {
  id: serial("id").primaryKey(),
  quizAttemptId: integer("quiz_attempt_id").references(() => quizAttempts.id).notNull(),
  questionId: integer("question_id").references(() => quizQuestions.id).notNull(),
  userAnswer: text("user_answer").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  answeredAt: timestamp("answered_at").notNull().defaultNow(),
});


// storing attention data for reading pdf

export const attentionData = pgTable("attentionData", {
  id: serial("id").primaryKey(), // Primary key column
  level: doublePrecision("level").notNull(), // Use doublePrecision for float values
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
});

export type AttentionData = typeof attentionData.$inferSelect;

// storing emotions data for reading pdf

export const emotionsData = pgTable("emotionsData", {
  id: serial("id").primaryKey(), // Primary key column
  angry: doublePrecision("angry").notNull(), // Floating-point type for emotion intensity values
  disgust: doublePrecision("disgust").notNull(), // Floating-point type for emotion intensity values
  fear: doublePrecision("fear").notNull(), // Floating-point type for emotion intensity values
  happy: doublePrecision("happy").notNull(), // Floating-point type for emotion intensity values
  neutral: doublePrecision("neutral").notNull(), // Floating-point type for emotion intensity values
  sad: doublePrecision("sad").notNull(), // Floating-point type for emotion intensity values
  surprise: doublePrecision("surprise").notNull(), // Floating-point type for emotion intensity values
  dominantEmotion: varchar("dominant_emotion", { length: 50 }).notNull(), // Varchar column
  timestamp: timestamp("timestamp").notNull().defaultNow(), // Timestamp column
  userId: varchar("user_id", { length: 256 }).notNull(),
});

export type EmotionsData = typeof emotionsData.$inferSelect;

// storing user data for taking quiz

export const quizAttentionData = pgTable("quizAttentionData", {
  id: serial("id").primaryKey(), // Primary key column
  level: doublePrecision("level").notNull(), // Use doublePrecision for float values
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
});

export type QuizAttentionData = typeof quizAttentionData.$inferSelect;

// storing emotions data for taking quiz

export const quizEmotionsData = pgTable("quizEmotionsData", {
  id: serial("id").primaryKey(), // Primary key column
  angry: doublePrecision("angry").notNull(), // Floating-point type for emotion intensity values
  disgust: doublePrecision("disgust").notNull(), // Floating-point type for emotion intensity values
  fear: doublePrecision("fear").notNull(), // Floating-point type for emotion intensity values
  happy: doublePrecision("happy").notNull(), // Floating-point type for emotion intensity values
  neutral: doublePrecision("neutral").notNull(), // Floating-point type for emotion intensity values
  sad: doublePrecision("sad").notNull(), // Floating-point type for emotion intensity values
  surprise: doublePrecision("surprise").notNull(), // Floating-point type for emotion intensity values
  dominantEmotion: varchar("dominant_emotion", { length: 50 }).notNull(), // Varchar column
  timestamp: timestamp("timestamp").notNull().defaultNow(), // Timestamp column
  userId: varchar("user_id", { length: 256 }).notNull(),
});

export type QuizEmotionsData = typeof quizEmotionsData.$inferSelect;

// storing mood data

export const moodData = pgTable("moodData", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mood: varchar("mood", { length: 50 }).notNull(),
  intensity: integer("intensity").notNull(),
  reasons: text("reasons").array().notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export type MoodData = typeof moodData.$inferSelect;

// storing  daily journal data

export const journalEntries = pgTable("journalEntries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type JournalEntry = typeof journalEntries.$inferSelect;

// upload gratitude data

export const gratitudeEntries = pgTable("gratitudeEntries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GratitudeEntry = typeof gratitudeEntries.$inferSelect;

// storing emotional wellbeing goals

export const emotionalWellbeingGoals = pgTable("emotionalWellbeingGoals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type EmotionalWellbeingGoal =
  typeof emotionalWellbeingGoals.$inferSelect;

// storing insights and tips

export const insightsAndTips = pgTable("insightsAndTips", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mood: varchar("mood", { length: 50 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type InsightData = typeof insightsAndTips.$inferSelect;

// storing suggested activities

export const suggestedActivities = pgTable("suggestedActivities", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mood: varchar("mood", { length: 50 }).notNull(),
  activities: text("activities").notNull(), // This will store JSON string of activities
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type SuggestedActivity = typeof suggestedActivities.$inferSelect;









// storing habit data
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  frequency: varchar("frequency", { length: 20 }).notNull(), // 'daily', 'weekly', 'monthly'
  timeOfDay: varchar("time_of_day", { length: 20 }), 
  isActive: boolean("is_active").default(true),
  status: varchar("status", { length: 20 }).default('upcoming'), // Add status field for 'upcoming', 'completed', 'missed', 'on_track'
  dailyAchieved: boolean("daily_achieved").default(false), // Add daily achievement tracking
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Modifications needed for the habitDetails table
export const habitDetails = pgTable("habit_details", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull().references(() => habits.id),
  habitType: varchar("habit_type", { length: 20 }).notNull(), // 'routine' or 'challenge'
  schedule: jsonb("schedule").notNull(), // Modify schedule structure to include:
  /* Example schedule JSON structure:
    {
      startDate: timestamp,
      selectedDays: string[], // ['Mo', 'We', 'Fr', 'Sa']
      time: string, // '8:30 AM'
      repeat: 'daily' | 'weekly' | 'monthly'
    }
  */
  endDate: timestamp("end_date"),
  challengeLength: integer("challenge_length"),
  timePerSession: integer("time_per_session"),
  reminder: jsonb("reminder"), // Modify reminder structure to include:
  /* Example reminder JSON structure:
    {
      time: number,
      unit: 'minutes_before' | 'hours_before' | 'days_before',
      enabled: boolean
    }
  */
  showOnScheduledTime: boolean("show_on_scheduled_time").default(true),
  tags: text("tags").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Modify habitCompletions to include journal entries
export const habitCompletions = pgTable(
  "habit_completions",
  {
    id: serial("id").primaryKey(),
    habitId: integer("habit_id").references(() => habits.id),
    completedAt: date("completed_at").notNull(),
    value: integer("value").notNull().default(1),
    journalEntry: text("journal_entry"), // Add journal entry field
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueHabitCompletion: unique().on(table.habitId, table.completedAt),
  })
);

// storing goal data
export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  habitId: integer("habit_id").references(() => habits.id),
  title: varchar("title", { length: 100 }).notNull(),
  description: text("description"),
  targetValue: integer("target_value").notNull(),
  currentValue: integer("current_value").default(0),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("in_progress"), // e.g., 'in_progress', 'completed', 'abandoned'
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Goal = typeof goals.$inferSelect;


export const habitInsights = pgTable("habit_insights", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  habitId: integer("habit_id").references(() => habits.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type HabitInsight = typeof habitInsights.$inferSelect;



export const weeklyChallenge = pgTable("weekly_challenges", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  habitId: integer("habit_id").references(() => habits.id),
  targetValue: integer("target_value").notNull(),
});

export const userChallengeParticipation = pgTable("user_challenge_participations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  challengeId: integer("challenge_id").references(() => weeklyChallenge.id),
  currentProgress: integer("current_progress").default(0),
  isCompleted: boolean("is_completed").default(false),
});

export type WeeklyChallenge = typeof weeklyChallenge.$inferSelect;
export type UserChallengeParticipation = typeof userChallengeParticipation.$inferSelect;


export const moodHabitCorrelations = pgTable("mood_habit_correlations", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  habitId: integer("habit_id").references(() => habits.id).notNull(),
  correlationData: json("correlation_data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type MoodHabitCorrelation = typeof moodHabitCorrelations.$inferSelect;







export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  seen: boolean("seen").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Notification = typeof notifications.$inferSelect;



// FAQs storage


export const FAQs = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  role: userSystemEnum("role").notNull(),
});

export type FAQs = typeof FAQs.$inferSelect;



export const TodoList = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type TodoList= typeof TodoList.$inferSelect;



