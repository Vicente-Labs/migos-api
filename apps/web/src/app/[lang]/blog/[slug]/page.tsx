import fs from 'fs'
import { serialize } from 'next-mdx-remote/serialize'
import path from 'path'

import { MDXRenderer } from '@/components/mdx-render'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import type { Language } from '@/types/languages'

interface BlogPostProps {
  params: {
    slug: string
    lang: Language
  }
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug, lang } = params
  const filePath = path.join(
    process.cwd(),
    'src',
    'blog-posts',
    slug,
    `${lang}.mdx`,
  )

  const title = slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  const source = fs.readFileSync(filePath, 'utf8')
  const mdxSource = await serialize(source)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}`}>Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/blog`}>Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/blog/${slug}`}>
              {title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <article>
        <MDXRenderer source={mdxSource} />
      </article>
    </div>
  )
}
