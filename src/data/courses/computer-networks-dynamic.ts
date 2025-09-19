import { CourseContent, CourseSlide, CourseTopic } from '../types/course-types';

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
      slideCount: 30
    },
    {
      id: 'osi-model',
      title: 'OSI Reference Model',
      description: 'Comprehensive deep dive into the 7-layer OSI model with detailed protocols, examples, and practical applications', 
      duration: '240 min',
      slideCount: 30
    },
    {
      id: 'tcp-ip',
      title: 'TCP/IP Protocol Suite',
      description: 'Comprehensive study of internet protocols and addressing',
      duration: '75 min',
      slideCount: 6
    },
    {
      id: 'network-devices',
      title: 'Network Devices and Infrastructure',
      description: 'Comprehensive study of network hardware and their functions',
      duration: '50 min',
      slideCount: 5
    },
    {
      id: 'routing-protocols', 
      title: 'Routing Protocols and Algorithms',
      description: 'Dynamic routing protocols and path selection algorithms',
      duration: '55 min',
      slideCount: 3
    },
    {
      id: 'network-security',
      title: 'Network Security and Threats',
      description: 'Comprehensive network security principles and threat mitigation',
      duration: '60 min',
      slideCount: 4
    },
    {
      id: 'troubleshooting',
      title: 'Network Troubleshooting and Performance', 
      description: 'Systematic approach to network problem resolution and optimization',
      duration: '45 min',
      slideCount: 4
    },
    {
      id: 'advanced-topics',
      title: 'Advanced Networking Concepts',
      description: 'Modern networking technologies and emerging trends',
      duration: '55 min',
      slideCount: 5
    }
  ]
};

// Function to dynamically load slides for a topic
async function loadTopicSlides(topicId: string): Promise<CourseSlide[]> {
  const slides: CourseSlide[] = [];
  
  try {
    if (topicId === 'introduction') {
      // Load all 30 introduction slides
      const slidePromises = [];
      for (let i = 1; i <= 30; i++) {
        slidePromises.push(import(`./computer-networks/introduction/intro-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'osi-model') {
      // Load all 30 OSI model slides
      const slidePromises = [];
      for (let i = 1; i <= 30; i++) {
        slidePromises.push(import(`./computer-networks/osi-model/osi-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'tcp-ip') {
      // Load TCP/IP slides
      const slidePromises = [];
      for (let i = 1; i <= 6; i++) {
        slidePromises.push(import(`./computer-networks/tcp-ip/tcp-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'network-devices') {
      // Load network devices slides
      const slidePromises = [];
      for (let i = 1; i <= 5; i++) {
        slidePromises.push(import(`./computer-networks/network-devices/devices-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'routing-protocols') {
      // Load routing protocols slides
      const slidePromises = [];
      for (let i = 1; i <= 3; i++) {
        slidePromises.push(import(`./computer-networks/routing-protocols/routing-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'network-security') {
      // Load network security slides
      const slidePromises = [];
      for (let i = 1; i <= 4; i++) {
        slidePromises.push(import(`./computer-networks/network-security/security-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'troubleshooting') {
      // Load network troubleshooting slides
      const slidePromises = [];
      for (let i = 1; i <= 4; i++) {
        slidePromises.push(import(`./computer-networks/network-troubleshooting/troubleshooting-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
    if (topicId === 'advanced-topics') {
      // Load advanced topics slides
      const slidePromises = [];
      for (let i = 1; i <= 5; i++) {
        slidePromises.push(import(`./computer-networks/advanced-topics/advanced-${i}.json`));
      }
      const slideModules = await Promise.all(slidePromises);
      slideModules.forEach(module => {
        slides.push({ ...module.default, type: 'text' as const });
      });
    }
    
  } catch (error) {
    console.warn(`Could not load some slides for topic: ${topicId}`, error);
  }
  
  return slides;
}

// Function to load complete course content
export async function loadComputerNetworksContent(): Promise<CourseContent> {
  const topics: CourseTopic[] = [];
  
  // Load slides for each topic
  for (const topicMeta of courseMeta.topicMeta) {
    const slides = await loadTopicSlides(topicMeta.id);
    
    topics.push({
      id: topicMeta.id,
      title: topicMeta.title,
      description: topicMeta.description,
      duration: topicMeta.duration,
      slides: slides
    });
  }
  
  return {
    courseId: courseMeta.courseId,
    topics: topics
  };
}

// Legacy export for backward compatibility - now uses dynamic loading
export const computerNetworksContent: CourseContent = {
  courseId: 'computer-networks',
  topics: [] // Will be populated by loadComputerNetworksContent()
};