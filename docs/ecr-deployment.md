# ECR Deployment Guide

## Build, Tag, and Push

### Login to ECR
```bash
export ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
export REGION=us-east-1
export ECR_BASE="$ACCOUNT.dkr.ecr.$REGION.amazonaws.com"

aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $ECR_BASE
```

### Build and Push Backend
```bash
docker build -t $ECR_BASE/shopmart/backend:latest \
             -t $ECR_BASE/shopmart/backend:$(git rev-parse --short HEAD) \
             ./backend

docker push $ECR_BASE/shopmart/backend --all-tags
```

### Build and Push Frontend
```bash
docker build -t $ECR_BASE/shopmart/frontend:latest \
             --build-arg REACT_APP_API_URL=https://api.shopmart.com \
             ./frontend

docker push $ECR_BASE/shopmart/frontend:latest
```

### Create/Update ECS Service
```bash
aws ecs register-task-definition --cli-input-json file://task-def.json

aws ecs create-service \
  --cluster shopmart-prod \
  --service-name backend-service \
  --task-definition shopmart-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

## ECR Lifecycle Policy
```bash
aws ecr put-lifecycle-policy --repository-name shopmart/backend \
  --lifecycle-policy-text '{
    "rules": [{
      "rulePriority": 1,
      "description": "Keep last 10 images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 10
      },
      "action": { "type": "expire" }
    }]
  }'
```
