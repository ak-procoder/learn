/**
 * Enhanced Course Card Tests
 * 
 * Tests for the beautified course cards in the browse-courses route
 */

import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CourseCard } from '@/components/courses/course-card'
import { Course } from '@/lib/courses/courses'

// Mock course data for testing
const mockCourse: Course = {
  id: 'test-course',
  title: 'Advanced React Development',
  shortDescription: 'Master advanced React concepts including hooks, context, and performance optimization.',
  description: 'Comprehensive course covering advanced React development techniques.',
  level: 'Intermediate',
  skills: ['React', 'JavaScript', 'TypeScript', 'Redux', 'Testing'],
  category: 'Web Development'
}

const mockBeginnerCourse: Course = {
  ...mockCourse,
  id: 'beginner-course',
  title: 'Web Development Basics',
  level: 'Beginner',
  skills: ['HTML', 'CSS', 'JavaScript']
}

const mockAdvancedCourse: Course = {
  ...mockCourse,
  id: 'advanced-course',
  title: 'System Architecture Design',
  level: 'Advanced',
  skills: ['Architecture', 'Microservices', 'Docker', 'Kubernetes', 'AWS']
}

describe('Enhanced Course Card Component', () => {
  afterEach(() => {
    cleanup()
  })

  describe('Visual Design and Styling', () => {
    test('renders card with beautiful gradient styling', () => {
      render(<CourseCard course={mockCourse} />)
      
      const card = screen.getByTestId('course-card')
      expect(card).toHaveClass('group')
      expect(card).toHaveClass('overflow-hidden')
      expect(card).toHaveClass('transition-all')
      expect(card).toHaveClass('duration-500')
    })

    test('displays course title with gradient text effect on hover', () => {
      render(<CourseCard course={mockCourse} />)
      
      const title = screen.getByText(mockCourse.title)
      expect(title).toBeInTheDocument()
      expect(title).toHaveClass('group-hover:bg-gradient-to-r')
      expect(title).toHaveClass('group-hover:from-primary')
      expect(title).toHaveClass('group-hover:to-secondary')
    })

    test('shows course description with proper styling', () => {
      render(<CourseCard course={mockCourse} />)
      
      const description = screen.getByText(mockCourse.shortDescription)
      expect(description).toBeInTheDocument()
      expect(description).toHaveClass('line-clamp-3')
    })

    test('renders BookOpen icon with animation effects', () => {
      render(<CourseCard course={mockCourse} />)
      
      // Look for the BookOpen icon by its SVG class
      const container = document.querySelector('.lucide-book-open')
      expect(container).toBeInTheDocument()
      expect(container).toHaveClass('h-8', 'w-8', 'text-primary')
    })
  })

  describe('Level-based Color Schemes', () => {
    test('applies beginner color scheme correctly', () => {
      render(<CourseCard course={mockBeginnerCourse} />)
      
      const levelBadge = screen.getByText('BEGINNER')
      expect(levelBadge).toBeInTheDocument()
      expect(levelBadge).toHaveClass('bg-gradient-to-r', 'from-emerald-500', 'to-teal-500')
    })

    test('applies intermediate color scheme correctly', () => {
      render(<CourseCard course={mockCourse} />)
      
      const levelBadge = screen.getByText('INTERMEDIATE')
      expect(levelBadge).toBeInTheDocument()
      expect(levelBadge).toHaveClass('bg-gradient-to-r', 'from-amber-500', 'to-orange-500')
    })

    test('applies advanced color scheme correctly', () => {
      render(<CourseCard course={mockAdvancedCourse} />)
      
      const levelBadge = screen.getByText('ADVANCED')
      expect(levelBadge).toBeInTheDocument()
      expect(levelBadge).toHaveClass('bg-gradient-to-r', 'from-red-500', 'to-pink-500')
    })
  })

  describe('Skills Display', () => {
    test('displays skills section with proper heading', () => {
      render(<CourseCard course={mockCourse} />)
      
      const skillsHeading = screen.getByText(/skills you.ll learn/i)
      expect(skillsHeading).toBeInTheDocument()
      expect(skillsHeading).toHaveClass('uppercase')
      expect(skillsHeading).toHaveClass('tracking-wide')
    })

    test('shows first 3 skills as badges', () => {
      render(<CourseCard course={mockCourse} />)
      
      // Should show first 3 skills
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    test('shows +more indicator for additional skills', () => {
      render(<CourseCard course={mockCourse} />)
      
      const moreIndicator = screen.getByText('+2 more')
      expect(moreIndicator).toBeInTheDocument()
      expect(moreIndicator).toHaveClass('border-dashed')
    })

    test('handles courses with 3 or fewer skills', () => {
      render(<CourseCard course={mockBeginnerCourse} />)
      
      // Should show all 3 skills
      expect(screen.getByText('HTML')).toBeInTheDocument()
      expect(screen.getByText('CSS')).toBeInTheDocument()
      expect(screen.getByText('JavaScript')).toBeInTheDocument()
      
      // Should not show +more indicator
      expect(screen.queryByText(/\+\d+ more/)).not.toBeInTheDocument()
    })
  })

  describe('Interactive Elements', () => {
    test('renders Start Learning button with enhanced styling', () => {
      render(<CourseCard course={mockCourse} />)
      
      const button = screen.getByRole('link', { name: /start learning/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('href', `/course/${mockCourse.id}`)
      expect(button).toHaveClass('bg-gradient-to-r')
    })

    test('button has proper hover effects', () => {
      render(<CourseCard course={mockCourse} />)
      
      const button = screen.getByRole('link', { name: /start learning/i })
      expect(button).toHaveClass('hover:shadow-xl')
      expect(button).toHaveClass('group-hover:scale-[1.02]')
    })
  })

  describe('Additional Visual Elements', () => {
    test('displays course stats with icons', () => {
      render(<CourseCard course={mockCourse} />)
      
      expect(screen.getByText('Self-paced')).toBeInTheDocument()
    })

    test('includes decorative elements', () => {
      render(<CourseCard course={mockCourse} />)
      
      const card = screen.getByTestId('course-card')
      
      // Should have decorative gradient overlays
      expect(card).toHaveClass('bg-gradient-to-br')
    })

    test('has hover effects and animations', () => {
      render(<CourseCard course={mockCourse} />)
      
      const card = screen.getByTestId('course-card')
      expect(card).toHaveClass('hover:shadow-xl')
      expect(card).toHaveClass('hover:-translate-y-2')
    })
  })

  describe('Responsive Behavior', () => {
    test('maintains proper layout structure', () => {
      render(<CourseCard course={mockCourse} />)
      
      // Should have proper card structure
      const title = screen.getByText(mockCourse.title)
      const description = screen.getByText(mockCourse.shortDescription)
      const button = screen.getByRole('link', { name: /start learning/i })
      
      expect(title).toBeInTheDocument()
      expect(description).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    test('handles long course titles gracefully', () => {
      const longTitleCourse = {
        ...mockCourse,
        title: 'This is a very long course title that should be handled gracefully with proper text truncation and responsive design'
      }
      
      render(<CourseCard course={longTitleCourse} />)
      
      const title = screen.getByText(longTitleCourse.title)
      expect(title).toHaveClass('line-clamp-2')
    })
  })

  describe('Accessibility', () => {
    test('provides proper link navigation', () => {
      render(<CourseCard course={mockCourse} />)
      
      const link = screen.getByRole('link', { name: /start learning/i })
      expect(link).toHaveAttribute('href', `/course/${mockCourse.id}`)
    })

    test('maintains semantic HTML structure', () => {
      render(<CourseCard course={mockCourse} />)
      
      // Should have proper heading structure
      const title = screen.getByText(mockCourse.title)
      expect(title.tagName).toBe('H3') // Assuming CardTitle renders as h3
    })
  })
})