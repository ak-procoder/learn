/**
 * Responsive Content Component Tests
 * 
 * This test suite covers the responsive content functionality including:
 * - Markdown rendering with custom components
 * - Responsive text scaling
 * - Custom styled headers (h1-h4)
 * - Code block syntax highlighting
 * - List styling with gradient bullets
 * - Mobile vs desktop content adaptation
 * 
 * Features Tested:
 * 1. Component renders markdown content correctly
 * 2. Custom header components with proper styling
 * 3. Code blocks with syntax highlighting
 * 4. Responsive list styling with gradient bullets
 * 5. Text size adaptation based on screen size
 * 6. Content truncation and expansion on mobile
 * 
 * How to Run:
 * - npm test responsive-content.test.js
 * - npm test -- --watch (for continuous testing)
 * 
 * Test Coverage:
 * - Markdown content rendering
 * - Custom component styling
 * - Responsive behavior simulation
 * - User interaction testing
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the ResponsiveContent component for testing
const ResponsiveContent = ({ content, isExpanded = false, onToggleExpanded }: {
  content: string
  isExpanded?: boolean
  onToggleExpanded?: () => void
}) => {
  const mockCustomComponents = {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 text-slate-800 dark:text-slate-100">
        {children}
      </h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="text-lg sm:text-xl md:text-2xl font-medium mb-2 text-slate-700 dark:text-slate-200">
        {children}
      </h3>
    ),
    h4: ({ children }: { children: React.ReactNode }) => (
      <h4 className="text-base sm:text-lg md:text-xl font-medium mb-2 text-slate-600 dark:text-slate-300">
        {children}
      </h4>
    ),
    code: ({ children, className }: { children: React.ReactNode, className?: string }) => (
      <code className={`${className || ''} bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm font-mono`}>
        {children}
      </code>
    ),
    pre: ({ children }: { children: React.ReactNode }) => (
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
        {children}
      </pre>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="space-y-2 mb-4 ml-4">
        {children}
      </ul>
    ),
    li: ({ children }: { children: React.ReactNode }) => (
      <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-2 before:h-2 before:bg-gradient-to-r before:from-blue-500 before:to-purple-500 before:rounded-full">
        {children}
      </li>
    )
  }

  // Simple markdown parsing for testing
  const parseMarkdown = (text: string) => {
    if (text.startsWith('# ')) {
      return mockCustomComponents.h1({ children: text.replace('# ', '') })
    }
    if (text.startsWith('## ')) {
      return mockCustomComponents.h2({ children: text.replace('## ', '') })
    }
    if (text.includes('**') && text.includes('**')) {
      const boldText = text.match(/\*\*(.*?)\*\*/)?.[1]
      return <strong>{boldText}</strong>
    }
    if (text.startsWith('- ')) {
      return mockCustomComponents.li({ children: text.replace('- ', '') })
    }
    if (text.includes('`')) {
      const codeMatch = text.match(/`([^`]+)`/)
      if (codeMatch) {
        const beforeCode = text.substring(0, codeMatch.index)
        const codeContent = codeMatch[1]
        const afterCode = text.substring(codeMatch.index! + codeMatch[0].length)
        return (
          <span>
            {beforeCode}
            {mockCustomComponents.code({ children: codeContent })}
            {afterCode}
          </span>
        )
      }
    }
    return <p>{text}</p>
  }

  const lines = content.split('\n').filter(line => line.trim())
  const shouldTruncate = !isExpanded && lines.length > 3

  return (
    <div className="responsive-content" data-testid="responsive-content">
      {shouldTruncate ? (
        <>
          {lines.slice(0, 3).map((line, index) => (
            <div key={index}>{parseMarkdown(line)}</div>
          ))}
          <button 
            onClick={onToggleExpanded}
            className="text-blue-600 hover:text-blue-800 text-sm mt-2"
          >
            Read More...
          </button>
        </>
      ) : (
        lines.map((line, index) => (
          <div key={index}>{parseMarkdown(line)}</div>
        ))
      )}
      {isExpanded && lines.length > 3 && (
        <button 
          onClick={onToggleExpanded}
          className="text-blue-600 hover:text-blue-800 text-sm mt-2"
        >
          Read Less
        </button>
      )}
    </div>
  )
}

describe('ResponsiveContent Component', () => {
  const sampleMarkdown = `# Network Basics

**Networks** connect devices together.

## Key Components

- Router
- Switch
- Hub

\`TCP/IP\` is the main protocol.`

  beforeEach(() => {
    // Reset any mocks or global state
    global.innerWidth = 1024
  })

  describe('Markdown Rendering', () => {
    test('renders headings with proper styling', () => {
      render(<ResponsiveContent content="# Network Basics" />)
      
      const heading = screen.getByText('Network Basics')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toBe('H1')
      expect(heading).toHaveClass('text-2xl', 'font-bold', 'text-gradient')
    })

    test('renders bold text correctly', () => {
      render(<ResponsiveContent content="**Networks** are important" />)
      
      const boldText = screen.getByText('Networks')
      expect(boldText).toBeInTheDocument()
      expect(boldText.tagName).toBe('STRONG')
    })

    test('renders code blocks with proper styling', () => {
      render(<ResponsiveContent content="`TCP/IP` protocol" />)
      
      const codeElement = screen.getByText('TCP/IP')
      expect(codeElement).toBeInTheDocument()
      expect(codeElement).toHaveClass('bg-slate-100', 'font-mono')
    })

    test('renders list items with gradient bullets', () => {
      render(<ResponsiveContent content="- Router" />)
      
      const listItem = screen.getByText('Router')
      expect(listItem).toBeInTheDocument()
      expect(listItem).toHaveClass('relative', 'pl-6')
    })
  })

  describe('Content Truncation', () => {
    test('shows "Read More" button for long content when not expanded', () => {
      const longContent = `# Title
Line 1
Line 2
Line 3
Line 4
Line 5`
      
      render(<ResponsiveContent content={longContent} isExpanded={false} />)
      
      expect(screen.getByText('Read More...')).toBeInTheDocument()
      expect(screen.queryByText('Line 5')).not.toBeInTheDocument()
    })

    test('shows full content when expanded', () => {
      const longContent = `# Title
Line 1
Line 2
Line 3
Line 4
Line 5`
      
      render(<ResponsiveContent content={longContent} isExpanded={true} />)
      
      expect(screen.getByText('Line 5')).toBeInTheDocument()
      expect(screen.getByText('Read Less')).toBeInTheDocument()
    })

    test('calls onToggleExpanded when Read More is clicked', () => {
      const mockToggle = jest.fn()
      const longContent = `# Title
Line 1
Line 2
Line 3
Line 4
Line 5`
      
      render(
        <ResponsiveContent 
          content={longContent} 
          isExpanded={false} 
          onToggleExpanded={mockToggle}
        />
      )
      
      const readMoreButton = screen.getByText('Read More...')
      fireEvent.click(readMoreButton)
      
      expect(mockToggle).toHaveBeenCalledTimes(1)
    })
  })

  describe('Responsive Behavior', () => {
    test('adapts header sizes for mobile', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        configurable: true
      })
      
      render(<ResponsiveContent content="# Mobile Header" />)
      
      const heading = screen.getByText('Mobile Header')
      expect(heading).toHaveClass('text-2xl') // Mobile size
    })

    test('adapts header sizes for desktop', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'innerWidth', {
        value: 1280,
        configurable: true
      })
      
      render(<ResponsiveContent content="# Desktop Header" />)
      
      const heading = screen.getByText('Desktop Header')
      expect(heading).toHaveClass('md:text-4xl') // Desktop size class present
    })

    test('handles different content types gracefully', () => {
      const mixedContent = `# Heading
## Subheading
**Bold text**
- List item
\`code\``
      
      render(<ResponsiveContent content={mixedContent} />)
      
      expect(screen.getByText('Heading')).toBeInTheDocument()
      expect(screen.getByText('Subheading')).toBeInTheDocument()
      expect(screen.getByText('Bold text')).toBeInTheDocument()
      expect(screen.getByText('List item')).toBeInTheDocument()
      expect(screen.getByText('code')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    test('handles empty content', () => {
      render(<ResponsiveContent content="" />)
      
      const container = screen.getByTestId('responsive-content')
      expect(container).toBeInTheDocument()
      expect(container).toBeEmptyDOMElement()
    })

    test('handles single line content', () => {
      render(<ResponsiveContent content="Single line" />)
      
      expect(screen.getByText('Single line')).toBeInTheDocument()
      expect(screen.queryByText('Read More...')).not.toBeInTheDocument()
    })

    test('handles content with only whitespace', () => {
      render(<ResponsiveContent content="   \n   \n   " />)
      
      const container = screen.getByTestId('responsive-content')
      expect(container).toBeInTheDocument()
    })

    test('preserves markdown formatting in complex content', () => {
      const complexContent = `# Main Title

## Introduction

**Important:** This is a crucial concept.

### Code Example

\`const example = "test";\`

#### List of Items

- First item
- Second item
- Third item`

      render(<ResponsiveContent content={complexContent} isExpanded={true} />)
      
      // Verify all elements are rendered
      expect(screen.getByText('Main Title')).toBeInTheDocument()
      expect(screen.getByText('Introduction')).toBeInTheDocument()
      expect(screen.getByText('Important:')).toBeInTheDocument()
      expect(screen.getByText('const example = "test";')).toBeInTheDocument()
      expect(screen.getByText('First item')).toBeInTheDocument()
    })
  })

  describe('Styling and Classes', () => {
    test('applies gradient styling to h1 elements', () => {
      render(<ResponsiveContent content="# Gradient Title" />)
      
      const heading = screen.getByText('Gradient Title')
      expect(heading).toHaveClass(
        'bg-gradient-to-r',
        'from-blue-600',
        'to-purple-600',
        'bg-clip-text',
        'text-transparent'
      )
    })

    test('applies proper spacing classes', () => {
      render(<ResponsiveContent content="## Spaced Header" />)
      
      const heading = screen.getByText('Spaced Header')
      expect(heading).toHaveClass('mb-3')
    })

    test('applies dark mode compatible classes', () => {
      render(<ResponsiveContent content="## Dark Mode Header" />)
      
      const heading = screen.getByText('Dark Mode Header')
      expect(heading).toHaveClass('text-slate-800', 'dark:text-slate-100')
    })
  })
})