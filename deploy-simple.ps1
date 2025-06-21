# Simple Cloud Run Deployment Script

# Configuration
$PROJECT_ID = "cloud-project-36944"
$SERVICE_NAME = "smart-city-app"
$REGION = "us-central1"
$IMAGE_NAME = "gcr.io/$PROJECT_ID/$SERVICE_NAME"

Write-Host "Starting Cloud Run deployment..." -ForegroundColor Green
Write-Host "Project ID: $PROJECT_ID" -ForegroundColor Cyan

# Check if gcloud is installed
try {
    gcloud --version | Out-Null
    Write-Host "Google Cloud CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "Google Cloud CLI is not installed!" -ForegroundColor Red
    Write-Host "Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if Docker is installed
try {
    docker --version | Out-Null
    Write-Host "Docker is installed" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed!" -ForegroundColor Red
    Write-Host "Please install Docker from: https://docs.docker.com/get-docker/" -ForegroundColor Yellow
    exit 1
}

# Authenticate with Google Cloud
Write-Host "Authenticating with Google Cloud..." -ForegroundColor Blue
gcloud auth login
gcloud auth application-default login

# Set the project
Write-Host "Setting project to: $PROJECT_ID" -ForegroundColor Blue
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host "Enabling required APIs..." -ForegroundColor Blue
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the Docker image
Write-Host "Building Docker image..." -ForegroundColor Blue
docker build -t $IMAGE_NAME .

Write-Host "Pushing image to Google Container Registry..." -ForegroundColor Blue
docker push $IMAGE_NAME

# Deploy to Cloud Run
Write-Host "Deploying to Cloud Run..." -ForegroundColor Blue
gcloud run deploy $SERVICE_NAME --image $IMAGE_NAME --platform managed --region $REGION --allow-unauthenticated --port 8080 --memory 512Mi --cpu 1 --max-instances 10 --min-instances 0 --timeout 300 --concurrency 80

Write-Host "Deployment completed!" -ForegroundColor Green
$serviceUrl = gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)"
Write-Host "Your app is available at: $serviceUrl" -ForegroundColor Cyan 