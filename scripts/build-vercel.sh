#!/bin/bash
set -e

# Build Vite assets (outputs to public/build)
npm run build

# Create dist directory as a copy of public
# Vercel needs "dist" but Laravel uses "public"
mkdir -p dist
cp -r public/* dist/

# Copy API handler to dist
mkdir -p dist/api  
cp api/index.php dist/api/

# Create a placeholder to ensure dist exists
touch dist/.vercel-ready

echo "✅ Build completed. dist/ directory created for Vercel."
echo "📦 Contents: $(ls -la dist/ | head -5)"

