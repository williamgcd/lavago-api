# Vercel Deployment Guide

This guide will help you deploy your LavaGo API to Vercel.

## Prerequisites

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

## Deployment Steps

### 1. Initial Deployment

Run the following command from your project root:
```bash
vercel
```

Follow the prompts to:
- Link to existing project or create new one
- Set project name
- Confirm deployment settings

### 2. Environment Variables

Set up the following environment variables in your Vercel project dashboard:

#### Required Environment Variables

```bash
# Database Configuration
TURSO_DATABASE_URL=your_turso_database_url
TURSO_AUTH_TOKEN=your_turso_auth_token

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Payment Configuration (PagBank)
PAGBANK_API_KEY=your_pagbank_api_key
PAGBANK_BASE_URL=https://sandbox.api.pagseguro.com
PAGBANK_WEBHOOK_SECRET=your_pagbank_webhook_secret

# Application Configuration
NODE_ENV=production
BASE_URL=https://your-vercel-domain.vercel.app
```

#### Optional Environment Variables

```bash
# Database Configuration (Supabase - if using)
SUPABASE_DATABASE_URL=your_supabase_database_url
SUPABASE_DATABASE_AUTH_TOKEN=your_supabase_auth_token
```

### 3. Setting Environment Variables

You can set environment variables in two ways:

#### Option A: Via Vercel Dashboard
1. Go to your project dashboard on Vercel
2. Navigate to Settings > Environment Variables
3. Add each variable with the appropriate environment (Production, Preview, Development)

#### Option B: Via Vercel CLI
```bash
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add GOOGLE_MAPS_API_KEY
# ... repeat for all variables
```

### 4. Deploy to Production

#### Option A: Using the deployment script (recommended)
```bash
# Deploy to preview
npm run deploy

# Deploy to production
npm run deploy:prod
```

#### Option B: Using Vercel CLI directly
```bash
vercel --prod
```

## Project Structure for Vercel

The deployment is configured with the following structure:

- `api/index.ts` - Main serverless function entry point
- `vercel.json` - Vercel configuration
- `tsconfig.vercel.json` - Vercel-specific TypeScript configuration
- `.vercelignore` - Files to exclude from deployment
- `scripts/deploy.sh` - Automated deployment script
- `env.template` - Environment variables template

## Important Notes

1. **Database Migrations**: Ensure your database is properly set up and migrations are run before deployment.

2. **CORS Configuration**: The API is configured with CORS enabled. Update the CORS configuration in `src/app.ts` if you need to restrict origins.

3. **Rate Limiting**: Basic rate limiting is enabled. Adjust the configuration in `src/middlewares/rate-limiter.ts` as needed.

4. **Function Timeout**: The serverless function is configured with a 30-second timeout. Adjust in `vercel.json` if needed.

## Health Check

After deployment, you can test the API health endpoint:
```
https://your-domain.vercel.app/health
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**: Ensure all required environment variables are set in Vercel dashboard.

2. **Database Connection Issues**: Verify your database URL and authentication tokens are correct.

3. **Build Failures**: Check that all dependencies are properly listed in `package.json`.

### Debugging

1. Check Vercel function logs in the dashboard
2. Use `vercel logs` command to view deployment logs
3. Test locally with `vercel dev` to simulate the production environment

## Local Development with Vercel

To test your deployment locally:

```bash
vercel dev
```

This will start a local server that simulates the Vercel environment.

## Continuous Deployment

To enable automatic deployments:

1. Connect your GitHub repository to Vercel
2. Configure branch deployment rules
3. Set up environment variables for each environment (Production, Preview, Development)

## Security Considerations

1. **Environment Variables**: Never commit sensitive environment variables to your repository
2. **API Keys**: Rotate API keys regularly
3. **CORS**: Configure CORS to only allow necessary origins
4. **Rate Limiting**: Ensure rate limiting is appropriate for your use case 