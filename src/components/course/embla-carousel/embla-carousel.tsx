"use client"

import React, { useCallback, useEffect, useState, useRef } from 'react'
import { EmblaOptionsType, EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CourseSlide } from '@/data/types/course-types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

// Responsive breakpoint types
type Breakpoint = 'mobile' | 'tablet' | 'desktop'


// Device capabilities interface
interface DeviceCapabilities {
  hasTouch: boolean
  hasHover: boolean
  prefersReducedMotion: boolean
  supportsVibration: boolean
}

// Responsive breakpoint detection hook
const useResponsiveBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop')
  
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width < 768) setBreakpoint('mobile')
      else if (width < 1024) setBreakpoint('tablet')
      else setBreakpoint('desktop')
    }
    
    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])
  
  return breakpoint
}

// Device capabilities detection hook
const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    hasTouch: false,
    hasHover: false,
    prefersReducedMotion: false,
    supportsVibration: false
  })
  
  useEffect(() => {
    setCapabilities({
      hasTouch: 'ontouchstart' in window,
      hasHover: window.matchMedia('(hover: hover)').matches,
      prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      supportsVibration: 'vibrate' in navigator
    })
  }, [])
  
  return capabilities
}

// Responsive styles configuration
const getResponsiveStyles = (breakpoint: Breakpoint) => ({
  mobile: {
    titleSize: 'text-xl sm:text-2xl',
    contentSize: 'text-sm',
    padding: 'p-3 sm:p-4',
    cardHeight: 'min-h-[70vh]',
    buttonSize: 'min-h-[44px] min-w-[44px] px-3',
    spacing: 'gap-3'
  },
  tablet: {
    titleSize: 'text-2xl md:text-3xl',
    contentSize: 'text-base',
    padding: 'p-4 md:p-6',
    cardHeight: 'min-h-[75vh]',
    buttonSize: 'min-h-[48px] min-w-[48px] px-4',
    spacing: 'gap-4'
  },
  desktop: {
    titleSize: 'text-3xl lg:text-4xl',
    contentSize: 'text-lg',
    padding: 'p-6 lg:p-8',
    cardHeight: 'min-h-[80vh]',
    buttonSize: 'min-h-[52px] min-w-[52px] px-6',
    spacing: 'gap-6'
  }
}[breakpoint])

type PropType = {
  slides: CourseSlide[]
  options?: EmblaOptionsType
  initialSlide?: number
  onSlideChange?: (index: number) => void
  onComplete?: () => void
  onNextTopic?: () => void
  onPreviousTopic?: () => void
  onFinishCourse?: () => void
  isLastTopic?: boolean
  isFirstTopic?: boolean
  hasNextTopic?: boolean
  hasPreviousTopic?: boolean
}

// Parallax parameters
const PARALLAX_FACTOR = 0

const numberWithinRange = (number: number, min: number, max: number): number =>
  Math.min(Math.max(number, min), max)

// Function to check if content is markdown
const isMarkdownContent = (content: unknown): content is { markdown: string } => {
  return typeof content === 'object' && content !== null && 'markdown' in content && typeof content.markdown === 'string'
}

// Responsive Navigation Button Component
const ResponsiveButton: React.FC<{
  breakpoint: Breakpoint
  capabilities: DeviceCapabilities
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive"
  className?: string
}> = ({ breakpoint, capabilities, children, onClick, disabled, variant = "outline", className }) => {
  const styles = getResponsiveStyles(breakpoint)
  
  const handleClick = () => {
    if (onClick) {
      // Add haptic feedback for mobile devices
      if (capabilities.supportsVibration && breakpoint === 'mobile') {
        navigator.vibrate(50)
      }
      onClick()
    }
  }
  
  return (
    <Button
      variant={variant}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        styles.buttonSize,
        "shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl",
        breakpoint === 'mobile' && "active:scale-95",
        className
      )}
    >
      {children}
    </Button>
  )
}

// Navigation Hints Component
const NavigationHints: React.FC<{
  breakpoint: Breakpoint
  capabilities: DeviceCapabilities
}> = ({ breakpoint, capabilities }) => {
  if (breakpoint === 'mobile' && capabilities.hasTouch) {
    return (
      <div className="text-center text-xs text-muted-foreground py-2 bg-muted/30 rounded-lg mx-4 mb-2">
        👆 Swipe left/right to navigate • ⌨️ Use arrow keys
      </div>
    )
  }
  
  if (breakpoint === 'desktop' && capabilities.hasHover) {
    return (
      <div className="text-center text-sm text-muted-foreground py-1">
        ⌨️ Use ← → arrow keys to navigate • ↑ ↓ to scroll content
      </div>
    )
  }
  
  return null
}

// Responsive Content Component
const ResponsiveContent: React.FC<{
  content: string
  breakpoint: Breakpoint
}> = ({ content, breakpoint }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const styles = getResponsiveStyles(breakpoint)
  
  const maxLength = {
    mobile: 300,
    tablet: 500,
    desktop: Infinity
  }[breakpoint]
  
  const shouldTruncate = content.length > maxLength && breakpoint !== 'desktop'
  const displayContent = shouldTruncate && !isExpanded 
    ? content.slice(0, maxLength) + '...'
    : content
  
  return (
    <div className={cn(styles.contentSize, "prose prose-sm max-w-none dark:prose-invert")}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold text-primary mb-6 flex items-center gap-3 pb-3 border-b border-primary/20">
              <div className="w-3 h-10 bg-gradient-to-b from-primary to-secondary rounded-full shadow-sm"></div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold text-primary mb-4 flex items-center gap-3 pb-2 border-b border-primary/20 mt-8">
              <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full shadow-sm"></div>
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold text-foreground mb-4 ml-6 text-secondary mt-6">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold text-foreground mb-3 ml-8 text-secondary/80 mt-4">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-foreground leading-relaxed text-base ml-4 mb-4 bg-card/30 p-4 rounded-lg border border-border/20">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="space-y-3 ml-6 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="flex items-start gap-4 group">
              <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mt-2.5 shrink-0 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground transition-colors duration-200">
                {children}
              </span>
            </li>
          ),
          strong: ({ children }) => (
            <strong className="text-primary font-semibold">{children}</strong>
          ),
          code: ({ children }) => (
            <code className="bg-gradient-to-r from-muted/80 to-muted/60 border border-border/30 rounded px-2 py-1 text-sm font-mono text-foreground">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gradient-to-r from-muted/80 to-muted/60 border border-border/30 rounded-xl p-4 mb-4 overflow-x-auto">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground bg-muted/20 p-4 rounded-r-lg ml-4 mb-4">
              {children}
            </blockquote>
          ),
        }}
      >
        {displayContent}
      </ReactMarkdown>
      {shouldTruncate && (
        <Button 
          variant="ghost" 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-primary hover:text-primary/80 p-0 h-auto font-medium"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </Button>
      )}
    </div>
  )
}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { 
    slides, 
    options, 
    initialSlide = 0,
    onSlideChange, 
    onComplete, 
    onNextTopic, 
    onPreviousTopic,
    onFinishCourse, 
    isLastTopic = false, 
    hasNextTopic = false,
    hasPreviousTopic = false
  } = props
  
  // Responsive hooks
  const breakpoint = useResponsiveBreakpoint()
  const capabilities = useDeviceCapabilities()
  const styles = getResponsiveStyles(breakpoint)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState(initialSlide)
  const [scrollProgress, setScrollProgress] = useState(0)
  const hasCompletedRef = useRef(false) // Use ref to avoid dependency issues
  const parallaxNodesRef = useRef<HTMLDivElement[]>([])

  const setParallaxValues = useCallback((emblaApi: EmblaCarouselType) => {
    const engine = emblaApi.internalEngine()
    const scrollProgress = emblaApi.scrollProgress()

    emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
      let diffToTarget = scrollSnap - scrollProgress
      const slidesInSnap = engine.slideRegistry[snapIndex]

      slidesInSnap.forEach((slideIndex) => {
        if (engine.options.loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target()

            if (slideIndex === loopItem.index && target !== 0) {
              const sign = Math.sign(target)

              if (sign === -1) {
                diffToTarget = scrollSnap - (1 + scrollProgress)
              }
              if (sign === 1) {
                diffToTarget = scrollSnap + (1 - scrollProgress)
              }
            }
          })
        }

        const translate = diffToTarget * (-1 * PARALLAX_FACTOR) * 100
        const parallaxNode = parallaxNodesRef.current[slideIndex]
        if (parallaxNode) {
          parallaxNode.style.transform = `translate3d(${numberWithinRange(
            translate,
            -100,
            100
          )}%, 0px, 0px)`
        }
      })
    })
  }, [])

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  )

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  )

  // Function to check if content is scrollable
  const checkScrollable = useCallback((element: HTMLElement | null) => {
    // This function can be used in the future if scroll indicator is needed
    if (element) {
      const isScrollable = element.scrollHeight > element.clientHeight
      console.log('Content scrollable:', isScrollable)
    }
  }, [])

  // Handle scroll events
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    // This can be used for future scroll handling
    const target = e.target as HTMLDivElement
    console.log('Scroll position:', target.scrollTop)
  }, [])

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setParallaxValues(emblaApi)
  }, [setParallaxValues])

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    const newIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(newIndex)
    setPrevBtnDisabled(!emblaApi.canScrollPrev())
    setNextBtnDisabled(!emblaApi.canScrollNext())
    
    // Notify parent of slide change
    onSlideChange?.(newIndex)
    
    // Check if this is the last slide and call onComplete (only once)
    if (newIndex === slides.length - 1 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      onComplete?.()
    }
  }, [onSlideChange, onComplete, slides.length])

  const onScroll = useCallback((emblaApi: EmblaCarouselType) => {
    const progress = Math.max(0, Math.min(1, emblaApi.scrollProgress()))
    setScrollProgress(progress * 100)
    setParallaxValues(emblaApi)
  }, [setParallaxValues])

  useEffect(() => {
    if (!emblaApi) return

    onInit(emblaApi)
    onSelect(emblaApi)
    onScroll(emblaApi)
    emblaApi.on('reInit', onInit)
    emblaApi.on('reInit', onSelect)
    emblaApi.on('select', onSelect)
    emblaApi.on('scroll', onScroll)

    // Add keyboard navigation for both slide navigation and vertical scrolling
    const handleKeyDown = (event: KeyboardEvent) => {
      // Handle horizontal navigation (left/right arrows for slides)
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        if (event.key === 'ArrowLeft' && emblaApi.canScrollPrev()) {
          emblaApi.scrollPrev()
        } else if (event.key === 'ArrowRight' && emblaApi.canScrollNext()) {
          emblaApi.scrollNext()
        }
        return
      }
      
      // Handle vertical navigation (up/down arrows for content scrolling)
      const activeSlide = document.querySelector('.embla__slide__scrollable')
      if (activeSlide && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
        event.preventDefault()
        const scrollAmount = event.key === 'ArrowDown' ? 100 : -100
        activeSlide.scrollBy({ top: scrollAmount, behavior: 'smooth' })
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [emblaApi, onInit, onSelect, onScroll])

  // Handle initial slide positioning
  useEffect(() => {
    if (!emblaApi || initialSlide === 0) return
    
    // Scroll to the initial slide without animation
    emblaApi.scrollTo(initialSlide, false)
  }, [emblaApi, initialSlide])

  // Reset completion state when slides change (new topic selected)
  useEffect(() => {
    hasCompletedRef.current = false
    setSelectedIndex(0)
  }, [slides])

  return (
    <div className="embla h-full flex flex-col bg-gradient-to-br from-background/50 to-primary/5">
      {/* Main Carousel */}
      <div className="embla__viewport flex-1" ref={emblaRef}>
        <div className="embla__container h-full">
          {slides.map((slide, index) => (
            <div className="embla__slide h-full" key={slide.id}>
              <div 
                className="embla__slide__parallax h-full"
                ref={(node) => {
                  if (node) parallaxNodesRef.current[index] = node;
                }}
              >
                <div className={cn("embla__slide__content h-full flex flex-col", styles.padding)}>
                  <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                    <Card className={cn("h-full border border-border/20 shadow-2xl bg-gradient-to-br from-card/90 via-card to-card/95 backdrop-blur-xl flex flex-col", styles.cardHeight)}>
                      <CardHeader className="flex-shrink-0 pb-1 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-t-lg border-b border-border/10">
                        <div className={cn("flex items-center mb-3", styles.spacing)}>
                          <div className="p-1 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                          <BookOpen className={cn("text-primary-foreground", breakpoint === 'mobile' ? "h-5 w-5" : "h-6 w-6")} />
                        </div>
                        <Badge variant="secondary" className={cn("font-semibold bg-gradient-to-r from-accent/20 to-accent/10 text-accent-foreground border-accent/30 px-3 py-1", breakpoint === 'mobile' ? "text-xs" : "text-sm")}>
                          Slide {slides.indexOf(slide) + 1} of {slides.length}
                        </Badge>
                      </div>
                      <CardTitle className={cn("font-bold text-foreground leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent", styles.titleSize)}>
                        {slide.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent 
                      className={cn("flex-1 overflow-y-auto embla__slide__scrollable relative", styles.padding)}
                      onScroll={handleScroll}
                      ref={(el) => {
                        if (el) {
                          checkScrollable(el)
                        }
                      }}
                    >
                      <div className="space-y-4 min-h-0">
                        {/* Render markdown content if available */}
                        {isMarkdownContent(slide.content) ? (
                          <ResponsiveContent content={slide.content.markdown} breakpoint={breakpoint} />
                        ) : (
                          /* Simple content display for non-markdown */
                          <div className="text-foreground leading-relaxed">
                            {typeof slide.content === 'string' ? (
                              <p>{slide.content}</p>
                            ) : Array.isArray(slide.content) ? (
                              <ul className="space-y-2">
                                {slide.content.map((item, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div>
                                {Object.entries(slide.content).map(([key, value], index) => (
                                  <div key={index} className="mb-4">
                                    <h3 className="font-semibold text-primary mb-2">{key}</h3>
                                    {Array.isArray(value) ? (
                                      <ul className="space-y-1 ml-4">
                                        {value.map((item, itemIndex) => (
                                          <li key={itemIndex} className="flex items-start gap-2">
                                            <span className="text-primary">•</span>
                                            <span>{item}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      <p>{value}</p>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {/* Scroll Indicator
                      {isContentScrollable && showScrollIndicator && (
                        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary/90 text-primary-foreground px-3 py-2 rounded-lg shadow-lg animate-bounce">
                          <ChevronDown className="h-4 w-4" />
                          <span className="text-sm font-medium">Scroll for more</span>
                        </div>
                      )} */}
                    </CardContent>
                  </Card>
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="embla__progress bg-gradient-to-r from-muted/30 via-muted/20 to-muted/30 relative overflow-hidden shadow-inner">
        <div 
          className="embla__progress__bar h-3 bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out shadow-lg"
          style={{ transform: `translateX(-${100 - scrollProgress}%)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
      </div>

      {/* Navigation Hints */}
      <NavigationHints breakpoint={breakpoint} capabilities={capabilities} />

      {/* Controls */}
      <div className={cn("embla__controls border-t border-border/20 bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-xl shadow-lg", styles.padding)}>
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <div className={cn("flex items-center", styles.spacing)}>
            {/* Smart Previous Button Logic */}
            {prevBtnDisabled && hasPreviousTopic ? (
              // First slide of topic but not first topic - show Previous Topic button
              <ResponsiveButton
                breakpoint={breakpoint}
                capabilities={capabilities}
                onClick={onPreviousTopic}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-purple-500"
              >
                <ChevronLeft className={cn(breakpoint === 'mobile' ? "h-4 w-4" : "h-5 w-5")} />
                {breakpoint === 'mobile' ? 'Prev Topic' : 'Previous Topic'}
              </ResponsiveButton>
            ) : (
              // Regular Previous button
              <ResponsiveButton
                breakpoint={breakpoint}
                capabilities={capabilities}
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
              >
                <ChevronLeft className={cn(breakpoint === 'mobile' ? "h-4 w-4" : "h-5 w-5")} />
                {breakpoint === 'mobile' ? 'Prev' : 'Previous'}
              </ResponsiveButton>
            )}
            
            {/* Smart Next Button Logic */}
            {nextBtnDisabled && isLastTopic ? (
              // Last slide of last topic - show Finish Course button
              <ResponsiveButton
                breakpoint={breakpoint}
                capabilities={capabilities}
                onClick={onFinishCourse}
                variant="default"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                {breakpoint === 'mobile' ? 'Finish' : 'Finish Course'}
                <CheckCircle className={cn(breakpoint === 'mobile' ? "h-4 w-4" : "h-5 w-5")} />
              </ResponsiveButton>
            ) : nextBtnDisabled && hasNextTopic ? (
              // Last slide of topic but not last topic - show Next Topic button
              <ResponsiveButton
                breakpoint={breakpoint}
                capabilities={capabilities}
                onClick={onNextTopic}
                variant="default"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                {breakpoint === 'mobile' ? 'Next Topic' : 'Next Topic'}
                <ChevronRight className={cn(breakpoint === 'mobile' ? "h-4 w-4" : "h-5 w-5")} />
              </ResponsiveButton>
            ) : (
              // Regular Next button
              <ResponsiveButton
                breakpoint={breakpoint}
                capabilities={capabilities}
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                variant="default"
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white"
              >
                {breakpoint === 'mobile' ? 'Next' : 'Next'}
                <ChevronRight className={cn(breakpoint === 'mobile' ? "h-4 w-4" : "h-5 w-5")} />
              </ResponsiveButton>
            )}
          </div>

          {/* Slide Indicator */}
          <div className="flex items-center gap-8">
            <div className="text-center bg-card/50 p-3 rounded-xl border border-border/20">
              <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {selectedIndex + 1}
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                of {slides.length}
              </div>
            </div>
            <div className="text-center bg-card/50 p-3 rounded-xl border border-border/20">
              <div className="text-lg font-bold text-accent">
                {Math.round(scrollProgress)}%
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                complete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmblaCarousel