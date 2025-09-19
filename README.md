# Be a ProCoder - Learning Platform

A modern online learning platform built with Next.js, featuring interactive courses, responsive design, and a clean user interface. The platform currently focuses on computer science and networking topics with plans for expansion.

## ✨ Features

- 🎓 **Interactive Courses**: Comprehensive course catalog with detailed lessons
- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 🎨 **Modern UI**: Built with Tailwind CSS and Radix UI components
- 🖼️ **Image Carousel**: Beautiful course previews with Embla Carousel
- 📚 **Course Categories**: Organized learning paths for different skill levels
- ⚡ **Fast Performance**: Powered by Next.js 15 with Turbopack

## 🚀 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) v4
- **UI Components**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)
- **TypeScript**: Full type safety
- **Build Tool**: Turbopack for faster development

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

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── layout.tsx         # Root layout
│   ├── browse-courses/    # Course browsing page
│   └── course/[id]/       # Dynamic course pages
├── components/            # Reusable UI components
│   ├── course/           # Course-specific components
│   ├── courses/          # Course listing components
│   ├── layout/           # Layout components (navbar, footer)
│   └── ui/               # Base UI components
├── data/                 # Static data and type definitions
│   ├── courses.ts        # Course data
│   ├── course-loader.ts  # Data loading utilities
│   └── types/            # TypeScript type definitions
└── lib/                  # Utility functions
    └── utils.ts          # Common utilities
```

## 🎯 Current Features

### Available Courses
- **Computer Networks Fundamentals** - Learn networking basics, protocols, and architecture
- **Web Development** - Modern web development with HTML, CSS, and JavaScript

### Course Categories
- Networking
- Computer Science
- More categories coming soon!

### UI Components
- Responsive navigation with mobile menu
- Course cards with hover effects
- Image carousels for course previews
- Modern button and form components
- Badge system for skill levels

## 🔧 Development Guidelines

### Adding New Courses

1. Create a new course file in `src/data/courses/`:
   ```typescript
   // src/data/courses/your-course.ts
   export const yourCourse = {
     id: 'your-course-id',
     title: 'Your Course Title',
     description: 'Detailed course description...',
     shortDescription: 'Brief overview...',
     level: 'Beginner' | 'Intermediate' | 'Advanced',
     category: 'Your Category',
     skills: ['skill1', 'skill2'],
     lessons: [
       // Add lesson objects here
     ]
   }
   ```

2. Export the course in `src/data/courses.ts`:
   ```typescript
   import { yourCourse } from './courses/your-course'
   
   export const courses: Course[] = [
     // existing courses...
     yourCourse
   ]
   ```

### Styling Guidelines

- Use Tailwind CSS classes for styling
- Follow the existing color scheme (primary, secondary, muted)
- Ensure responsive design with mobile-first approach
- Use the established component patterns from `src/components/ui/`

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Troubleshooting

### Common Issues

**Port 3000 already in use:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
# Or use a different port
npm run dev -- -p 3001
```

**Module not found errors:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**TypeScript errors:**
```bash
# Restart TypeScript server in your editor
# Or run type check manually
npx tsc --noEmit
```

## 📞 Support

If you encounter any issues or have questions:

1. Check the [troubleshooting section](#🆘-troubleshooting) above
2. Search existing issues in the repository
3. Create a new issue with detailed information about your problem

## 🚀 Deployment

This application can be deployed on various platforms:

- **Vercel** (recommended for Next.js): Connect your repository and deploy automatically
- **Netlify**: Use the build command `npm run build` and publish directory `out`
- **Docker**: Create a Dockerfile for containerized deployment

---

Happy coding! 🎉

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
