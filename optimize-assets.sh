#!/bin/bash

# Asset Optimization Script for Mansa Dashboard
# This script helps reduce file sizes for faster loading

echo "🎨 Mansa Asset Optimization Tool"
echo "================================"
echo ""

# Check if required tools are installed
check_dependencies() {
    echo "Checking dependencies..."
    
    # Check for imagemagick (for images)
    if ! command -v convert &> /dev/null; then
        echo "⚠️  ImageMagick not found. Install with:"
        echo "   macOS: brew install imagemagick"
        echo "   Ubuntu: sudo apt-get install imagemagick"
        echo ""
    else
        echo "✅ ImageMagick found"
    fi
    
    # Check for ffmpeg (for videos)
    if ! command -v ffmpeg &> /dev/null; then
        echo "⚠️  FFmpeg not found. Install with:"
        echo "   macOS: brew install ffmpeg"
        echo "   Ubuntu: sudo apt-get install ffmpeg"
        echo ""
    else
        echo "✅ FFmpeg found"
    fi
    
    echo ""
}

# Optimize images
optimize_images() {
    echo "📸 Optimizing Images..."
    echo "----------------------"
    
    if ! command -v convert &> /dev/null; then
        echo "❌ ImageMagick not installed. Skipping image optimization."
        return
    fi
    
    # Create optimized directory
    mkdir -p public/optimized
    
    # Optimize JPG images
    echo "Optimizing JPG images..."
    for img in public/*.jpg public/*.jpeg; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            echo "  Processing: $filename"
            convert "$img" -quality 85 -strip "public/optimized/$filename"
        fi
    done
    
    # Optimize PNG images
    echo "Optimizing PNG images..."
    for img in public/*.png; do
        if [ -f "$img" ]; then
            filename=$(basename "$img")
            echo "  Processing: $filename"
            convert "$img" -quality 85 -strip "public/optimized/$filename"
        fi
    done
    
    echo "✅ Images optimized! Check public/optimized/"
    echo ""
}

# Optimize videos
optimize_videos() {
    echo "🎬 Optimizing Videos..."
    echo "----------------------"
    
    if ! command -v ffmpeg &> /dev/null; then
        echo "❌ FFmpeg not installed. Skipping video optimization."
        return
    fi
    
    # Create optimized directory
    mkdir -p public/videos/optimized
    
    # Optimize each video
    for video in public/videos/*.mp4; do
        if [ -f "$video" ]; then
            filename=$(basename "$video" .mp4)
            echo "  Processing: $filename.mp4"
            echo "  This may take a few minutes..."
            
            # Create temp log file for ffmpeg output
            temp_log=$(mktemp)
            
            ffmpeg -i "$video" \
                -c:v libx264 \
                -crf 28 \
                -preset slow \
                -c:a aac \
                -b:a 128k \
                -movflags +faststart \
                "public/videos/optimized/${filename}-optimized.mp4" \
                -y > "$temp_log" 2>&1
            
            # Check ffmpeg exit status
            ffmpeg_exit_code=$?
            
            if [ $ffmpeg_exit_code -ne 0 ]; then
                echo "  ❌ Error: FFmpeg failed to process $filename.mp4"
                echo "  Check the log for details:"
                tail -10 "$temp_log"
                rm -f "$temp_log"
                continue
            fi
            
            # Show progress info from log if available
            grep -E "time=|Duration:" "$temp_log" | tail -5
            rm -f "$temp_log"
            
            # Show file size comparison only if conversion succeeded
            if [ -f "public/videos/optimized/${filename}-optimized.mp4" ]; then
                original_size=$(du -h "$video" | cut -f1)
                optimized_size=$(du -h "public/videos/optimized/${filename}-optimized.mp4" | cut -f1)
                echo "  Original: $original_size → Optimized: $optimized_size"
            else
                echo "  ❌ Error: Output file was not created"
            fi
            echo ""
        fi
    done
    
    echo "✅ Videos optimized! Check public/videos/optimized/"
    echo ""
}

# Show file sizes
show_sizes() {
    echo "📊 Current Asset Sizes"
    echo "---------------------"
    
    echo "Images:"
    du -sh public/*.{jpg,jpeg,png,webp} 2>/dev/null | sort -h | tail -10
    echo ""
    
    echo "Videos:"
    du -sh public/videos/*.mp4 2>/dev/null | sort -h
    echo ""
    
    echo "Total public folder size:"
    du -sh public/
    echo ""
}

# Main menu
show_menu() {
    while true; do
        echo "What would you like to do?"
        echo "1) Check dependencies"
        echo "2) Optimize images"
        echo "3) Optimize videos"
        echo "4) Optimize everything"
        echo "5) Show current sizes"
        echo "6) Exit"
        echo ""
        read -p "Enter choice [1-6]: " choice
        
        case $choice in
            1) check_dependencies ;;
            2) optimize_images ;;
            3) optimize_videos ;;
            4) 
                check_dependencies
                optimize_images
                optimize_videos
                ;;
            5) show_sizes ;;
            6) 
                echo "👋 Goodbye!"
                return 0
                ;;
            *) 
                echo "❌ Invalid choice"
                ;;
        esac
        
        echo ""
        echo "Press Enter to continue..."
        read
    done
}

# Start
check_dependencies
show_menu
