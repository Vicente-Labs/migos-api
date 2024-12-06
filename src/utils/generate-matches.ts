import type { member } from '@/db/schemas'

type Members = (typeof member.$inferSelect)[]

export async function generateMatchesFn(members: Members) {
  let attempts = 0
  const maxAttempts = 100

  const matches: { giverId: string; receiverId: string }[] = []
  const usedReceivers = new Set<string>()
  let shuffleArray = [...members]

  while (attempts < maxAttempts) {
    try {
      matches.length = 0
      usedReceivers.clear()
      shuffleArray = [...members]

      for (let i = shuffleArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffleArray[i], shuffleArray[j]] = [shuffleArray[j], shuffleArray[i]]
      }

      for (let i = 0; i < shuffleArray.length; i++) {
        const giver = shuffleArray[i]
        let receiver = null

        for (let j = 0; j < shuffleArray.length; j++) {
          const potentialReceiver = shuffleArray[j]
          if (
            potentialReceiver.userId !== giver.userId &&
            !usedReceivers.has(potentialReceiver.userId)
          ) {
            receiver = potentialReceiver
            break
          }
        }

        if (!receiver) {
          throw new Error('Invalid matching configuration')
        }

        matches.push({
          giverId: giver.userId,
          receiverId: receiver.userId,
        })
        usedReceivers.add(receiver.userId)
      }

      return { matches: Array.from(matches) }
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        throw new Error(
          'Unable to generate valid matches after maximum attempts',
        )
      }
      shuffleArray.length = 0
    }
  }

  shuffleArray.length = 0
  throw new Error('Unable to generate matches')
}
