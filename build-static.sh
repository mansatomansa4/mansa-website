#!/bin/bash

# Static Build Script for Mansa Dashboard
# Handles dynamic routes for static export

echo "🚀 Building Mansa Dashboard (Static Export)"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Backup dynamic routes
echo "📦 Backing up dynamic routes..."
BACKUP_DIR="/tmp/mansa-dynamic-routes-$(date +%s)"
mkdir -p "$BACKUP_DIR"

# Cleanup function to restore backed-up routes
cleanup() {
    echo ""
    echo "📥 Restoring dynamic routes..."
    if [ -d "$BACKUP_DIR/[id]" ]; then
        mv "$BACKUP_DIR/[id]" "src/app/community/mentorship/" 2>/dev/null
        echo "✅ Restored [id] route"
    fi
    
    # Clean up backup directory
    if [ -d "$BACKUP_DIR" ]; then
        rm -rf "$BACKUP_DIR"
    fi
}

# Register cleanup function to run on script exit (normal or interrupted)
trap cleanup EXIT INT TERM

if [ -d "src/app/community/mentorship/[id]" ]; then
    mv "src/app/community/mentorship/[id]" "$BACKUP_DIR/"
    echo "✅ Backed up [id] route to $BACKUP_DIR"
fi

# Build the static site
echo ""
echo "🔨 Building static site..."
npx next build

BUILD_EXIT_CODE=$?

# The cleanup trap will handle restoring routes and cleaning up

# Check build status
echo ""
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
    echo ""
    echo "📁 Static files generated in: ./out"
    echo ""
    echo "Next steps:"
    echo "1. Test locally: npm start"
    echo "2. Deploy to Render (Static Site)"
    echo "3. Or deploy to any static host"
    echo ""
    echo "Note: Dynamic routes (/community/mentorship/[id]) will work"
    echo "client-side after navigation, even though they're not pre-generated."
    exit 0
else
    echo -e "${RED}❌ Build failed!${NC}"
    echo "Check the error messages above."
    exit 1
fi
