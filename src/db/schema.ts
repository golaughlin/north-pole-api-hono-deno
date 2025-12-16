import {pgTable, serial, varchar, date, boolean, timestamp } from "drizzle-orm/pg-core"

// Create Children schema for database
export const childrenTable = pgTable('children', {
  id: serial().primaryKey(),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  dateOfBirth: date('date_of_birth').notNull(),
  hometown: varchar({ length: 150 }),
  isNice: boolean('is_nice').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type SelectChild = typeof childrenTable.$inferSelect
export type NewChild = typeof childrenTable.$inferInsert
