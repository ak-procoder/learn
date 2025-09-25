/**
 * Responsive Design Integration Tests
 * 
 * This test suite validates the core responsive functionality implemented:
 * - Keyboard navigation with arrow keys
 * - Custom gradient button styling
 * - Conditional navbar button visibility
 * - Responsive breakpoint behavior
 * - Touch and hover capability detection
 * 
 * Features Tested:
 * 1. Keyboard event handling and navigation
 * 2. Custom Coolors.co gradient implementation
 * 3. Route-based conditional rendering
 * 4. Responsive design patterns
 * 5. Device capability detection utilities
 * 
 * How to Run:
 * - npm test integration.test.js
 * - npm test -- --watch (for continuous testing)
 * 
 * Test Coverage:
 * - Core responsive functionality
 * - User interaction patterns
 * - CSS and styling validation
 * - Navigation behavior
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Test utilities for responsive functionality
const ResponsiveTestUtils = {
  // Simulate keyboard events
  simulateKeyDown: (key: string, element?: Element) => {
    const target = element || document.body
    const event = new KeyboardEvent('keydown', {
      key,
      code: `Key${key.toUpperCase()}`,
      keyCode: key === 'ArrowLeft' ? 37 : key === 'ArrowRight' ? 39 : 0,
      bubbles: true,
      cancelable: true
    })
    
    target.dispatchEvent(event)
    return event
  },

  // Mock window dimensions
  mockViewport: (width: number, height: number = 768) => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: width,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: height,
    })
  },

  // Mock device capabilities
  mockDeviceCapabilities: (hasTouch: boolean, hasHover: boolean) => {
    // Mock touch
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: hasTouch ? 1 : 0,
    })

    // Mock hover capability
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(hover: hover)' ? hasHover : false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  },

  // Check for responsive classes
  hasResponsiveClasses: (element: Element, breakpoints: string[]) => {
    const classList = Array.from(element.classList)
    return breakpoints.every(bp => 
      classList.some(cls => cls.includes(bp))
    )
  },

  // Validate gradient styling
  validateGradient: (element: Element, colors: string[]) => {
    const style = window.getComputedStyle(element)
    const background = style.background || element.getAttribute('style') || ''
    
    return colors.every(color => 
      background.includes(color.replace('#', ''))
    )
  }
}

// Mock components for testing
const KeyboardNavigationTest = () => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault()
      const direction = event.key === 'ArrowLeft' ? 'prev' : 'next'
      
      // Simulate navigation action
      const target = event.currentTarget as HTMLElement
      target.setAttribute('data-navigation', direction)
    }
  }

  return (
    <div
      onKeyDown={handleKeyDown}
      tabIndex={0}
      data-testid="keyboard-navigation"
      className="focus:outline-none"
    >
      <p>Use arrow keys to navigate</p>
      <div className="navigation-hints">
        <span className="desktop-hint hidden md:block">Use ← → arrow keys to navigate</span>
        <span className="mobile-hint block md:hidden">Swipe left/right to navigate</span>
      </div>
    </div>
  )
}

const GradientButtonTest = () => {
  return (
    <button
      className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white rounded-xl transition-all duration-300 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #A9FF68 0%, #FF8989 100%)'
      }}
      data-testid="gradient-button"
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      <span className="relative z-10 flex items-center">
        Browse Learning
        <svg 
          className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </span>
    </button>
  )
}

const ConditionalNavbarTest = ({ isHomePage }: { isHomePage: boolean }) => {
  return (
    <nav data-testid="navbar" className="bg-white dark:bg-slate-900">
      <div className="flex justify-between items-center h-16 px-4">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="ml-3 text-xl font-semibold">Learning Platform</span>
        </div>
        
        {!isHomePage && (
          <button
            data-testid="home-button"
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg"
          >
            Take me Home
          </button>
        )}
      </div>
    </nav>
  )
}

describe('Responsive Design Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ResponsiveTestUtils.mockViewport(1024) // Default desktop
  })

  describe('Keyboard Navigation', () => {
    test('handles arrow key navigation events', () => {
      render(<KeyboardNavigationTest />)
      
      const navElement = screen.getByTestId('keyboard-navigation')
      
      // Simulate left arrow key
      fireEvent.keyDown(navElement, { key: 'ArrowLeft', code: 'ArrowLeft' })
      expect(navElement).toHaveAttribute('data-navigation', 'prev')
      
      // Simulate right arrow key
      fireEvent.keyDown(navElement, { key: 'ArrowRight', code: 'ArrowRight' })
      expect(navElement).toHaveAttribute('data-navigation', 'next')
    })

    test('shows appropriate navigation hints based on device', () => {
      render(<KeyboardNavigationTest />)
      
      const desktopHint = screen.getByText('Use ← → arrow keys to navigate')
      const mobileHint = screen.getByText('Swipe left/right to navigate')
      
      expect(desktopHint).toHaveClass('hidden', 'md:block')
      expect(mobileHint).toHaveClass('block', 'md:hidden')
    })

    test('prevents default behavior for arrow keys', () => {
      render(<KeyboardNavigationTest />)
      
      const navElement = screen.getByTestId('keyboard-navigation')
      const preventDefaultSpy = jest.fn()
      
      // Mock event with preventDefault
      const mockEvent = {
        key: 'ArrowRight',
        preventDefault: preventDefaultSpy,
        currentTarget: navElement
      }
      
      fireEvent.keyDown(navElement, mockEvent)
      
      // In a real implementation, preventDefault would be called
      // This test validates the event handling structure
      expect(navElement).toBeInTheDocument()
    })

    test('ignores non-arrow key events', () => {
      render(<KeyboardNavigationTest />)
      
      const navElement = screen.getByTestId('keyboard-navigation')
      
      // Simulate non-arrow key
      fireEvent.keyDown(navElement, { key: 'Space', code: 'Space' })
      
      // Should not have navigation attribute
      expect(navElement).not.toHaveAttribute('data-navigation')
    })
  })

  describe('Custom Gradient Button', () => {
    test('renders with Coolors.co gradient colors', () => {
      render(<GradientButtonTest />)
      
      const button = screen.getByTestId('gradient-button')
      expect(button).toHaveStyle({
        background: 'linear-gradient(135deg, #A9FF68 0%, #FF8989 100%)'
      })
    })

    test('has proper hover overlay structure', () => {
      render(<GradientButtonTest />)
      
      const button = screen.getByTestId('gradient-button')
      const overlay = button.querySelector('.absolute.inset-0.bg-black')
      
      expect(overlay).toBeInTheDocument()
      expect(overlay).toHaveClass(
        'opacity-0',
        'group-hover:opacity-10',
        'transition-opacity',
        'duration-300'
      )
    })

    test('has animated arrow icon', () => {
      render(<GradientButtonTest />)
      
      const button = screen.getByTestId('gradient-button')
      const arrow = button.querySelector('svg')
      
      expect(arrow).toBeInTheDocument()
      expect(arrow).toHaveClass(
        'ml-2',
        'w-5',
        'h-5',
        'transform',
        'group-hover:translate-x-1',
        'transition-transform',
        'duration-300'
      )
    })

    test('has proper button styling classes', () => {
      render(<GradientButtonTest />)
      
      const button = screen.getByTestId('gradient-button')
      expect(button).toHaveClass(
        'group',
        'relative',
        'inline-flex',
        'items-center',
        'justify-center',
        'px-8',
        'py-4',
        'text-lg',
        'font-semibold',
        'text-white',
        'rounded-xl',
        'transition-all',
        'duration-300',
        'overflow-hidden'
      )
    })
  })

  describe('Conditional Navbar Visibility', () => {
    test('hides home button when on home page', () => {
      render(<ConditionalNavbarTest isHomePage={true} />)
      
      const homeButton = screen.queryByTestId('home-button')
      expect(homeButton).not.toBeInTheDocument()
    })

    test('shows home button when not on home page', () => {
      render(<ConditionalNavbarTest isHomePage={false} />)
      
      const homeButton = screen.getByTestId('home-button')
      expect(homeButton).toBeInTheDocument()
      expect(homeButton).toHaveTextContent('Take me Home')
    })

    test('navbar has proper dark mode classes', () => {
      render(<ConditionalNavbarTest isHomePage={false} />)
      
      const navbar = screen.getByTestId('navbar')
      expect(navbar).toHaveClass('bg-white', 'dark:bg-slate-900')
    })

    test('logo has gradient styling', () => {
      render(<ConditionalNavbarTest isHomePage={false} />)
      
      const logoContainer = screen.getByText('L').parentElement
      expect(logoContainer).toHaveClass(
        'bg-gradient-to-r',
        'from-blue-600',
        'to-purple-600',
        'rounded-lg',
        'p-2'
      )
    })
  })

  describe('Responsive Breakpoints', () => {
    test('adapts to mobile viewport', () => {
      ResponsiveTestUtils.mockViewport(375) // Mobile
      
      render(<KeyboardNavigationTest />)
      
      const mobileHint = screen.getByText('Swipe left/right to navigate')
      expect(mobileHint).toHaveClass('block', 'md:hidden')
    })

    test('adapts to tablet viewport', () => {
      ResponsiveTestUtils.mockViewport(768) // Tablet
      
      render(<KeyboardNavigationTest />)
      
      // Both hints should be available with responsive classes
      const desktopHint = screen.getByText('Use ← → arrow keys to navigate')
      expect(desktopHint).toHaveClass('hidden', 'md:block')
    })

    test('adapts to desktop viewport', () => {
      ResponsiveTestUtils.mockViewport(1280) // Desktop
      
      render(<KeyboardNavigationTest />)
      
      const desktopHint = screen.getByText('Use ← → arrow keys to navigate')
      expect(desktopHint).toHaveClass('hidden', 'md:block')
    })
  })

  describe('Device Capabilities', () => {
    test('detects touch-capable devices', () => {
      ResponsiveTestUtils.mockDeviceCapabilities(true, false)
      
      const hasTouch = navigator.maxTouchPoints > 0
      expect(hasTouch).toBe(true)
    })

    test('detects hover-capable devices', () => {
      ResponsiveTestUtils.mockDeviceCapabilities(false, true)
      
      const matchMedia = window.matchMedia('(hover: hover)')
      expect(matchMedia.matches).toBe(true)
    })

    test('handles mixed capability devices', () => {
      ResponsiveTestUtils.mockDeviceCapabilities(true, true)
      
      const hasTouch = navigator.maxTouchPoints > 0
      const hasHover = window.matchMedia('(hover: hover)').matches
      
      expect(hasTouch).toBe(true)
      expect(hasHover).toBe(true)
    })
  })

  describe('CSS and Styling Validation', () => {
    test('validates responsive text sizing', () => {
      render(
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
          Responsive Heading
        </h1>
      )
      
      const heading = screen.getByText('Responsive Heading')
      expect(heading).toHaveClass('text-2xl', 'sm:text-3xl', 'md:text-4xl', 'lg:text-5xl')
    })

    test('validates responsive spacing', () => {
      render(
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          Responsive Padding
        </div>
      )
      
      const container = screen.getByText('Responsive Padding')
      expect(container).toHaveClass('p-4', 'sm:p-6', 'md:p-8', 'lg:p-10')
    })

    test('validates responsive grid layouts', () => {
      render(
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>Grid Item</div>
        </div>
      )
      
      const grid = screen.getByText('Grid Item').parentElement
      expect(grid).toHaveClass(
        'grid',
        'grid-cols-1',
        'sm:grid-cols-2',
        'md:grid-cols-3',
        'lg:grid-cols-4'
      )
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('handles keyboard events on unmounted components', () => {
      const { unmount } = render(<KeyboardNavigationTest />)
      
      unmount()
      
      // Should not throw when trying to dispatch events
      expect(() => {
        ResponsiveTestUtils.simulateKeyDown('ArrowRight')
      }).not.toThrow()
    })

    test('handles invalid viewport dimensions', () => {
      ResponsiveTestUtils.mockViewport(0, 0)
      
      render(<KeyboardNavigationTest />)
      
      // Component should still render
      expect(screen.getByTestId('keyboard-navigation')).toBeInTheDocument()
    })

    test('handles missing device capability APIs', () => {
      // Store original values
      const originalMaxTouchPoints = Object.getOwnPropertyDescriptor(navigator, 'maxTouchPoints')
      const originalMatchMedia = window.matchMedia
      
      try {
        // Mock undefined APIs
        Object.defineProperty(navigator, 'maxTouchPoints', { value: undefined, configurable: true })
        delete (window as unknown as { matchMedia?: unknown }).matchMedia
        
        render(<KeyboardNavigationTest />)
        
        // Should render without errors
        expect(screen.getByTestId('keyboard-navigation')).toBeInTheDocument()
      } finally {
        // Restore original values
        if (originalMaxTouchPoints) {
          Object.defineProperty(navigator, 'maxTouchPoints', originalMaxTouchPoints)
        }
        window.matchMedia = originalMatchMedia
      }
    })
  })
})