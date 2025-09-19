import Link from "next/link"
import { 
  BookOpen
} from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Course } from "@/data/courses"

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative overflow-hidden">
        {/* <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/60" />
        </div> */}
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge variant="outline" className="bg-background/90">
            {course.level}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-3">
        <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {course.shortDescription}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pb-3">
        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          {course.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
          {course.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{course.skills.length - 4}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        {/* Start Learning Button */}
        <Button asChild className="w-full">
          <Link href={`/course/${course.id}`}>
            Start Learning
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}