# Course Content Management

This directory contains the course content management system for the learning platform.

## Directory Structure

```
src/data/
├── types/
│   └── course-types.ts          # TypeScript interfaces for courses
├── courses/                     # Individual course content files
│   ├── computer-networks.ts     # Computer Networks course content
│   ├── web-development.ts       # Web Development course (example)
│   └── [future-courses].ts     # Add new courses here
├── course-loader.ts             # Dynamic course loading system
└── courses.ts                   # Course catalog metadata
```

## Adding a New Course

To add a new course to the platform:

### 1. Create Course Content File

Create a new file in `src/data/courses/[course-name].ts`:

```typescript
import { CourseContent } from '../types/course-types'

export const yourCourseContent: CourseContent = {
  courseId: 'your-course-id',
  topics: [
    {
      id: 'topic-1',
      title: 'Topic Title',
      description: 'Topic description',
      duration: '20 min',
      slides: [
        {
          id: 'slide-1',
          title: 'Slide Title',
          content: 'Slide content...',
          type: 'text'
        }
        // Add more slides...
      ]
    }
    // Add more topics...
  ]
}
```

### 2. Register Course in Loader

Add your course to the `courseRegistry` in `src/data/course-loader.ts`:

```typescript
const courseRegistry = {
  'computer-networks': () => import('./courses/computer-networks').then(m => m.computerNetworksContent),
  'your-course-id': () => import('./courses/your-course-name').then(m => m.yourCourseContent),
  // Add more courses here...
}
```

### 3. Add Course Metadata

Add course metadata to `src/data/courses.ts` for the course catalog:

```typescript
export const courses: Course[] = [
  // existing courses...
  {
    id: 'your-course-id',
    title: 'Your Course Title',
    description: 'Course description...',
    // ... other metadata
  }
]
```

## Benefits of This Structure

### 🚀 **Performance**
- **Code Splitting**: Each course is loaded only when needed
- **Lazy Loading**: Courses load on-demand, reducing initial bundle size
- **Caching**: Loaded courses are cached to avoid repeated imports

### 📁 **Organization**
- **Separate Files**: Each course has its own dedicated file
- **Easy Management**: Add/edit courses without affecting others
- **Clear Structure**: Intuitive directory organization

### 🔧 **Maintainability**
- **Type Safety**: Full TypeScript support with interfaces
- **Scalable**: Easy to add unlimited courses
- **Modular**: Independent course modules

### 🎯 **Developer Experience**
- **Hot Reload**: Changes to individual courses reload instantly
- **Error Isolation**: Issues in one course don't affect others
- **Team Collaboration**: Multiple developers can work on different courses

## Course Content Types

### Slide Types
- **text**: Text-based content with markdown support
- **image**: Image slides with optional descriptions
- **video**: Video content with embedded players

### Topic Structure
Each topic contains:
- Unique ID and title
- Description and estimated duration
- Array of slides
- Completion tracking

## API Usage

### Loading Course Content
```typescript
import { getCourseContent } from '@/data/course-loader'

// Async loading
const courseContent = await getCourseContent('course-id')

// Get specific topic
const topic = await getTopicById('course-id', 'topic-id')
```

### Available Functions
- `getCourseContent(courseId)`: Load complete course content
- `getTopicById(courseId, topicId)`: Get specific topic
- `getAvailableCourseIds()`: List all available courses
- `preloadCourse(courseId)`: Preload course for better UX
- `clearCourseCache()`: Clear cache (development/testing)

## File Naming Conventions

- Course files: `kebab-case.ts` (e.g., `computer-networks.ts`)
- Export names: `camelCase + Content` (e.g., `computerNetworksContent`)
- Course IDs: `kebab-case` (e.g., `computer-networks`)
- Topic/Slide IDs: `kebab-case` (e.g., `introduction`, `slide-1`)

## Best Practices

1. **Keep courses focused**: Each course should cover a specific subject area
2. **Consistent naming**: Follow established naming conventions
3. **Meaningful IDs**: Use descriptive IDs for easy reference
4. **Proper duration estimates**: Help users plan their learning time
5. **Progressive difficulty**: Order topics from basic to advanced
6. **Rich content**: Use varied slide types for engaging learning

## Example Course Structure

See `src/data/courses/computer-networks.ts` for a complete example of a well-structured course with multiple topics, slides, and content types.