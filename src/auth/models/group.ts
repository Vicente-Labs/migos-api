import { z } from 'zod'

import { planSchema } from '../plan'
import { roleSchema } from '../role'

export const groupSchema = z.object({
  __typename: z.literal('group').default('group'),
  id: z.string(),
  ownerId: z.string(),
  ownerPlan: planSchema,
  role: roleSchema,
  isMember: z.boolean().default(false),
  membersCount: z.number().default(0),
  userGroupsCount: z.number().default(0),
  timesMatchesGenerated: z.number().default(0),
})

export type Group = z.infer<typeof groupSchema>
