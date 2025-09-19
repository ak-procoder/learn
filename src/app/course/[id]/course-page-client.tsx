"use client"

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Clock, BookOpen, ChevronRight, Settings, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { courses } from '@/data/courses'
import { getCourseContent } from '@/data/course-loader'
import { CourseTopic, CourseSlide, CourseContent } from '@/data/types/course-types'
import EmblaCarousel from '@/components/course/embla-carousel'
import '../../../components/course/embla.css'

interface CoursePageClientProps {
  courseId: string
}

export default function CoursePageClient({ courseId }: CoursePageClientProps) {
  const [selectedTopic, setSelectedTopic] = useState<CourseTopic | null>(null)
  const [currentSlides, setCurrentSlides] = useState<CourseSlide[]>([])
  const [courseContent, setCourseContent] = useState<CourseContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set())
  const router = useRouter()

  const course = courses.find(c => c.id === courseId)

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
  }

  const handleSlideChange = (index: number) => {
    // Slide change handler - can be used for tracking progress
    console.log(`Slide changed to: ${index}`)
  }

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

  // Helper function to check if there's a next topic
  const hasNextTopic = useCallback(() => {
    if (!selectedTopic || !courseContent) return false
    const currentTopicIndex = courseContent.topics.findIndex(topic => topic.id === selectedTopic.id)
    return currentTopicIndex < courseContent.topics.length - 1
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
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" asChild className="gap-2 hover:bg-secondary/10 rounded-xl transition-all duration-200">
                <Link href="/browse-courses">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Courses
                </Link>
              </Button>
              <div className="h-8 w-px bg-gradient-to-b from-primary/20 to-secondary/20" />
              <div>
                <h1 className="font-bold text-foreground text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{course.title}</h1>
                <p className="text-sm text-muted-foreground font-medium">Computer Networking Course</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Card className="px-6 py-3 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 border-primary/20 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {completedCount}/{totalTopics}
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Topics</div>
                  </div>
                  <div className="w-20 h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-primary via-secondary to-accent transition-all duration-700 ease-out rounded-full shadow-sm"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">
                      {Math.round(overallProgress)}%
                    </div>
                    <div className="text-xs text-muted-foreground font-medium">Complete</div>
                  </div>
                </div>
              </Card>
              <Badge variant="outline" className="bg-accent/10 border-accent/30 text-accent-foreground font-semibold px-3 py-1">{course.level}</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Three Column Layout */}
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Sidebar - 20% */}
        <aside className="w-[20%] border-r border-border/20 bg-gradient-to-b from-card/50 to-card/80 backdrop-blur-sm overflow-y-auto">
          <div className="p-6">
            <div className="mb-8">
              <h2 className="font-bold text-foreground mb-4 flex items-center gap-3 text-lg">
                <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg">
                  <BookOpen className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Course Topics</span>
              </h2>
              <p className="text-sm text-muted-foreground mb-4 bg-card/50 p-3 rounded-lg">
                {completedCount}/{totalTopics} topics completed • {courseContent?.topics.length} topics available
              </p>
            </div>
            <div className="space-y-4">
              {courseContent?.topics.map((topic, index) => (
                <Card 
                  key={topic.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] group ${
                    selectedTopic?.id === topic.id
                      ? 'ring-2 ring-primary bg-gradient-to-r from-primary/10 to-secondary/5 shadow-xl border-primary/30'
                      : 'hover:bg-card/80 hover:border-primary/20 bg-card/40 backdrop-blur-sm'
                  }`}
                  onClick={() => handleTopicSelect(topic)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={`text-xs px-3 py-1 font-semibold ${
                          selectedTopic?.id === topic.id
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {index + 1}
                        </Badge>
                        {completedTopics.has(topic.id) && (
                          <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-secondary to-accent rounded-full shadow-md">
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all duration-300 ${
                        selectedTopic?.id === topic.id ? 'rotate-90 text-primary' : 'text-muted-foreground group-hover:text-primary'
                      }`} />
                    </div>
                    <h3 className={`font-semibold text-sm mb-2 line-clamp-1 leading-tight transition-colors duration-200 ${
                      selectedTopic?.id === topic.id 
                        ? 'text-primary' 
                        : 'text-foreground group-hover:text-primary'
                    }`}>
                      {topic.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                      {topic.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{topic.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded-md">
                        <BookOpen className="h-3 w-3" />
                        <span className="font-medium">{topic.slides.length} slides</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </aside>

        {/* Slide Area - 50% */}
        <main className="w-[50%] bg-gradient-to-br from-background to-muted/10 relative">
          {currentSlides.length > 0 ? (
            <EmblaCarousel 
              slides={currentSlides} 
              options={{ loop: false }} 
              onSlideChange={handleSlideChange}
              onComplete={handleTopicComplete}
              onNextTopic={handleNextTopic}
              onFinishCourse={handleFinishCourse}
              isLastTopic={isLastTopic()}
              hasNextTopic={hasNextTopic()}
            />
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <Card className="text-center max-w-md bg-gradient-to-br from-background to-muted/20 shadow-lg">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    Ready to Learn?
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Select a topic from the sidebar to begin your networking journey
                  </p>
                  <Badge variant="secondary" className="text-sm">
                    {courseContent.topics.length} topics available
                  </Badge>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Placeholder Area - 30% */}
        <aside className="w-[30%] border-l bg-gradient-to-br from-muted/10 to-muted/30 p-6">
          <Card className="h-full bg-gradient-to-br from-background to-muted/20 shadow-lg">
            <CardHeader>
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Settings className="h-4 w-4 text-primary" />
                </div>
                Learning Tools
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-medium text-foreground mb-2">📝 Take Notes</h4>
                <p className="text-sm text-muted-foreground">
                  Jot down important concepts as you learn
                </p>
              </Card>
              <Card className="p-4 bg-green-500/5 border-green-500/20">
                <h4 className="font-medium text-foreground mb-2">🎯 Practice</h4>
                <p className="text-sm text-muted-foreground">
                  Test your knowledge with exercises
                </p>
              </Card>
              <Card className="p-4 bg-blue-500/5 border-blue-500/20">
                <h4 className="font-medium text-foreground mb-2">💬 Discuss</h4>
                <p className="text-sm text-muted-foreground">
                  Join the community discussions
                </p>
              </Card>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}