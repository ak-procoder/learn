import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for deployment to static hosting
  output: 'export',
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // Configure trailing slashes for better compatibility
  trailingSlash: true,
  
  // Base path configuration (uncomment and modify if deploying to subdirectory)
  // basePath: '/your-subdirectory',
  
  // Asset prefix for CDN (optional)
  // assetPrefix: 'https://your-cdn-domain.com',
  
  // Strict mode for better development experience
  reactStrictMode: true,
  
  // Enable experimental features
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-avatar',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-slot'
    ],
  },
  
  // Webpack configuration for better performance
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
