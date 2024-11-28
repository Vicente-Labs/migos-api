import type { Language } from './languages'

export interface BlogPost {
  slug: string
  title: Record<Language, string>
}
