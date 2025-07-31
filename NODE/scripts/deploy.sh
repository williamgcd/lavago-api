#!/bin/bash

# LavaGo API Vercel Deployment Script

echo "🚀 Starting LavaGo API deployment to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm i -g vercel"
    exit 1
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ You are not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
if [ "$1" = "--prod" ]; then
    echo "📤 Deploying to production..."
    vercel --prod
else
    echo "📤 Deploying to preview..."
    vercel
fi

if [ $? -eq 0 ]; then
    echo "✅ Deployment completed successfully!"
    echo "🔗 Your API is now live on Vercel"
    echo "📊 Check your Vercel dashboard for the deployment URL"
else
    echo "❌ Deployment failed. Please check the error messages above."
    exit 1
fi 