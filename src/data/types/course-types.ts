export interface CourseSlide {
  id: string
  title: string
  content: string | string[] | Record<string, string | string[]>
  type: 'text' | 'image' | 'video'
  imageUrl?: string
  videoUrl?: string
}

export interface CourseTopic {
  id: string
  title: string
  description: string
  duration: string
  slides: CourseSlide[]
  isCompleted?: boolean
}

export interface CourseContent {
  courseId: string
  topics: CourseTopic[]
}