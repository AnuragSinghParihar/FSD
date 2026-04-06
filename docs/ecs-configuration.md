# ECS Configuration Guide

## ECS Cluster Setup
```bash
aws ecs create-cluster \
  --cluster-name shopmart-prod \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1,base=1 \
    capacityProvider=FARGATE_SPOT,weight=1
```

## CloudWatch Log Group
```bash
aws logs create-log-group --log-group-name /ecs/shopmart-backend
aws logs put-retention-policy \
  --log-group-name /ecs/shopmart-backend \
  --retention-in-days 30

aws logs create-log-group --log-group-name /ecs/shopmart-frontend
aws logs put-retention-policy \
  --log-group-name /ecs/shopmart-frontend \
  --retention-in-days 30
```

## ECR Repositories
```bash
aws ecr create-repository --repository-name shopmart/backend \
  --image-scanning-configuration scanOnPush=true

aws ecr create-repository --repository-name shopmart/frontend \
  --image-scanning-configuration scanOnPush=true
```

## Service Configuration
- **Launch Type:** FARGATE
- **desired-count:** 2 (for high availability)
- **Network:** awsvpc with public subnets
- **Health Check:** /health endpoint
