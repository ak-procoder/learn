"use client"

import Link from "next/link"
import { Mail, Github, Twitter } from "lucide-react"
import { useState } from "react"

export function Footer() {
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)

  // Enhanced email click handler with clipboard copying
  const handleEmailClick = async () => {
    // Don't prevent the mailto link from working
    try {
      await navigator.clipboard.writeText('info@procoder.work')
      
      // Show success feedback
      setShowCopiedMessage(true)
      setTimeout(() => setShowCopiedMessage(false), 2000) // Hide after 2 seconds
      
    } catch {
      // Silently fail - mailto link still works normally
      console.log('Clipboard not available, mailto will still work')
    }
  }

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        {/* Combined Connect and Copyright Section */}
        <div className="text-center space-y-3 relative">
          {/* Social Links - Compact Layout */}
          <div className="flex justify-center items-center gap-4 sm:gap-6">
            <Link 
              href="mailto:info@procoder.work" 
              onClick={handleEmailClick}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
              aria-label="Email us - Click to open email client and copy address"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <Mail className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors hidden sm:block">
                info@procoder.work
              </span>
            </Link>

            <Link 
              href="https://github.com/ak-procoder" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
              aria-label="Visit our GitHub"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <Github className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors hidden sm:block">
                @ak-procoder
              </span>
            </Link>

            <Link 
              href="https://twitter.com/akprocoder" 
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-all duration-300"
              aria-label="Follow us on Twitter"
            >
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 group-hover:from-primary/20 group-hover:to-secondary/20 transition-all duration-300">
                <Twitter className="h-4 w-4 text-primary group-hover:scale-110 transition-transform duration-300" />
              </div>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors hidden sm:block">
                @akprocoder
              </span>
            </Link>
          </div>
          
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2025 ProCoder. All rights reserved. | Let&apos;s stay connected and build something amazing together
          </p>
        </div>
      </div>

      {/* Toast Notification - Fixed Position */}
      {showCopiedMessage && (
        <div className="fixed bottom-6 right-6 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium shadow-lg border border-primary/20 animate-in slide-in-from-right-5 fade-in-0 duration-100 z-50">
          <div className="flex items-center gap-2">
            <span className="text-green-200">✅</span>
            <span>Email copied to clipboard!</span>
          </div>
        </div>
      )}
    </footer>
  )
}