import { z } from 'zod'

export const groupSchema = z.object({
  __typename: z.literal('group').default('group'),
  id: z.string(),
  ownerId: z.string(),
  isMember: z.boolean().default(false),
})

export type Group = z.infer<typeof groupSchema>
