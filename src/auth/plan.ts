import { z } from 'zod'

export const planSchema = z.enum(['BASIC', 'PRO'])

export type Plan = z.infer<typeof planSchema>
