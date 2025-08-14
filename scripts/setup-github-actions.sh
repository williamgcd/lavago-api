#!/bin/bash

# GitHub Actions Setup Script for LAVAGO API
# This script helps you set up the required Google Cloud service account and provides instructions for GitHub secrets

set -e

echo "🚀 Setting up GitHub Actions for LAVAGO API deployment..."
echo ""

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud SDK is not installed. Please install it first:"
    echo "   https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "❌ Not authenticated with Google Cloud. Please run 'gcloud auth login' first."
    exit 1
fi

# Get current project
CURRENT_PROJECT=$(gcloud config get-value project 2>/dev/null || echo "")
if [ -z "$CURRENT_PROJECT" ]; then
    echo "❌ No Google Cloud project is set. Please set one first:"
    echo "   gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

echo "📋 Current Google Cloud project: $CURRENT_PROJECT"
echo ""

# Ask for confirmation
read -p "Do you want to create a service account for GitHub Actions in this project? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled."
    exit 1
fi

# Create service account
SERVICE_ACCOUNT_NAME="github-actions"
SERVICE_ACCOUNT_EMAIL="$SERVICE_ACCOUNT_NAME@$CURRENT_PROJECT.iam.gserviceaccount.com"

echo "🔧 Creating service account: $SERVICE_ACCOUNT_NAME"

# Check if service account already exists
if gcloud iam service-accounts describe "$SERVICE_ACCOUNT_EMAIL" >/dev/null 2>&1; then
    echo "⚠️  Service account already exists. Skipping creation."
else
    gcloud iam service-accounts create "$SERVICE_ACCOUNT_NAME" \
        --display-name="GitHub Actions for LAVAGO API"
    echo "✅ Service account created successfully."
fi

# Grant necessary permissions
echo "🔐 Granting permissions to service account..."

# Cloud Run Admin
gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/run.admin"

# Storage Admin (for Container Registry)
gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/storage.admin"

# Service Account User
gcloud projects add-iam-policy-binding "$CURRENT_PROJECT" \
    --member="serviceAccount:$SERVICE_ACCOUNT_EMAIL" \
    --role="roles/iam.serviceAccountUser"

echo "✅ Permissions granted successfully."

# Create and download key
KEY_FILE="github-actions-key.json"
echo "🔑 Creating service account key..."

gcloud iam service-accounts keys create "$KEY_FILE" \
    --iam-account="$SERVICE_ACCOUNT_EMAIL"

echo "✅ Service account key created: $KEY_FILE"
echo ""

# Display next steps
echo "🎉 Google Cloud setup completed!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Add the following secrets to your GitHub repository:"
echo "   Go to: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo ""
echo "   Required secrets:"
echo "   - GCP_PROJECT_ID: $CURRENT_PROJECT"
echo "   - GCP_REGION: southamerica-east1 (or your preferred region)"
echo "   - GCP_SA_KEY: (copy the contents of $KEY_FILE)"
echo "   - SUPABASE_URL: your-supabase-project-url"
echo "   - SUPABASE_SECRET_KEY: your-supabase-service-role-key"
echo "   - JWT_SECRET: your-jwt-secret-key"
echo "   - PAGBANK_API_KEY: your-pagbank-api-key"
echo "   - PAGBANK_WEBHOOK_SECRET: your-pagbank-webhook-secret"
echo ""
echo "2. Copy the service account key content:"
echo "   cat $KEY_FILE"
echo ""
echo "3. Push to main branch to trigger deployment:"
echo "   git push origin main"
echo ""
echo "⚠️  IMPORTANT: Keep the $KEY_FILE secure and delete it after adding to GitHub secrets!"
echo "   rm $KEY_FILE"
echo ""
echo "🔗 Useful links:"
echo "   - GitHub Secrets: https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions"
echo "   - Cloud Run Console: https://console.cloud.google.com/run"
echo "   - Container Registry: https://console.cloud.google.com/gcr"

