import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const languageEnum = pgEnum('language', ['en-US', 'pt-BR', 'es-ES'])

export const preRegisters = pgTable('pre_registers', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  email: varchar('email', { length: 255 }).notNull().unique(),
  language: languageEnum('language').notNull().default('en-US'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
