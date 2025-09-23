"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Menu, 
  GraduationCap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/20 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 shadow-lg shadow-primary/5">
      <div className="container pl-4 flex h-16 max-w-screen-2xl items-center">
        {/* Logo */}
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-3 group">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              ProCoder Learning
            </span>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-2 py-2 text-base hover:bg-secondary/10 focus-visible:bg-secondary/10 focus-visible:ring-2 focus-visible:ring-primary md:hidden rounded-xl transition-all duration-200"
            >
              <Menu className="h-6 w-6 text-primary" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0 bg-card/95 backdrop-blur-xl border-border/20">
            <SheetHeader>
              <SheetTitle>
                <Link
                  href="/"
                  className="flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <span className="font-bold">ProCoder</span>
                </Link>
              </SheetTitle>
              <SheetDescription>
                Navigate through your learning journey
              </SheetDescription>
            </SheetHeader>
            <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
              <div className="flex flex-col space-y-3">
                <p className="text-sm text-muted-foreground">Navigation items will be added here.</p>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Logo */}
        <div className="flex md:hidden">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-md group-hover:shadow-lg transition-all duration-300">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">ProCoder</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium hidden md:flex flex-1">
          {/* Navigation items will be added here */}
        </nav>

        {/* Take me Home Button - Only show when not on home page */}
        {pathname !== "/" && (
          <div className="flex items-center">
            <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Link href="/" className="flex items-center gap-2">
                <span>Take me Home</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}