#!/bin/bash

# Monster Meme Memory - GitHub Repository Creation Script
# This script will help you create the GitHub repository

echo "🚀 Monster Meme Memory - GitHub Repository Setup"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Please run this script from the monster-meme-memory directory"
    exit 1
fi

echo "✅ Found project files in current directory"
echo ""

# Check git status
if [ ! -d ".git" ]; then
    echo "❌ Error: Git repository not initialized"
    echo "Please run: git init"
    exit 1
fi

echo "✅ Git repository is initialized"
echo ""

# Check if files are committed
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Error: There are uncommitted changes"
    echo "Please commit your changes first"
    exit 1
fi

echo "✅ All files are committed"
echo ""

# Get GitHub username
echo "📝 Please provide your GitHub username:"
read -p "GitHub Username: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Error: GitHub username is required"
    exit 1
fi

echo ""
echo "🔗 Repository will be created at: https://github.com/$GITHUB_USERNAME/monster-meme-memory"
echo ""

# Create the repository using GitHub API
echo "🌐 Creating GitHub repository..."

# Note: This requires a GitHub personal access token
echo "⚠️  To create the repository automatically, you'll need a GitHub Personal Access Token"
echo ""
echo "📋 Steps to get a Personal Access Token:"
echo "1. Go to https://github.com/settings/tokens"
echo "2. Click 'Generate new token' -> 'Generate new token (classic)'"
echo "3. Give it a name like 'Monster Meme Memory'"
echo "4. Select 'repo' scope (full control of private repositories)"
echo "5. Click 'Generate token'"
echo "6. Copy the token (you won't see it again!)"
echo ""

read -p "🔑 Enter your GitHub Personal Access Token: " GITHUB_TOKEN

if [ -z "$GITHUB_TOKEN" ]; then
    echo "❌ Error: GitHub token is required"
    exit 1
fi

echo ""
echo "🚀 Creating repository..."

# Create repository via GitHub API
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -d '{
        "name": "monster-meme-memory",
        "description": "A retro internet-inspired interface for managing memories and conversing with an AI bot powered by mem0. Features Times New Roman fonts, black/white styling, and classic web aesthetics.",
        "private": false,
        "auto_init": false
    }' \
    https://api.github.com/user/repos)

# Check if repository was created successfully
if echo "$RESPONSE" | grep -q '"name":"monster-meme-memory"'; then
    echo "✅ Repository created successfully!"
    echo ""
    
    # Add remote and push
    echo "🔗 Adding remote origin..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/monster-meme-memory.git"
    
    echo "📤 Pushing code to GitHub..."
    git branch -M main
    git push -u origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "🎉 SUCCESS! Your repository is now live at:"
        echo "   https://github.com/$GITHUB_USERNAME/monster-meme-memory"
        echo ""
        echo "🌐 To enable GitHub Pages:"
        echo "1. Go to https://github.com/$GITHUB_USERNAME/monster-meme-memory/settings"
        echo "2. Scroll down to 'Pages' section"
        echo "3. Select 'Deploy from a branch'"
        echo "4. Choose 'main' branch and '/ (root)' folder"
        echo "5. Your site will be at: https://$GITHUB_USERNAME.github.io/monster-meme-memory/"
        echo ""
    else
        echo "❌ Error pushing to GitHub. Please check your credentials."
    fi
    
else
    echo "❌ Error creating repository. Response:"
    echo "$RESPONSE"
    echo ""
    echo "💡 Manual steps:"
    echo "1. Go to https://github.com/new"
    echo "2. Repository name: monster-meme-memory"
    echo "3. Description: A retro internet-inspired interface for managing memories and conversing with an AI bot powered by mem0"
    echo "4. Make it public"
    echo "5. Don't initialize with README"
    echo "6. Click 'Create repository'"
    echo "7. Then run: git remote add origin https://github.com/$GITHUB_USERNAME/monster-meme-memory.git"
    echo "8. Then run: git push -u origin main"
fi

echo ""
echo "🎯 Your Monster Meme Memory interface is ready to deploy!"
