import { defineAbilitiesFor, type Role, userSchema } from '@migos/auth'

export function getUserPermissions(userId: string, role: Role) {
  const authUser = userSchema.parse({
    id: userId,
    role,
  })

  const ability = defineAbilitiesFor(authUser)

  return ability
}
