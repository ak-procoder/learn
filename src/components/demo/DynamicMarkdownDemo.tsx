"use client"

import React, { useState } from 'react';
import { CourseSlide } from '@/data/types/course-types';
import { loadTopicSlidesDynamic } from '@/lib/courses/computer-networks-dynamic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Demo component to showcase dynamic markdown loading
 * This demonstrates the new approach vs the old TypeScript variable approach
 */
export default function DynamicMarkdownDemo() {
  const [slides, setSlides] = useState<CourseSlide[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const loadSecuritySlides = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const loadedSlides = await loadTopicSlidesDynamic('network-security');
      setSlides(loadedSlides);
      setCurrentSlide(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load slides');
    } finally {
      setLoading(false);
    }
  };

  const isMarkdownContent = (content: unknown): content is { markdown: string } => {
    return typeof content === 'object' && content !== null && 'markdown' in content;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">🚀 Dynamic Markdown Loading Demo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2">✅ New Approach Benefits:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Individual .md files with proper syntax highlighting</li>
                <li>• Lazy loading - only load slides when needed</li>
                <li>• Better maintainability and content organization</li>
                <li>• Smaller initial bundle size</li>
                <li>• Easy to edit content without touching TypeScript</li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-2">❌ Old Approach Issues:</h3>
              <ul className="text-red-700 space-y-1">
                <li>• Large TypeScript files with embedded markdown strings</li>
                <li>• All content loaded upfront (larger bundle)</li>
                <li>• No markdown syntax highlighting in .ts files</li>
                <li>• Difficult to maintain and edit content</li>
                <li>• Mixed content and code responsibilities</li>
              </ul>
            </div>

            <Button onClick={loadSecuritySlides} disabled={loading} className="w-full">
              {loading ? 'Loading...' : 'Load Network Security Slides (Demo)'}
            </Button>

            {error && (
              <div className="bg-red-100 p-4 rounded-lg border border-red-300">
                <p className="text-red-800">Error: {error}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {slides.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Slide {currentSlide + 1} of {slides.length}: {slides[currentSlide]?.title}
              </CardTitle>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                  disabled={currentSlide === 0}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                  disabled={currentSlide === slides.length - 1}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {slides[currentSlide] && isMarkdownContent(slides[currentSlide].content) && (
              <div className="prose max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {slides[currentSlide].content.markdown}
                </ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}