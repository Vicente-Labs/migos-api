import { z } from 'zod'

import { roleSchema } from '../role'

export const userSchema = z.object({
  __typename: z.literal('user').default('user'),
  id: z.string(),
  role: roleSchema,
})

export type User = z.infer<typeof userSchema>
