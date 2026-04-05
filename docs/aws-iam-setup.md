# AWS IAM Setup Guide

## Prerequisites
- AWS Account with admin access
- AWS CLI v2 installed

## 1. Configure AWS CLI
```bash
aws configure
# Region: us-east-1
# Output: json

aws sts get-caller-identity   # verify identity
```

## 2. Create ECS Task Execution Role
```bash
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Service":"ecs-tasks.amazonaws.com"},
      "Action":"sts:AssumeRole"
    }]
  }'

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/AmazonSSMReadOnlyAccess
```

## 3. GitHub Actions OIDC Role
See `docs/secrets-management.md` for OIDC setup.
