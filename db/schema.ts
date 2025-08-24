import { sql } from "drizzle-orm";
import { pgTable, text, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  prompt: text("prompt").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const renders = pgTable("renders", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").notNull().references(() => projects.id),
  status: varchar("status", { length: 32 }).notNull().default("queued"),
  storyboardJson: text("storyboard_json"),
  videoUrl: text("video_url"),
  error: text("error"),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});