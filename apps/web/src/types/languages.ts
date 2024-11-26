export type Language = 'en-US' | 'es-ES' | 'pt-BR'

export type PageProps<T = unknown> = {
  searchParams: {
    [key: string]: string
  }
  params: {
    lang: Language
  } & T
}
