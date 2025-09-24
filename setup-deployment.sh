#!/bin/bash

# 🚀 Hostinger Deployment Setup Script
# This script helps you set up the optimal deployment method for your Hostinger hosting

echo "🚀 Hostinger Deployment Setup"
echo "==============================="
echo ""

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    echo "❌ Error: This script must be run from the root of your git repository"
    exit 1
fi

# Function to test SSH connection
test_ssh_connection() {
    local host=$1
    local user=$2
    local port=${3:-22}
    
    echo "🔍 Testing SSH connection to $user@$host:$port..."
    
    if timeout 10 ssh -o ConnectTimeout=5 -o BatchMode=yes -p $port $user@$host exit 2>/dev/null; then
        echo "✅ SSH connection successful!"
        return 0
    else
        echo "❌ SSH connection failed"
        return 1
    fi
}

# Function to generate SSH key
generate_ssh_key() {
    local key_path="$HOME/.ssh/hostinger_deploy"
    
    if [ -f "$key_path" ]; then
        echo "🔑 SSH key already exists at $key_path"
        echo "📋 Public key content:"
        cat "${key_path}.pub"
        return 0
    fi
    
    echo "🔑 Generating new SSH key for Hostinger deployment..."
    ssh-keygen -t ed25519 -C "github-actions-hostinger-deploy" -f "$key_path" -N ""
    
    echo "✅ SSH key generated!"
    echo "📋 Public key content (add this to Hostinger):"
    cat "${key_path}.pub"
    echo ""
    echo "🔐 Private key content (add this to GitHub secrets as HOSTINGER_SSH_PRIVATE_KEY):"
    cat "$key_path"
}

# Main menu
echo "Please choose your preferred deployment method:"
echo ""
echo "1) 🚀 Rsync over SSH (Recommended - Fastest & Most Secure)"
echo "2) 🔒 SFTP (Secure & Reliable)"
echo "3) 📁 FTP (Simple but Less Secure)"
echo "4) ❓ Help me choose"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Setting up Rsync deployment..."
        echo ""
        echo "Required information:"
        read -p "🌐 Hostinger domain (e.g., yourdomain.com): " ssh_host
        read -p "👤 SSH username (usually your cPanel username): " ssh_user
        read -p "🔌 SSH port (press Enter for default 22): " ssh_port
        ssh_port=${ssh_port:-22}
        
        echo ""
        if test_ssh_connection "$ssh_host" "$ssh_user" "$ssh_port"; then
            echo ""
            echo "🎉 Great! SSH access is working."
            echo ""
            echo "Next steps:"
            echo "1. Generate SSH key (if you don't have one)"
            echo "2. Add public key to Hostinger"
            echo "3. Add secrets to GitHub"
            echo ""
            read -p "Would you like to generate an SSH key now? (y/n): " gen_key
            
            if [[ $gen_key =~ ^[Yy] ]]; then
                generate_ssh_key
            fi
            
            echo ""
            echo "📝 Add these secrets to your GitHub repository:"
            echo "   Settings → Secrets and variables → Actions"
            echo ""
            echo "HOSTINGER_SSH_HOST=$ssh_host"
            echo "HOSTINGER_SSH_USERNAME=$ssh_user"
            echo "HOSTINGER_SSH_PORT=$ssh_port"
            echo "HOSTINGER_SSH_PRIVATE_KEY=<your-private-key-content>"
            
        else
            echo ""
            echo "⚠️  SSH connection failed. Possible issues:"
            echo "   - SSH is not enabled on your Hostinger plan"
            echo "   - Incorrect hostname or username"
            echo "   - Firewall blocking SSH"
            echo ""
            echo "💡 Consider using SFTP or FTP instead"
        fi
        ;;
        
    2)
        echo ""
        echo "🔒 Setting up SFTP deployment..."
        echo ""
        echo "📝 Add these secrets to your GitHub repository:"
        echo "   Settings → Secrets and variables → Actions"
        echo ""
        echo "HOSTINGER_SFTP_HOST=yourdomain.com"
        echo "HOSTINGER_SFTP_USERNAME=your_cpanel_username"
        echo "HOSTINGER_SFTP_PASSWORD=your_password"
        echo "HOSTINGER_SFTP_PORT=22"
        echo ""
        echo "🔧 Update .github/workflows/deploy-hostinger.yml:"
        echo "   - Comment out the Rsync section"
        echo "   - Uncomment the SFTP section"
        ;;
        
    3)
        echo ""
        echo "📁 Setting up FTP deployment..."
        echo ""
        echo "📝 Add these secrets to your GitHub repository:"
        echo "   Settings → Secrets and variables → Actions"
        echo ""
        echo "HOSTINGER_FTP_SERVER=ftp.yourdomain.com"
        echo "HOSTINGER_FTP_USERNAME=your_ftp_username"
        echo "HOSTINGER_FTP_PASSWORD=your_ftp_password"
        echo ""
        echo "🔧 Update .github/workflows/deploy-hostinger.yml:"
        echo "   - Comment out the Rsync section"
        echo "   - Uncomment the FTP section"
        ;;
        
    4)
        echo ""
        echo "❓ Choosing the right deployment method:"
        echo ""
        echo "🚀 Choose Rsync if:"
        echo "   ✅ You have SSH access to your Hostinger account"
        echo "   ✅ You want the fastest deployments"
        echo "   ✅ You deploy frequently"
        echo "   ✅ You have large sites with many files"
        echo ""
        echo "🔒 Choose SFTP if:"
        echo "   ✅ You want security but Rsync isn't available"
        echo "   ✅ You have SSH/SFTP access"
        echo "   ✅ You want a good balance of speed and simplicity"
        echo ""
        echo "📁 Choose FTP if:"
        echo "   ✅ You only have basic FTP access"
        echo "   ✅ You want the simplest setup"
        echo "   ✅ You have a small site and deploy infrequently"
        echo ""
        echo "💡 Most Hostinger plans support SSH/SFTP, so Rsync is usually the best choice!"
        ;;
        
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "🚀 Happy deploying!"