'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MusicalNoteIcon, BookOpenIcon, Bars3Icon, XMarkIcon, PlusIcon } from '@heroicons/react/24/outline'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from '@/lib/utils'
import { routes } from '@/lib/routes'
import { Button } from '@/components/ui/button'
import CreateJamModal from './CreateJamModal'

const icons = {
  music: MusicalNoteIcon,
  library: BookOpenIcon
}

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const handleCreateJam = (newJam) => {
    setIsCreateModalOpen(false)
    router.push(`/${newJam.slug}`)
  }

  return (
    <div className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <span className="text-xl font-bold">Jam Vote</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavigationMenu>
                <NavigationMenuList>
                  {routes.map((route) => {
                    const Icon = icons[route.icon]
                    return (
                      <NavigationMenuItem key={route.path}>
                        <Link href={route.path} legacyBehavior passHref>
                          <NavigationMenuLink
                            className={cn(
                              navigationMenuTriggerStyle(),
                              pathname === route.path && "font-semibold relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[calc(100%-1rem)] after:h-0.5 after:bg-primary"
                            )}
                          >
                            <Icon className="w-4 h-4 mr-2" />
                            {route.name}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  })}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
            
            {/* Create Jam Button */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              variant="default"
              size="sm"
              className="hidden md:inline-flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              Create a Jam
            </Button>
            
            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                className="px-0"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {routes.map((route) => {
              const Icon = icons[route.icon]
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm rounded-md relative',
                    pathname === route.path
                      ? 'font-semibold after:content-[\'\'] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-[calc(100%-1rem)] after:h-0.5 after:bg-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {route.name}
                </Link>
              )
            })}
            <Button
              onClick={() => {
                setIsCreateModalOpen(true)
                setIsMobileMenuOpen(false)
              }}
              variant="default"
              size="sm"
              className="w-full justify-start mt-2"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create a Jam
            </Button>
          </div>
        </div>
      )}

      <CreateJamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateJam={handleCreateJam}
      />
    </div>
  )
} 