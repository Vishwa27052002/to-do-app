import { pgTable, text, timestamp, boolean, uuid } from "drizzle-orm/pg-core";

export const todos = pgTable("todos", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: text("user_id").notNull(),
    text: text("text").notNull(),
    completed: boolean("completed").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    reminderDate: timestamp("reminder_date"),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
