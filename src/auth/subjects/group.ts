import { z } from 'zod'

import { groupSchema } from '../models/group'

export const groupSubject = z.tuple([
  z.union([
    z.literal('manage'),
    z.literal('get'),
    z.literal('create'),
    z.literal('update'),
    z.literal('delete'),
    z.literal('sort'),
    z.literal('transfer_ownership'),
  ]),
  z.union([z.literal('group'), groupSchema]),
])

export type GroupSubject = z.infer<typeof groupSubject>
