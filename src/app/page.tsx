import React from 'react'
import { CourseCard } from '@/components/courses/course-card'
import { courses } from '@/lib/courses/courses'

const page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-4 md:py-4">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Learn Together, Grow Together
            <span className="text-primary"> Open Learning</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Join our open-source learning community where knowledge is shared freely.
            Contribute, learn, and help others grow through collaborative education.
          </p>
          {/*<div className="flex gap-4 justify-center flex-wrap">*/}
          {/*  <Button */}
          {/*    asChild */}
          {/*    variant="outline" */}
          {/*    size="lg" */}
          {/*    className="text-lg px-8 transition-all duration-500 group border-0 relative overflow-hidden"*/}
          {/*    style={{*/}
          {/*      background: 'linear-gradient(to right, #A9FF6820, #FF898920)',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <Link href="/browse-courses" className="flex items-center gap-2 relative z-10">*/}
          {/*      <div */}
          {/*        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"*/}
          {/*        style={{*/}
          {/*          background: 'linear-gradient(to right, #0f110d40, #FF898940)',*/}
          {/*        }}*/}
          {/*      />*/}
          {/*      <BookOpen className="h-5 w-5 group-hover:text-black transition-colors duration-300" />*/}
          {/*      <span className="font-semibold bg-gradient-to-r from-[#392d69] to-[#210CAE] bg-clip-text text-transparent group-hover:text-black transition-all duration-300">*/}
          {/*        Browse Learning*/}
          {/*      </span>*/}
          {/*    </Link>*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-4 bg-muted/50">
        
        {/* Course Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default page