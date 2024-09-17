#!/bin/bash

set -e

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Set variables
AWS_REGION=${AWS_REGION}
APP_NAME=${APP_NAME}
DOMAIN_NAME=${DOMAIN_NAME}

# Get AWS Account ID if not set
if [ -z "$AWS_ACCOUNT_ID" ]; then
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
fi

# Change directory to infra and initialize Terraform
cd infra
terraform init

# Apply Terraform to create ECR repositories only
terraform apply -target=aws_ecr_repository.backend -target=aws_ecr_repository.frontend -auto-approve

# Construct ECR repository URLs directly
ECR_BACKEND_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}-backend"
ECR_FRONTEND_REPO="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${APP_NAME}-frontend"

# Log in to ECR
aws ecr get-login-password --region "$AWS_REGION" | \
  docker login --username AWS --password-stdin "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Build and push backend image
echo "Building and pushing backend image..."
cd ../backend

docker build -t "${APP_NAME}-backend" -f Dockerfile.prod .

docker tag "${APP_NAME}-backend:latest" "${ECR_BACKEND_REPO}:latest"
docker push "${ECR_BACKEND_REPO}:latest"

cd ..

# Build and push frontend image
echo "Building and pushing frontend image..."
cd frontend

docker build -t "${APP_NAME}-frontend" -f Dockerfile.prod --build-arg VITE_APP_API_URL="https://${DOMAIN_NAME}/api/v1" .

docker tag "${APP_NAME}-frontend:latest" "${ECR_FRONTEND_REPO}:latest"
docker push "${ECR_FRONTEND_REPO}:latest"

cd ..

# Deploy the rest of the infrastructure
cd infra

terraform apply -auto-approve

# Update ECS services to force new deployment
echo "Updating ECS services..."
aws ecs update-service --cluster "${APP_NAME}-cluster" --service "${APP_NAME}-backend-service" --force-new-deployment --region "$AWS_REGION"
aws ecs update-service --cluster "${APP_NAME}-cluster" --service "${APP_NAME}-frontend-service" --force-new-deployment --region "$AWS_REGION"

echo "Deployment complete!"
echo "Your application is available at: https://${DOMAIN_NAME}/"