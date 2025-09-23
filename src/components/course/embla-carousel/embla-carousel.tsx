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

// Function to render markdown with custom styles
const MarkdownRenderer = ({ content }: { content: string }) => {
  return (
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
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground bg-muted/20 p-4 rounded-r-lg ml-4 mb-4">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  )
}

// Function to parse and format slide content
const formatSlideContent = (content: string | string[] | Record<string, string | string[]>) => {
  const sections: Array<{type: 'heading' | 'bullet' | 'text' | 'code', content: string, level?: number}> = []
  
  // Handle JSON object format
  if (typeof content === 'object' && !Array.isArray(content)) {
    Object.entries(content).forEach(([key, value]) => {
      // Add section heading
      sections.push({
        type: 'heading',
        content: key.charAt(0).toUpperCase() + key.slice(1),
        level: 1
      })
      
      // Handle the value (string or array)
      if (typeof value === 'string') {
        sections.push({
          type: 'text',
          content: value
        })
      } else if (Array.isArray(value)) {
        value.forEach(item => {
          sections.push({
            type: 'bullet',
            content: item
          })
        })
      }
    })
    return sections
  }
  
  // Handle both string and array formats (legacy support)
  const lines = Array.isArray(content) ? content : content.split('\n')
  
  lines.forEach(line => {
    const trimmed = line.trim()
    if (!trimmed) return
    
    // Detect headings with **text:**
    if (trimmed.match(/^\*\*.*:\*\*$/)) {
      sections.push({
        type: 'heading',
        content: trimmed.replace(/^\*\*/, '').replace(/:\*\*$/, ''),
        level: 1
      })
    }
    // Detect subheadings with **text**
    else if (trimmed.match(/^\*\*.*\*\*$/) && !trimmed.includes(':')) {
      sections.push({
        type: 'heading',
        content: trimmed.replace(/^\*\*/, '').replace(/\*\*$/, ''),
        level: 2
      })
    }
    // Detect bullet points
    else if (trimmed.startsWith('•')) {
      sections.push({
        type: 'bullet',
        content: trimmed.substring(1).trim()
      })
    }
    // Detect code blocks
    else if (trimmed.startsWith('`') && trimmed.endsWith('`')) {
      sections.push({
        type: 'code',
        content: trimmed.slice(1, -1)
      })
    }
    // Regular text
    else {
      sections.push({
        type: 'text',
        content: trimmed
      })
    }
  })
  
  return sections
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

    // Add keyboard navigation for vertical scrolling
    const handleKeyDown = (event: KeyboardEvent) => {
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
                <div className="embla__slide__content h-full p-4 flex flex-col">
                  <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                    <Card className="h-full border border-border/20 shadow-2xl bg-gradient-to-br from-card/90 via-card to-card/95 backdrop-blur-xl flex flex-col">
                      <CardHeader className="flex-shrink-0 pb-1 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-t-lg border-b border-border/10">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="p-1 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg">
                          <BookOpen className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <Badge variant="secondary" className="text-sm font-semibold bg-gradient-to-r from-accent/20 to-accent/10 text-accent-foreground border-accent/30 px-3 py-1">
                          Slide {slides.indexOf(slide) + 1} of {slides.length}
                        </Badge>
                      </div>
                      <CardTitle className="text-4xl font-bold text-foreground leading-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {slide.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent 
                      className="flex-1 overflow-y-auto p-8 embla__slide__scrollable relative"
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
                          <MarkdownRenderer content={slide.content.markdown} />
                        ) : (
                          /* Render traditional JSON content */
                          formatSlideContent(slide.content).map((section, index) => (
                            <div key={index}>
                              {section.type === 'heading' && section.level === 1 && (
                                <h3 className="text-2xl font-bold text-primary mb-2 flex items-center gap-3 pb-2 border-b border-primary/20 mt-8 first:mt-0">
                                  <div className="w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full shadow-sm"></div>
                                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{section.content}</span>
                                </h3>
                              )}
                              {section.type === 'heading' && section.level === 2 && (
                                <h4 className="text-xl font-semibold text-foreground mb-4 ml-6 text-secondary mt-6">
                                  {section.content}
                                </h4>
                              )}
                              {section.type === 'bullet' && (
                                <div className="flex items-start gap-4 ml-10 mb-3 group">
                                  <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full mt-2.5 shrink-0 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
                                  <p className="text-muted-foreground leading-relaxed text-base group-hover:text-foreground transition-colors duration-200">
                                    {section.content}
                                  </p>
                                </div>
                              )}
                              {section.type === 'code' && (
                                <div className="ml-14 mb-4">
                                  <code className="block bg-gradient-to-r from-muted/80 to-muted/60 border border-border/30 rounded-xl p-4 text-sm font-mono text-foreground shadow-inner backdrop-blur-sm">
                                    {section.content}
                                  </code>
                                </div>
                              )}
                              {section.type === 'text' && (
                                <p className="text-foreground leading-relaxed text-base ml-10 mb-4 bg-card/30 p-4 rounded-lg border border-border/20">
                                  {section.content}
                                </p>
                              )}
                            </div>
                          ))
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

      {/* Controls */}
      <div className="embla__controls p-6 border-t border-border/20 bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-xl shadow-lg">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-4">
            {/* Smart Previous Button Logic */}
            {prevBtnDisabled && hasPreviousTopic ? (
              // First slide of topic but not first topic - show Previous Topic button
              <Button
                variant="outline"
                size="default"
                onClick={onPreviousTopic}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white border-purple-500 rounded-xl px-6"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous Topic
              </Button>
            ) : (
              // Regular Previous button
              <Button
                variant="outline"
                size="default"
                onClick={scrollPrev}
                disabled={prevBtnDisabled}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 border-primary/20 hover:border-primary/40 hover:bg-primary/5 rounded-xl px-6"
              >
                <ChevronLeft className="h-5 w-5" />
                Previous
              </Button>
            )}
            
            {/* Smart Next Button Logic */}
            {nextBtnDisabled && isLastTopic ? (
              // Last slide of last topic - show Finish Course button
              <Button
                size="default"
                onClick={onFinishCourse}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 rounded-xl px-6"
              >
                Finish Course
                <CheckCircle className="h-5 w-5" />
              </Button>
            ) : nextBtnDisabled && hasNextTopic ? (
              // Last slide of topic but not last topic - show Next Topic button
              <Button
                size="default"
                onClick={onNextTopic}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl px-6"
              >
                Next Topic
                <ChevronRight className="h-5 w-5" />
              </Button>
            ) : (
              // Regular Next button
              <Button
                size="default"
                onClick={scrollNext}
                disabled={nextBtnDisabled}
                className="gap-2 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 rounded-xl px-6"
              >
                Next
                <ChevronRight className="h-5 w-5" />
              </Button>
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