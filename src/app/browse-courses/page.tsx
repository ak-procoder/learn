"use client"

import { useState, useMemo } from "react"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { courses, getCoursesbyCategory } from "@/lib/courses/courses"
import { CourseCard } from "@/components/courses/course-card"

export default function BrowseCoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Courses')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = useMemo(() => {
    let filtered = courses

    // Filter by category
    if (selectedCategory !== 'All Courses') {
      filtered = getCoursesbyCategory(selectedCategory)
    }

    // Filter by level
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    return filtered
  }, [selectedCategory, selectedLevel, searchQuery])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 border-b border-border/50">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-16" />
        <div className="relative container mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Explore Courses
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive collection of hands-on courses designed to enhance your technical skills
            </p>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <div className="h-1 w-12 bg-gradient-to-r from-primary to-secondary rounded-full" />
              <p className="text-muted-foreground font-medium">
                {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedLevel !== 'all' || searchQuery) && (
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary/5 to-accent/5 rounded-xl border border-border/50 backdrop-blur-sm">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              <div className="flex items-center gap-2">
                {selectedLevel !== 'all' && (
                  <Badge className="bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20">
                    Level: {selectedLevel}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge className="bg-gradient-to-r from-secondary/10 to-accent/10 text-secondary-foreground border border-secondary/20">
                    Search: {searchQuery}
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedLevel('all')
                    setSearchQuery('')
                    setSelectedCategory('All Courses')
                  }}
                  className="h-7 px-3 text-xs bg-gradient-to-r from-muted/50 to-muted/30 hover:from-muted hover:to-muted/80 border border-border/50"
                >
                  Clear all
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-muted/50 to-muted/30 rounded-2xl flex items-center justify-center mx-auto border border-border/50 backdrop-blur-sm">
                  <Search className="h-10 w-10 text-muted-foreground" />
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-br from-primary to-secondary rounded-full animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                No courses found
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Try adjusting your search criteria or browse different categories to find the perfect course for you.
              </p>
              <Button
                onClick={() => {
                  setSelectedLevel('all')
                  setSearchQuery('')
                  setSelectedCategory('All Courses')
                }}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25 px-6 py-2"
              >
                Show All Courses
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}