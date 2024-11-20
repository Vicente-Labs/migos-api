import Link from 'next/link'

import { cn } from '@/lib/utils'

interface AnimatedLinkProps extends React.ComponentProps<'div'> {
  href: string
  children: React.ReactNode
}

export const AnimatedLink = ({
  href,
  className,
  children,
  ...props
}: AnimatedLinkProps) => {
  return (
    <div
      {...props}
      className={cn(
        'relative w-fit after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-bottom-right after:scale-x-0 after:bg-neutral-400 after:transition-transform after:duration-300 after:ease-in-out hover:after:origin-bottom-left hover:after:scale-x-100',
        className,
      )}
    >
      <Link href={href} className="text-primary">
        {children}
      </Link>
    </div>
  )
}
