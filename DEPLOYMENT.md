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
# or use the web terminal in Hostinger Dashboard
```

Clone your repository (replace with your actual URL):
```bash
git clone https://github.com/Vishaljani21/ontru-cctv-management.git /opt/ontru
cd /opt/ontru
```

## Step 2: Deployment (Automated)

**Good news!** You do NOT need to run any scripts manually.

I have configured the **GitHub Actions** pipeline to handle everything for you.
1.  **Repo Configured**: I added your VPS credentials (`HOST`, `USERNAME`, `VPS_PASSWORD`) and Domain (`DOMAIN`) to GitHub Secrets.
2.  **Workflow Updated**: The deployment script will automatically detect if it's a fresh install or an update.

**Just sit back!**
Since I pushed the latest code, the deployment is already running.
*   It will install Docker.
*   It will build the app.
*   It will set up SSL for `app.ontru.in`.

## Option 3: Manual Deployment (Fallback)

If you are logged into the VPS and want to get it running immediately without waiting for GitHub:

```bash
# 1. Clone the repository
git clone https://github.com/Vishaljani21/ontru-cctv-management.git /opt/ontru

# 2. Enter directory
cd /opt/ontru

# 3. Make script executable
chmod +x deploy/deploy.sh

# 4. Run Deployment (Replace with your actual domain)
./deploy/deploy.sh app.ontru.in
```

## Step 3: Verification

Once the GitHub Action completes (green checkmark in Repo -> Actions), visit:
**https://app.ontru.in**

## Troubleshooting: "No Process Running" or "Authentication Failed"

If the automatic deployment fails, it is usually because the VPS hosting provider (like Hostinger) blocks password-based authentication for automation tools (GitHub Actions).

**To fix this permanently, use an SSH Key (Recommended):**

1.  **On your local computer**, run this in PowerShell:
    ```powershell
    ssh-keygen -t rsa -b 4096 -f $HOME/.ssh/ontru_deploy_key
    ```
    *(Press Enter for no passphrase)*.

2.  **Copy the public key to your VPS**:
    *(You will need to enter your VPS password one last time)*
    ```powershell
    type $HOME/.ssh/ontru_deploy_key.pub | ssh root@72.60.221.119 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
    ```

3.  **Get your Private Key**:
    ```powershell
    cat $HOME/.ssh/ontru_deploy_key
    ```
    *Copy the entire block starting with `-----BEGIN OPENSSH PRIVATE KEY-----`.*

4.  **Update GitHub Secret**:
    *   Go to GitHub Repo -> Settings -> Secrets -> Actions.
    *   Delete `VPS_PASSWORD` (or ignore it).
    *   Add `SSH_KEY` with the content you just copied.
    *   Update `deploy.yml` to use `key: ${{ secrets.SSH_KEY }}` instead of `password`.

5.  **Re-run Deployment**: Go to Actions -> Select "Deploy" -> "Re-run jobs".
