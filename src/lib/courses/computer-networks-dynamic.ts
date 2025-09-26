import { CourseContent, CourseSlide, CourseTopic } from '../../data/types/course-types';
import { loadTopicSlides } from './dynamic-markdown-loader';

// Course metadata
const courseMeta = {
  courseId: 'computer-networks',
  title: 'Computer Networks',
  description: 'Comprehensive course covering networking fundamentals, protocols, security, and modern technologies',
  difficulty: 'intermediate' as const,
  estimatedDuration: '20 hours',
  topicMeta: [
    {
      id: 'introduction',
      title: 'Introduction to Computer Networks', 
      description: 'Comprehensive foundation of computer networking fundamentals for college students',
      duration: '180 min',
      slideCount: 30,
      slidePattern: 'intro-{n}.md'
    },
    {
      id: 'osi-model',
      title: 'OSI Reference Model',
      description: 'Comprehensive deep dive into the 7-layer OSI model with detailed protocols, examples, and practical applications', 
      duration: '240 min',
      slideCount: 30,
      slidePattern: 'osi-{n}.md'
    },
    {
      id: 'tcp-ip',
      title: 'TCP/IP Protocol Suite',
      description: 'Comprehensive coverage of TCP/IP including addressing, subnetting, CIDR, and advanced topics',
      duration: '180 min',
      slideCount: 30,
      slidePattern: 'tcp-{n}.md'
    },
    {
      id: 'network-devices',
      title: 'Network Devices and Infrastructure',
      description: 'Comprehensive study of network hardware and their functions',
      duration: '120 min',
      slideCount: 20,
      slidePattern: 'devices-{n}.md'
    },
    {
      id: 'routing-protocols', 
      title: 'Routing Protocols and Algorithms',
      description: 'Dynamic routing protocols and path selection algorithms',
      duration: '100 min',
      slideCount: 20,
      slidePattern: 'routing-{n}.md'
    },
    {
      id: 'network-security',
      title: 'Network Security and Threats',
      description: 'Comprehensive network security principles and threat mitigation',
      duration: '105 min',
      slideCount: 22,
      slidePattern: 'security-{n}.md'
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Networking Topics',
      description: 'Modern networking technologies and future trends',
      duration: '75 min',
      slideCount: 15,
      slidePattern: 'advanced-{n}.md'
    },
    {
      id: 'troubleshooting',
      title: 'Network Troubleshooting',
      description: 'Network troubleshooting methodologies and tools',
      duration: '100 min',
      slideCount: 20,
      slidePattern: 'troubleshooting-{n}.md'
    }
  ]
};

/**
 * Load slides for a specific topic using dynamic markdown loading
 * @param topicId - The topic identifier
 * @returns Promise resolving to array of course slides
 */
export async function loadTopicSlidesDynamic(topicId: string): Promise<CourseSlide[]> {
  const topicInfo = courseMeta.topicMeta.find(topic => topic.id === topicId);
  
  if (!topicInfo) {
    console.warn(`Topic not found: ${topicId}`);
    return [];
  }

  try {
    const topicPath = `computer-networks/${topicId}`;
    const slides = await loadTopicSlides(
      topicPath,
      topicInfo.slidePattern,
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
  const topics: CourseTopic[] = [];

  for (const topicMeta of courseMeta.topicMeta) {
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
    courseId: courseMeta.courseId,
    topics: topics
  };
}

/**
 * Get course metadata without loading slides (faster for navigation)
 * @returns Course metadata with topic information
 */
export function getCourseMetadata() {
  return {
    ...courseMeta,
    topics: courseMeta.topicMeta.map(topic => ({
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
export function isValidTopic(topicId: string): boolean {
  return courseMeta.topicMeta.some(topic => topic.id === topicId);
}

/**
 * Get topic metadata
 * @param topicId - The topic identifier
 * @returns Topic metadata or null if not found
 */
export function getTopicMetadata(topicId: string) {
  return courseMeta.topicMeta.find(topic => topic.id === topicId) || null;
}