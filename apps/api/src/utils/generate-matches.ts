import type { member } from '@/db/schemas'

type Members = (typeof member.$inferSelect)[]

export async function generateMatchesFn(members: Members) {
  const shuffledMembers = members.sort(() => Math.random() - 0.5)

  const matches = shuffledMembers.map((member, index) => ({
    giverId: member.userId,
    receiverId: shuffledMembers[(index + 1) % shuffledMembers.length].userId,
  }))

  return { matches }
}
