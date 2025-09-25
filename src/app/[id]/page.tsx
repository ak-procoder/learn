import { courses } from '@/lib/courses/courses'
import CoursePageClient from './course-page-client'

// Generate static params for all course IDs - this runs at build time
export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }))
}

// Server component that wraps the client component
export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  return <CoursePageClient courseId={resolvedParams.id} />
}