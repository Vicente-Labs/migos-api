import { createId } from '@paralleldrive/cuid2'
import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

import { groups, users } from '.'

export const inviteStatus = pgEnum('invite_status', [
  'PENDING',
  'ACCEPTED',
  'REJECTED',
])

export const invites = pgTable('invites', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  email: text('email').unique(),

  inviterId: text('inviter_id')
    .references(() => users.id)
    .notNull(),
  groupId: text('group_id')
    .references(() => groups.id)
    .notNull(),

  status: inviteStatus('status').notNull().default('PENDING'),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const inviteRelations = relations(invites, ({ one }) => ({
  inviter: one(users, {
    fields: [invites.inviterId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [invites.groupId],
    references: [groups.id],
  }),
}))
