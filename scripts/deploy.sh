#!/bin/bash

# LAVAGO API Google Cloud Run Deployment Script
# Usage: ./scripts/deploy.sh [PROJECT_ID] [REGION] [SERVICE_NAME]

set -e

# Default values
PROJECT_ID=${1:-"your-project-id"}
REGION=${2:-"southamerica-east1"}
SERVICE_NAME=${3:-"lavago-api"}
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting deployment to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"
echo "Service Name: $SERVICE_NAME"
echo "Image: $IMAGE_NAME"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first."
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Set the project
echo "📋 Setting project to $PROJECT_ID..."
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Configure Docker for Google Container Registry
echo "🐳 Configuring Docker for Google Container Registry..."
gcloud auth configure-docker

# Build the Docker image
echo "🔨 Building Docker image..."
docker build -t $IMAGE_NAME .

# Push the image to Google Container Registry
echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image $IMAGE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0 \
  --timeout 300 \
  --concurrency 80 \
  --set-env-vars NODE_ENV=production

echo "✅ Deployment completed successfully!"
echo "🌐 Service URL: $(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables using:"
echo "   gcloud run services update $SERVICE_NAME --region=$REGION --update-env-vars SUPABASE_URL=your-url,SUPABASE_SECRET_KEY=your-key,JWT_SECRET=your-secret"
echo ""
echo "2. Test the health endpoint:"
echo "   curl $(gcloud run services describe $SERVICE_NAME --region=$REGION --format='value(status.url)')/health"

