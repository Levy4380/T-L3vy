#!/bin/bash
set -e

echo "🔧 Installing PHP and Composer..."

# Check if PHP is already available
if command -v php &> /dev/null; then
    echo "✅ PHP is already installed: $(php -v | head -1)"
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer && \
    rm composer-setup.php && \
    echo "✅ Composer installed"
    exit 0
fi

# Try to install PHP using available package managers
# Vercel uses Ubuntu-based images
if command -v apt-get &> /dev/null; then
    echo "📦 Installing PHP via apt-get..."
    export DEBIAN_FRONTEND=noninteractive
    apt-get update -qq
    apt-get install -y -qq php8.1-cli php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip php8.1-json 2>&1 | grep -v "^$" || {
        echo "⚠️  apt-get install failed, trying alternative method..."
    }
fi

# Alternative: Download PHP binary
if ! command -v php &> /dev/null; then
    echo "📥 Downloading PHP binary..."
    PHP_VERSION="8.1.27"
    ARCH="x86_64"
    wget -q "https://github.com/shivammathur/php-builder/releases/download/${PHP_VERSION}/php-${PHP_VERSION}-${ARCH}.tar.gz" -O php.tar.gz 2>/dev/null || {
        echo "⚠️  PHP download failed, will try to use system PHP if available"
    }
    
    if [ -f "php.tar.gz" ]; then
        tar -xzf php.tar.gz
        export PATH="$PWD/php/bin:$PATH"
    fi
fi

# Install Composer
if command -v php &> /dev/null; then
    echo "📦 Installing Composer..."
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    php composer-setup.php --install-dir=/usr/local/bin --filename=composer 2>/dev/null || \
    php composer-setup.php --install-dir=. --filename=composer.phar
    rm -f composer-setup.php
    
    # Make composer available
    if [ -f "composer.phar" ]; then
        chmod +x composer.phar
        export PATH="$PWD:$PATH"
    fi
    
    echo "✅ PHP and Composer setup complete"
    php -v | head -1
    composer --version 2>/dev/null || php composer.phar --version
else
    echo "❌ ERROR: Could not install PHP. Vercel build environment may not support PHP installation."
    echo "   Consider:"
    echo "   1. Using a different hosting service (Railway, Render, Laravel Forge)"
    echo "   2. Pre-compiling dependencies and committing vendor/ (not recommended)"
    echo "   3. Using GitHub Actions to build and deploy"
    exit 1
fi

