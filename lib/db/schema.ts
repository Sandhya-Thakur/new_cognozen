import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  doublePrecision,
  boolean
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

export type EmotionalWellbeingGoal = typeof emotionalWellbeingGoals.$inferSelect;


// storing insights and tips

export const insightsAndTips = pgTable("insightsAndTips", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull(),
  mood: varchar("mood", { length: 50 }).notNull(),
  content : text("content").notNull(),
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

