#!/bin/bash

set -e

echo "🚀 Starting deployment..."

# Load environment variables
source .env.production

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Run database migrations
docker-compose -f docker-compose.prod.yml run --rm app \
  npx prisma migrate deploy

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Run health checks
echo "⏳ Running health checks..."
sleep 30

if curl -f http://localhost:3000/health; then
    echo "✅ Deployment successful!"
else
    echo "❌ Deployment failed!"
    exit 1
fi

# Clean up old images
docker image prune -f

echo "🎉 Deployment completed!"