import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { invites } from './invites'
import { member } from './member'
import { users } from './users'

export const groups = pgTable('groups', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  description: text('description'),
  budget: integer('budget'),

  avatarUrl: text('avatar_url'),

  ownerId: text('owner_id')
    .references(() => users.id)
    .notNull(),

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
