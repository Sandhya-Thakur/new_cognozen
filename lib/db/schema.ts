import {
<<<<<<< HEAD
    integer,
    pgEnum,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    doublePrecision 

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
=======
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
>>>>>>> 73239b525beb90395278205e6fac4fc356c7a6a0

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

// attention data


export const attentionData = pgTable("attentionData", {
  id: serial("id").primaryKey(), // Primary key column
  level: doublePrecision("level").notNull(), // Use doublePrecision for float values
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  userId: varchar("user_id", { length: 256 }).notNull(),
});
<<<<<<< HEAD

export type AttentionData = typeof attentionData.$inferSelect;







  

  
=======
>>>>>>> 73239b525beb90395278205e6fac4fc356c7a6a0
