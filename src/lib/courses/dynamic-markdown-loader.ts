import matter from 'gray-matter'
import { CourseSlide } from '../../data/types/course-types'

// Slide cache to prevent re-fetching
const slideCache = new Map<string, CourseSlide>()
const topicCache = new Map<string, CourseSlide[]>()

// Request deduplication - track ongoing requests to prevent duplicates
const ongoingRequests = new Map<string, Promise<CourseSlide | null>>()
const ongoingTopicRequests = new Map<string, Promise<CourseSlide[]>>()

/**
 * Clear slide cache for a specific topic or all topics
 * @param topicPath - Optional topic path to clear specific topic cache
 */
export function clearSlideCache(topicPath?: string) {
  if (topicPath) {
    // Clear specific topic cache
    topicCache.delete(topicPath)
    // Clear individual slide cache for this topic
    for (const key of slideCache.keys()) {
      if (key.startsWith(`${topicPath}/`)) {
        slideCache.delete(key)
      }
    }
    // Clear ongoing requests for this topic
    for (const key of ongoingRequests.keys()) {
      if (key.startsWith(`${topicPath}/`)) {
        ongoingRequests.delete(key)
      }
    }
    for (const key of ongoingTopicRequests.keys()) {
      if (key.includes(topicPath)) {
        ongoingTopicRequests.delete(key)
      }
    }
  } else {
    // Clear all caches
    slideCache.clear()
    topicCache.clear()
    ongoingRequests.clear()
    ongoingTopicRequests.clear()
  }
}
import { join } from 'path';

// Server-side fs import
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = typeof window === 'undefined' ? require('fs/promises') : null;

/**
 * Dynamic markdown loader utility for course slides
 * Provides a better alternative to storing markdown content in TypeScript variables
 */

export interface MarkdownFileMetadata {
  id: string;
  title: string;
  type: 'text' | 'quiz' | 'exercise';
  [key: string]: string | number | boolean | undefined;
}

/**
 * Dynamically loads and parses a markdown file with caching and request deduplication
 * @param filePath - Path to the markdown file (relative to public/content)
 * @returns Parsed course slide with metadata and content
 */
export async function loadMarkdownSlide(filePath: string): Promise<CourseSlide> {
  // Check cache first
  if (slideCache.has(filePath)) {
    return slideCache.get(filePath)!
  }

  // Check if request is already in progress
  if (ongoingRequests.has(filePath)) {
    const cachedRequest = await ongoingRequests.get(filePath)!
    if (cachedRequest) {
      return cachedRequest
    }
    throw new Error(`Failed to load slide from ongoing request: ${filePath}`)
  }

  // Start new request and track it
  const requestPromise = (async (): Promise<CourseSlide | null> => {
    try {
      // Fetch the markdown file content with optimized headers
      const response = await fetch(`/content/${filePath}`, {
        headers: {
          'Accept': 'text/markdown, text/plain, */*',
          'Cache-Control': 'max-age=300' // Cache for 5 minutes
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load markdown file: ${filePath} (${response.status})`);
      }
      
      const markdownContent = await response.text();
      
      // Parse frontmatter and content using gray-matter
      const { data: frontmatter, content } = matter(markdownContent);
      
      // Validate required frontmatter fields
      if (!frontmatter.id || !frontmatter.title) {
        throw new Error(`Missing required frontmatter in ${filePath}. Required: id, title`);
      }
      
      // Create course slide object
      const slide: CourseSlide = {
        id: frontmatter.id,
        title: frontmatter.title,
        type: frontmatter.type || 'text',
        content: {
          markdown: content.trim()
        }
      };
      
      // Cache the slide
      slideCache.set(filePath, slide)
      
      return slide;
    } finally {
      // Remove from ongoing requests when done
      ongoingRequests.delete(filePath)
    }
  })()

  // Track ongoing request
  ongoingRequests.set(filePath, requestPromise)

  const result = await requestPromise
  if (!result) {
    throw new Error(`Failed to load slide: ${filePath}`)
  }
  
  return result
}

/**
 * Load multiple slides for a topic with pattern-based naming (parallel loading + caching + deduplication)
 * @param topicPath - Base path for the topic (e.g., 'computer-networks/introduction')
 * @param slidePattern - Pattern with {n} placeholder (e.g., 'intro-{n}.md')
 * @param slideCount - Number of slides to load
 * @returns Promise resolving to array of loaded slides
 */
export async function loadTopicSlides(
  topicPath: string,
  slidePattern: string,
  slideCount: number
): Promise<CourseSlide[]> {
  const cacheKey = `${topicPath}:${slidePattern}:${slideCount}`
  
  // Check topic cache first
  if (topicCache.has(cacheKey)) {
    return topicCache.get(cacheKey)!
  }

  // Check if request is already in progress
  if (ongoingTopicRequests.has(cacheKey)) {
    return await ongoingTopicRequests.get(cacheKey)!
  }

  // Start new request and track it
  const requestPromise = (async (): Promise<CourseSlide[]> => {
    try {
      // Create array of slide loading promises for parallel execution
      const slidePromises = Array.from({ length: slideCount }, async (_, index) => {
        const slideNumber = index + 1
        try {
          const fileName = slidePattern.replace('{n}', slideNumber.toString())
          const filePath = `${topicPath}/${fileName}`
          
          const slide = await loadMarkdownSlide(filePath)
          if (slide) {
            return { slide, order: slideNumber }
          }
          return null
        } catch (error) {
          console.warn(`Failed to load slide ${slideNumber} from ${topicPath}:`, error)
          return null
        }
      })
      
      // Execute all slide loading promises concurrently
      const slideResults = await Promise.all(slidePromises)
      
      // Filter out null results, sort by order, and extract slides
      const slides = slideResults
        .filter((result): result is { slide: CourseSlide; order: number } => result !== null)
        .sort((a, b) => a.order - b.order)
        .map(result => result.slide)
      
      // Cache the topic slides
      topicCache.set(cacheKey, slides)
      
      return slides
    } finally {
      // Remove from ongoing requests when done
      ongoingTopicRequests.delete(cacheKey)
    }
  })()

  // Track ongoing request
  ongoingTopicRequests.set(cacheKey, requestPromise)
  
  return await requestPromise
}

/**
 * Load initial slides for progressive loading (first batch only)
 * @param topicPath - Base path for the topic
 * @param slidePattern - Pattern with {n} placeholder
 * @param totalSlideCount - Total number of slides available
 * @param initialBatchSize - Number of slides to load initially (default: 5)
 * @returns Promise resolving to object with initial slides and loader for remaining slides
 */
export async function loadTopicSlidesProgressively(
  topicPath: string,
  slidePattern: string,
  totalSlideCount: number,
  initialBatchSize: number = 5
): Promise<{
  initialSlides: CourseSlide[]
  loadRemainingSlides: () => Promise<CourseSlide[]>
  hasMoreSlides: boolean
}> {
  const batchSize = Math.min(initialBatchSize, totalSlideCount)
  
  // Load initial batch
  const initialSlides = await loadTopicSlidesBatch(topicPath, slidePattern, 1, batchSize)
  
  // Create loader for remaining slides
  const loadRemainingSlides = async (): Promise<CourseSlide[]> => {
    if (batchSize >= totalSlideCount) {
      return [] // No more slides to load
    }
    
    return await loadTopicSlidesBatch(
      topicPath, 
      slidePattern, 
      batchSize + 1, 
      totalSlideCount - batchSize
    )
  }
  
  return {
    initialSlides,
    loadRemainingSlides,
    hasMoreSlides: batchSize < totalSlideCount
  }
}

/**
 * Load a specific batch of slides
 * @param topicPath - Base path for the topic
 * @param slidePattern - Pattern with {n} placeholder
 * @param startIndex - Starting slide number (1-based)
 * @param count - Number of slides to load
 * @returns Promise resolving to array of loaded slides
 */
async function loadTopicSlidesBatch(
  topicPath: string,
  slidePattern: string,
  startIndex: number,
  count: number
): Promise<CourseSlide[]> {
  const slidePromises = Array.from({ length: count }, async (_, index) => {
    const slideNumber = startIndex + index
    try {
      const fileName = slidePattern.replace('{n}', slideNumber.toString())
      const filePath = `${topicPath}/${fileName}`
      
      const slide = await loadMarkdownSlide(filePath)
      if (slide) {
        return { slide, order: slideNumber }
      }
      return null
    } catch (error) {
      console.warn(`Failed to load slide ${slideNumber} from ${topicPath}:`, error)
      return null
    }
  })
  
  const slideResults = await Promise.all(slidePromises)
  
  return slideResults
    .filter((result): result is { slide: CourseSlide; order: number } => result !== null)
    .sort((a, b) => a.order - b.order)
    .map(result => result.slide)
}

/**
 * Preload slides for a topic in the background using requestIdleCallback
 * @param topicPath - Base path for the topic
 * @param slidePattern - Pattern with {n} placeholder
 * @param slideCount - Number of slides to preload
 * @param priority - Optional priority (default: 'low')
 * @returns Promise that resolves when preloading starts (non-blocking)
 */
export async function preloadTopicSlides(
  topicPath: string,
  slidePattern: string,
  slideCount: number,
  priority: 'low' | 'high' = 'low'
): Promise<void> {
  const cacheKey = `${topicPath}:${slidePattern}:${slideCount}`
  
  // Don't preload if already cached
  if (topicCache.has(cacheKey)) {
    return
  }

  const preloadFunction = async () => {
    try {
      // This will cache the slides for future use
      await loadTopicSlides(topicPath, slidePattern, slideCount)
      console.log(`Preloaded ${slideCount} slides for topic: ${topicPath}`)
    } catch (error) {
      console.warn(`Failed to preload slides for topic ${topicPath}:`, error)
    }
  }

  if (priority === 'high') {
    // High priority: preload immediately
    preloadFunction()
  } else {
    // Low priority: preload when browser is idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => preloadFunction(), { timeout: 5000 })
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => preloadFunction(), 100)
    }
  }
}

/**
 * Preload the next topic slides based on current topic
 * @param courseContent - Full course content to find next topic
 * @param currentTopicId - Current topic ID to find the next one
 * @param topicMetaMap - Map of topic metadata for loading patterns
 */
export function preloadNextTopic(
  courseContent: { topics: { id: string }[] } | null,
  currentTopicId: string,
  topicMetaMap: Map<string, { slidePattern: string; slideCount: number }>
): void {
  if (!courseContent?.topics) return

  const currentIndex = courseContent.topics.findIndex((topic) => topic.id === currentTopicId)
  const nextIndex = currentIndex + 1

  if (nextIndex < courseContent.topics.length) {
    const nextTopic = courseContent.topics[nextIndex]
    const nextTopicMeta = topicMetaMap.get(nextTopic.id)
    
    if (nextTopicMeta) {
      preloadTopicSlides(
        `computer-networks/${nextTopic.id}`,
        nextTopicMeta.slidePattern,
        nextTopicMeta.slideCount,
        'low'
      )
    }
  }
}

/**
 * Alternative approach: Load slides by scanning directory
 * This approach automatically discovers all markdown files in a directory
 * @param topicPath - Path to the topic directory
 * @returns Array of course slides sorted by filename
 */
export async function loadTopicSlidesFromDirectory(topicPath: string): Promise<CourseSlide[]> {
  try {
    // Get list of files in the directory
    const response = await fetch(`/api/content/${topicPath}`);
    if (!response.ok) {
      throw new Error(`Failed to get directory listing for ${topicPath}`);
    }
    
    const files: string[] = await response.json();
    const markdownFiles = files
      .filter(file => file.endsWith('.md'))
      .sort(); // Sort files alphabetically
    
    // Load all markdown files
    const slides = await Promise.all(
      markdownFiles.map(file => loadMarkdownSlide(`${topicPath}/${file}`))
    );
    
    return slides;
  } catch (error) {
    console.error(`Error loading slides from directory ${topicPath}:`, error);
    return [];
  }
}

/**
 * Server-side utility for Next.js (to be used in getStaticProps/getServerSideProps)
 * @param topicPath - Absolute path to topic directory on filesystem
 * @param slidePattern - Pattern for slide files
 * @param count - Number of slides to load
 * @returns Array of course slides
 */
export async function loadTopicSlidesServerSide(
  topicPath: string,
  slidePattern: string,
  count: number
): Promise<CourseSlide[]> {
  if (!fs) {
    throw new Error('File system operations not available in browser context');
  }
  
  const slides: CourseSlide[] = [];
  
  for (let i = 1; i <= count; i++) {
    try {
      const fileName = slidePattern.replace('{n}', i.toString());
      const filePath = join(topicPath, fileName);
      
      // Read file content
      const markdownContent = await fs.readFile(filePath, 'utf-8');
      
      // Parse frontmatter and content
      const { data: frontmatter, content } = matter(markdownContent);
      
      if (!frontmatter.id || !frontmatter.title) {
        console.warn(`Missing required frontmatter in ${fileName}`);
        continue;
      }
      
      const slide: CourseSlide = {
        id: frontmatter.id,
        title: frontmatter.title,
        type: frontmatter.type || 'text',
        content: {
          markdown: content.trim()
        }
      };
      
      slides.push(slide);
    } catch (error) {
      console.warn(`Could not load slide ${i} from ${topicPath}:`, error);
    }
  }
  
  return slides;
}