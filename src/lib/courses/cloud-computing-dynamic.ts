import { CourseContent, CourseTopic } from '../../data/types/course-types';
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

// Slide patterns mapping for each topic
const slidePatterns: Record<string, string> = {
  'introduction': 'intro-{n}.md',
  'cloud-service-models': 'service-{n}.md',
  'cloud-deployment-models': 'deploy-{n}.md',
  'virtualization': 'virt-{n}.md',
  'cloud-storage': 'storage-{n}.md',
  'cloud-security': 'security-{n}.md',
  'cloud-providers': 'provider-{n}.md',
  'advanced-topics': 'advanced-{n}.md'
};

// Load course metadata from JSON file
let courseMeta: CourseMetaJson | null = null;

async function loadCourseMeta(): Promise<CourseMetaJson> {
  if (courseMeta) return courseMeta;
  
  try {
    const response = await fetch('/content/cloud computing/course-meta.json');
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
 * Dynamically load Cloud Computing course content
 * - Loads metadata from course-meta.json
 * - Loads slides from markdown files
 */
export async function loadCourseContentDynamic(): Promise<CourseContent> {
  console.log('[Cloud Computing] Loading course content dynamically...');
  
  const meta = await loadCourseMeta();
  
  // Load topics in parallel
  const topicPromises = meta.topics.map(async (topicMeta): Promise<CourseTopic> => {
    const pattern = slidePatterns[topicMeta.id];
    if (!pattern) {
      console.warn(`[Cloud Computing] No slide pattern found for topic: ${topicMeta.id}`);
      return {
        ...topicMeta,
        slides: []
      };
    }
    
    const slidePath = `cloud computing/${topicMeta.id}`;
    const slides = await loadTopicSlides(slidePath, pattern, topicMeta.slideCount);
    
    return {
      ...topicMeta,
      slides
    };
  });
  
  const topics = await Promise.all(topicPromises);
  
  console.log(`[Cloud Computing] Loaded ${topics.length} topics with ${topics.reduce((sum, t) => sum + t.slides.length, 0)} total slides`);
  
  return {
    courseId: meta.id,
    topics
  };
}
