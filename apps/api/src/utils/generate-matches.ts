import type { member } from '@/db/schemas'

type Members = (typeof member.$inferSelect)[]

export async function generateMatchesFn(members: Members) {
  let attempts = 0
  const maxAttempts = 100

  while (attempts < maxAttempts) {
    try {
      const shuffledMembers = [...members].sort(() => Math.random() - 0.5)
      const matches: { giverId: string; receiverId: string }[] = []
      const usedReceivers = new Set<string>()

      for (let i = 0; i < shuffledMembers.length; i++) {
        const giver = shuffledMembers[i]
        let receiver = null

        // Find a valid receiver that isn't the giver and hasn't been used
        for (let j = 0; j < shuffledMembers.length; j++) {
          const potentialReceiver = shuffledMembers[j]
          if (
            potentialReceiver.userId !== giver.userId &&
            !usedReceivers.has(potentialReceiver.userId)
          ) {
            receiver = potentialReceiver
            break
          }
        }

        if (!receiver) {
          // If we couldn't find a valid receiver, start over
          throw new Error('Invalid matching configuration')
        }

        matches.push({
          giverId: giver.userId,
          receiverId: receiver.userId,
        })
        usedReceivers.add(receiver.userId)
      }

      return { matches }
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        throw new Error(
          'Unable to generate valid matches after maximum attempts',
        )
      }
    }
  }

  throw new Error('Unable to generate matches')
}
