#!/bin/bash
# Local Docker test script - run before pushing to AWS
set -e

echo "🐳 Building containers..."
docker compose build

echo "🚀 Starting services..."
docker compose up -d

echo "⏳ Waiting for services to be healthy..."
sleep 15

echo "🔍 Checking backend health..."
BACKEND=$(curl -sf http://localhost:3000/health | grep -c healthy)
if [ "$BACKEND" -eq 1 ]; then
  echo "✅ Backend: HEALTHY"
else
  echo "❌ Backend: UNHEALTHY"
  docker compose logs backend
  exit 1
fi

echo "🔍 Checking frontend health..."
FRONTEND=$(curl -sf http://localhost:3001/health | grep -c OK)
if [ "$FRONTEND" -eq 1 ]; then
  echo "✅ Frontend: HEALTHY"
else
  echo "❌ Frontend: UNHEALTHY"
  docker compose logs frontend
  exit 1
fi

echo "🔍 Checking all containers..."
docker compose ps

echo ""
echo "✅ All services healthy! Ready for AWS deployment."
echo "   Frontend: http://localhost:3001"
echo "   Backend:  http://localhost:3000"
echo ""
echo "Run 'docker compose down -v' to cleanup."
