import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, GitBranch, Heart, Code, Share2 } from 'lucide-react'

const page = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Learn Together, Grow Together
            <span className="text-primary"> Open Learning</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            Join our open-source learning community where knowledge is shared freely. 
            Contribute, learn, and help others grow through collaborative education.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 transition-all duration-500 group border-0 relative overflow-hidden"
              style={{
                background: 'linear-gradient(to right, #A9FF6820, #FF898920)',
              }}
            >
              <Link href="/browse-courses" className="flex items-center gap-2 relative z-10">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                  style={{
                    background: 'linear-gradient(to right, #A9FF6840, #FF898940)',
                  }}
                />
                <BookOpen className="h-5 w-5 group-hover:text-black transition-colors duration-300" />
                <span className="font-semibold bg-gradient-to-r from-[#4dc9e6] to-[#210CAE] bg-clip-text text-transparent group-hover:text-black transition-all duration-300">
                  Browse Learning
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built by the Community, for the Community
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Our platform thrives on community contributions, collaborative learning, and shared knowledge.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Open Content</h3>
            <p className="text-muted-foreground">
              All learning materials are open-source and freely available to everyone
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Collaborative</h3>
            <p className="text-muted-foreground">
              Learn together, teach others, and build knowledge as a community
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <GitBranch className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Contribute</h3>
            <p className="text-muted-foreground">
              Fork, improve, and contribute to course content and platform development
            </p>
          </div>
          
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">Community Driven</h3>
            <p className="text-muted-foreground">
              Powered by passion and maintained by volunteers who love sharing knowledge
            </p>
          </div>
        </div>
      </section>

      {/* Community Values Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Our Community Values
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Open Knowledge</h3>
              <p className="text-muted-foreground">
                We believe knowledge should be free and accessible to everyone, everywhere.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Learn by Doing</h3>
              <p className="text-muted-foreground">
                Hands-on, practical learning with real projects and collaborative coding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Join Our Community?
          </h2>
          <p className="text-muted-foreground text-lg">
            Start learning, contributing, and growing with fellow developers and learners from around the world.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/browse-courses">Start Learning</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                Contribute on GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default page