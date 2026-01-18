#!/bin/bash

# SSL SETUP SCRIPT FOR ONTRU.IN
# Run this on the VPS to set up Let's Encrypt SSL certificates

set -e

DOMAIN="ontru.in"
EMAIL="info@softwarelicensehub.in"

echo "🔐 Setting up SSL for $DOMAIN"
echo "================================"

# Stop nginx to free port 80
echo "1. Stopping nginx..."
docker-compose -f docker-compose.prod.yml stop nginx || true

# Create directories
echo "2. Creating SSL directories..."
mkdir -p ./deploy/ssl
mkdir -p ./deploy/certbot-data

# Install certbot and get certificates
echo "3. Getting SSL certificates from Let's Encrypt..."
docker run -it --rm \
    -v "$(pwd)/deploy/ssl:/etc/letsencrypt" \
    -v "$(pwd)/deploy/certbot-data:/var/www/certbot" \
    -p 80:80 \
    certbot/certbot certonly \
    --standalone \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN \
    -d app.$DOMAIN

# Check if certificates were created
if [ -f "./deploy/ssl/live/$DOMAIN/fullchain.pem" ]; then
    echo "✅ SSL certificates created successfully!"
else
    echo "❌ Failed to create SSL certificates"
    exit 1
fi

# Update nginx config path (it might be looking in wrong location)  
echo "4. Updating nginx config..."
sed -i "s|/etc/nginx/ssl/live|/etc/letsencrypt/live|g" ./deploy/nginx.conf

# Start all services
echo "5. Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "✅ SSL setup complete!"
echo "================================"
echo "Your site should now be accessible at:"
echo "  https://ontru.in"
echo "  https://www.ontru.in"  
echo "  https://app.ontru.in"
echo ""
echo "Note: It may take a few minutes for DNS to propagate."
