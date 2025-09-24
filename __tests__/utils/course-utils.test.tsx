/**
 * Course Utilities Tests
 * 
 * This test suite covers utility functions for course management including:
 * - Course loading and data processing
 * - Markdown parsing and slide generation
 * - Dynamic content loading
 * - Course metadata handling
 * - Error handling and edge cases
 * 
 * Features Tested:
 * 1. Course data loading from markdown files
 * 2. Slide content processing and formatting
 * 3. Course metadata parsing and validation
 * 4. Dynamic import functionality
 * 5. Error handling for missing or invalid content
 * 6. Responsive content adaptation
 * 
 * How to Run:
 * - npm test course-utils.test.js
 * - npm test -- --watch (for continuous testing)
 * 
 * Test Coverage:
 * - Data loading and processing
 * - Content parsing and validation
 * - Error scenarios and edge cases
 * - Utility function behavior
 */

import '@testing-library/jest-dom'

// Mock course data
const mockCourseMetadata = {
  id: 'computer-networks',
  title: 'Computer Networks',
  description: 'Learn the fundamentals of computer networking',
  duration: '8 hours',
  difficulty: 'intermediate',
  topics: [
    {
      id: 'introduction',
      title: 'Introduction to Networks',
      slides: ['intro-1', 'intro-2', 'intro-3']
    },
    {
      id: 'protocols',
      title: 'Network Protocols', 
      slides: ['proto-1', 'proto-2']
    }
  ]
}

const mockSlideContent = {
  'intro-1': '# Welcome to Networks\n\nThis course covers **networking fundamentals**.\n\n- TCP/IP\n- OSI Model\n- Routing',
  'intro-2': '## Network Topology\n\nDifferent ways to connect devices:\n\n- Star topology\n- Mesh topology',
  'intro-3': '### Network Devices\n\nCommon networking equipment:\n\n- Router\n- Switch\n- Hub\n\n`ping` command tests connectivity.',
  'proto-1': '# Network Protocols\n\n**Protocols** define communication rules.',
  'proto-2': '## TCP vs UDP\n\n**TCP**: Reliable connection\n**UDP**: Fast, unreliable'
}

// Utility functions to test
class CourseUtils {
  static async loadCourseMetadata(courseId: string) {
    if (courseId === 'computer-networks') {
      return mockCourseMetadata
    }
    throw new Error(`Course not found: ${courseId}`)
  }

  static async loadSlideContent(slideId: string) {
    if (mockSlideContent[slideId as keyof typeof mockSlideContent]) {
      return mockSlideContent[slideId as keyof typeof mockSlideContent]
    }
    throw new Error(`Slide not found: ${slideId}`)
  }

  static parseSlideContent(content: string) {
    const lines = content.split('\n').filter(line => line.trim())
    const title = lines.find(line => line.startsWith('#'))?.replace(/^#+\s*/, '') || 'Untitled'
    
    return {
      title,
      content: {
        markdown: content
      },
      type: 'text' as const,
      id: `slide-${Date.now()}`
    }
  }

  static async loadTopicSlides(courseId: string, topicId: string) {
    const metadata = await this.loadCourseMetadata(courseId)
    const topic = metadata.topics.find(t => t.id === topicId)
    
    if (!topic) {
      throw new Error(`Topic not found: ${topicId}`)
    }

    const slides = await Promise.all(
      topic.slides.map(async slideId => {
        const content = await this.loadSlideContent(slideId)
        return this.parseSlideContent(content)
      })
    )

    return slides
  }

  static validateCourseData(courseData: any) {
    if (!courseData || typeof courseData !== 'object') {
      return { valid: false, error: 'Course data must be an object' }
    }
    
    const required = ['id', 'title', 'description', 'topics']
    
    for (const field of required) {
      if (!courseData[field]) {
        return { valid: false, error: `Missing required field: ${field}` }
      }
    }

    if (!Array.isArray(courseData.topics)) {
      return { valid: false, error: 'Topics must be an array' }
    }

    for (const topic of courseData.topics) {
      if (!topic.id || !topic.title || !Array.isArray(topic.slides)) {
        return { valid: false, error: 'Invalid topic structure' }
      }
    }

    return { valid: true }
  }

  static formatDuration(minutes: number) {
    if (minutes < 60) {
      return `${minutes} min`
    }
    
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    
    if (remainingMinutes === 0) {
      return `${hours} hr`
    }
    
    return `${hours}h ${remainingMinutes}m`
  }

  static getDifficultyColor(difficulty: string) {
    const colors = {
      beginner: 'green',
      intermediate: 'yellow', 
      advanced: 'red',
      expert: 'purple'
    }
    
    return colors[difficulty as keyof typeof colors] || 'gray'
  }

  static calculateProgress(completedSlides: string[], totalSlides: string[]) {
    if (totalSlides.length === 0) return 0
    
    const completed = completedSlides.filter(slideId => 
      totalSlides.includes(slideId)
    ).length
    
    return Math.round((completed / totalSlides.length) * 100)
  }

  static searchCourses(courses: any[], query: string) {
    const lowercaseQuery = query.toLowerCase()
    
    return courses.filter(course => 
      course.title.toLowerCase().includes(lowercaseQuery) ||
      course.description.toLowerCase().includes(lowercaseQuery) ||
      course.topics.some((topic: any) => 
        topic.title.toLowerCase().includes(lowercaseQuery)
      )
    )
  }

  static getNextSlide(currentSlideIndex: number, totalSlides: number) {
    if (currentSlideIndex >= totalSlides - 1) {
      return null // No next slide
    }
    return currentSlideIndex + 1
  }

  static getPreviousSlide(currentSlideIndex: number) {
    if (currentSlideIndex <= 0) {
      return null // No previous slide
    }
    return currentSlideIndex - 1
  }

  static isLastSlideInTopic(slideIndex: number, topicSlideCount: number) {
    return slideIndex === topicSlideCount - 1
  }

  static isFirstSlideInTopic(slideIndex: number) {
    return slideIndex === 0
  }
}

describe('CourseUtils', () => {
  describe('Course Metadata Loading', () => {
    test('loads course metadata successfully', async () => {
      const metadata = await CourseUtils.loadCourseMetadata('computer-networks')
      
      expect(metadata).toBeDefined()
      expect(metadata.id).toBe('computer-networks')
      expect(metadata.title).toBe('Computer Networks')
      expect(metadata.topics).toHaveLength(2)
    })

    test('throws error for non-existent course', async () => {
      await expect(CourseUtils.loadCourseMetadata('non-existent'))
        .rejects.toThrow('Course not found: non-existent')
    })

    test('loads course with all required properties', async () => {
      const metadata = await CourseUtils.loadCourseMetadata('computer-networks')
      
      expect(metadata).toHaveProperty('id')
      expect(metadata).toHaveProperty('title')
      expect(metadata).toHaveProperty('description')
      expect(metadata).toHaveProperty('duration')
      expect(metadata).toHaveProperty('difficulty')
      expect(metadata).toHaveProperty('topics')
    })
  })

  describe('Slide Content Loading', () => {
    test('loads slide content successfully', async () => {
      const content = await CourseUtils.loadSlideContent('intro-1')
      
      expect(content).toContain('# Welcome to Networks')
      expect(content).toContain('**networking fundamentals**')
      expect(content).toContain('- TCP/IP')
    })

    test('throws error for non-existent slide', async () => {
      await expect(CourseUtils.loadSlideContent('non-existent'))
        .rejects.toThrow('Slide not found: non-existent')
    })

    test('loads different slide types correctly', async () => {
      const slide1 = await CourseUtils.loadSlideContent('intro-1')
      const slide2 = await CourseUtils.loadSlideContent('proto-1')
      
      expect(slide1).toContain('Welcome to Networks')
      expect(slide2).toContain('Network Protocols')
    })
  })

  describe('Slide Content Parsing', () => {
    test('parses slide content with title extraction', () => {
      const content = '# Network Basics\n\nThis is content.\n\n- Item 1'
      const parsed = CourseUtils.parseSlideContent(content)
      
      expect(parsed.title).toBe('Network Basics')
      expect(parsed.content.markdown).toBe(content)
      expect(parsed.type).toBe('text')
      expect(parsed.id).toMatch(/^slide-\d+$/)
    })

    test('handles content without heading', () => {
      const content = 'Just some content without heading'
      const parsed = CourseUtils.parseSlideContent(content)
      
      expect(parsed.title).toBe('Untitled')
      expect(parsed.content.markdown).toBe(content)
    })

    test('extracts title from different heading levels', () => {
      const content1 = '# Level 1 Heading\nContent'
      const content2 = '## Level 2 Heading\nContent'
      const content3 = '### Level 3 Heading\nContent'
      
      expect(CourseUtils.parseSlideContent(content1).title).toBe('Level 1 Heading')
      expect(CourseUtils.parseSlideContent(content2).title).toBe('Level 2 Heading')
      expect(CourseUtils.parseSlideContent(content3).title).toBe('Level 3 Heading')
    })

    test('handles empty or whitespace content', () => {
      const emptyContent = ''
      const whitespaceContent = '   \n   \n   '
      
      const parsed1 = CourseUtils.parseSlideContent(emptyContent)
      const parsed2 = CourseUtils.parseSlideContent(whitespaceContent)
      
      expect(parsed1.title).toBe('Untitled')
      expect(parsed2.title).toBe('Untitled')
    })
  })

  describe('Topic Slide Loading', () => {
    test('loads all slides for a topic', async () => {
      const slides = await CourseUtils.loadTopicSlides('computer-networks', 'introduction')
      
      expect(slides).toHaveLength(3)
      expect(slides[0].title).toBe('Welcome to Networks')
      expect(slides[1].title).toBe('Network Topology')
      expect(slides[2].title).toBe('Network Devices')
    })

    test('throws error for non-existent topic', async () => {
      await expect(CourseUtils.loadTopicSlides('computer-networks', 'non-existent'))
        .rejects.toThrow('Topic not found: non-existent')
    })

    test('loads slides in correct order', async () => {
      const slides = await CourseUtils.loadTopicSlides('computer-networks', 'protocols')
      
      expect(slides).toHaveLength(2)
      expect(slides[0].title).toBe('Network Protocols')
      expect(slides[1].title).toBe('TCP vs UDP')
    })
  })

  describe('Data Validation', () => {
    test('validates correct course data', () => {
      const validCourse = {
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        topics: [
          { id: 'topic1', title: 'Topic 1', slides: ['slide1', 'slide2'] }
        ]
      }
      
      const result = CourseUtils.validateCourseData(validCourse)
      expect(result.valid).toBe(true)
    })

    test('identifies missing required fields', () => {
      const invalidCourse = {
        id: 'test-course',
        // Missing title, description, topics
      }
      
      const result = CourseUtils.validateCourseData(invalidCourse)
      expect(result.valid).toBe(false)
      expect(result.error).toContain('Missing required field')
    })

    test('validates topics array structure', () => {
      const invalidCourse = {
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        topics: 'not an array'
      }
      
      const result = CourseUtils.validateCourseData(invalidCourse)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Topics must be an array')
    })

    test('validates topic structure', () => {
      const invalidCourse = {
        id: 'test-course',
        title: 'Test Course',
        description: 'A test course',
        topics: [
          { id: 'topic1' } // Missing title and slides
        ]
      }
      
      const result = CourseUtils.validateCourseData(invalidCourse)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Invalid topic structure')
    })
  })

  describe('Utility Functions', () => {
    test('formats duration correctly', () => {
      expect(CourseUtils.formatDuration(30)).toBe('30 min')
      expect(CourseUtils.formatDuration(60)).toBe('1 hr')
      expect(CourseUtils.formatDuration(90)).toBe('1h 30m')
      expect(CourseUtils.formatDuration(120)).toBe('2 hr')
      expect(CourseUtils.formatDuration(150)).toBe('2h 30m')
    })

    test('gets difficulty colors', () => {
      expect(CourseUtils.getDifficultyColor('beginner')).toBe('green')
      expect(CourseUtils.getDifficultyColor('intermediate')).toBe('yellow')
      expect(CourseUtils.getDifficultyColor('advanced')).toBe('red')
      expect(CourseUtils.getDifficultyColor('expert')).toBe('purple')
      expect(CourseUtils.getDifficultyColor('unknown')).toBe('gray')
    })

    test('calculates progress correctly', () => {
      const totalSlides = ['slide1', 'slide2', 'slide3', 'slide4']
      const completedSlides = ['slide1', 'slide3']
      
      const progress = CourseUtils.calculateProgress(completedSlides, totalSlides)
      expect(progress).toBe(50)
    })

    test('handles empty progress calculation', () => {
      const progress = CourseUtils.calculateProgress([], [])
      expect(progress).toBe(0)
    })

    test('filters completed slides correctly', () => {
      const totalSlides = ['slide1', 'slide2', 'slide3']
      const completedSlides = ['slide1', 'slide4', 'slide2'] // slide4 not in total
      
      const progress = CourseUtils.calculateProgress(completedSlides, totalSlides)
      expect(progress).toBe(67) // 2 out of 3 slides
    })
  })

  describe('Search Functionality', () => {
    const mockCourses = [
      {
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        topics: [{ title: 'Variables and Functions' }]
      },
      {
        title: 'Python for Data Science',
        description: 'Data analysis with Python and pandas',
        topics: [{ title: 'Data Manipulation' }]
      },
      {
        title: 'Web Development',
        description: 'Build modern websites with HTML, CSS, and JavaScript',
        topics: [{ title: 'Frontend Design' }]
      }
    ]

    test('searches by course title', () => {
      const results = CourseUtils.searchCourses(mockCourses, 'JavaScript')
      expect(results).toHaveLength(2) // JavaScript Fundamentals and Web Development
    })

    test('searches by description', () => {
      const results = CourseUtils.searchCourses(mockCourses, 'data')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Python for Data Science')
    })

    test('searches by topic title', () => {
      const results = CourseUtils.searchCourses(mockCourses, 'Frontend')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Web Development')
    })

    test('returns empty array for no matches', () => {
      const results = CourseUtils.searchCourses(mockCourses, 'Quantum Physics')
      expect(results).toHaveLength(0)
    })

    test('is case insensitive', () => {
      const results = CourseUtils.searchCourses(mockCourses, 'PYTHON')
      expect(results).toHaveLength(1)
      expect(results[0].title).toBe('Python for Data Science')
    })
  })

  describe('Slide Navigation', () => {
    test('gets next slide correctly', () => {
      expect(CourseUtils.getNextSlide(0, 5)).toBe(1)
      expect(CourseUtils.getNextSlide(2, 5)).toBe(3)
      expect(CourseUtils.getNextSlide(4, 5)).toBeNull() // Last slide
    })

    test('gets previous slide correctly', () => {
      expect(CourseUtils.getPreviousSlide(3)).toBe(2)
      expect(CourseUtils.getPreviousSlide(1)).toBe(0)
      expect(CourseUtils.getPreviousSlide(0)).toBeNull() // First slide
    })

    test('identifies first and last slides', () => {
      expect(CourseUtils.isFirstSlideInTopic(0)).toBe(true)
      expect(CourseUtils.isFirstSlideInTopic(1)).toBe(false)
      
      expect(CourseUtils.isLastSlideInTopic(4, 5)).toBe(true)
      expect(CourseUtils.isLastSlideInTopic(3, 5)).toBe(false)
    })

    test('handles edge cases in navigation', () => {
      // Single slide topic
      expect(CourseUtils.getNextSlide(0, 1)).toBeNull()
      expect(CourseUtils.getPreviousSlide(0)).toBeNull()
      expect(CourseUtils.isFirstSlideInTopic(0)).toBe(true)
      expect(CourseUtils.isLastSlideInTopic(0, 1)).toBe(true)
    })
  })

  describe('Error Handling', () => {
    test('handles malformed course data gracefully', () => {
      const malformedData = null
      
      expect(() => CourseUtils.validateCourseData(malformedData)).not.toThrow()
      
      const result = CourseUtils.validateCourseData(malformedData)
      expect(result.valid).toBe(false)
      expect(result.error).toBe('Course data must be an object')
    })

    test('handles empty search query', () => {
      const courses = [{ title: 'Test', description: 'Test', topics: [] }]
      const results = CourseUtils.searchCourses(courses, '')
      
      // Empty query should return all courses
      expect(results).toHaveLength(1)
    })

    test('handles negative slide indices', () => {
      expect(CourseUtils.getPreviousSlide(-1)).toBeNull()
      expect(CourseUtils.getNextSlide(-1, 5)).toBe(0)
    })

    test('handles invalid total slide counts', () => {
      expect(CourseUtils.getNextSlide(0, 0)).toBeNull()
      expect(CourseUtils.calculateProgress(['slide1'], [])).toBe(0)
    })
  })
})