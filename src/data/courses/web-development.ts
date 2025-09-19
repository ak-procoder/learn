import { CourseContent } from '../types/course-types'

export const webDevelopmentContent: CourseContent = {
  courseId: 'web-development',
  topics: [
    {
      id: 'html-basics',
      title: 'HTML Fundamentals',
      description: 'Learn the building blocks of web pages',
      duration: '20 min',
      slides: [
        {
          id: 'html-1',
          title: 'What is HTML?',
          content: 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and content of a webpage using elements and tags.',
          type: 'text'
        },
        {
          id: 'html-2',
          title: 'Basic HTML Structure',
          content: 'Every HTML document has a basic structure:\n\n• <!DOCTYPE html> - Document type declaration\n• <html> - Root element\n• <head> - Document metadata\n• <body> - Visible content\n• Elements are enclosed in tags like <tag>content</tag>',
          type: 'text'
        }
      ]
    },
    {
      id: 'css-basics',
      title: 'CSS Styling',
      description: 'Style your web pages with CSS',
      duration: '25 min',
      slides: [
        {
          id: 'css-1',
          title: 'Introduction to CSS',
          content: 'CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, positioning, and responsive design.',
          type: 'text'
        },
        {
          id: 'css-2',
          title: 'CSS Selectors',
          content: 'CSS selectors target HTML elements for styling:\n\n• Element selector: p { }\n• Class selector: .class-name { }\n• ID selector: #id-name { }\n• Attribute selector: [attribute] { }\n• Pseudo-classes: :hover, :focus, etc.',
          type: 'text'
        }
      ]
    }
  ]
}

// Note: To activate this course, uncomment the line in course-loader.ts:
// 'web-development': () => import('./courses/web-development').then(m => m.webDevelopmentContent),