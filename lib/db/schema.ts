import { pgTable, text, timestamp, integer, serial } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk userId
  leetcodeUsername: text('leetcode_username'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const snapshots = pgTable('snapshots', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  totalSolved: integer('total_solved').notNull(),
  easy: integer('easy').notNull(),
  medium: integer('medium').notNull(),
  hard: integer('hard').notNull(),
  capturedAt: timestamp('captured_at').defaultNow().notNull(),
})