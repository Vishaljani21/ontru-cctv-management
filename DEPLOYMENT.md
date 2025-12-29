# Production Deployment Guide - Ontru CCTV Management

This guide details how to deploy the "Production Ready" Ontru application to a Hostinger VPS (or any Ubuntu 20.04/22.04 server).

## Prerequisites

1.  **Hostinger VPS**: Recommended 4GB RAM minimum (for Postgres + Node build).
    *   OS: Ubuntu 22.04 LTS (Recommended)
2.  **Domain Name**:
    *   Point your domain's **A Record** to your VPS IP Address.
    *   Example: `A @ 123.45.67.89`
3.  **GitHub Repository**: Ensure this code is pushed to your GitHub.

## Step 1: Access your VPS & Clone Repository

SSH into your VPS:
```bash
ssh root@your_vps_ip
```

Clone your repository (replace with your actual URL):
```bash
git clone https://github.com/Start-Spark/ontru-cctv-system.git /opt/ontru
cd /opt/ontru
```

## Step 2: Run Deployment Script

We have created an automated `deploy.sh` script that handles:
*   Docker & Docker Compose installation.
*   SSL Certificate generation (Let's Encrypt).
*   Frontend Building (Vite).
*   Database & Backend Startup (Supabase Self-Hosted).

Run the script with your domain:
```bash
# Make script executable
chmod +x deploy/deploy.sh

# Run deployment (replace with your DOMAIN)
./deploy/deploy.sh your-domain.com
```

### What happens next?
1.  **Dependencies**: The script installs Docker and Node.js.
2.  **Secrets**: It generates a `.env` file with secure passwords for the Database and JWT tokens.
    *   *Note: You will see these printed once. Save them if needed.*
3.  **Build**: It installs npm packages and builds the React frontend.
4.  **SSL**: It requests a free HTTPS certificate from Let's Encrypt.
5.  **Start**: It starts the Nginx web server and Supabase backend.

## Step 3: Deployment Verification

1.  **Visit your URL**: `https://your-domain.com`
2.  **Check Health**: `https://your-domain.com/health` should return "healthy".
3.  **Supabase Studio**: Manage your database at `https://your-domain.com:54323` (Note: Requires opening port 54323 in VPS Firewall if accessing externally, otherwise tunnel via SSH).

## Troubleshooting

**View Logs:**
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

**Restart Services:**
```bash
docker-compose -f docker-compose.prod.yml restart
```

**Re-deploy (after code changes):**
```bash
git pull origin main
./deploy/deploy.sh --update
```

**Database Migrations:**
Migrations run automatically on deploy, but you can force them:
```bash
docker-compose -f docker-compose.prod.yml exec db psql -U postgres -d postgres < supabase/migrations/20241205000001_initial_schema.sql
```

## Step 4: Configure Automatic Deployment (CI/CD)

To enable automatic updates whenever you push to GitHub, you must configure **GitHub Secrets**.

1.  Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2.  Click **New repository secret**.
3.  Add the following secrets:

    *   `HOST`: Your VPS IP Address (e.g., `123.45.67.89`).
    *   `USERNAME`: `root` (or your VPS username).
    *   `SSH_KEY`: The private SSH key you use to access the VPS.
        *   *To get this key from your local machine (if you generated one):* `cat ~/.ssh/id_rsa`
        *   *Or generate a new pair on your local machine and add the public key to VPS `~/.ssh/authorized_keys`.*

**Once configured:**
*   Any commit pushed to the `main` branch will trigger the **Deploy to Hostinger VPS** workflow.
*   You can check the progress in the **Actions** tab of your GitHub repo.
