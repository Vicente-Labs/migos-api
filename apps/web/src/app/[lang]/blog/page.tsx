'use client'

import Link from 'next/link'

import { useLanguage } from '@/context/language'

const posts = [
  {
    slug: 'how-we-were-born-technically-speaking',
    title: {
      'en-US': 'How Migos was Born (Technically Speaking)',
      'es-ES': 'Cómo Nació Migos (Técnicamente)',
      'pt-BR': 'Como o Migos Nasceu (Técnicamente)',
    },
  },
  {
    slug: 'how-we-were-born',
    title: {
      'en-US': 'How Migos was Born',
      'es-ES': 'Cómo Nació Migos',
      'pt-BR': 'Como o Migos Nasceu',
    },
  },
]

export default function BlogListing() {
  const { language } = useLanguage()

  return (
    <div className="mx-auto flex min-h-[calc(100vh-17rem)] max-w-4xl flex-col items-center px-6 py-8">
      <h1 className="mb-8 self-start text-4xl font-bold">Blog</h1>
      <div className="flex w-full max-w-4xl flex-col items-start justify-center gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/${language}/blog/${post.slug}`}
            className="group flex w-full max-w-4xl justify-between rounded-lg border p-6 transition-all hover:bg-gray-50 hover:shadow-md"
          >
            <h2 className="text-2xl font-semibold transition-colors group-hover:text-primary">
              {post.title[language]}
            </h2>
            <div className="mt-2 flex items-center text-primary">
              <span className="text-sm">Read more</span>
              <svg
                className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      <span className="mt-8 text-sm text-gray-500">more comming soon...</span>
    </div>
  )
}
