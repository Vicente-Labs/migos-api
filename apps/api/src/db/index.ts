import { faker } from '@faker-js/faker'
import { hash } from 'bcryptjs'
import { drizzle } from 'drizzle-orm/node-postgres'
import { reset } from 'drizzle-seed'

import { env } from '../env'
import * as schema from './schemas'
import { groups, member, users } from './schemas'

export const db = drizzle(env.DATABASE_URL, { schema, logger: true })

async function seedDatabase() {
  await db.transaction(async (tx) => {
    await reset(tx, schema)

    const owner = await tx
      .insert(users)
      .values({
        name: 'John Doe',
        email: 'john.doe@example.com',
        passwordHash: await hash('12345678', 1),
        avatarUrl: faker.image.avatarGitHub(),
        plan: 'BASIC',
      })
      .returning()

    const group = await tx
      .insert(groups)
      .values({
        name: faker.company.name(),
        description: faker.lorem.sentence(),
        budget: '300',
        avatarUrl: faker.image.avatarGitHub(),
        timesMatchesGenerated: 0,
        ownerId: owner[0].id,
        endDate: new Date(faker.date.future()),
        drawDate: new Date(faker.date.future()),
      })
      .returning()

    await tx.insert(member).values({
      groupId: group[0].id,
      userId: owner[0].id,
      role: 'ADMIN',
    })

    const members = []

    for (let i = 0; i < 10; i++) {
      const user = await tx
        .insert(users)
        .values({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          passwordHash: faker.internet.password(),
          avatarUrl: faker.image.avatarGitHub(),
          plan: faker.helpers.arrayElement(['BASIC', 'PRO']),
        })
        .returning()

      await tx.insert(member).values({
        groupId: group[0].id,
        userId: user[0].id,
        role: 'MEMBER',
      })

      members.push(user[0].id)
    }
  })
}

if (env.NODE_ENV === 'development') seedDatabase()
