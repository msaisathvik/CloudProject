# Quick Start: Using Google Cloud Run

## 🚀 Simple 5-Step Process

### Step 1: Install Required Tools

1. **Install Google Cloud CLI:**
   - Go to: https://cloud.google.com/sdk/docs/install
   - Download Windows installer
   - Run installer and restart PowerShell

2. **Install Docker Desktop:**
   - Go to: https://docs.docker.com/get-docker/
   - Download and install Docker Desktop
   - Start Docker Desktop

### Step 2: Create Google Cloud Project

1. Go to: https://console.cloud.google.com
2. Click "Create Project" or "Select Project"
3. Enter project name: "smart-city-project"
4. Click "Create"
5. **Copy your Project ID** (you'll need this)

### Step 3: Update Configuration

Edit `deploy-cloud-run.ps1` and change:
```powershell
$PROJECT_ID = "your-actual-project-id"  # Replace with your Project ID
```

### Step 4: Deploy Your App

Run this command in PowerShell:
```powershell
.\deploy-cloud-run.ps1
```

The script will:
- ✅ Check if tools are installed
- 🔐 Authenticate with Google Cloud
- 🏗️ Build your Docker image
- 📤 Push to Google Container Registry
- 🚀 Deploy to Cloud Run
- 🌐 Give you a public URL

### Step 5: Access Your App

After deployment, you'll get:
- **Public URL**: Your app is live on the internet
- **Monitoring**: View logs and performance
- **Auto-scaling**: Handles traffic automatically

## 📊 What You Get

### Free Tier Benefits:
- ✅ **2 million requests/month**
- ✅ **Auto-scaling** (0 to 10 instances)
- ✅ **HTTPS** (automatic SSL)
- ✅ **Global CDN**
- ✅ **Built-in monitoring**

### Your App Features:
- 🌐 **Public HTTPS URL**
- 📱 **Mobile responsive**
- 🔒 **Secure by default**
- ⚡ **Fast loading**
- 📈 **Auto-scaling**

## 🔧 Common Commands

### View Your Services:
```powershell
gcloud run services list
```

### View Logs:
```powershell
gcloud logs tail --service=smart-city-app --region=us-central1
```

### Update Your App:
```powershell
.\deploy-cloud-run.ps1
```

### Delete Service:
```powershell
gcloud run services delete smart-city-app --region=us-central1
```

## 🆘 Troubleshooting

### If gcloud is not found:
1. Install Google Cloud CLI
2. Restart PowerShell
3. Try again

### If Docker is not found:
1. Install Docker Desktop
2. Start Docker Desktop
3. Try again

### If authentication fails:
```powershell
gcloud auth login
gcloud auth application-default login
```

### If deployment fails:
1. Check your Project ID is correct
2. Ensure you have billing enabled
3. Check the error messages

## 💰 Cost

### Free Tier (Always Free):
- 2 million requests/month
- 360,000 vCPU-seconds
- 180,000 GiB-seconds memory

### Beyond Free Tier:
- $0.00002400 per 100ms of CPU time
- $0.00000250 per GiB-second of memory
- $0.40 per million requests

## 🎯 Next Steps

1. **Custom Domain**: Add your own domain
2. **Monitoring**: Set up alerts
3. **CI/CD**: Automatic deployments
4. **Multiple Regions**: Global deployment

## 📞 Support

- **Google Cloud Console**: https://console.cloud.google.com
- **Cloud Run Docs**: https://cloud.google.com/run/docs
- **Pricing**: https://cloud.google.com/run/pricing 