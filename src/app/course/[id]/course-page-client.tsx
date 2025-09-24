"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { ArrowLeft, BookOpen, ChevronRight, CheckCircle, Menu, X } from 'lucide-react'
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
import '../../../components/course/embla-carousel/embla.css'

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
  const router = useRouter()

  const course = courses.find(c => c.id === courseId)

  // Topic metadata for preloading (computer-networks specific)
  const topicMetaMap = useMemo(() => new Map([
    ['introduction', { slidePattern: 'intro-{n}.md', slideCount: 30 }],
    ['osi-model', { slidePattern: 'osi-{n}.md', slideCount: 30 }],
    ['tcp-ip', { slidePattern: 'tcp-{n}.md', slideCount: 30 }],
    ['network-devices', { slidePattern: 'devices-{n}.md', slideCount: 20 }],
    ['routing-protocols', { slidePattern: 'routing-{n}.md', slideCount: 20 }],
    ['network-security', { slidePattern: 'security-{n}.md', slideCount: 25 }],
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

  // Calculate overall progress
  const totalTopics = courseContent?.topics.length || 0
  const completedCount = completedTopics.size
  const overallProgress = totalTopics > 0 ? (completedCount / totalTopics) * 100 : 0

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <div className="min-h-screen flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/20 bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/60 sticky top-16 z-40 shadow-lg shadow-primary/5">
        <div className="container mx-auto px-2 lg:px-4 py-1 lg:py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 lg:gap-6">
              <Button variant="ghost" size="sm" asChild className="gap-1 lg:gap-2 hover:bg-secondary/10 rounded-xl transition-all duration-200 text-xs lg:text-sm">
                <Link href="/browse-courses">
                  <ArrowLeft className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="hidden sm:inline">Back to Courses</span>
                  <span className="sm:hidden">Back</span>
                </Link>
              </Button>
              <div className="h-6 lg:h-8 w-px bg-gradient-to-b from-primary/20 to-secondary/20" />
              {/* Sidebar toggle for smaller screens */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="xl:hidden gap-1 hover:bg-secondary/10 rounded-xl transition-all duration-200 text-xs lg:text-sm"
              >
                {sidebarOpen ? <X className="h-3 w-3 lg:h-4 lg:w-4" /> : <Menu className="h-3 w-3 lg:h-4 lg:w-4" />}
                <span className="hidden sm:inline">Topics</span>
              </Button>
              <div className="xl:hidden h-6 lg:h-8 w-px bg-gradient-to-b from-primary/20 to-secondary/20" />
              <div>
                <h1 className="font-bold text-foreground text-sm lg:text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{course.title}</h1>
                <p className="text-xs lg:text-sm text-muted-foreground font-medium hidden lg:block">Computer Networking Course</p>
              </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <Card className="px-2 lg:px-6 py-1 lg:py-3 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-primary/20 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2 lg:gap-4">
                  <div className="text-center">
                    <div className="text-sm lg:text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {completedCount}/{totalTopics}
                    </div>
                    <div className="text-xs lg:text-xs text-muted-foreground font-medium hidden lg:block">Topics</div>
                  </div>
                  <div className="w-12 lg:w-20 h-2 lg:h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out rounded-full shadow-sm"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-sm lg:text-lg font-bold text-primary">
                      {Math.round(overallProgress)}%
                    </div>
                    <div className="text-xs lg:text-xs text-muted-foreground font-medium hidden lg:block">Complete</div>
                  </div>
                </div>
              </Card>
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent-foreground font-semibold px-2 lg:px-3 py-1 text-xs lg:text-sm">{course.level}</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive Layout */}
      <div className="relative flex h-[calc(100vh-6rem)] lg:h-[calc(100vh-8rem)]">
        {/* Sidebar - 35% width for 13" screens */}
        <aside className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } xl:translate-x-0 fixed xl:relative z-50 xl:z-auto w-72 xl:w-[35%] 2xl:w-[30%] h-full border-r border-border/20 bg-gradient-to-b from-card/95 to-card/98 xl:from-card/50 xl:to-card/80 backdrop-blur-sm overflow-y-auto transition-transform duration-300 ease-in-out`}>
          <div className="p-3 lg:p-5">
            <div className="mb-4 lg:mb-6">
              <div className="flex items-center justify-between xl:justify-start mb-3">
                <h2 className="font-bold text-foreground flex items-center gap-2 text-sm lg:text-lg">
                  <div className="p-1.5 lg:p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-sm">
                    <BookOpen className="h-4 w-4 lg:h-5 lg:w-5 text-primary-foreground" />
                  </div>
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Course Topics</span>
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="xl:hidden hover:bg-secondary/10 rounded-lg p-1"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground mb-3 bg-card/50 p-2 lg:p-3 rounded-lg">
                {completedCount}/{totalTopics} topics completed - {courseContent?.topics.length} available
              </p>
            </div>
            <div className="space-y-1 lg:space-y-2">
              {courseContent?.topics.map((topic, index) => (
                <Card 
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md group ${
                    selectedTopic?.id === topic.id
                      ? 'ring-1 ring-primary bg-gradient-to-r from-primary/8 to-secondary/4 shadow-md border-primary/30'
                      : 'hover:bg-card/80 hover:border-primary/20 bg-card/40 backdrop-blur-sm'
                  }`}
                  onClick={() => {
                    handleTopicSelect(topic)
                    setSidebarOpen(false) // Close sidebar on mobile after selection
                  }}
                >
                  <CardContent className="p-2 lg:p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                        <Badge variant="outline" className={`text-xs px-2 lg:px-3 py-0.5 lg:py-1 font-medium flex-shrink-0 ${
                          selectedTopic?.id === topic.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </Badge>
                        {completedTopics.has(topic.id) && (
                          <div className="flex items-center justify-center w-4 h-4 lg:w-5 lg:h-5 bg-gradient-to-r from-secondary to-accent rounded-full flex-shrink-0">
                            <CheckCircle className="h-2.5 w-2.5 lg:h-3 lg:w-3 text-white" />
                          </div>
                        )}
                        <h3 className={`font-semibold text-xs lg:text-sm truncate transition-colors duration-200 ${
                          selectedTopic?.id === topic.id 
                            ? 'text-primary' 
                            : 'text-foreground group-hover:text-primary'
                        }`}>
                          {topic.title}
                        </h3>
                      </div>
                      <ChevronRight className={`h-3 w-3 lg:h-4 lg:w-4 transition-all duration-200 flex-shrink-0 ml-2 ${
                        selectedTopic?.id === topic.id ? 'rotate-90 text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
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

        {/* Slide Area - Full remaining width */}
        <main className="flex-1 xl:flex-none xl:w-[65%] 2xl:w-[70%] bg-gradient-to-br from-background to-muted/10 relative">
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
                    {courseContent.topics.length} topics available
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