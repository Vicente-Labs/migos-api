import { z } from 'zod'

import { planSchema } from '../plan'

export const groupSchema = z.object({
  __typename: z.literal('group').default('group'),
  id: z.string(),
  ownerId: z.string(),
  ownerPlan: planSchema,
  isMember: z.boolean().default(false),
  groups: z.number().default(0),
})

export type Group = z.infer<typeof groupSchema>
