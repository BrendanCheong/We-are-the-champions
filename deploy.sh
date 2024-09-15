#!/bin/bash

set -e

# Set variables
AWS_REGION="ap-southeast-1"
APP_NAME="myapp"

# Get AWS Account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Log in to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push frontend image
echo "Building and pushing frontend image..."
cd ../frontend

# Get ECR repository URI for frontend
ECR_FRONTEND_REPO=$(aws ecr describe-repositories --repository-names ${APP_NAME}-frontend --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)

docker build -t ${APP_NAME}-frontend -f Dockerfile.prod --build-arg VITE_API_URL=http://placeholder /app .

docker tag ${APP_NAME}-frontend:latest $ECR_FRONTEND_REPO:latest
docker push $ECR_FRONTEND_REPO:latest

# Build and push backend image
echo "Building and pushing backend image..."
cd ../backend

# Get ECR repository URI for backend
ECR_BACKEND_REPO=$(aws ecr describe-repositories --repository-names ${APP_NAME}-backend --region $AWS_REGION --query 'repositories[0].repositoryUri' --output text)

docker build -t ${APP_NAME}-backend .

docker tag ${APP_NAME}-backend:latest $ECR_BACKEND_REPO:latest
docker push $ECR_BACKEND_REPO:latest

# Deploy via Terraform
cd ../infra
terraform init

# Retrieve the ALB DNS name after infrastructure is created
terraform apply -auto-approve \
  -var "db_username=postgres" \
  -var "db_password=your_db_password"

# Retrieve ALB DNS Name
ALB_DNS_NAME=$(terraform output -raw load_balancer_dns)

# Rebuild frontend image with the correct VITE_API_URL
cd ../frontend

docker build -t ${APP_NAME}-frontend -f Dockerfile.prod --build-arg VITE_API_URL=http://${ALB_DNS_NAME}/api /app .

docker tag ${APP_NAME}-frontend:latest $ECR_FRONTEND_REPO:latest
docker push $ECR_FRONTEND_REPO:latest

# Update ECS service to use the new image
aws ecs update-service --cluster ${APP_NAME}-cluster --service ${APP_NAME}-frontend-service --force-new-deployment --region $AWS_REGION