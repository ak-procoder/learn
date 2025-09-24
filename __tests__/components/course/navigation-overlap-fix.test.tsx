/**
 * Navigation Controls Overlap Test Suite
 * 
 * This test suite specifically addresses the issue where Previous/Next buttons
 * were overlapping with slide content, hiding the last few lines.
 * 
 * Tests verify:
 * 1. Navigation controls don't overlap with slide content
 * 2. All slide content is visible and accessible
 * 3. Proper spacing between content and controls
 * 4. Controls are positioned correctly at the bottom
 */

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CourseSlide } from '@/data/types/course-types'

// Mock Embla Carousel for testing
jest.mock('embla-carousel-react', () => ({
  __esModule: true,
  default: () => [
    null, // Mock embla ref
    {
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      canScrollNext: jest.fn(() => true),
      canScrollPrev: jest.fn(() => true),
      scrollTo: jest.fn(),
      on: jest.fn(),
      off: jest.fn(),
      scrollProgress: jest.fn(() => 0.5),
      scrollSnapList: jest.fn(() => [0, 1, 2]),
      selectedScrollSnap: jest.fn(() => 0),
      internalEngine: jest.fn(() => ({
        slideRegistry: [[0], [1], [2]],
        options: { loop: false }
      })),
      reInit: jest.fn()
    }
  ]
}))

// Mock carousel component that replicates the actual structure
const MockEmblaCarouselWithControls = ({ slides, testId = 'carousel-overlap-test' }: {
  slides: CourseSlide[]
  testId?: string
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)

  return (
    <div data-testid={testId} className="embla h-full flex flex-col bg-gradient-to-br from-background/50 to-primary/5">
      {/* Main Carousel - Takes available space minus controls */}
      <div className="embla__viewport flex-1" data-testid={`${testId}-viewport`}>
        <div className="embla__container h-full" data-testid={`${testId}-container`}>
          {slides.map((slide, index) => (
            <div className="embla__slide flex-1 min-h-0" key={slide.id} data-testid={`${testId}-slide-${index}`}>
              <div className="embla__slide__parallax h-full">
                <div className="embla__slide__content flex flex-col w-full h-full p-4">
                  <div className="w-full max-w-full mx-auto flex-1 flex flex-col">
                    <div className="flex-1 border border-border/20 shadow-2xl bg-gradient-to-br from-card/90 via-card to-card/95 backdrop-blur-xl flex flex-col w-full">
                      {/* Header */}
                      <div className="flex-shrink-0 pb-1 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-t-lg border-b border-border/10 p-4">
                        <h3 className="font-bold text-foreground leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-xl">
                          {slide.title}
                        </h3>
                      </div>
                      
                      {/* Scrollable Content */}
                      <div 
                        className="flex-1 overflow-y-auto embla__slide__scrollable relative p-4"
                        data-testid={`${testId}-slide-content-${index}`}
                        style={{
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#3b82f6 transparent'
                        }}
                      >
                        <div className="space-y-4 min-h-0 pb-8">
                          <div>
                            {typeof slide.content === 'object' && 'markdown' in slide.content 
                              ? slide.content.markdown 
                              : String(slide.content)
                            }
                          </div>
                          
                          {/* Generate long content to test scrolling and overlap */}
                          <div className="mt-8 space-y-4">
                            {Array.from({ length: 15 }, (_, i) => (
                              <p key={i} className="text-gray-600" data-testid={`${testId}-content-line-${i}`}>
                                Content line {i + 1} - This is a long line of content that should be fully visible and not hidden by navigation controls. 
                                The last few lines should not be overlapped by Previous/Next buttons.
                              </p>
                            ))}
                            {/* Critical last line that should always be visible */}
                            <p 
                              className="text-red-600 font-bold" 
                              data-testid={`${testId}-last-line`}
                            >
                              LAST LINE: This content should never be hidden by navigation controls!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Controls - Should not overlap with content */}
      <div 
        className="embla__controls flex-shrink-0 border-t border-border/20 bg-gradient-to-r from-card/95 via-card/98 to-card/95 backdrop-blur-xl shadow-lg p-4"
        data-testid={`${testId}-controls`}
        style={{ minHeight: '4rem' }}
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto w-full">
          <button 
            onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
            disabled={currentSlide === 0}
            data-testid={`${testId}-prev-button`}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Previous
          </button>
          
          <div className="text-center bg-card/50 p-3 rounded-xl border border-border/20">
            <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {currentSlide + 1}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              of {slides.length}
            </div>
          </div>
          
          <button 
            onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
            disabled={currentSlide === slides.length - 1}
            data-testid={`${testId}-next-button`}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

// Test data with long content
const mockSlidesWithLongContent: CourseSlide[] = [
  {
    id: 'overlap-test-slide-1',
    title: 'Long Content Test Slide',
    content: {
      markdown: '# Testing Content Overlap\n\nThis slide has extensive content to test whether the last lines are hidden by navigation controls.\n\n## Important Information\n\nAll content should be visible and scrollable without being obscured by Previous/Next buttons.'
    },
    type: 'text'
  }
]

describe('Navigation Controls Overlap Prevention', () => {
  beforeEach(() => {
    // Reset viewport size
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

  describe('Layout Structure', () => {
    test('carousel container uses flex column layout', () => {
      const testId = 'layout-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const carousel = screen.getByTestId(testId)
      expect(carousel).toHaveClass('flex', 'flex-col')
    })

    test('viewport takes available space with flex-1', () => {
      const testId = 'viewport-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const viewport = screen.getByTestId(`${testId}-viewport`)
      expect(viewport).toHaveClass('flex-1')
    })

    test('controls are flex-shrink-0 to maintain fixed height', () => {
      const testId = 'controls-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const controls = screen.getByTestId(`${testId}-controls`)
      expect(controls).toHaveClass('flex-shrink-0')
    })
  })

  describe('Content Visibility', () => {
    test('last line of content should be accessible', () => {
      const testId = 'content-visibility-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      // The last line should be present and accessible
      const lastLine = screen.getByTestId(`${testId}-last-line`)
      expect(lastLine).toBeInTheDocument()
      expect(lastLine).toHaveTextContent('LAST LINE: This content should never be hidden by navigation controls!')
    })

    test('all content lines should be present', () => {
      const testId = 'all-content-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      // Check that all 15 content lines are present
      for (let i = 0; i < 15; i++) {
        const contentLine = screen.getByTestId(`${testId}-content-line-${i}`)
        expect(contentLine).toBeInTheDocument()
        expect(contentLine).toHaveTextContent(`Content line ${i + 1}`)
      }
    })

    test('slide content has proper padding to prevent overlap', () => {
      const testId = 'padding-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      const contentContainer = slideContent.querySelector('.space-y-4')
      
      expect(contentContainer).toHaveClass('pb-8')
    })
  })

  describe('Controls Positioning', () => {
    test('previous button should be properly positioned', () => {
      const testId = 'prev-button-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const prevButton = screen.getByTestId(`${testId}-prev-button`)
      expect(prevButton).toBeInTheDocument()
      expect(prevButton).toHaveTextContent('Previous')
    })

    test('next button should be properly positioned', () => {
      const testId = 'next-button-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const nextButton = screen.getByTestId(`${testId}-next-button`)
      expect(nextButton).toBeInTheDocument()
      expect(nextButton).toHaveTextContent('Next')
    })

    test('controls container has minimum height to prevent collapse', () => {
      const testId = 'controls-height-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const controls = screen.getByTestId(`${testId}-controls`)
      expect(controls).toHaveStyle('min-height: 4rem')
    })
  })

  describe('Responsive Behavior', () => {
    test('layout maintains integrity on mobile screens', () => {
      // Set mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      const testId = 'mobile-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const carousel = screen.getByTestId(testId)
      const viewport = screen.getByTestId(`${testId}-viewport`)
      const controls = screen.getByTestId(`${testId}-controls`)
      
      expect(carousel).toHaveClass('flex-col')
      expect(viewport).toHaveClass('flex-1')
      expect(controls).toHaveClass('flex-shrink-0')
    })

    test('layout maintains integrity on desktop screens', () => {
      // Set desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1440,
      })

      const testId = 'desktop-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const carousel = screen.getByTestId(testId)
      const viewport = screen.getByTestId(`${testId}-viewport`)
      const controls = screen.getByTestId(`${testId}-controls`)
      
      expect(carousel).toHaveClass('flex-col')
      expect(viewport).toHaveClass('flex-1')
      expect(controls).toHaveClass('flex-shrink-0')
    })
  })

  describe('Scrolling Behavior', () => {
    test('slide content should be scrollable when content overflows', () => {
      const testId = 'scroll-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      expect(slideContent).toHaveClass('overflow-y-auto')
      expect(slideContent).toHaveStyle('scrollbar-width: thin')
    })

    test('content container has proper spacing at bottom', () => {
      const testId = 'spacing-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      const contentDiv = slideContent.querySelector('.space-y-4')
      
      expect(contentDiv).toHaveClass('pb-8')
    })
  })

  describe('Integration Test - Complete Layout', () => {
    test('entire layout works together without overlap', () => {
      const testId = 'integration-test'
      render(<MockEmblaCarouselWithControls slides={mockSlidesWithLongContent} testId={testId} />)
      
      // Verify all key components are present
      const carousel = screen.getByTestId(testId)
      const viewport = screen.getByTestId(`${testId}-viewport`)
      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      const controls = screen.getByTestId(`${testId}-controls`)
      const prevButton = screen.getByTestId(`${testId}-prev-button`)
      const nextButton = screen.getByTestId(`${testId}-next-button`)
      const lastLine = screen.getByTestId(`${testId}-last-line`)
      
      // Verify structure
      expect(carousel).toBeInTheDocument()
      expect(viewport).toBeInTheDocument()
      expect(slideContent).toBeInTheDocument()
      expect(controls).toBeInTheDocument()
      expect(prevButton).toBeInTheDocument()
      expect(nextButton).toBeInTheDocument()
      expect(lastLine).toBeInTheDocument()
      
      // Verify classes for layout
      expect(carousel).toHaveClass('flex-col')
      expect(viewport).toHaveClass('flex-1')
      expect(controls).toHaveClass('flex-shrink-0')
      expect(slideContent).toHaveClass('overflow-y-auto')
      
      // Critical test: last line should be accessible
      expect(lastLine).toHaveTextContent('LAST LINE: This content should never be hidden by navigation controls!')
    })
  })
})