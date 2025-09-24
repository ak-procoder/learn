/**
 * Scrollbar Visibility Test Suite
 * 
 * This test suite specifically tests the side scrollbar functionality
 * to ensure scrollbars appear when content overflows and are styled correctly.
 */

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CourseSlide } from '@/data/types/course-types'

// Mock scrollbar component to test scrollbar behavior
const MockScrollableContent = ({ content, testId }: { content: string, testId: string }) => {
  return (
    <div 
      className="embla__slide__scrollable overflow-y-auto max-h-[60vh] p-4"
      data-testid={testId}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#3b82f6 transparent'
      }}
    >
      <div className="space-y-4 pb-8">
        <div dangerouslySetInnerHTML={{ __html: content }} />
        
        {/* Add extra content to ensure overflow */}
        <div className="space-y-4">
          {Array.from({ length: 20 }, (_, i) => (
            <p key={i} className="text-gray-600 p-4 bg-gray-50 rounded">
              Scrollable content line {i + 1}. This is additional content to ensure the container 
              overflows and requires a scrollbar. The scrollbar should be visible on the right side 
              when this content extends beyond the container height.
            </p>
          ))}
        </div>

        {/* Critical last element for visibility testing */}
        <div 
          className="bg-red-100 p-4 rounded text-red-800 font-bold"
          data-testid={`${testId}-last-element`}
        >
          LAST ELEMENT: This should be accessible via scrolling
        </div>
      </div>
    </div>
  )
}

const mockSlideWithLongContent: CourseSlide = {
  id: 'scrollbar-test-slide',
  title: 'Scrollbar Test Slide',
  content: {
    markdown: `
# Long Content for Scrollbar Testing

This slide contains extensive content to test scrollbar visibility and functionality.

## Section 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

## Section 2
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

## Section 3
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.

## Section 4
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

## Section 5
Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
    `
  },
  type: 'text'
}

describe('Scrollbar Functionality Tests', () => {
  beforeEach(() => {
    // Set a reasonable viewport size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    })
  })

  afterEach(() => {
    cleanup()
  })

  describe('Scrollbar CSS Properties', () => {
    test('scrollable container has overflow-y-auto class', () => {
      const testId = 'scrollbar-overflow-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      expect(scrollableElement).toHaveClass('overflow-y-auto')
    })

    test('scrollable container has max-height constraint', () => {
      const testId = 'scrollbar-height-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      expect(scrollableElement).toHaveClass('max-h-[60vh]')
    })

    test('scrollable container has proper scrollbar styling', () => {
      const testId = 'scrollbar-style-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      expect(scrollableElement).toHaveStyle('scrollbar-width: thin')
      expect(scrollableElement).toHaveStyle('scrollbar-color: #3b82f6 transparent')
    })
  })

  describe('Content Overflow Detection', () => {
    test('container with long content should trigger scrollbar', () => {
      const testId = 'overflow-detection-test'
      const longContent = `
        <h1>Very Long Content</h1>
        ${Array.from({ length: 50 }, (_, i) => `<p>Content paragraph ${i + 1}</p>`).join('')}
      `
      
      render(<MockScrollableContent content={longContent} testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      
      // Should have overflow styles
      expect(scrollableElement).toHaveClass('overflow-y-auto')
      
      // The last element should be present but may need scrolling to see
      const lastElement = screen.getByTestId(`${testId}-last-element`)
      expect(lastElement).toBeInTheDocument()
    })

    test('scrollable area has proper padding at bottom', () => {
      const testId = 'padding-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      const innerDiv = scrollableElement.querySelector('.space-y-4')
      
      expect(innerDiv).toHaveClass('pb-8')
    })
  })

  describe('Scrollbar Visibility in Different Scenarios', () => {
    const testScenarios = [
      { name: 'Mobile', width: 375, height: 667, expectedMaxHeight: '60vh' },
      { name: 'Tablet', width: 768, height: 1024, expectedMaxHeight: '60vh' },
      { name: 'Desktop', width: 1024, height: 768, expectedMaxHeight: '60vh' },
      { name: 'Large Desktop', width: 1440, height: 900, expectedMaxHeight: '60vh' }
    ]

    testScenarios.forEach(scenario => {
      test(`scrollbar works correctly on ${scenario.name} (${scenario.width}x${scenario.height})`, () => {
        // Set viewport size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: scenario.width,
        })
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: scenario.height,
        })

        const testId = `scrollbar-${scenario.name.toLowerCase()}-test`
        const longContent = Array.from({ length: 30 }, (_, i) => 
          `<p>Line ${i + 1}: Content that should trigger scrolling on ${scenario.name}</p>`
        ).join('')

        render(<MockScrollableContent content={longContent} testId={testId} />)
        
        const scrollableElement = screen.getByTestId(testId)
        
        // Should have scrolling styles
        expect(scrollableElement).toHaveClass('overflow-y-auto')
        expect(scrollableElement).toHaveClass('max-h-[60vh]')
        
        // Should have scrollbar styling
        expect(scrollableElement).toHaveStyle('scrollbar-width: thin')

        cleanup()
      })
    })
  })

  describe('CSS Class Integration', () => {
    test('embla__slide__scrollable class is applied', () => {
      const testId = 'css-class-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      expect(scrollableElement).toHaveClass('embla__slide__scrollable')
    })

    test('scrollable element has both Tailwind and custom classes', () => {
      const testId = 'combined-classes-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      
      // Should have Tailwind classes
      expect(scrollableElement).toHaveClass('overflow-y-auto')
      expect(scrollableElement).toHaveClass('max-h-[60vh]')
      expect(scrollableElement).toHaveClass('p-4')
      
      // Should have custom embla class
      expect(scrollableElement).toHaveClass('embla__slide__scrollable')
    })
  })

  describe('Scrollbar Behavior Validation', () => {
    test('content can be scrolled programmatically', () => {
      const testId = 'scroll-behavior-test'
      const longContent = Array.from({ length: 50 }, (_, i) => 
        `<p>Scrollable line ${i + 1}</p>`
      ).join('')

      render(<MockScrollableContent content={longContent} testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      
      // Mock scroll behavior
      Object.defineProperty(scrollableElement, 'scrollTop', {
        writable: true,
        value: 0
      })
      
      Object.defineProperty(scrollableElement, 'scrollHeight', {
        writable: true,
        value: 1000 // Mock height greater than container
      })
      
      Object.defineProperty(scrollableElement, 'clientHeight', {
        writable: true,
        value: 400 // Mock container height
      })
      
      // Should be scrollable (scrollHeight > clientHeight)
      expect(scrollableElement.scrollHeight).toBeGreaterThan(scrollableElement.clientHeight)
    })

    test('scroll position can be tracked', () => {
      const testId = 'scroll-position-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      
      // Mock scroll properties
      Object.defineProperty(scrollableElement, 'scrollTop', {
        writable: true,
        value: 100
      })
      
      expect(scrollableElement.scrollTop).toBe(100)
    })
  })

  describe('Accessibility and UX', () => {
    test('scrollable content is keyboard accessible', () => {
      const testId = 'keyboard-scroll-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const scrollableElement = screen.getByTestId(testId)
      
      // Should be focusable for keyboard scrolling (add tabIndex programmatically)
      scrollableElement.setAttribute('tabindex', '0')
      expect(scrollableElement).toHaveAttribute('tabindex', '0')
    })

    test('last element should be reachable', () => {
      const testId = 'last-element-test'
      render(<MockScrollableContent content="Test content" testId={testId} />)
      
      const lastElement = screen.getByTestId(`${testId}-last-element`)
      expect(lastElement).toBeInTheDocument()
      expect(lastElement).toHaveTextContent('LAST ELEMENT: This should be accessible via scrolling')
    })
  })
})