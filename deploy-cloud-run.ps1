# Minimal Cloud Run Deployment Script for Smart City Project (PowerShell)

# Set your variables
$PROJECT_ID = "YOUR_BILLING_ENABLED_PROJECT_ID"  # Replace with your actual project ID that has billing enabled
$SERVICE_NAME = "smart-city-app"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Starting Cloud Run deployment..."
Write-Host "Project ID: $PROJECT_ID"
Write-Host "Region: $REGION"
Write-Host "Service Name: $SERVICE_NAME"

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "Google Cloud CLI is not installed!"
    exit 1
}

# Check if Docker is installed
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker is not installed!"
    exit 1
}

# Authenticate if needed
$authStatus = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $authStatus) {
    gcloud auth login
    gcloud auth application-default login
}

# Set the project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build Docker image
docker build -t $IMAGE_NAME .
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker build failed!"
    exit 1
}

gcloud auth configure-docker
docker push $IMAGE_NAME
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker push failed!"
    exit 1
}

# Deploy to Cloud Run
gcloud run deploy $SERVICE_NAME --image $IMAGE_NAME --platform managed --region $REGION --allow-unauthenticated --port 8080
if ($LASTEXITCODE -eq 0) {
    $serviceUrl = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)"
    Write-Host "Deployment completed successfully! Your app is available at: $serviceUrl"
} else {
    Write-Host "Deployment failed!"
} 