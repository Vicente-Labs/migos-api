import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const providerEnum = pgEnum('provider', ['GOOGLE'])

export const users = pgTable('users', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash'),
  avatarUrl: text('avatar_url'),

  provider: providerEnum('provider'),
  providerId: text('provider_id').unique(),

  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})
