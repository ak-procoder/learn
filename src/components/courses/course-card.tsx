import Link from "next/link"
import { BookOpen, Clock, Users, Star } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Course } from "@/lib/courses/courses"

interface CourseCardProps {
  course: Course
}

// Helper function to get level colors
const getLevelColors = (level: string) => {
  switch (level.toLowerCase()) {
    case 'beginner':
      return {
        gradient: 'from-emerald-500/20 via-teal-500/10 to-cyan-500/20',
        badge: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white',
        border: 'border-emerald-200/50 dark:border-emerald-700/50'
      }
    case 'intermediate':
      return {
        gradient: 'from-amber-500/20 via-orange-500/10 to-yellow-500/20',
        badge: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white',
        border: 'border-amber-200/50 dark:border-amber-700/50'
      }
    case 'advanced':
      return {
        gradient: 'from-red-500/20 via-pink-500/10 to-rose-500/20',
        badge: 'bg-gradient-to-r from-red-500 to-pink-500 text-white',
        border: 'border-red-200/50 dark:border-red-700/50'
      }
    default:
      return {
        gradient: 'from-blue-500/20 via-indigo-500/10 to-purple-500/20',
        badge: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white',
        border: 'border-blue-200/50 dark:border-blue-700/50'
      }
  }
}

export function CourseCard({ course }: CourseCardProps) {
  const levelColors = getLevelColors(course.level)
  
  return (
    <Card className={`group overflow-hidden transition-all duration-500 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 bg-gradient-to-br ${levelColors.gradient} backdrop-blur-sm border-2 ${levelColors.border} relative`}>
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm" />
      
      {/* Course Header with Icon */}
      <div className="relative overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 flex items-center justify-center relative">
          <div className="p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 group-hover:scale-110 transition-transform duration-300">
            <BookOpen className="h-8 w-8 text-primary group-hover:text-secondary transition-colors duration-300" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-2 left-2 w-3 h-3 bg-gradient-to-br from-primary to-secondary rounded-full opacity-60 animate-pulse" />
          <div className="absolute bottom-3 right-4 w-2 h-2 bg-gradient-to-br from-secondary to-accent rounded-full opacity-40 animate-pulse delay-75" />
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${levelColors.badge} border-0 shadow-lg font-semibold px-3 py-1 text-xs tracking-wide`}>
            {course.level.toUpperCase()}
          </Badge>
        </div>
        
        {/* Course stats */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm rounded-full px-2 py-1">
          <Clock className="h-3 w-3" />
          <span>Self-paced</span>
        </div>
      </div>

      <div className="relative">
        <CardHeader className="pb-3 space-y-3">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-3 text-muted-foreground leading-relaxed">
            {course.shortDescription}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pb-4 relative">
          {/* Skills with enhanced styling */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skills you&apos;ll learn</p>
            <div className="flex flex-wrap gap-2">
              {course.skills.slice(0, 3).map((skill, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs bg-gradient-to-r from-secondary/20 to-accent/20 text-secondary-foreground border border-secondary/20 hover:from-secondary/30 hover:to-accent/30 transition-all duration-200"
                >
                  {skill}
                </Badge>
              ))}
              {course.skills.length > 3 && (
                <Badge 
                  variant="outline" 
                  className="text-xs border-dashed border-muted-foreground/30 text-muted-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                >
                  +{course.skills.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          
          {/* Additional course info */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/50">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Interactive</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-current text-yellow-500" />
              <span className="text-foreground font-medium">New</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 relative">
          {/* Enhanced Start Learning Button */}
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 transform transition-all duration-300 group-hover:scale-[1.02] font-semibold py-6 text-sm tracking-wide"
          >
            <Link href={`/course/${course.id}`} className="flex items-center justify-center gap-2">
              <span>Start Learning</span>
              <BookOpen className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </Button>
        </CardFooter>
      </div>
      
      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[300%] transition-all duration-1000 ease-out pointer-events-none" />
    </Card>
  )
}