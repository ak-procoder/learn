import matter from 'gray-matter';
import { CourseSlide } from '@/data/types/course-types';
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
 * Dynamically loads and parses a markdown file
 * @param filePath - Path to the markdown file (relative to public/content)
 * @returns Parsed course slide with metadata and content
 */
export async function loadMarkdownSlide(filePath: string): Promise<CourseSlide> {
  try {
    // Fetch the markdown file content
    const response = await fetch(`/content/${filePath}`);
    if (!response.ok) {
      throw new Error(`Failed to load markdown file: ${filePath}`);
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
    
    return slide;
  } catch (error) {
    console.error(`Error loading markdown slide ${filePath}:`, error);
    throw error;
  }
}

/**
 * Loads multiple markdown slides for a topic
 * @param topicPath - Path to the topic directory (e.g., 'computer-networks/introduction')
 * @param slidePattern - Pattern for slide files (e.g., 'intro-{n}.md')
 * @param count - Number of slides to load
 * @returns Array of course slides
 */
export async function loadTopicSlides(
  topicPath: string,
  slidePattern: string,
  count: number
): Promise<CourseSlide[]> {
  const slides: CourseSlide[] = [];
  
  for (let i = 1; i <= count; i++) {
    try {
      const fileName = slidePattern.replace('{n}', i.toString());
      const filePath = `${topicPath}/${fileName}`;
      const slide = await loadMarkdownSlide(filePath);
      slides.push(slide);
    } catch (error) {
      console.warn(`Could not load slide ${i} for topic ${topicPath}:`, error);
      // Continue loading other slides even if one fails
    }
  }
  
  return slides;
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