import { AbilityBuilder } from '@casl/ability'

import { AppAbility } from '.'
import { User } from './models/user'
import type { Role } from './role'

type PermissionsByRole = (
  user: User,
  builder: AbilityBuilder<AppAbility>,
) => void

export const permissions: Record<Role, PermissionsByRole> = {
  ADMIN: (_, { can, cannot }) => {
    can('manage', 'all')

    cannot('sort', 'group')
    can('sort', 'group', {
      timesMatchesGenerated: { $eq: 0 }, // idk why but it means 0
      ownerPlan: { $eq: 'BASIC' },
      isMember: { $eq: true },
      role: { $eq: 'ADMIN' },
    })
    can('sort', 'group', {
      timesMatchesGenerated: { $lte: 1 }, // idk why but it means 2
      ownerPlan: { $eq: 'PRO' },
      isMember: { $eq: true },
      role: { $eq: 'ADMIN' },
    })
  },
  MEMBER: (user, { can, cannot }) => {
    can('get', 'group', { isMember: { $eq: true } })
    can(['update', 'delete'], 'group', { ownerId: { $eq: user.id } })

    cannot('create', 'group')
    can('create', 'group', {
      ownerPlan: { $eq: 'BASIC' },
      userGroupsCount: { $lte: 1 }, // idk why but it means 2
    })
    can('create', 'group', {
      ownerPlan: { $eq: 'PRO' },
      userGroupsCount: { $lte: 4 }, // idk why but it means 5
    })
  },
}
