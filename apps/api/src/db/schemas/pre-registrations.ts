import { createId } from '@paralleldrive/cuid2'
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const preRegisters = pgTable('pre_registers', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  email: varchar('email', { length: 255 }).notNull().unique(),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
