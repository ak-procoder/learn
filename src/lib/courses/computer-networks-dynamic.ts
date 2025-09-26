import { CourseContent, CourseSlide, CourseTopic } from '../../data/types/course-types';
import { loadTopicSlides } from './dynamic-markdown-loader';

// Types for course metadata from JSON
interface CourseTopicMeta {
  id: string;
  title: string;
  description: string;
  duration: string;
  slideCount: number;
}

interface CourseMetaJson {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedDuration: string;
  topics: CourseTopicMeta[];
  prerequisites: string[];
  learningOutcomes: string[];
}

// Slide patterns mapping for each topic (only thing not in course-meta.json)
const slidePatterns: Record<string, string> = {
  'introduction': 'intro-{n}.md',
  'osi-model': 'osi-{n}.md',
  'tcp-ip': 'tcp-{n}.md',
  'network-devices': 'devices-{n}.md',  
  'routing-protocols': 'routing-{n}.md',
  'network-security': 'security-{n}.md',
  'advanced-topics': 'advanced-{n}.md',
  'troubleshooting': 'troubleshooting-{n}.md'
};

// Load course metadata from JSON file
let courseMeta: CourseMetaJson | null = null;async function loadCourseMeta(): Promise<CourseMetaJson> {
  if (courseMeta) return courseMeta;
  
  try {
    const response = await fetch('/content/computer-networks/course-meta.json');
    if (!response.ok) {
      throw new Error(`Failed to load course metadata: ${response.status}`);
    }
    courseMeta = await response.json() as CourseMetaJson;
    return courseMeta;
  } catch (error) {
    console.error('Failed to load course metadata:', error);
    throw error;
  }
}

/**
 * Load slides for a specific topic using dynamic markdown loading
 * @param topicId - The topic identifier
 * @returns Promise resolving to array of course slides
 */
export async function loadTopicSlidesDynamic(topicId: string): Promise<CourseSlide[]> {
  const meta = await loadCourseMeta();
  const topicInfo = meta.topics.find((topic: CourseTopicMeta) => topic.id === topicId);
  
  if (!topicInfo) {
    console.warn(`Topic not found: ${topicId}`);
    return [];
  }

  const slidePattern = slidePatterns[topicId];
  if (!slidePattern) {
    console.warn(`Slide pattern not found for topic: ${topicId}`);
    return [];
  }

  try {
    const topicPath = `computer-networks/${topicId}`;
    const slides = await loadTopicSlides(
      topicPath,
      slidePattern,
      topicInfo.slideCount
    );
    
    // console.log(`Loaded ${slides.length} slides for topic: ${topicId}`);
    return slides;
  } catch (error) {
    console.error(`Failed to load slides for topic ${topicId}:`, error);
    return [];
  }
}

/**
 * Load complete course content with dynamic markdown loading
 * @returns Promise resolving to complete course content
 */
export async function loadCourseContentDynamic(): Promise<CourseContent> {
  const meta = await loadCourseMeta();
  const topics: CourseTopic[] = [];

  for (const topicMeta of meta.topics) {
    try {
      const slides = await loadTopicSlidesDynamic(topicMeta.id);
      
      const topic: CourseTopic = {
        id: topicMeta.id,
        title: topicMeta.title,
        description: topicMeta.description,
        duration: topicMeta.duration,
        slides: slides
      };

      topics.push(topic);
    } catch (error) {
      console.error(`Failed to load topic ${topicMeta.id}:`, error);
      // Continue loading other topics even if one fails
    }
  }

  return {
    courseId: meta.id,
    topics: topics
  };
}

/**
 * Get course metadata without loading slides (faster for navigation)
 * @returns Course metadata with topic information
 */
export async function getCourseMetadata() {
  const meta = await loadCourseMeta();
  return {
    ...meta,
    topics: meta.topics.map((topic: CourseTopicMeta) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      duration: topic.duration,
      slideCount: topic.slideCount
    }))
  };
}

/**
 * Check if a topic exists
 * @param topicId - The topic identifier
 * @returns Boolean indicating if topic exists
 */
export async function isValidTopic(topicId: string): Promise<boolean> {
  const meta = await loadCourseMeta();
  return meta.topics.some((topic: CourseTopicMeta) => topic.id === topicId);
}

/**
 * Get topic metadata
 * @param topicId - The topic identifier
 * @returns Topic metadata or null if not found
 */
export async function getTopicMetadata(topicId: string): Promise<CourseTopicMeta | null> {
  const meta = await loadCourseMeta();
  return meta.topics.find((topic: CourseTopicMeta) => topic.id === topicId) || null;
}