# Google Cloud Run Setup Guide

## Prerequisites

1. **Google Cloud Account** - Create one at https://console.cloud.google.com
2. **Google Cloud CLI** - Install from https://cloud.google.com/sdk/docs/install
3. **Docker** - Install from https://docs.docker.com/get-docker/
4. **Node.js** - Already installed for your React project

## Step 1: Install Google Cloud CLI

### Windows
1. Download the installer from: https://cloud.google.com/sdk/docs/install
2. Run the installer
3. Restart your terminal/PowerShell
4. Verify installation: `gcloud --version`

### macOS/Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

## Step 2: Authenticate with Google Cloud

```bash
gcloud auth login
gcloud auth application-default login
```

## Step 3: Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click "Create Project" or "Select Project"
3. Enter a project name (e.g., "smart-city-project")
4. Note your Project ID (you'll need this)

## Step 4: Configure Your Project

Update the deployment scripts with your project ID:

### For PowerShell (Windows):
Edit `deploy-cloud-run.ps1` and change:
```powershell
$PROJECT_ID = "your-actual-project-id"
```

### For Bash (Linux/macOS):
Edit `deploy-cloud-run.sh` and change:
```bash
PROJECT_ID="your-actual-project-id"
```

## Step 5: Enable Required APIs

```bash
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

## Step 6: Set Up Environment Variables

Create a `.env.production` file with your production environment variables:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Step 7: Deploy to Cloud Run

### Windows (PowerShell):
```powershell
.\deploy-cloud-run.ps1
```

### Linux/macOS (Bash):
```bash
chmod +x deploy-cloud-run.sh
./deploy-cloud-run.sh
```

## Step 8: Verify Deployment

1. Check the deployment status in Google Cloud Console
2. Visit the provided URL to test your app
3. Monitor logs: `gcloud logs tail --service=smart-city-app`

## Configuration Options

### Memory and CPU
- **Memory**: 512Mi (free tier limit)
- **CPU**: 1 vCPU
- **Max Instances**: 10 (free tier limit)
- **Min Instances**: 0 (scale to zero)

### Custom Domain (Optional)
```bash
gcloud run domain-mappings create \
  --service smart-city-app \
  --domain your-domain.com \
  --region us-central1
```

## Monitoring and Logging

### View Logs
```bash
gcloud logs tail --service=smart-city-app
```

### Monitor Performance
1. Go to Google Cloud Console
2. Navigate to Cloud Run
3. Select your service
4. View metrics and logs

## Cost Optimization

### Free Tier Limits
- **2 million requests per month**
- **360,000 vCPU-seconds**
- **180,000 GiB-seconds of memory**

### Scaling Configuration
- **Min instances**: 0 (scale to zero)
- **Max instances**: 10 (free tier limit)
- **Concurrency**: 80 requests per instance

## Troubleshooting

### Common Issues

1. **Authentication Error**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   ```

2. **Permission Denied**
   - Ensure you have the "Cloud Run Admin" role
   - Check project permissions

3. **Build Failures**
   - Check Dockerfile syntax
   - Verify all dependencies are in package.json

4. **Environment Variables**
   - Ensure all required variables are set
   - Check .env file format

### Useful Commands

```bash
# List services
gcloud run services list

# Describe service
gcloud run services describe smart-city-app --region=us-central1

# Update service
gcloud run services update smart-city-app --image=your-new-image

# Delete service
gcloud run services delete smart-city-app --region=us-central1
```

## Security Best Practices

1. **Environment Variables**: Never commit sensitive data
2. **HTTPS**: Cloud Run provides HTTPS by default
3. **IAM**: Use least privilege principle
4. **Secrets**: Use Google Secret Manager for sensitive data

## Next Steps

1. Set up custom domain
2. Configure monitoring alerts
3. Set up CI/CD pipeline
4. Implement auto-scaling policies
5. Add SSL certificates

## Support

- [Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Google Cloud Console](https://console.cloud.google.com)
- [Cloud Run Pricing](https://cloud.google.com/run/pricing) 