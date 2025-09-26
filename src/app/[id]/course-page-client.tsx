"use client"

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { BookOpen, ChevronRight, CheckCircle, Menu, X, GripVertical } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { courses } from '@/lib/courses/courses'
import { getCourseContent } from '@/lib/courses/course-loader'
import { CourseTopic, CourseSlide, CourseContent } from '@/data/types/course-types'
import { preloadNextTopic } from '@/lib/courses/dynamic-markdown-loader'
import EmblaCarousel from '@/components/course/embla-carousel/embla-carousel'
import '../../components/course/embla-carousel/embla.css'

interface CoursePageClientProps {
  courseId: string
}

export default function CoursePageClient({ courseId }: CoursePageClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<CourseTopic | null>(null)
  const [currentSlides, setCurrentSlides] = useState<CourseSlide[]>([])
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [initialSlideIndex, setInitialSlideIndex] = useState(0)
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    // Responsive sidebar width based on screen size
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      if (width < 768) return 280 // Mobile
      if (width < 1024) return 320 // Tablet
      if (width < 1440) return 350 // Laptop
      return 380 // Desktop
    }
    return 350 // Default for SSR
  })
  const isDragging = useRef(false)
  const dragStartX = useRef(0)
  const dragStartWidth = useRef(0)
  const router = useRouter()

  const course = courses.find(c => c.id === courseId)

  // Topic metadata for preloading (computer-networks specific)
  const topicMetaMap = useMemo(() => new Map([
    ['introduction', { slidePattern: 'intro-{n}.md', slideCount: 30 }],
    ['osi-model', { slidePattern: 'osi-{n}.md', slideCount: 30 }],
    ['tcp-ip', { slidePattern: 'tcp-{n}.md', slideCount: 30 }],
    ['network-devices', { slidePattern: 'devices-{n}.md', slideCount: 20 }],
    ['routing-protocols', { slidePattern: 'routing-{n}.md', slideCount: 20 }],
    ['network-security', { slidePattern: 'security-{n}.md', slideCount: 22 }],
    ['troubleshooting', { slidePattern: 'troubleshooting-{n}.md', slideCount: 15 }],
    ['advanced-topics', { slidePattern: 'advanced-{n}.md', slideCount: 15 }]
  ]), [])

  useEffect(() => {
    const loadCourseContent = async () => {
      setIsLoading(true)
      try {
        const content = await getCourseContent(courseId)
        setCourseContent(content || null)
        
        // Auto-select first topic if available
        if (content && content.topics.length > 0) {
          const firstTopic = content.topics[0]
          setSelectedTopic(firstTopic)
          setCurrentSlides(firstTopic.slides)
        }
      } catch (error) {
        console.error('Failed to load course content:', error)
        setCourseContent(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadCourseContent()
  }, [courseId])

  // Responsive sidebar width handler
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      let newWidth: number
      if (width < 768) newWidth = 280 // Mobile
      else if (width < 1024) newWidth = 320 // Tablet  
      else if (width < 1440) newWidth = 350 // Laptop
      else newWidth = 380 // Desktop
      
      setSidebarWidth(newWidth)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleTopicSelect = (topic: CourseTopic) => {
    setSelectedTopic(topic)
    setCurrentSlides(topic.slides)
    setInitialSlideIndex(0) // Always start from first slide when selecting from sidebar
    
    // Preload next topic slides in background
    if (courseContent) {
      preloadNextTopic(courseContent, topic.id, topicMetaMap)
    }
  }

  // const handleSlideChange = (index: number) => {
  //   // Slide change handler - can be used for tracking progress
  //   // console.log(`Slide changed to: ${index}`)
  // }

  const handleTopicComplete = () => {
    if (selectedTopic) {
      setCompletedTopics(prev => new Set([...prev, selectedTopic.id]))
    }
  }

  const handleNextTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return
    
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    const nextTopicIndex = currentTopicIndex + 1
    
    if (nextTopicIndex < courseContent.topics.length) {
      const nextTopic = courseContent.topics[nextTopicIndex]
      setSelectedTopic(nextTopic)
      setCurrentSlides(nextTopic.slides)
      setInitialSlideIndex(0) // Start from first slide for next topic
      
      // Preload next topic after this one
      preloadNextTopic(courseContent, nextTopic.id, topicMetaMap)
    }
  }, [selectedTopic, courseContent, topicMetaMap])

  const handlePreviousTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return
    
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    const previousTopicIndex = currentTopicIndex - 1
    
    if (previousTopicIndex >= 0) {
      const previousTopic = courseContent.topics[previousTopicIndex]
      setSelectedTopic(previousTopic)
      setCurrentSlides(previousTopic.slides)
      setInitialSlideIndex(previousTopic.slides.length - 1) // Start from last slide for previous topic
    }
  }, [selectedTopic, courseContent])

  const handleFinishCourse = useCallback(() => {
    router.push('/browse-courses')
  }, [router])

  // Helper function to check if current topic is the last topic
  const isLastTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return false
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    return currentTopicIndex === courseContent.topics.length - 1
  }, [selectedTopic, courseContent])

  // Helper function to check if current topic is the first topic
  const isFirstTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return false
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    return currentTopicIndex === 0
  }, [selectedTopic, courseContent])

  // Helper function to check if there's a next topic
  const hasNextTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return false
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    return currentTopicIndex < courseContent.topics.length - 1
  }, [selectedTopic, courseContent])

  // Helper function to check if there's a previous topic
  const hasPreviousTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return false
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    return currentTopicIndex > 0
  }, [selectedTopic, courseContent])

  // Mouse drag handlers for sidebar resizing - MUST be before early returns
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return

      const delta = e.clientX - dragStartX.current
      const newWidth = Math.min(Math.max(dragStartWidth.current + delta, 250), 600)
      setSidebarWidth(newWidth)
    }

    const handleMouseUp = () => {
      isDragging.current = false
      document.body.style.userSelect = ''
      document.body.style.cursor = ''
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  // Mouse down handler for sidebar resizing
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    dragStartX.current = e.clientX
    dragStartWidth.current = sidebarWidth
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'
  }

  // Calculate overall progress
  const totalTopics = courseContent?.topics.length || 0
  const completedCount = completedTopics.size
  const overallProgress = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0

    // Loading state
  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] supports-[height:100cqh]:h-[calc(100cqh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground">Loading Course...</h2>
        </div>
      </div>
    )
  }

  // Course not found
  if (!course || !courseContent) {
    return (
      <div className="h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] supports-[height:100cqh]:h-[calc(100cqh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
          <p className="text-muted-foreground mb-6">The course you&apos;re looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/browse-courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-4rem)] h-[calc(100dvh-4rem)] supports-[height:100cqh]:h-[calc(100cqh-4rem)] bg-gradient-to-br from-background via-background/50 to-primary/5 flex flex-col">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 sticky top-16 z-40 shadow-lg shadow-primary/5 flex-shrink-0">
        <div className="container mx-auto px-1 lg:px-2 py-0.5 lg:py-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 lg:gap-4">
              <div className="h-5 lg:h-6 w-px bg-gradient-to-b from-primary/20 to-secondary/20" />
              {/* Sidebar toggle for smaller screens */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="xl:hidden gap-1 hover:bg-secondary/10 rounded-xl transition-all duration-200 text-xs lg:text-sm p-1"
              >
                {sidebarOpen ? <X className="h-3 w-3 lg:h-4 lg:w-4" /> : <Menu className="h-3 w-3 lg:h-4 lg:w-4" />}
                <span className="hidden sm:inline">Topics</span>
              </Button>
              <div className="xl:hidden h-5 lg:h-6 w-px bg-gradient-to-b from-primary/20 to-secondary/20" />
              <div>
                <h1 className="font-bold text-foreground text-xs lg:text-base bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{course?.title || 'Course'}</h1>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium hidden lg:block">Computer Networking Course</p>
              </div>
            </div>
            <div className="flex items-center gap-1 lg:gap-3">
              <Card className="px-1 lg:px-4 py-0.5 lg:py-2 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-primary/20 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-1 lg:gap-3">
                  <div className="text-center">
                    <div className="text-xs lg:text-base font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {completedCount}/{totalTopics}
                    </div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground font-medium hidden lg:block">Topics</div>
                  </div>
                  <div className="w-8 lg:w-16 h-1.5 lg:h-2 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out rounded-full shadow-sm"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-xs lg:text-base font-bold text-primary">
                      {Math.round(overallProgress)}%
                    </div>
                    <div className="text-[10px] lg:text-xs text-muted-foreground font-medium hidden lg:block">Complete</div>
                  </div>
                </div>
              </Card>
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent-foreground font-semibold px-1 lg:px-2 py-0.5 text-xs lg:text-sm">{course?.level || 'Course'}</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Sidebar - 35% width for 13" screens */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:translate-x-0 fixed xl:relative z-50 xl:z-auto h-full border-r border-border/20 bg-gradient-to-b from-card/95 to-card/98 xl:from-card/50 xl:to-card/80 backdrop-blur-sm overflow-y-auto transition-transform duration-300 ease-in-out`}
        style={{ width: `${sidebarWidth}px` }}
        >
          <div className="p-1 lg:p-2">
            <div className="mb-2 lg:mb-3">
              <div className="flex items-center justify-between xl:justify-start mb-3">
                <h2 className="font-bold text-foreground flex items-center gap-2 text-xs lg:text-base">
                  <div className="p-1.5 lg:p-2 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/10 rounded-xl shadow-lg border border-primary/20 group-hover:shadow-xl transition-all duration-300">
                    <BookOpen className="h-3 w-3 lg:h-4 lg:w-4 text-primary drop-shadow-sm" />
                  </div>
                  <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-extrabold tracking-wide">Course Topics</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="xl:hidden hover:bg-secondary/10 rounded-lg p-0.5"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <div className="bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-sm p-2 lg:p-3 rounded-xl border border-border/30 shadow-sm mb-3">
                <p className="text-xs lg:text-sm text-muted-foreground font-medium">
                  <span className="text-primary font-semibold">{completedCount}</span>/<span className="text-secondary font-semibold">{totalTopics}</span> topics completed
                </p>
                <div className="w-full bg-muted/30 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-primary via-secondary to-accent h-full rounded-full transition-all duration-500 ease-out shadow-sm"
                    style={{ width: `${totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2 lg:space-y-3">
              {courseContent?.topics.map((topic, index) => (
                <Card 
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-300 group relative overflow-hidden ${
                    selectedTopic?.id === topic.id
                      ? 'ring-2 ring-primary/50 bg-gradient-to-r from-primary/12 via-secondary/8 to-accent/6 shadow-lg border-primary/40 scale-[1.02] hover:shadow-xl'
                      : 'hover:bg-gradient-to-r hover:from-card/90 hover:via-card/80 hover:to-card/70 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover:scale-[1.01] hover:shadow-lg'
                  }`}
                  onClick={() => {
                    handleTopicSelect(topic)
                    setSidebarOpen(false)
                  }}
                >
                  {/* Subtle glow effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    selectedTopic?.id === topic.id 
                      ? 'bg-gradient-to-r from-primary/5 to-secondary/5' 
                      : 'bg-gradient-to-r from-primary/3 to-secondary/3'
                  }`} />
                  <CardContent className="p-2 lg:p-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                        <Badge variant="outline" className={`text-xs px-2 lg:px-3 py-1 font-semibold flex-shrink-0 transition-all duration-300 ${
                          selectedTopic?.id === topic.id
                            ? 'bg-gradient-to-r from-primary to-secondary text-primary-foreground border-primary/50 shadow-md'
                            : 'bg-gradient-to-r from-muted/80 to-muted/60 text-muted-foreground border-muted-foreground/30 group-hover:border-primary/40 group-hover:bg-gradient-to-r group-hover:from-primary/10 group-hover:to-secondary/10'
                        }`}>
                          {index + 1}
                        </Badge>
                        {completedTopics.has(topic.id) && (
                          <div className="relative flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse opacity-20" />
                            <div className="flex items-center justify-center w-full h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-lg">
                              <CheckCircle className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-white drop-shadow-sm" />
                            </div>
                          </div>
                        )}
                        <h3 className={`font-semibold text-xs lg:text-sm truncate transition-all duration-300 ${
                          selectedTopic?.id === topic.id 
                            ? 'text-primary drop-shadow-sm' 
                            : 'text-foreground group-hover:text-primary group-hover:translate-x-1'
                        }`}>
                          {topic.title}
                        </h3>
                      </div>
                      <div className="relative flex items-center justify-center flex-shrink-0">
                        <ChevronRight className={`h-3 w-3 lg:h-4 lg:w-4 transition-all duration-300 ml-2 ${
                          selectedTopic?.id === topic.id 
                            ? 'rotate-90 text-primary scale-110 drop-shadow-sm' 
                            : 'text-muted-foreground group-hover:text-primary group-hover:translate-x-1 group-hover:scale-110'
                        }`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Resize Handle */}
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize hidden xl:block"
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-y-0 right-0 w-4 hover:bg-primary/5 transition-colors flex items-center justify-center group">
              <GripVertical className="w-3 h-8 text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
            </div>
          </div>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <main
          className="flex-1 xl:flex-none bg-gradient-to-br from-background to-muted/10 relative h-full overflow-hidden w-full xl:w-auto"
          style={{ 
            width: typeof window !== 'undefined' && window.innerWidth >= 1280 
              ? `calc(100% - ${sidebarWidth}px)` 
              : '100%' 
          }}
        >
          {currentSlides.length > 0 ? (
            <EmblaCarousel 
              key={`${selectedTopic?.id}-${initialSlideIndex}`} // Force remount when topic or initial slide changes
              slides={currentSlides} 
              options={{ loop: false }} 
              initialSlide={initialSlideIndex}
              // onSlideChange={handleSlideChange}
              onComplete={handleTopicComplete}
              onNextTopic={handleNextTopic}
              onPreviousTopic={handlePreviousTopic}
              onFinishCourse={handleFinishCourse}
              isLastTopic={isLastTopic()}
              isFirstTopic={isFirstTopic()}
              hasNextTopic={hasNextTopic()}
              hasPreviousTopic={hasPreviousTopic()}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-4 lg:p-8">
              <Card className="text-center max-w-md bg-gradient-to-br from-background to-muted/20 shadow-lg">
                <CardContent className="p-6 lg:p-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 lg:h-8 lg:w-8 text-primary" />
                  </div>
                  <h3 className="text-lg lg:text-xl font-semibold text-foreground mb-3">
                    Ready to Learn?
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4">
                    Select a topic from the sidebar to begin your networking journey
                  </p>
                  <Badge variant="secondary" className="text-xs lg:text-sm">
                    {courseContent?.topics.length || 0} topics available
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
