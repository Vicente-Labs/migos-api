import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { decimal, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { invites } from './invites'
import { member } from './member'
import { users } from './users'

export const groups = pgTable('groups', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
  budget: decimal('budget', { precision: 10, scale: 2 }).notNull(),

  avatarUrl: text('avatar_url'),

  timesMatchesGenerated: integer('times_matches_generated')
    .notNull()
    .default(0),

  ownerId: text('owner_id')
    .references(() => users.id)
    .notNull(),

  endDate: timestamp('end_date').notNull(),
  drawDate: timestamp('draw_date'),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const groupsRelations = relations(groups, ({ many, one }) => ({
  members: many(member),
  owner: one(users, {
    fields: [groups.ownerId],
    references: [users.id],
  }),
  invites: many(invites),
}))
