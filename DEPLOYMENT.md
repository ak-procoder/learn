# 🚀 Hostinger Deployment Guide

This guide explains how to automatically deploy your Next.js learning platform to Hostinger using GitHub Actions.

## 📋 Prerequisites

- **Hostinger hosting account** with FTP/SFTP access
- **GitHub repository** with your Next.js project
- **Node.js 18+** for local development

## 🔧 Setup Instructions

### Step 1: Get Hostinger Credentials

1. **Log into your Hostinger hPanel**
2. **Navigate to Files → File Manager**
3. **Get your FTP credentials:**
   - **Server**: Usually `ftp.yourdomain.com` or provided by Hostinger
   - **Username**: Your hosting username
   - **Password**: Your hosting password
   - **Directory**: Usually `/public_html/`

### Step 2: Configure GitHub Secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add these secrets:

#### Required Secrets for FTP Deployment:
```
HOSTINGER_FTP_SERVER=ftp.yourdomain.com
HOSTINGER_FTP_USERNAME=your_ftp_username
HOSTINGER_FTP_PASSWORD=your_ftp_password
```

#### Alternative: SFTP Deployment (More Secure):
```
HOSTINGER_SFTP_HOST=yourdomain.com
HOSTINGER_SFTP_USERNAME=your_sftp_username
HOSTINGER_SFTP_PASSWORD=your_sftp_password
HOSTINGER_SFTP_PORT=22
```

### Step 3: Choose Deployment Method

The GitHub Actions workflow includes both FTP and SFTP options:

#### Option A: FTP Deployment (Default)
- ✅ Simpler setup
- ✅ Works with most Hostinger plans
- ⚠️ Less secure than SFTP

#### Option B: SFTP Deployment (Recommended)
- ✅ More secure
- ✅ Better for production
- ⚠️ Requires SFTP access (available on most plans)

To switch to SFTP:
1. **Comment out the FTP deployment section** in `.github/workflows/deploy-hostinger.yml`
2. **Uncomment the SFTP deployment section**
3. **Add SFTP secrets** to your repository

## 🛠️ Configuration Options

### Custom Domain Setup
If deploying to a subdirectory, update `next.config.ts`:
```typescript
const nextConfig: NextConfig = {
  basePath: '/your-subdirectory',
  // ... other config
};
```

### Environment Variables
Add any environment variables your app needs:
```
# In GitHub Secrets
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Build Optimization
The deployment is configured for optimal performance:
- ✅ Static export for faster loading
- ✅ Image optimization disabled for static hosting
- ✅ Package imports optimized
- ✅ Webpack configured for client-side only

## 🚀 Deployment Process

### Automatic Deployment
The workflow triggers automatically when you:
1. **Push to main branch** → Builds and deploys
2. **Create pull request** → Builds only (no deployment)
3. **Manual trigger** → Use "Run workflow" button in GitHub Actions

### Manual Deployment
You can also deploy manually:
```bash
# Build for production
npm run build

# Deploy the 'out' folder to your Hostinger hosting
# Upload contents of 'out/' to /public_html/
```

## 📁 File Structure After Deployment

Your Hostinger hosting structure will look like:
```
/public_html/
├── _next/           # Next.js assets
├── images/          # Static images
├── favicon.ico
├── index.html       # Homepage
├── browse-courses/
│   └── index.html
├── course/
│   └── [various course pages]
└── [other static files]
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### ❌ Build Fails
```bash
# Check Node.js version
node --version  # Should be 18+

# Install dependencies
npm ci

# Try building locally
npm run build
```

#### ❌ FTP Connection Fails
- ✅ Verify FTP credentials in Hostinger hPanel
- ✅ Check server address (might include port)
- ✅ Ensure FTP is enabled for your account
- ✅ Try SFTP instead of FTP

#### ❌ Pages Not Loading
- ✅ Check if files uploaded to correct directory (`/public_html/`)
- ✅ Verify index.html exists in root
- ✅ Check Hostinger error logs
- ✅ Ensure no .htaccess conflicts

#### ❌ Images Not Loading
- ✅ Verify `images.unoptimized: true` in next.config.ts
- ✅ Check image paths are relative
- ✅ Ensure images are in the `out/` folder after build

### Deployment Logs
Check GitHub Actions logs for detailed error information:
1. Go to **Actions** tab in your repository
2. Click on the failed workflow run
3. Expand the failed step to see error details

## 🔒 Security Best Practices

1. **Use SFTP instead of FTP** when possible
2. **Never commit secrets** to your repository
3. **Use strong passwords** for hosting accounts
4. **Enable 2FA** on your GitHub account
5. **Regularly rotate credentials**

## 📊 Performance Optimization

### Recommended Hostinger Settings:
- ✅ Enable **Gzip compression**
- ✅ Set up **Cloudflare** (if available)
- ✅ Configure **browser caching**
- ✅ Enable **HTTP/2**

### Next.js Optimizations:
- ✅ Static export reduces server requirements
- ✅ Optimized package imports reduce bundle size
- ✅ Trailing slash configuration for better caching

## 🆘 Support

### Getting Help:
1. **Check GitHub Actions logs** for build/deployment errors
2. **Review Hostinger documentation** for hosting-specific issues  
3. **Check Next.js documentation** for framework-related problems
4. **Contact Hostinger support** for hosting-related issues

### Useful Links:
- [Hostinger Help Center](https://support.hostinger.com/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 🎉 Success!

Once deployed, your learning platform will be available at your Hostinger domain. The deployment process will:

1. ✅ **Build** your Next.js application
2. ✅ **Generate** static files in the `out/` directory  
3. ✅ **Upload** files to your Hostinger hosting
4. ✅ **Test** the deployment (optional)
5. ✅ **Notify** you of the deployment status

Your students can now access the learning platform from anywhere in the world! 🌍📚