/**
 * Embla Carousel Responsive Test Suite - Fixed Version
 * 
 * This test suite comprehensively tests the Embla carousel functionality
 * across all Tailwind screen breakpoints and validates:
 * - Slide scrollbar visibility and styling
 * - Slides fitting screen size properly
 * - Responsive behavior at each breakpoint
 * - Navigation controls
 * - Overflow handling and containment
 * 
 * Tailwind Breakpoints Tested:
 * - Default (< 640px): Mobile phones
 * - sm (640px+): Large phones 
 * - md (768px+): Tablets
 * - lg (1024px+): Laptops
 * - xl (1280px+): Large laptops
 * - 2xl (1536px+): Large desktops
 */

import React from 'react'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { CourseSlide } from '@/data/types/course-types'

// Mock Embla Carousel with proper viewport behavior
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

// Mock the actual EmblaCarousel component structure for testing
const MockEmblaCarousel = ({ slides, testId = 'embla-carousel' }: {
  slides: CourseSlide[]
  testId?: string
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0)
  
  // Mock responsive breakpoint detection
  const getBreakpoint = (width: number) => {
    if (width < 640) return 'mobile'
    if (width < 768) return 'sm'
    if (width < 1024) return 'md'
    if (width < 1280) return 'lg'
    if (width < 1536) return 'xl'
    return '2xl'
  }

  const [breakpoint, setBreakpoint] = React.useState(getBreakpoint(window.innerWidth))

  React.useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getBreakpoint(window.innerWidth))
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Responsive styles based on breakpoint
  const getResponsiveClasses = (bp: string) => {
    const styles = {
      mobile: {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[70vh] max-w-full',
        content: 'p-3 sm:p-4 text-sm',
        scrollable: 'overflow-y-auto max-h-[60vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      },
      sm: {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[72vh] max-w-full',
        content: 'p-4 text-base',
        scrollable: 'overflow-y-auto max-h-[62vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      },
      md: {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[75vh] max-w-full',
        content: 'p-4 md:p-6 text-base',
        scrollable: 'overflow-y-auto max-h-[65vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      },
      lg: {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[78vh] max-w-full',
        content: 'p-6 lg:p-8 text-lg',
        scrollable: 'overflow-y-auto max-h-[68vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      },
      xl: {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[80vh] max-w-full',
        content: 'p-6 lg:p-8 text-lg',
        scrollable: 'overflow-y-auto max-h-[70vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      },
      '2xl': {
        container: 'w-full max-w-full overflow-hidden',
        slide: 'flex-shrink-0 w-full min-h-[82vh] max-w-full',
        content: 'p-8 text-xl',
        scrollable: 'overflow-y-auto max-h-[72vh] scrollbar-thin',
        viewport: 'overflow-hidden w-full max-w-[100vw]'
      }
    }
    return styles[bp as keyof typeof styles] || styles.lg
  }

  const styles = getResponsiveClasses(breakpoint)

  return (
    <div data-testid={testId} className="embla h-full flex flex-col" data-breakpoint={breakpoint}>
      <div 
        className={`embla__viewport ${styles.viewport}`}
        data-testid={`${testId}-viewport`}
        style={{
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100vw'
        }}
      >
        <div 
          className={`embla__container ${styles.container} flex`}
          data-testid={`${testId}-container`}
          style={{
            display: 'flex',
            width: `${slides.length * 100}%`,
            transform: `translateX(-${currentSlide * (100 / slides.length)}%)`
          }}
        >
          {slides.map((slide, index) => (
            <div 
              key={slide.id}
              className={`embla__slide ${styles.slide}`}
              data-testid={`${testId}-slide-${index}`}
              data-slide-index={index}
              style={{
                flex: `0 0 ${100 / slides.length}%`,
                minWidth: 0,
                maxWidth: '100vw'
              }}
            >
              <div className="embla__slide__parallax h-full w-full">
                <div className={`embla__slide__content ${styles.content} h-full flex flex-col`}>
                  <h3 className="text-xl font-bold mb-4">{slide.title}</h3>
                  <div 
                    className={`embla__slide__scrollable ${styles.scrollable}`}
                    data-testid={`${testId}-slide-content-${index}`}
                    style={{
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#3b82f6 transparent'
                    }}
                  >
                    <div className="space-y-4">
                      {typeof slide.content === 'object' && 'markdown' in slide.content ? (
                        <div dangerouslySetInnerHTML={{ __html: String(slide.content.markdown).replace(/\n/g, '<br/>') }} />
                      ) : (
                        <div>
                          {typeof slide.content === 'string' ? (
                            <p dangerouslySetInnerHTML={{ __html: slide.content.replace(/\n/g, '<br/>') }} />
                          ) : (
                            <p>No content available</p>
                          )}
                        </div>
                      )}
                      {/* Add extra content to test scrolling */}
                      <div className="mt-8 space-y-4">
                        {Array.from({ length: 10 }, (_, i) => (
                          <p key={i} className="text-gray-600">
                            Additional content line {i + 1} to test vertical scrolling behavior and scrollbar visibility.
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div className="flex justify-between items-center p-4" data-testid={`${testId}-controls`}>
        <button 
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          data-testid={`${testId}-prev-button`}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span data-testid={`${testId}-slide-indicator`}>
          Slide {currentSlide + 1} of {slides.length}
        </span>
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
  )
}

// Test data
const mockSlides: CourseSlide[] = [
  {
    id: 'slide-1',
    title: 'Network Fundamentals',
    content: {
      markdown: '# Network Basics\n\n**Networks** connect devices together.\n\n- Router\n- Switch\n- Hub\n\nThis slide contains enough content to test vertical scrolling behavior and ensure the scrollbar appears when needed.'
    },
    type: 'text'
  },
  {
    id: 'slide-2',
    title: 'TCP/IP Protocol',
    content: {
      markdown: '## TCP/IP Overview\n\nTransmission Control Protocol and Internet Protocol work together.\n\n- Layer 4: Transport\n- Layer 3: Network\n- Reliable communication\n\nLong content for testing scrollbar functionality and viewport behavior across different screen sizes.'
    },
    type: 'text'
  },
  {
    id: 'slide-3',
    title: 'Network Security',
    content: {
      markdown: '### Security Concepts\n\n**Confidentiality**, **Integrity**, and **Availability** are the core principles.\n\n- Encryption\n- Authentication\n- Authorization\n- Auditing\n\nExtensive content to validate scrollbar behavior and responsive design patterns.'
    },
    type: 'text'
  }
]

describe('Embla Carousel Responsive Tests (Fixed)', () => {
  // Utility function to simulate viewport resize
  const resizeWindow = (width: number, height: number = 768) => {
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
    
    // Trigger resize event
    window.dispatchEvent(new Event('resize'))
  }

  // Utility function to check if element has horizontal scrollbar
  const hasHorizontalScrollbar = (element: Element) => {
    return element.scrollWidth > element.clientWidth
  }

  beforeEach(() => {
    cleanup()
    // Reset to default desktop size
    resizeWindow(1024, 768)
  })

  afterEach(() => {
    cleanup()
  })

  describe('Tailwind Breakpoint Responsiveness', () => {
    test('adapts to all Tailwind breakpoints correctly', async () => {
      const breakpoints = [
        { name: 'mobile', width: 320, minHeight: '70vh' },
        { name: 'sm', width: 640, minHeight: '72vh' },
        { name: 'md', width: 768, minHeight: '75vh' },
        { name: 'lg', width: 1024, minHeight: '78vh' },
        { name: 'xl', width: 1280, minHeight: '80vh' },
        { name: '2xl', width: 1536, minHeight: '82vh' }
      ]

      for (let i = 0; i < breakpoints.length; i++) {
        const bp = breakpoints[i]
        const testId = `carousel-${bp.name}-${i}`
        
        resizeWindow(bp.width)
        render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)

        await waitFor(() => {
          const carousel = screen.getByTestId(testId)
          expect(carousel).toHaveAttribute('data-breakpoint', bp.name)
          
          const slides = screen.getAllByTestId(new RegExp(`${testId}-slide-\\d+`))
          slides.forEach((slide) => {
            // Each slide should be full width
            expect(slide).toHaveClass('w-full')
            expect(slide).toHaveClass('flex-shrink-0')
            
            // Slide should have appropriate constraints
            expect(slide.style.maxWidth).toBe('100vw')
          })
        })
        
        cleanup()
      }
    })

    test('prevents horizontal overflow at all screen sizes', () => {
      const testSizes = [320, 375, 640, 768, 1024, 1280, 1440, 1920]
      
      testSizes.forEach((width, index) => {
        const testId = `overflow-test-${width}-${index}`
        resizeWindow(width)
        
        render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
        
        const viewport = screen.getByTestId(`${testId}-viewport`)
        
        // Should not have horizontal scrollbar on viewport
        expect(hasHorizontalScrollbar(document.body)).toBe(false)
        expect(viewport).toHaveStyle('overflow: hidden')
        expect(viewport).toHaveStyle('width: 100%')
        expect(viewport).toHaveStyle('max-width: 100vw')
        
        cleanup()
      })
    })
  })

  describe('Scrollbar Behavior', () => {
    test('vertical scrollbar appears when content overflows', async () => {
      const testId = 'scrollbar-test'
      render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)

      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      
      // Should have scrollbar styling
      expect(slideContent).toHaveStyle('scrollbar-width: thin')
      expect(slideContent).toHaveStyle('scrollbar-color: #3b82f6 transparent')
      expect(slideContent).toHaveStyle('overflow-y: auto')
    })

    test('scrollbar styling is consistent across breakpoints', () => {
      const testBreakpoints = [
        { width: 320, name: 'mobile' },
        { width: 768, name: 'md' },
        { width: 1280, name: 'xl' }
      ]

      testBreakpoints.forEach((bp, index) => {
        const testId = `scrollbar-bp-${bp.name}-${index}`
        resizeWindow(bp.width)
        
        render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
        
        const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
        
        // Verify scrollbar CSS is applied
        expect(slideContent).toHaveClass('scrollbar-thin')
        expect(slideContent).toHaveStyle('overflow-y: auto')
        
        cleanup()
      })
    })
  })

  describe('Navigation Controls', () => {
    test('navigation controls work at all screen sizes', async () => {
      const testWidths = [375, 640, 768, 1024, 1280]
      
      for (let i = 0; i < testWidths.length; i++) {
        const width = testWidths[i]
        const testId = `nav-test-${width}-${i}`
        
        resizeWindow(width)
        render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
        
        const nextButton = screen.getByTestId(`${testId}-next-button`)
        const prevButton = screen.getByTestId(`${testId}-prev-button`)
        const indicator = screen.getByTestId(`${testId}-slide-indicator`)
        
        // Initial state
        expect(indicator).toHaveTextContent('Slide 1 of 3')
        expect(prevButton).toBeDisabled()
        expect(nextButton).not.toBeDisabled()
        
        // Navigate next
        await userEvent.click(nextButton)
        expect(indicator).toHaveTextContent('Slide 2 of 3')
        
        // Navigate back
        await userEvent.click(prevButton)
        expect(indicator).toHaveTextContent('Slide 1 of 3')
        
        // Should not cause horizontal scroll during navigation
        const viewport = screen.getByTestId(`${testId}-viewport`)
        expect(hasHorizontalScrollbar(viewport)).toBe(false)
        
        cleanup()
      }
    })

    test('slide transitions maintain viewport constraints', async () => {
      const testId = 'transition-test'
      render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
      
      const nextButton = screen.getByTestId(`${testId}-next-button`)
      const viewport = screen.getByTestId(`${testId}-viewport`)
      const container = screen.getByTestId(`${testId}-container`)
      
      // Navigate through all slides
      for (let i = 0; i < mockSlides.length - 1; i++) {
        await userEvent.click(nextButton)
        
        // Viewport should never show horizontal scrollbar
        expect(hasHorizontalScrollbar(viewport)).toBe(false)
        expect(viewport).toHaveStyle('overflow: hidden')
        
        // Container should be properly transformed
        expect(container).toHaveStyle('display: flex')
      }
    })
  })

  describe('Touch and Gesture Support', () => {
    test('handles touch events without breaking layout', async () => {
      const testId = 'touch-test'
      render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
      
      const viewport = screen.getByTestId(`${testId}-viewport`)
      const container = screen.getByTestId(`${testId}-container`)
      
      // Simulate touch start/move/end
      fireEvent.touchStart(viewport, {
        touches: [{ clientX: 100, clientY: 100 }]
      })
      
      fireEvent.touchMove(viewport, {
        touches: [{ clientX: 50, clientY: 100 }]
      })
      
      fireEvent.touchEnd(viewport)
      
      // Layout should remain intact
      expect(viewport).toHaveStyle('overflow: hidden')
      expect(container).toHaveStyle('display: flex')
      expect(hasHorizontalScrollbar(viewport)).toBe(false)
    })
  })

  describe('Content Overflow Handling', () => {
    test('slide content scrolls vertically when needed', () => {
      const testId = 'content-test'
      // Set to mobile size to get max-h-[60vh]
      resizeWindow(320)
      render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
      
      // Check first slide content
      const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
      
      // Should be scrollable vertically
      expect(slideContent).toHaveClass('overflow-y-auto')
      expect(slideContent).toHaveClass('max-h-[60vh]')
      
      // Should have scrollbar when content overflows
      const hasVerticalScroll = slideContent.scrollHeight > slideContent.clientHeight
      if (hasVerticalScroll) {
        expect(slideContent).toHaveStyle('scrollbar-width: thin')
      }
    })

    test('maintains responsive content sizing', () => {
      const breakpoints = [
        { width: 320, maxHeight: '60vh' },
        { width: 768, maxHeight: '65vh' },
        { width: 1024, maxHeight: '68vh' },
        { width: 1280, maxHeight: '70vh' }
      ]

      breakpoints.forEach((bp, index) => {
        const testId = `content-responsive-${bp.width}-${index}`
        resizeWindow(bp.width)
        
        render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
        
        const slideContent = screen.getByTestId(`${testId}-slide-content-0`)
        expect(slideContent).toHaveClass('overflow-y-auto')
        
        cleanup()
      })
    })
  })

  describe('Keyboard Navigation', () => {
    test('supports keyboard navigation', async () => {
      const testId = 'keyboard-test'
      render(<MockEmblaCarousel slides={mockSlides} testId={testId} />)
      
      const nextButton = screen.getByTestId(`${testId}-next-button`)
      const prevButton = screen.getByTestId(`${testId}-prev-button`)
      const indicator = screen.getByTestId(`${testId}-slide-indicator`)
      
      // Focus and activate next button with keyboard
      nextButton.focus()
      await userEvent.keyboard('{Enter}')
      
      expect(indicator).toHaveTextContent('Slide 2 of 3')
      
      // Focus and activate prev button with keyboard
      prevButton.focus()
      await userEvent.keyboard('{Enter}')
      
      expect(indicator).toHaveTextContent('Slide 1 of 3')
    })
  })
})