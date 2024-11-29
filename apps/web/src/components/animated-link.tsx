import Link from 'next/link'

import { cn } from '@/lib/utils'

interface AnimatedLinkProps extends React.ComponentProps<'div'> {
  href: string
  target?: string
  children: React.ReactNode
}

export const AnimatedLink = ({
  href,
  target,
  className,
  children,
  ...props
}: AnimatedLinkProps) => {
  return (
    <span
      {...props}
      className={cn(
        (className =
          'relative w-fit text-primary after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-400 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100'),
        className,
      )}
    >
      <Link
        href={href}
        target={target}
        className="text-primary transition-colors hover:text-primary/80"
      >
        {children}
      </Link>
    </span>
  )
}
