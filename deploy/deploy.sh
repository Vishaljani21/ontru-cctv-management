#!/bin/bash
# Ontru CCTV Management - Hostinger VPS Deployment Script
# Usage: ./deploy.sh [domain] [flags]
# Flags:
#   --update    Only update code and restart services (skip system install)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check for update flag
IS_UPDATE=false
DOMAIN=""

for arg in "$@"
do
    case $arg in
        --update)
        IS_UPDATE=true
        shift # Remove --update from processing
        ;;
        *)
        DOMAIN=$arg
        ;;
    esac
done

# If not updating, domain is required
if [ "$IS_UPDATE" = false ] && [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: Please provide a domain name for initial setup${NC}"
    echo "Usage: ./deploy.sh your-domain.com"
    echo "       ./deploy.sh --update (to update existing installation)"
    exit 1
fi

# Load existing domain if updating
if [ "$IS_UPDATE" = true ]; then
    if [ -f .env ]; then
        # Extract domain from .env matching DOMAIN=...
        DOMAIN=$(grep "^DOMAIN=" .env | cut -d '=' -f2)
    fi
    
    if [ -z "$DOMAIN" ]; then
         echo -e "${RED}Error: Could not determine domain from .env. Please provide it explicitly.${NC}"
         exit 1
    fi
fi

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Ontru CCTV Management - Deployment    ${NC}"
echo -e "${GREEN}  Domain: $DOMAIN                       ${NC}"
echo -e "${GREEN}  Mode: $([ "$IS_UPDATE" = true ] && echo "Update" || echo "Initial Setup")${NC}"
echo -e "${GREEN}========================================${NC}"

# ==========================================
# SYSTEM DEPENDENCIES (Skip on Update)
# ==========================================
if [ "$IS_UPDATE" = false ]; then
# Add Snap to path ensuring it persists
export PATH=$PATH:/snap/bin

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}Installing Docker...${NC}"
    # Try standard script first
    if curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh; then
        echo "Docker installed via official script."
    else
        echo -e "${RED}Standard install failed. Trying Snap...${NC}"
        # Fallback to Snap (common for newer Ubuntu versions with repo issues)
        sudo snap install docker
        # Add snap docker group hack if needed
        sudo addgroup --system docker
        sudo adduser $USER docker
        sudo snap connect docker:home
    fi
    
    sudo usermod -aG docker $USER || true
    rm -f get-docker.sh
fi


    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null; then
        echo -e "${YELLOW}Installing Docker Compose...${NC}"
        if [ "$(uname -m)" = "x86_64" ]; then
            sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            sudo chmod +x /usr/local/bin/docker-compose
        else
            # Fallback for other architectures or apt
            sudo apt-get update && sudo apt-get install -y docker-compose
        fi
    fi

    # Create project directory
    echo -e "${YELLOW}Setting up project directory...${NC}"
    mkdir -p /opt/ontru
    # Note: We assume the script is running from within the repo, so we don't cd /opt/ontru here if we are already there.
    # But for a fresh VPS setup, one might curl this script. 
    # For now, let's assume this script is part of the cloned repo.
fi

# ==========================================
# CONFIGURATION
# ==========================================

# Generate secrets if not exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Generating secrets...${NC}"
    
    # Generate random passwords and secrets
    POSTGRES_PASSWORD=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    JWT_SECRET=$(openssl rand -base64 64 | tr -dc 'a-zA-Z0-9' | head -c 64)
    ANON_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    SERVICE_ROLE_KEY=$(openssl rand -base64 32 | tr -dc 'a-zA-Z0-9' | head -c 32)
    
    cat > .env << EOF
# Ontru Production Environment
# Generated on $(date)

# Domain Configuration
DOMAIN=$DOMAIN
SITE_URL=https://$DOMAIN
API_EXTERNAL_URL=https://$DOMAIN

# Database
POSTGRES_PASSWORD=$POSTGRES_PASSWORD

# JWT
JWT_SECRET=$JWT_SECRET

# Supabase Keys
ANON_KEY=$ANON_KEY
SERVICE_ROLE_KEY=$SERVICE_ROLE_KEY

# Auth Settings
DISABLE_SIGNUP=false
ADDITIONAL_REDIRECT_URLS=

# Email Configuration (configure for production)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_SENDER_NAME=Ontru
EOF

    echo -e "${GREEN}Environment file created!${NC}"
    echo -e "${YELLOW}IMPORTANT: Save these credentials securely:${NC}"
    echo "  POSTGRES_PASSWORD: $POSTGRES_PASSWORD"
    echo "  JWT_SECRET: $JWT_SECRET"
fi

# Update Nginx config with actual domain
# We accept the overhead of doing this every time to ensure compliance
echo -e "${YELLOW}Configuring Nginx for $DOMAIN...${NC}"
sed -i "s/ontru.yourdomain.com/$DOMAIN/g" deploy/nginx.conf

# ==========================================
# BUILD
# ==========================================

# Build frontend
echo -e "${YELLOW}Building frontend...${NC}"
if [ -f package.json ]; then
    # Install Node.js if not present (Check for both node and npm)
    if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
        echo -e "${YELLOW}Installing Node.js...${NC}"
        
        # Attempt standard apt install first
        # We ignore errors here to check the result explicitly
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - || true
        sudo apt-get install -y nodejs || true
        
        # VERIFY: Did it actually install npm?
        if command -v npm &> /dev/null; then
             echo "Node.js (and npm) installed via apt."
        else
             echo -e "${RED}Apt install succeeded but 'npm' is missing. Removing broken package and using Snap...${NC}"
             # Remove broken apt version
             sudo apt-get remove -y nodejs || true
             sudo apt-get autoremove -y || true
             
             # Fallback to Snap
             sudo snap install node --classic
        fi
    fi
    
    # Use clean install for CI/consistency
    npm ci || npm install
    npm run build
fi

# ==========================================
# SSL CERTIFICATE (Initial Setup Only)
# ==========================================
if [ "$IS_UPDATE" = false ] && [ ! -d "deploy/ssl/live/$DOMAIN" ]; then
    echo -e "${YELLOW}Setting up SSL certificate...${NC}"
    mkdir -p deploy/ssl

    # Start services temporarily for certbot
    docker-compose -f docker-compose.prod.yml up -d nginx

    # Get SSL certificate
    docker run --rm -v $(pwd)/deploy/ssl:/etc/letsencrypt -v $(pwd)/deploy/certbot:/var/www/certbot certbot/certbot certonly \
        --webroot --webroot-path=/var/www/certbot \
        --email admin@$DOMAIN \
        --agree-tos \
        --no-eff-email \
        --non-interactive \
        -d $DOMAIN

    # Stop nginx temporarily
    docker-compose -f docker-compose.prod.yml down
fi

# ==========================================
# START SERVICES
# ==========================================

# Restart/Start all services
echo -e "${YELLOW}Starting/Restarting all services...${NC}"
docker-compose -f docker-compose.prod.yml up -d --remove-orphans

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 15

# ==========================================
# MIGRATIONS
# ==========================================

# Run database migrations
# Always run this to ensure DB is up to date with code
echo -e "${YELLOW}Running database migrations...${NC}"
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d postgres < supabase/migrations/20241205000001_initial_schema.sql
# You might want to wrap this in a conditional or keep it idempotent
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d postgres < supabase/migrations/20241205000002_rls_policies.sql

# ==========================================
# HEALTH CHECK
# ==========================================

echo -e "${YELLOW}Running health check...${NC}"
# Allow some more time for Nginx to come up fully
sleep 5

if curl -s -k "https://$DOMAIN/health" > /dev/null || curl -s "http://localhost/health" > /dev/null; then
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}  Deployment Successful!                ${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""
    echo -e "Your Ontru CCTV Management app is now live at:"
    echo -e "  ${GREEN}https://$DOMAIN${NC}"
    echo ""
    
    if [ "$IS_UPDATE" = false ]; then
        echo -e "Supabase Studio (database admin):"
        echo -e "  ${GREEN}https://$DOMAIN:54323${NC}"
        echo ""
        echo -e "${YELLOW}Next steps:${NC}"
        echo "  1. Add secrets to GitHub Repo (HOST, USERNAME, SSH_KEY)"
        echo "  2. Configure SMTP in .env for email functionality"
    fi
else
    echo -e "${RED}Health check failed. Check logs with:${NC}"
    echo "  docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo -e "\n${YELLOW}Useful commands:${NC}"
echo "  View logs:     docker-compose -f docker-compose.prod.yml logs -f"
echo "  Manual Update: ./deploy/deploy.sh --update"
