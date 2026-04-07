# Secrets Management

## AWS SSM Parameter Store
Store all secrets in SSM - never in code or environment files.

```bash
# Database URL
aws ssm put-parameter \
  --name "/shopmart/prod/db-url" \
  --value "mysql://user:pass@rds-endpoint:3306/shopmart" \
  --type SecureString

# JWT Secret
aws ssm put-parameter \
  --name "/shopmart/prod/jwt-secret" \
  --value "your-strong-production-secret" \
  --type SecureString
```

## GitHub Actions OIDC (No Static Keys)
```bash
# Create OIDC provider
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1

# Create trusted role
aws iam create-role \
  --role-name GitHubActionsRole \
  --assume-role-policy-document '{
    "Version":"2012-10-17",
    "Statement":[{
      "Effect":"Allow",
      "Principal":{"Federated":"arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"},
      "Action":"sts:AssumeRoleWithWebIdentity",
      "Condition":{"StringLike":{
        "token.actions.githubusercontent.com:sub":"repo:AnuragSinghParihar/SHOPMART:*"
      }}
    }]
  }'
```

## GitHub Repository Secrets
Add these in GitHub → Settings → Secrets → Actions:
- `AWS_ACCOUNT_ID`
- `AWS_ROLE_ARN`
- `AWS_REGION`
