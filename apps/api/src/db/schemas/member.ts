import { relations } from 'drizzle-orm'
import { pgEnum, pgTable, text } from 'drizzle-orm/pg-core'

import { groups, users } from '.'

export const memberRole = pgEnum('member_role', ['ADMIN', 'MEMBER'])

export const member = pgTable('member', {
  userId: text('user_id').references(() => users.id),
  groupId: text('group_id').references(() => groups.id),

  role: memberRole('role').notNull().default('MEMBER'),
  giftTip: text('gift_tip'),
})

export const memberRelations = relations(member, ({ one }) => ({
  group: one(groups, {
    fields: [member.groupId],
    references: [groups.id],
  }),
}))
