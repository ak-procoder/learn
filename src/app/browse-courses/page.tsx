"use client"

import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { courses, courseCategories, getCoursesbyCategory } from "@/data/courses"
import { CourseCard } from "@/components/courses/course-card"

const filterOptions = [
  { label: 'All Courses', value: 'all' }
]

const levelOptions = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'Beginner' },
  { label: 'Intermediate', value: 'Intermediate' },
  { label: 'Advanced', value: 'Advanced' },
]

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
    <div className="min-h-screen bg-background">

      {/* Results Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory}
            </h2>
            <p className="text-muted-foreground">
              {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          {/* Active Filters */}
          {(selectedLevel !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedLevel !== 'all' && (
                <Badge variant="secondary">
                  {selectedLevel}
                </Badge>
              )}
              {searchQuery && (
                <Badge variant="secondary">
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
                className="h-6 px-2 text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No courses found
              </h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse different categories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedLevel('all')
                  setSearchQuery('')
                  setSelectedCategory('All Courses')
                }}
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