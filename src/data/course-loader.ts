import { CourseContent, CourseTopic } from './types/course-types'

// Course registry - add new courses here
const courseRegistry = {
  'computer-networks': () => import('./courses/computer-networks-dynamic').then(m => m.loadComputerNetworksContent()),
  // Future courses can be added here:
  // 'web-development': () => import('./courses/web-development').then(m => m.webDevelopmentContent),
  // 'database-fundamentals': () => import('./courses/database-fundamentals').then(m => m.databaseFundamentalsContent),
}

type CourseId = keyof typeof courseRegistry

// Cache for loaded courses to avoid repeated imports
const courseCache = new Map<string, CourseContent>()

/**
 * Get course content by course ID
 * Uses dynamic imports for better performance and code splitting
 */
export const getCourseContent = async (courseId: string): Promise<CourseContent | undefined> => {
  // Check cache first
  if (courseCache.has(courseId)) {
    return courseCache.get(courseId)
  }

  // Check if course exists in registry
  if (!(courseId in courseRegistry)) {
    console.warn(`Course '${courseId}' not found in registry`)
    return undefined
  }

  try {
    // Dynamically import the course content
    const courseLoader = courseRegistry[courseId as CourseId]
    const courseContent = await courseLoader()
    
    // Cache the result
    courseCache.set(courseId, courseContent)
    
    return courseContent
  } catch (error) {
    console.error(`Failed to load course '${courseId}':`, error)
    return undefined
  }
}

/**
 * Get a specific topic from a course
 */
export const getTopicById = async (courseId: string, topicId: string): Promise<CourseTopic | undefined> => {
  const content = await getCourseContent(courseId)
  return content?.topics.find(topic => topic.id === topicId)
}

/**
 * Get all available course IDs
 */
export const getAvailableCourseIds = (): string[] => {
  return Object.keys(courseRegistry)
}

/**
 * Preload a course (useful for better UX)
 */
export const preloadCourse = async (courseId: string): Promise<void> => {
  await getCourseContent(courseId)
}

/**
 * Clear course cache (useful for development/testing)
 */
export const clearCourseCache = (): void => {
  courseCache.clear()
}