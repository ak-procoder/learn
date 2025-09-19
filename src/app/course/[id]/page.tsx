import { courses } from '@/data/courses'
import CoursePageClient from './course-page-client'

// Generate static params for all course IDs - this runs at build time
export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }))
}

// Server component that wraps the client component
export default function CoursePage({ params }: { params: { id: string } }) {
  return <CoursePageClient courseId={params.id} />
}