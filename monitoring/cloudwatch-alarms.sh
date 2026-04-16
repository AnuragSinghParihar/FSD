#!/bin/bash
# CloudWatch Alarms for SHOPMART ECS Services
set -e

CLUSTER="shopmart-prod"
SERVICE="backend-service"

echo "📊 Creating CloudWatch alarms..."

# CPU Utilization Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "SHOPMART-ECS-CPU-High" \
  --alarm-description "Backend CPU above 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$SERVICE \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --treat-missing-data missing

echo "✅ CPU alarm created"

# Memory Utilization Alarm
aws cloudwatch put-metric-alarm \
  --alarm-name "SHOPMART-ECS-Memory-High" \
  --alarm-description "Backend memory above 85%" \
  --metric-name MemoryUtilization \
  --namespace AWS/ECS \
  --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$SERVICE \
  --statistic Average \
  --period 300 \
  --threshold 85 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2

echo "✅ Memory alarm created"

# Unhealthy Task Count
aws cloudwatch put-metric-alarm \
  --alarm-name "SHOPMART-ECS-Unhealthy-Tasks" \
  --alarm-description "Unhealthy tasks detected" \
  --metric-name RunningTaskCount \
  --namespace AWS/ECS \
  --dimensions Name=ClusterName,Value=$CLUSTER Name=ServiceName,Value=$SERVICE \
  --statistic Minimum \
  --period 60 \
  --threshold 1 \
  --comparison-operator LessThanThreshold \
  --evaluation-periods 3

echo "✅ Task health alarm created"
echo "🎉 All alarms configured!"
