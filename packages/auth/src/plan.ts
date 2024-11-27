import { z } from 'zod'

export const planSchema = z.union([z.literal('BASIC'), z.literal('PRO')])

export type Plan = z.infer<typeof planSchema>
