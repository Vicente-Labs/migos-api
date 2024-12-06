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
  MEMBER: (user, { can }) => {
    can('get', 'group', { isMember: { $eq: true } })
    can(['update', 'delete'], 'group', { ownerId: { $eq: user.id } })

    can('create', 'group')
  },
}
