# 🚀 Deploying LavaGo API to Google Cloud Run

This guide will help you deploy your LavaGo API to Google Cloud Run using the free tier.

## 📋 Prerequisites

1. **Google Cloud Account**: Sign up at [cloud.google.com](https://cloud.google.com)
2. **Google Cloud CLI**: Install from [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)
3. **Docker**: Install from [docker.com](https://docker.com)
4. **GitHub Account** (for automated deployments)

## 🔧 Setup Steps

### 1. Create a Google Cloud Project

```bash
# Create a new project (or use existing)
gcloud projects create lavago-api-[YOUR-UNIQUE-ID]
gcloud config set project lavago-api-[YOUR-UNIQUE-ID]
```

### 2. Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### 3. Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth configure-docker
```

### 4. Update Configuration

Edit `deploy-cloud-run.sh` and replace `your-gcp-project-id` with your actual project ID:

```bash
PROJECT_ID="lavago-api-[YOUR-UNIQUE-ID]"
```

## 🚀 Deployment Options

### Option 1: Manual Deployment (Recommended for testing)

```bash
# Make the script executable (if not already done)
chmod +x deploy-cloud-run.sh

# Run the deployment
./deploy-cloud-run.sh
```

### Option 2: Automated Deployment with GitHub Actions

1. **Create a Service Account**:
   ```bash
   gcloud iam service-accounts create github-actions \
     --display-name="GitHub Actions Service Account"
   
   gcloud projects add-iam-policy-binding lavago-api-[YOUR-UNIQUE-ID] \
     --member="serviceAccount:github-actions@lavago-api-[YOUR-UNIQUE-ID].iam.gserviceaccount.com" \
     --role="roles/run.admin"
   
   gcloud projects add-iam-policy-binding lavago-api-[YOUR-UNIQUE-ID] \
     --member="serviceAccount:github-actions@lavago-api-[YOUR-UNIQUE-ID].iam.gserviceaccount.com" \
     --role="roles/storage.admin"
   
   gcloud iam service-accounts keys create key.json \
     --iam-account=github-actions@lavago-api-[YOUR-UNIQUE-ID].iam.gserviceaccount.com
   ```

2. **Add GitHub Secrets**:
   - Go to your GitHub repository → Settings → Secrets and variables → Actions
   - Add `GCP_PROJECT_ID`: Your project ID
   - Add `GCP_SA_KEY`: The contents of the `key.json` file

3. **Push to main branch** to trigger automatic deployment

## 📊 Free Tier Limits

Google Cloud Run free tier includes:
- **2 million requests per month**
- **360,000 vCPU-seconds per month**
- **180,000 GiB-seconds per month**
- **1 GB network egress per month**

This should be more than enough for testing and small applications.

## 🔍 Monitoring Your Deployment

### Check Service Status
```bash
gcloud run services describe lavago-api --region=us-central1
```

### View Logs
```bash
gcloud logs read "resource.type=cloud_run_revision AND resource.labels.service_name=lavago-api" --limit=50
```

### Test Your API
```bash
# Get your service URL
SERVICE_URL=$(gcloud run services describe lavago-api --region=us-central1 --format="value(status.url)")

# Test health endpoint
curl $SERVICE_URL/health

# Test main endpoint
curl $SERVICE_URL/
```

## 🛠️ Configuration Options

### Environment Variables
You can add environment variables in the deployment script:

```bash
--set-env-vars NODE_ENV=production,DATABASE_URL=your-db-url
```

### Resource Limits
Adjust memory and CPU in the deployment script:
- `--memory 512Mi` (256Mi, 512Mi, 1Gi, 2Gi, 4Gi, 8Gi, 16Gi, 32Gi)
- `--cpu 1` (0.25, 0.5, 1, 2, 4, 8)

### Scaling
- `--max-instances 10` (0-1000)
- `--min-instances 0` (0-1000)
- `--concurrency 80` (1-1000)

## 🚨 Troubleshooting

### Common Issues

1. **Build fails**: Check Dockerfile and ensure all dependencies are in package.json
2. **Deployment fails**: Verify project ID and authentication
3. **Service not responding**: Check logs and ensure port 8080 is exposed
4. **Cold start delays**: Consider setting `--min-instances 1` for faster response

### Useful Commands

```bash
# List all Cloud Run services
gcloud run services list

# Delete a service
gcloud run services delete lavago-api --region=us-central1

# Update environment variables
gcloud run services update lavago-api \
  --region=us-central1 \
  --set-env-vars NODE_ENV=production

# View service details
gcloud run services describe lavago-api --region=us-central1
```

## 💰 Cost Optimization

- Use `--min-instances 0` to scale to zero when not in use
- Set appropriate `--max-instances` to prevent runaway costs
- Monitor usage in Google Cloud Console
- Set up billing alerts

## 🔗 Useful Links

- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing)
- [Docker Documentation](https://docs.docker.com/)
- [Bun Documentation](https://bun.sh/docs) 