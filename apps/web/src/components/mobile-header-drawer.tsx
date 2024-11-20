import Link from 'next/link'

import { Button } from './ui/button'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer'

type MobileHeaderDrawerProps = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function MobileHeaderDrawer({
  isOpen,
  setIsOpen,
}: MobileHeaderDrawerProps) {
  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="mb-10">
        <DrawerHeader>
          <DrawerTitle className="sr-only">migos</DrawerTitle>
        </DrawerHeader>
        <div className="-mt-10 flex h-28 flex-row items-center justify-center gap-4 text-xl">
          <Button size="lg" variant="outline">
            <Link href="/about">about us</Link>
          </Button>
          <Button size="lg" variant="outline">
            <Link href="/contact">plans</Link>
          </Button>

          <Button size="lg" variant="outline">
            <Link href="/sign-up">sign up</Link>
          </Button>

          <Button size="lg" variant="outline">
            <Link href="/sign-in">login</Link>
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
