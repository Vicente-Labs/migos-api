'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

import { AnimatedLink } from './animated-link'

interface MDXRendererProps {
  source: MDXRemoteSerializeResult
}

const components = {
  h1: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h1 className="mb-4 font-cooperBlack text-4xl font-bold" {...props} />
  ),
  h2: (props: React.HTMLProps<HTMLHeadingElement>) => (
    <h2 className="mb-4 font-cooperBlack text-3xl font-bold" {...props} />
  ),
  p: (props: React.HTMLProps<HTMLParagraphElement>) => (
    <p className="mb-4 text-lg font-normal" {...props} />
  ),
  ul: (props: React.HTMLProps<HTMLUListElement>) => (
    <ul className="mb-4 list-disc pl-6" {...props} />
  ),
  li: (props: React.HTMLProps<HTMLLIElement>) => (
    <li className="mb-2" {...props} />
  ),
  AnimatedLink: (props: React.HTMLProps<HTMLAnchorElement>) => {
    /* @ts-expect-error - MDXRemote doesn't pass a children in the expected way */
    return <AnimatedLink href={props.href as string} {...props} />
  },
}

export function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <article className="prose dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </article>
  )
}
