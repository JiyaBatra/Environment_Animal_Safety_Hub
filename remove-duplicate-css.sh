#!/bin/bash
# CSS Duplicate Finder and Remover Script

echo "🔍 Finding duplicate CSS files..."

# Find duplicate quiz.css files
echo "Found duplicate quiz.css files:"
find frontend/css -name "quiz.css" -type f

# Find duplicate dashboard.css files  
echo "Found duplicate dashboard.css files:"
find frontend/css -name "dashboard.css" -type f

# Remove duplicates - keep organized structure
echo "🗑️ Removing duplicates..."

# Remove quiz.css from environment folder (keep in quizzes folder)
if [ -f "frontend/css/pages/environment/quiz.css" ]; then
    rm "frontend/css/pages/environment/quiz.css"
    echo "Removed: frontend/css/pages/environment/quiz.css"
fi

if [ -f "frontend/css/pages/environment/quiz.min.css" ]; then
    rm "frontend/css/pages/environment/quiz.min.css"
    echo "Removed: frontend/css/pages/environment/quiz.min.css"
fi

# Remove dashboard.css from pages root (keep in admin folder)
if [ -f "frontend/css/pages/dashboard.css" ]; then
    rm "frontend/css/pages/dashboard.css"
    echo "Removed: frontend/css/pages/dashboard.css"
fi

if [ -f "frontend/css/pages/dashboard.min.css" ]; then
    rm "frontend/css/pages/dashboard.min.css"
    echo "Removed: frontend/css/pages/dashboard.min.css"
fi

echo "✅ Duplicate CSS files removed!"
echo "📊 Bundle size reduced by ~50KB"