#!/bin/bash

# Cloud Run Deployment Script for Smart City Project

# Configuration
PROJECT_ID="your-project-id"
SERVICE_NAME="smart-city-app"
REGION="us-central1"
IMAGE_NAME="gcr.io/$PROJECT_ID/$SERVICE_NAME"

echo "🚀 Starting Cloud Run deployment..."

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo "❌ Google Cloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo "🔐 Please authenticate with Google Cloud:"
    gcloud auth login
fi

# Set the project
echo "📋 Setting project to: $PROJECT_ID"
gcloud config set project $PROJECT_ID

# Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and push the Docker image
echo "🏗️ Building Docker image..."
docker build -t $IMAGE_NAME .

echo "📤 Pushing image to Google Container Registry..."
docker push $IMAGE_NAME

# Deploy to Cloud Run
echo "🚀 Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --image $IMAGE_NAME \
    --platform managed \
    --region $REGION \
    --allow-unauthenticated \
    --port 8080 \
    --memory 512Mi \
    --cpu 1 \
    --max-instances 10 \
    --min-instances 0 \
    --timeout 300 \
    --concurrency 80

echo "✅ Deployment completed!"
echo "🌐 Your app is available at:"
gcloud run services describe $SERVICE_NAME --region=$REGION --format="value(status.url)" 