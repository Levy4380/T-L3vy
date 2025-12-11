#!/bin/bash
set -e

echo "🔨 Building Vite assets..."
npm run build

# Install Composer dependencies if PHP is available
if command -v php &> /dev/null && command -v composer &> /dev/null; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-dev --optimize-autoloader --no-interaction --quiet || php composer.phar install --no-dev --optimize-autoloader --no-interaction --quiet
elif [ -f "composer.phar" ]; then
    echo "📦 Installing Composer dependencies with composer.phar..."
    php composer.phar install --no-dev --optimize-autoloader --no-interaction --quiet
else
    echo "⚠️  WARNING: PHP/Composer not available. vendor/ directory must exist in repository."
fi

echo "📦 Creating dist directory structure..."
mkdir -p dist

# Copy public directory (this becomes the root)
cp -r public/* dist/

# Copy API handler
mkdir -p dist/api
cp api/index.php dist/api/

# Copy all Laravel directories needed for runtime
# NOTE: vendor/ must be committed to the repository for this to work
echo "📂 Copying Laravel files..."
cp -r app dist/ 2>/dev/null || true
cp -r bootstrap dist/ 2>/dev/null || true
cp -r config dist/ 2>/dev/null || true
cp -r database dist/ 2>/dev/null || true
cp -r resources dist/ 2>/dev/null || true
cp -r routes dist/ 2>/dev/null || true
cp -r storage dist/ 2>/dev/null || true

# Vendor directory - install if PHP/Composer is available, otherwise must exist
if [ -d "vendor" ]; then
  echo "📦 Copying existing vendor directory..."
  cp -r vendor dist/ 2>/dev/null || true
elif command -v php &> /dev/null && (command -v composer &> /dev/null || [ -f "composer.phar" ]); then
  echo "📦 Installing Composer dependencies..."
  if command -v composer &> /dev/null; then
    composer install --no-dev --optimize-autoloader --no-interaction --quiet
  elif [ -f "composer.phar" ]; then
    php composer.phar install --no-dev --optimize-autoloader --no-interaction --quiet
  fi
  cp -r vendor dist/ 2>/dev/null || true
else
  echo "❌ ERROR: vendor/ directory not found and PHP/Composer not available!"
  echo "   Solutions:"
  echo "   1. Install PHP during build (see scripts/install-php.sh)"
  echo "   2. Use a different hosting service that supports PHP (Railway, Render, Laravel Forge)"
  echo "   3. Pre-build and commit vendor/ (not recommended)"
  exit 1
fi

cp artisan dist/ 2>/dev/null || true
cp composer.json dist/ 2>/dev/null || true
cp composer.lock dist/ 2>/dev/null || true

# Fix paths in dist/index.php - since everything is in dist/, paths should be relative to dist/
# The paths __DIR__.'/../vendor' need to become __DIR__.'/vendor' since vendor is now in dist/
echo "🔧 Fixing paths in dist/index.php..."
if [ -f "dist/index.php" ]; then
  # Use perl for cross-platform compatibility
  perl -i -pe 's|__DIR__\."/\.\./vendor|__DIR__."/vendor|g' dist/index.php
  perl -i -pe 's|__DIR__\."/\.\./bootstrap|__DIR__."/bootstrap|g' dist/index.php
  echo "✅ Fixed paths in dist/index.php"
fi

# Fix paths in dist/api/index.php - api is in dist/api/, so paths go up one level to dist/
echo "🔧 Fixing paths in dist/api/index.php..."
if [ -f "dist/api/index.php" ]; then
  # API paths should go up to dist/ level
  perl -i -pe 's|__DIR__\."/\.\./vendor|__DIR__."/../vendor|g' dist/api/index.php
  perl -i -pe 's|__DIR__\."/\.\./bootstrap|__DIR__."/../bootstrap|g' dist/api/index.php
  echo "✅ Fixed paths in dist/api/index.php"
fi

# Verify critical files exist
echo "🔍 Verifying build..."
if [ -f "dist/index.php" ]; then
  echo "✅ dist/index.php exists"
else
  echo "❌ ERROR: dist/index.php not found!"
  exit 1
fi

if [ -d "dist/vendor" ]; then
  echo "✅ dist/vendor exists"
else
  echo "❌ ERROR: dist/vendor not found!"
  exit 1
fi

if [ -d "dist/bootstrap" ]; then
  echo "✅ dist/bootstrap exists"
else
  echo "❌ ERROR: dist/bootstrap not found!"
  exit 1
fi

echo "✅ Build completed. dist/ directory ready."
echo "📁 dist/ contents:"
ls -la dist/ | head -10
