export interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  skills: string[]
}

export const courseCategories = [
  'All Courses',
  'Networking',
  'Computer Science'
]

export const courses: Course[] = [
  {
    id: 'computer-networks',
    title: 'Computer Networks Fundamentals',
    description: 'Master the fundamentals of computer networking including network protocols, architectures, and technologies. Learn how data flows through networks, understand TCP/IP, OSI model, routing, switching, and network security basics. Perfect for students pursuing careers in IT, network administration, or computer science.',
    shortDescription: 'Learn the fundamentals of computer networking and protocols',
    level: 'Beginner',
    category: 'Networking',
    skills: ['TCP/IP', 'OSI Model', 'Routing', 'Switching', 'Network Security', 'Protocols']
  }
]

export const getCoursesbyCategory = (category: string): Course[] => {
  if (category === 'All Courses') {
    return courses
  }
  return courses.filter(course => course.category === category)
}