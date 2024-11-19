import Link from 'next/link'

import { Button } from './ui/button'

export default function Header() {
  return (
    <header className="flex items-center justify-between font-poppins">
      <Link href="/" className="text-3xl font-semibold">
        migos
      </Link>

      <div className="flex items-center gap-4 text-xl font-medium">
        <ul className="flex items-center gap-4">
          <li>
            <Link href="#about-us">about us</Link>
          </li>
          <li>
            <Link href="#about-us">plans</Link>
          </li>
        </ul>

        <span className="size-[6px] rounded-full bg-[#4E4F4C]" />

        <div className="flex items-center gap-2">
          <Link href="/sign-up">sign up</Link>
          <Button className="px-6 py-0.5 text-xl font-medium">sign in</Button>
        </div>
      </div>
    </header>
  )
}
