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

# 🚀 Hostinger Deployment Guide

This guide explains how to automatically deploy your Next.js learning platform to Hostinger using GitHub Actions with multiple deployment options.

## 📋 Prerequisites

- **Hostinger hosting account** with SSH/FTP/SFTP access
- **GitHub repository** with your Next.js project
- **Node.js 18+** for local development

## 🔧 Deployment Options

### ⭐ **Option 1: Rsync over SSH (Recommended)**

**Advantages:**
- ✅ **Most efficient** - Only uploads changed files
- ✅ **Faster deployments** - Uses compression and delta transfers
- ✅ **More reliable** - Better error handling and resumability
- ✅ **Secure** - Uses SSH key authentication
- ✅ **Advanced features** - Can sync deletions, preserve permissions

**Requirements:**
- SSH access to your Hostinger account
- SSH key pair (more secure than passwords)

**GitHub Secrets needed:**
```
HOSTINGER_SSH_HOST=yourdomain.com
HOSTINGER_SSH_USERNAME=your_ssh_username
HOSTINGER_SSH_PRIVATE_KEY=your_private_ssh_key
HOSTINGER_SSH_PORT=22
```

### **Option 2: SFTP (Secure FTP)**

**Advantages:**
- ✅ **More secure than FTP** - Encrypted transfers
- ✅ **Widely supported** - Available on most Hostinger plans
- ✅ **Reliable** - Better than standard FTP
- ✅ **SSH-based** - Uses same credentials as SSH

**GitHub Secrets needed:**
```
HOSTINGER_SFTP_HOST=yourdomain.com
HOSTINGER_SFTP_USERNAME=your_sftp_username
HOSTINGER_SFTP_PASSWORD=your_sftp_password
HOSTINGER_SFTP_PORT=22
```

### **Option 3: FTP (Basic)**

**Advantages:**
- ✅ **Simple setup** - Easy to configure
- ✅ **Universal support** - Works on all hosting plans
- ✅ **No special requirements** - Just username/password

**Disadvantages:**
- ❌ **Less secure** - Unencrypted transfers
- ❌ **Slower** - No compression or optimization
- ❌ **Less reliable** - More prone to connection issues

**GitHub Secrets needed:**
```
HOSTINGER_FTP_SERVER=ftp.yourdomain.com
HOSTINGER_FTP_USERNAME=your_ftp_username
HOSTINGER_FTP_PASSWORD=your_ftp_password
```

### **Option 4: Hostinger-Specific Integrations**

**Hostinger Git Integration (if available):**
- Some Hostinger plans offer direct GitHub integration
- Check your hPanel for "Git Integration" or "Auto Deploy" features
- May not require GitHub Actions at all

**Hostinger API (Advanced):**
- Use Hostinger's hosting API if available
- Custom deployment scripts
- More control over the deployment process

## 🛠️ Setup Instructions

### Step 1: Choose Your Deployment Method

The workflow includes all options. **Rsync is enabled by default** as it's the most efficient.

To switch methods:
1. **Comment out** the current deployment method
2. **Uncomment** your preferred method
3. **Add the appropriate secrets** to your GitHub repository

### Step 2: Configure SSH Access (For Rsync/SFTP)

#### Generate SSH Key Pair:
```bash
# Generate a new SSH key for deployment
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/hostinger_deploy

# Copy the public key to your clipboard
cat ~/.ssh/hostinger_deploy.pub | pbcopy
```

#### Add Public Key to Hostinger:
1. **Log into Hostinger hPanel**
2. **Go to Advanced → SSH Access**
3. **Add the public key** to your authorized keys
4. **Test the connection**

#### Add Private Key to GitHub:
1. **Copy the private key content:**
   ```bash
   cat ~/.ssh/hostinger_deploy
   ```
2. **Add to GitHub Secrets** as `HOSTINGER_SSH_PRIVATE_KEY`

### Step 3: Configure GitHub Secrets

In your GitHub repository: **Settings → Secrets and variables → Actions**

#### For Rsync (Recommended):
```
HOSTINGER_SSH_HOST=yourdomain.com
HOSTINGER_SSH_USERNAME=your_cpanel_username  
HOSTINGER_SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...your private key content...
-----END OPENSSH PRIVATE KEY-----
HOSTINGER_SSH_PORT=22
```

#### For SFTP:
```
HOSTINGER_SFTP_HOST=yourdomain.com
HOSTINGER_SFTP_USERNAME=your_cpanel_username
HOSTINGER_SFTP_PASSWORD=your_password
HOSTINGER_SFTP_PORT=22
```

#### For FTP:
```
HOSTINGER_FTP_SERVER=ftp.yourdomain.com
HOSTINGER_FTP_USERNAME=your_ftp_username
HOSTINGER_FTP_PASSWORD=your_ftp_password
```

## 📊 **Performance Comparison**

| Method | Speed | Security | Reliability | Setup Complexity |
|--------|--------|----------|-------------|------------------|
| **Rsync** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **SFTP** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| **FTP** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |

## 🚀 Advanced Options

### **Hybrid Deployment Strategy**
```yaml
# Try rsync first, fallback to SFTP if it fails
- name: Deploy via Rsync
  id: rsync_deploy
  continue-on-error: true
  uses: burnett01/rsync-deployments@7.0.1
  # ... rsync config

- name: Deploy via SFTP (Fallback)
  if: steps.rsync_deploy.outcome == 'failure'
  uses: wlixcc/SFTP-Deploy-Action@v1.2.4
  # ... sftp config
```

### **Deployment with Health Checks**
```yaml
- name: Health Check After Deployment
  run: |
    sleep 30  # Wait for deployment to propagate
    curl -f https://yourdomain.com || exit 1
    echo "✅ Deployment successful and site is accessible"
```

### **Custom Deployment Script**
Create a custom script for complex deployment needs:
```bash
#!/bin/bash
# deploy.sh
rsync -avz --delete ./out/ user@host:/public_html/
# Run post-deployment tasks
curl -X POST https://api.cloudflare.com/purge-cache
```

## 🔍 **Troubleshooting**

### Common Issues:

#### ❌ SSH Connection Failed
```bash
# Test SSH connection locally
ssh -p 22 username@yourdomain.com

# Check SSH key format
ssh-keygen -l -f ~/.ssh/hostinger_deploy.pub
```

#### ❌ Permission Denied
- Verify SSH key is added to Hostinger authorized_keys
- Check username is correct (usually your cPanel username)
- Ensure private key format is correct in GitHub secrets

#### ❌ Rsync Not Available
- Some shared hosting providers disable rsync
- Fallback to SFTP or FTP deployment
- Contact Hostinger support to enable rsync

#### ❌ Path Issues
- Verify `remote_path` is correct (usually `/public_html/`)
- Check local path points to `./out/` (Next.js export directory)
- Test paths manually via SSH/FTP client

## 📈 **Best Practices**

1. **Use Rsync when possible** - Most efficient and reliable
2. **Always use SSH keys** instead of passwords for better security
3. **Set up health checks** to verify deployment success
4. **Use staging environment** for testing deployments
5. **Monitor deployment logs** in GitHub Actions
6. **Keep secrets secure** and rotate them regularly

## 🆘 **Need Help?**

- **Hostinger SSH Issues**: Contact Hostinger support for SSH access
- **GitHub Actions Problems**: Check the Actions tab for detailed logs
- **Deployment Failures**: Enable debug logging in your workflow
- **Performance Issues**: Consider using Cloudflare or CDN

---

Your learning platform will be deployed efficiently and securely! 🌟

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