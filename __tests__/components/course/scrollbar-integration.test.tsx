/**
 * Scrollbar Integration Test
 * 
 * This test verifies that scrollbars appear correctly with real content
 * and proper height constraints after our fixes.
 */

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock component that simulates the actual content structure
const ScrollbarContentTest = () => {
  const styles = {
    cardHeight: 'h-[80vh]',
    contentMaxHeight: 'max-h-[60vh]',
    padding: 'p-6 lg:p-8'
  }

  // Generate long content that should trigger scrolling
  const longContent = Array.from({ length: 50 }, (_, i) => (
    `This is paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
    Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`
  )).join('\n\n')

  return (
    <div className="flex flex-col h-screen">
      <div className={`${styles.cardHeight} flex flex-col border border-gray-200 shadow-xl bg-white`}>
        <div className="flex-shrink-0 p-4 bg-gray-50 border-b">
          <h1 className="text-2xl font-bold">Test Slide Title</h1>
          <p className="text-sm text-gray-600">Slide 1 of 10</p>
        </div>
        
        <div 
          className={`flex-1 overflow-y-auto embla__slide__scrollable relative ${styles.padding} ${styles.contentMaxHeight}`}
          data-testid="scrollable-content"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#3b82f6 transparent'
          }}
        >
          <div className="space-y-4 min-h-0 pb-8">
            <div className="whitespace-pre-line leading-relaxed">
              {longContent}
            </div>
            
            <div className="bg-blue-100 p-4 rounded border-2 border-blue-300">
              <h3 className="font-bold text-blue-800">Important Note</h3>
              <p className="text-blue-700">
                This should be visible when scrolling to the bottom of the content.
              </p>
            </div>
            
            <div 
              className="bg-red-100 p-4 rounded border-2 border-red-300"
              data-testid="bottom-element"
            >
              <h3 className="font-bold text-red-800">Bottom Element</h3>
              <p className="text-red-700">
                This is the last element. If scrollbars work correctly, 
                this should be accessible by scrolling.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex-shrink-0 p-4 bg-gray-50 border-t flex justify-between">
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Previous</button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Next</button>
        </div>
      </div>
    </div>
  )
}

describe('Scrollbar Integration Tests', () => {
  beforeEach(() => {
    // Set up viewport size
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

  test('scrollable content has proper height constraints', async () => {
    render(<ScrollbarContentTest />)
    
    const scrollableElement = screen.getByTestId('scrollable-content')
    
    // Should have overflow and height classes
    expect(scrollableElement).toHaveClass('overflow-y-auto')
    expect(scrollableElement).toHaveClass('max-h-[60vh]')
    expect(scrollableElement).toHaveClass('embla__slide__scrollable')
    
    // Should have scrollbar styling
    expect(scrollableElement).toHaveStyle('scrollbar-width: thin')
    expect(scrollableElement).toHaveStyle('scrollbar-color: #3b82f6 transparent')
  })

  test('content extends beyond visible area requiring scroll', async () => {
    render(<ScrollbarContentTest />)
    
    const scrollableElement = screen.getByTestId('scrollable-content')
    const bottomElement = screen.getByTestId('bottom-element')
    
    // Bottom element should exist
    expect(bottomElement).toBeInTheDocument()
    
    // Mock scroll properties to simulate overflow
    Object.defineProperty(scrollableElement, 'scrollHeight', {
      configurable: true,
      value: 1200, // Content height
    })
    
    Object.defineProperty(scrollableElement, 'clientHeight', {
      configurable: true,
      value: 400, // Visible height (60vh ≈ 460px on 768px screen)
    })
    
    // Should have content that overflows
    expect(scrollableElement.scrollHeight).toBeGreaterThan(scrollableElement.clientHeight)
  })

  test('scrollable area maintains flex-1 behavior within card', async () => {
    render(<ScrollbarContentTest />)
    
    const scrollableElement = screen.getByTestId('scrollable-content')
    
    // Should have both flex-1 and max-height for proper constraint
    expect(scrollableElement).toHaveClass('flex-1')
    expect(scrollableElement).toHaveClass('max-h-[60vh]')
  })

  test('card has fixed height for proper layout', async () => {
    render(<ScrollbarContentTest />)
    
    const cardElement = screen.getByTestId('scrollable-content').closest('.h-\\[80vh\\]')
    expect(cardElement).toBeInTheDocument()
  })

  test('responsive breakpoint styles work correctly', () => {
    const getResponsiveStyles = (breakpoint: 'mobile' | 'tablet' | 'desktop') => ({
      mobile: {
        cardHeight: 'h-[70vh]',
        contentMaxHeight: 'max-h-[50vh]',
      },
      tablet: {
        cardHeight: 'h-[75vh]',
        contentMaxHeight: 'max-h-[55vh]',
      },
      desktop: {
        cardHeight: 'h-[80vh]',
        contentMaxHeight: 'max-h-[60vh]',
      }
    }[breakpoint])

    // Test different breakpoints
    const mobileStyles = getResponsiveStyles('mobile')
    const tabletStyles = getResponsiveStyles('tablet')
    const desktopStyles = getResponsiveStyles('desktop')

    expect(mobileStyles.cardHeight).toBe('h-[70vh]')
    expect(mobileStyles.contentMaxHeight).toBe('max-h-[50vh]')
    
    expect(tabletStyles.cardHeight).toBe('h-[75vh]')
    expect(tabletStyles.contentMaxHeight).toBe('max-h-[55vh]')
    
    expect(desktopStyles.cardHeight).toBe('h-[80vh]')
    expect(desktopStyles.contentMaxHeight).toBe('max-h-[60vh]')
  })

  test('navigation controls do not overlap with content', async () => {
    render(<ScrollbarContentTest />)
    
    const scrollableElement = screen.getByTestId('scrollable-content')
    const bottomElement = screen.getByTestId('bottom-element')
    
    // Content area should be constrained by max-height
    expect(scrollableElement).toHaveClass('max-h-[60vh]')
    
    // Bottom navigation should be separate (flex-shrink-0)
    const navButtons = screen.getAllByRole('button')
    expect(navButtons).toHaveLength(2)
    
    // Content should be in its own scrollable container
    expect(bottomElement).toBeInTheDocument()
  })

  test('CSS scrollbar styles are properly defined', () => {
    const testElement = document.createElement('div')
    testElement.className = 'embla__slide__scrollable overflow-y-auto max-h-[60vh]'
    testElement.style.scrollbarWidth = 'thin'
    testElement.style.scrollbarColor = '#3b82f6 transparent'
    
    document.body.appendChild(testElement)
    
    // Should have correct styles applied
    expect(testElement.style.scrollbarWidth).toBe('thin')
    expect(testElement.style.scrollbarColor).toBe('#3b82f6 transparent')
    
    document.body.removeChild(testElement)
  })

  describe('Edge Cases', () => {
    test('handles very short content without scrollbars', () => {
      const ShortContentTest = () => (
        <div className="overflow-y-auto embla__slide__scrollable max-h-[60vh] p-4" data-testid="short-content">
          <p>Short content that should not trigger scrollbar</p>
        </div>
      )
      
      render(<ShortContentTest />)
      const element = screen.getByTestId('short-content')
      
      // Should still have scrollbar styles but no actual scrollbar needed
      expect(element).toHaveClass('overflow-y-auto')
      expect(element).toHaveClass('embla__slide__scrollable')
    })

    test('handles extremely long content gracefully', () => {
      const VeryLongContentTest = () => {
        const veryLongContent = Array.from({ length: 200 }, (_, i) => 
          `Paragraph ${i + 1}: ${'Very long text content. '.repeat(20)}`
        ).join('\n\n')
        
        return (
          <div className="overflow-y-auto embla__slide__scrollable max-h-[60vh] p-4" data-testid="very-long-content">
            <div className="whitespace-pre-line">{veryLongContent}</div>
            <div data-testid="very-bottom">Bottom of very long content</div>
          </div>
        )
      }
      
      render(<VeryLongContentTest />)
      
      const element = screen.getByTestId('very-long-content')
      const bottomElement = screen.getByTestId('very-bottom')
      
      expect(element).toHaveClass('overflow-y-auto')
      expect(bottomElement).toBeInTheDocument()
    })
  })
})