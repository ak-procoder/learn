# Be a ProCoder - Open Learning Platform

A modern, open-source learning platform built with Next.js, featuring dynamic markdown-based courses, interactive slide presentations, and optimized performance. The platform focuses on computer science education with an emphasis on collaborative learning and community contribution.

## ✨ Key Features

- 🎓 **Dynamic Course System**: Markdown-based courses with frontmatter metadata
- 📊 **Interactive Slide Presentations**: Beautiful carousel-based learning experience  
- 🚀 **Optimized Performance**: Parallel loading, caching, and preloading for instant navigation
- 📱 **Responsive Design**: Mobile-first design that works seamlessly across all devices
- 🎨 **Modern UI**: Built with Tailwind CSS v4 and Radix UI components
- 🖼️ **Advanced Carousel**: Smooth slide transitions with Embla Carousel
- 📚 **Structured Learning**: 8 comprehensive topics with 150+ slides total
- ⚡ **Lightning Fast**: Powered by Next.js 15 with Turbopack experimental features
- 🌐 **Open Source**: Community-driven learning platform

## 🚀 Tech Stack

- **Framework**: [Next.js 15.5.3](https://nextjs.org/) with App Router & Turbopack
- **Language**: TypeScript for full type safety
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/) (544+ icons)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/) v8.6.0
- **Markdown Processing**: [gray-matter](https://github.com/jonschlinkert/gray-matter) + [react-markdown](https://github.com/remarkjs/react-markdown)
- **Testing**: Jest + React Testing Library
- **Build Tool**: Turbopack for 10x faster development builds

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (v8.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Git** - [Download here](https://git-scm.com/)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd learning
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application running.

## 🏗️ Available Scripts

- `npm run dev` - Start development server with Turbopack (⚡ 10x faster)
- `npm run build` - Build optimized production application with Turbopack
- `npm run build:static` - Generate static export for deployment
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run test` - Run Jest test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate test coverage reports
- `npm run deploy` - Build and export for deployment

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── page.tsx               # Homepage with hero section
│   ├── layout.tsx             # Root layout with navigation
│   ├── globals.css            # Global styles and Tailwind imports
│   ├── browse-courses/        # Course discovery and filtering
│   │   └── page.tsx          # Course browsing with categories
│   └── course/[id]/           # Dynamic course pages
│       ├── page.tsx          # Server-side course data loading
│       └── course-page-client.tsx  # Client-side slide presentation
├── components/                 # Reusable UI components
│   ├── course/                # Course-specific components
│   │   └── embla-carousel/    # Advanced slide carousel system
│   ├── courses/               # Course listing and cards
│   │   └── course-card.tsx    # Beautiful gradient course cards
│   ├── layout/                # Layout components
│   │   ├── navbar.tsx         # Responsive navigation with mobile menu
│   │   └── footer.tsx         # Site footer
│   └── ui/                    # Base UI components (Radix UI)
├── data/                      # Data types and interfaces
│   └── types/                 # TypeScript type definitions
│       └── course-types.ts    # CourseSlide, CourseTopic, CourseContent
├── lib/                       # Core utilities and business logic
│   ├── utils.ts              # Common utility functions
│   └── courses/              # Course management system
│       ├── courses.ts        # Course registry and metadata
│       ├── course-loader.ts  # Dynamic course content loading
│       ├── computer-networks-dynamic.ts  # Course-specific loader
│       └── dynamic-markdown-loader.ts    # Optimized markdown processing
└── public/content/            # Course content (Markdown files)
    └── computer-networks/     # Computer Networks course
        ├── course-meta.json   # Course metadata and structure
        ├── introduction/      # 30 intro slides
        ├── osi-model/        # 30 OSI model slides
        ├── tcp-ip/           # 30 TCP/IP protocol slides
        ├── network-devices/  # 20 network devices slides
        ├── routing-protocols/# 20 routing slides
        ├── network-security/ # 25 security slides
        ├── troubleshooting/ # 15 troubleshooting slides
        └── advanced-topics/ # 15 advanced slides
```

## 🎯 Current Course Catalog

### Computer Networks Fundamentals
**Level**: Beginner to Intermediate | **Duration**: ~20 hours | **Total Slides**: 185

A comprehensive course covering networking fundamentals with 8 structured learning modules:

| Module | Topic | Duration | Slides | Content Coverage |
|--------|-------|----------|--------|------------------|
| 1 | **Introduction to Networks** | 180 min | 30 | Network basics, types, topologies |
| 2 | **OSI Reference Model** | 240 min | 30 | 7-layer model, protocols, applications |
| 3 | **TCP/IP Protocol Suite** | 180 min | 30 | Internet protocols, addressing, routing |
| 4 | **Network Devices** | 120 min | 20 | Switches, routers, hubs, gateways |
| 5 | **Routing Protocols** | 100 min | 20 | Static/dynamic routing, algorithms |
| 6 | **Network Security** | 150 min | 25 | Firewalls, encryption, security protocols |
| 7 | **Network Troubleshooting** | 90 min | 15 | Tools, methodologies, best practices |
| 8 | **Advanced Topics** | 90 min | 15 | Modern networking, cloud, SDN |

**Skills You'll Learn**: TCP/IP, OSI Model, Routing, Switching, Network Security, Protocol Analysis, Troubleshooting

### Course Categories
- **Networking** - Network protocols, infrastructure, and security
- **Computer Science** - Algorithms, data structures, and theory
- *More categories coming soon through community contributions!*

### Advanced Features & Optimizations

- **Parallel Slide Loading**: Uses `Promise.all()` for concurrent slide fetching
- **Intelligent Caching**: Multi-level caching (slide + topic level) with smart invalidation
- **Smart Preloading**: Background loading of next topic using `requestIdleCallback`
- **Request Deduplication**: Prevents duplicate network requests for same content
- **Progressive Loading**: Load first 5 slides immediately, remaining slides on demand
- **Responsive Carousel**: Touch-friendly slide navigation with smooth transitions
- **Course Progress Tracking**: Visual indicators for completed topics and slides
- **Mobile-Optimized Navigation**: Collapsible sidebar for mobile learning
- **Gradient-Based Design**: Beautiful level-based color schemes for course cards

## 🔧 Development Guidelines

### Adding New Courses

1. **Create course content structure**:
   ```bash
   mkdir -p public/content/your-course/{topic1,topic2,topic3}
   ```

2. **Add course metadata** in `public/content/your-course/course-meta.json`:
   ```json
   {
     "id": "your-course",
     "title": "Your Course Title",
     "description": "Comprehensive course description",
     "difficulty": "beginner|intermediate|advanced",
     "estimatedDuration": "X hours",
     "topics": [
       {
         "id": "topic1",
         "title": "Topic Title",
         "description": "Topic description",
         "duration": "X min",
         "slideCount": 20
       }
     ]
   }
   ```

3. **Create slides** with frontmatter in each topic folder:
   ```markdown
   ---
   id: slide-1
   title: "Slide Title"
   type: text
   ---
   # Your slide content here
   Markdown content with full formatting support.
   ```

4. **Register course** in `src/lib/courses/courses.ts`:
   ```typescript
   export const courses: Course[] = [
     // existing courses...
     {
       id: 'your-course',
       title: 'Your Course Title',
       description: 'Detailed course description...',
       shortDescription: 'Brief overview...',
       level: 'Beginner' | 'Intermediate' | 'Advanced',
       category: 'Your Category',
       skills: ['skill1', 'skill2', 'skill3']
     }
   ]
   ```

5. **Create dynamic loader** in `src/lib/courses/your-course-dynamic.ts`:
   ```typescript
   import { loadTopicSlides } from './dynamic-markdown-loader'
   // Follow the pattern from computer-networks-dynamic.ts
   ```

### Performance Best Practices

- **Use parallel loading** for multiple slides with `Promise.all()`
- **Implement caching** to avoid re-fetching content
- **Add preloading** for smooth user navigation experience
- **Optimize images** and use appropriate formats (WebP, AVIF)
- **Follow lazy loading patterns** for large course content

### Styling Guidelines

- Use **Tailwind CSS v4** with the established design system
- Follow **gradient color schemes** for course levels:
  - Beginner: emerald-teal gradients
  - Intermediate: amber-orange gradients  
  - Advanced: red-pink gradients
- Ensure **mobile-first responsive design**
- Use **Radix UI primitives** for consistent component behavior

## 🌐 Browser Support & Compatibility

- **Chrome** 100+ (Recommended for best performance)
- **Firefox** 95+ 
- **Safari** 15.4+ (including iOS Safari)
- **Edge** 100+
- **Mobile Browsers**: Full support for touch gestures and responsive design

### Performance Optimizations
- **First Load JS**: ~140-251 kB (optimized with code splitting)
- **Static Generation**: Pre-rendered pages for lightning-fast loading
- **Turbopack**: 10x faster development builds than webpack
- **Request Caching**: 5-minute browser cache headers for content
- **Parallel Processing**: Concurrent slide loading for reduced wait times

## 🤝 Contributing

We welcome contributions from educators, developers, and learners! Here's how you can help:

### 🎓 Content Contributors
- **Add new courses** following our markdown-based structure
- **Improve existing slides** with better explanations or examples
- **Translate content** to make learning accessible globally
- **Create interactive examples** and code snippets

### 💻 Code Contributors
- **Performance optimizations** - help make loading even faster
- **UI/UX improvements** - enhance the learning experience
- **New features** - slide animations, quiz systems, progress tracking
- **Bug fixes** - help maintain code quality

### 📝 How to Contribute

1. **Fork the repository**
   ```bash
   git clone https://github.com/ak-procoder/learn.git
   cd learn
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-course
   # or
   git checkout -b fix/performance-improvement
   ```

3. **Make your changes**
   - Add courses, fix bugs, or improve features
   - Follow our coding standards and guidelines
   - Test your changes locally

4. **Commit your changes**
   ```bash
   git commit -m 'feat: add advanced algorithms course'
   # or
   git commit -m 'fix: improve slide loading performance'
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/amazing-course
   ```
   Then open a Pull Request with detailed description of your changes.

### 🏆 Recognition
All contributors are recognized in our contributors list and course credits!

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Find and kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

**Module not found or dependency errors:**
```bash
# Clear node_modules and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
# or force clean install
npm ci
```

**TypeScript compilation errors:**
```bash
# Restart TypeScript server in your editor (VSCode: Cmd+Shift+P -> "TypeScript: Restart TS Server")
# Or run manual type check
npx tsc --noEmit
```

**Build failures with Turbopack:**
```bash
# Try standard Next.js build if Turbopack has issues
npm run build -- --no-turbo
# Clear Next.js cache
rm -rf .next
npm run build
```

**Slow slide loading:**
- Check browser network tab for failed requests
- Verify markdown files exist in `public/content/` directories
- Check browser console for JavaScript errors
- Try clearing browser cache (hard refresh: Cmd+Shift+R)

**Course content not displaying:**
```bash
# Verify course metadata structure
cat public/content/your-course/course-meta.json | jq '.'
# Check slide frontmatter format
head -10 public/content/your-course/topic/slide-1.md
```

### Performance Debugging
- Use React DevTools Profiler to identify rendering bottlenecks
- Check Network tab for duplicate or slow requests
- Monitor memory usage during long learning sessions
- Verify caching is working by checking for 304 responses

## 📞 Support & Community

### Getting Help
- **GitHub Issues**: Report bugs or request features
- **Discussions**: Ask questions and share ideas in GitHub Discussions
- **Documentation**: Check our detailed guides in `/docs` folder
- **Community**: Join our learning community discussions

### Reporting Issues
When reporting bugs, please include:
- Your operating system and browser version
- Steps to reproduce the issue  
- Screenshots or error messages
- Any relevant console output

### Feature Requests
We love new ideas! Please describe:
- The problem you're trying to solve
- Your proposed solution
- Any examples or mockups
- How it would benefit other learners

## 🚀 Deployment Options

This application can be deployed on multiple platforms:

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Vercel automatically detects Next.js and configures build settings
3. Push to main branch triggers automatic deployments
4. Benefits: Zero-config, optimized for Next.js, edge functions support

### Netlify
```bash
# Build command
npm run build
# Publish directory  
out
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
npm run build:static
# Serve the 'out' directory with any static hosting service
```

---

## 📈 Project Stats & Metrics

- **Total Slides**: 185+ interactive learning slides
- **Course Topics**: 8 comprehensive modules  
- **Average Load Time**: <2 seconds with optimizations
- **Build Time**: ~1.4 seconds with Turbopack
- **Bundle Size**: Optimized for performance (140-251kB first load)
- **Mobile Optimized**: 100% responsive design
- **Accessibility**: WCAG 2.1 compliant UI components

## � Roadmap

### 🔮 Upcoming Features
- [ ] **Quiz System**: Interactive assessments for each topic
- [ ] **Progress Analytics**: Detailed learning progress tracking  
- [ ] **Multi-language Support**: Internationalization for global learners
- [ ] **Dark Mode**: Theme switching for comfortable learning
- [ ] **Offline Mode**: PWA support for learning without internet
- [ ] **Video Integration**: Embedded video lessons alongside slides
- [ ] **Community Notes**: Collaborative slide annotations
- [ ] **AI-Powered Recommendations**: Personalized learning paths

### 📚 Content Expansion
- [ ] **Data Structures & Algorithms**: Comprehensive CS fundamentals
- [ ] **Web Development**: Full-stack development track
- [ ] **Database Systems**: SQL, NoSQL, and database design
- [ ] **Machine Learning**: AI and ML fundamentals
- [ ] **Cybersecurity**: Security practices and ethical hacking
- [ ] **Cloud Computing**: AWS, Azure, and cloud architecture

### 🛠️ Technical Improvements
- [ ] **Performance**: Sub-second slide transitions
- [ ] **Search**: Global content search across all courses
- [ ] **API**: RESTful API for external integrations
- [ ] **Mobile App**: Native iOS/Android applications
- [ ] **Advanced Analytics**: Learning pattern insights

---

**Happy Learning! 🎓✨**

*Built with ❤️ by the open-source community | Powered by Next.js 15 & Turbopack*

## Quick Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
