export interface Course {
  id: string
  title: string
  description: string
  shortDescription: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  category: string
  skills: string[]
  image?: string
}

export const courseCategories = [
  'All Courses',
  'Networking',
  'Operating Systems',
  'Cloud Computing',
  'Computer Science'
]

export const courses: Course[] = [
  {
    id: 'computer-networks',
    title: 'Computer Networks Fundamentals',
    description: 'Master the fundamentals of computer networking including network protocols, architectures, and technologies. Learn how data flows through networks, understand TCP/IP, OSI model, routing, switching, and network security basics. Perfect for students pursuing careers in IT, network administration, or computer science.',
    shortDescription: 'Learn the fundamentals of computer networking and protocols',
    level: 'Intermediate',
    category: 'Networking',
    skills: ['TCP/IP', 'OSI Model', 'Routing', 'Switching', 'Network Security', 'Protocols'],
    image: '/content/computer-networks/Computer-Network.jpeg'
  },
  {
    id: 'linux-fundamentals',
    title: 'Linux Fundamentals',
    description: 'Comprehensive introduction to the Linux operating system. Learn essential command-line skills, file system navigation, user management, shell scripting, and system administration. Perfect for beginners starting their Linux journey or IT professionals looking to strengthen their foundational knowledge.',
    shortDescription: 'Master Linux commands, file system, and system administration',
    level: 'Beginner',
    category: 'Operating Systems',
    skills: ['Command Line', 'File System', 'Shell Scripting', 'User Management', 'Package Management', 'System Administration'],
    image: '/content/linux-fundamentals/971.jpeg'
  },
  {
    id: 'cloud-computing',
    title: 'Cloud Computing Fundamentals',
    description: 'Master cloud computing concepts from fundamentals to advanced topics. Learn about cloud service models (IaaS, PaaS, SaaS), deployment models, virtualization, containers, Kubernetes, cloud storage, security, and major cloud providers (AWS, Azure, GCP). Includes serverless computing, DevOps, and infrastructure as code. Perfect for aspiring cloud architects, developers, and IT professionals.',
    shortDescription: 'Learn cloud computing, AWS, Azure, GCP, containers, and Kubernetes',
    level: 'Intermediate',
    category: 'Cloud Computing',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Serverless', 'Cloud Security', 'DevOps', 'IaC'],
    image: '/content/cloud computing/cloud-computing.jpeg'
  }
]

export const getCoursesbyCategory = (category: string): Course[] => {
  if (category === 'All Courses') {
    return courses
  }
  return courses.filter(course => course.category === category)
}