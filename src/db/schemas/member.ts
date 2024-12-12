import { relations } from 'drizzle-orm'
import { index, pgEnum, pgTable, text, unique } from 'drizzle-orm/pg-core'

import { groups, users } from '.'

export const memberRole = pgEnum('member_role', ['ADMIN', 'MEMBER'])

export const member = pgTable(
  'member',
  {
    userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }),
    groupId: text('group_id').references(() => groups.id, {
      onDelete: 'cascade',
    }),

    role: memberRole('role').notNull().default('MEMBER'),
    giftTip: text('gift_tip'),
    matchId: text('match_id').references(() => users.id, {
      onDelete: 'set null',
    }),
  },
  (t) => ({
    idx: index('idx_member_user_group').on(t.userId, t.groupId),
    unique: unique().on(t.userId, t.groupId),
  }),
)

export const memberRelations = relations(member, ({ one }) => ({
  group: one(groups, {
    fields: [member.groupId],
    references: [groups.id],
  }),
  match: one(users, {
    fields: [member.matchId],
    references: [users.id],
  }),
}))
