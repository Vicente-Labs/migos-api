import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import type { Role } from './role'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can }) => {
    can('manage', 'all')
  },
  MEMBER: (user, { can, cannot }) => {
    can('get', 'group', { isMember: { $eq: true } })
    can(['update', 'delete'], 'group', { ownerId: { $eq: user.id } })

    cannot('create', 'group')
    can('create', 'group', {
      ownerPlan: { $eq: 'PRO' },
      groups: { $lte: 5 },
    })
    can('create', 'group', {
      ownerPlan: { $eq: 'BASIC' },
      groups: { $lte: 2 },
    })
  },
}
