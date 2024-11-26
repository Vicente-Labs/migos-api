import { Language } from '@/types/languages'

const dictionaries = {
  'en-US': () =>
    import('@/../public/dictionaries/en-US.json').then((r) => r.default),
  'pt-BR': () =>
    import('@/../public/dictionaries/pt-BR.json').then((r) => r.default),
  'es-ES': () =>
    import('@/../public/dictionaries/es-ES.json').then((r) => r.default),
} as const

export const getDictionary = (lang: Language) => {
  const langFn = dictionaries[lang]

  return langFn ? langFn() : dictionaries['en-US']()
}
export type Dictionary = Awaited<ReturnType<typeof getDictionary>>
