#!/bin/bash
set -e

echo "🔨 Building Vite assets..."
npm run build

echo "📦 Creating dist directory structure..."
mkdir -p dist

# Copy public directory (this becomes the root)
cp -r public/* dist/

# Copy API handler
mkdir -p dist/api
cp api/index.php dist/api/

# Copy all Laravel directories needed for runtime
echo "📂 Copying Laravel files..."
cp -r app dist/ 2>/dev/null || true
cp -r bootstrap dist/ 2>/dev/null || true
cp -r config dist/ 2>/dev/null || true
cp -r database dist/ 2>/dev/null || true
cp -r resources dist/ 2>/dev/null || true
cp -r routes dist/ 2>/dev/null || true
cp -r storage dist/ 2>/dev/null || true
cp -r vendor dist/ 2>/dev/null || true
cp artisan dist/ 2>/dev/null || true
cp composer.json dist/ 2>/dev/null || true
cp composer.lock dist/ 2>/dev/null || true

# Fix paths in dist/index.php - since everything is in dist/, paths should be relative to dist/
# The paths __DIR__.'/../vendor' need to become __DIR__.'/vendor' since vendor is now in dist/
sed -i.bak 's|__DIR__."/../vendor|__DIR__."/vendor|g' dist/index.php 2>/dev/null || sed -i '' 's|__DIR__."/../vendor|__DIR__."/vendor|g' dist/index.php 2>/dev/null || true
sed -i.bak 's|__DIR__."/../bootstrap|__DIR__."/bootstrap|g' dist/index.php 2>/dev/null || sed -i '' 's|__DIR__."/../bootstrap|__DIR__."/bootstrap|g' dist/index.php 2>/dev/null || true

# Fix paths in dist/api/index.php
sed -i.bak 's|__DIR__."/../vendor|__DIR__."/../vendor|g' dist/api/index.php 2>/dev/null || sed -i '' 's|__DIR__."/../vendor|__DIR__."/../vendor|g' dist/api/index.php 2>/dev/null || true
sed -i.bak 's|__DIR__."/../bootstrap|__DIR__."/../bootstrap|g' dist/api/index.php 2>/dev/null || sed -i '' 's|__DIR__."/../bootstrap|__DIR__."/../bootstrap|g' dist/api/index.php 2>/dev/null || true

echo "✅ Build completed. dist/ directory ready."
