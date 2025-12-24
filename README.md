# Ontru CCTV Project Management System

A comprehensive web application for managing CCTV installations, technicians, inventory, and customer relationships. Built for dealers and service providers in the surveillance industry.

## 🚀 Features
- **Project Management**: Track installation visits, job status, and technician assignments.
- **Inventory Management**: Manage stock across multiple godowns (warehouses), track serialized items.
- **Technician Portal**: Dedicated interface for technicians to view schedules and log work.
- **Billing & Invoicing**: Generate GST-compliant invoices and track payments.
- **AMC Tracking**: Monitor Annual Maintenance Contracts and renewals.
- **Reporting**: Visual dashboards for business health and performance.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, TailwindCSS
- **Backend & Database**: Supabase (PostgreSQL 15), Supabase Auth
- **Infrastructure**: Docker, Nginx, Hostinger VPS (Ubuntu)

## 🏃‍♂️ Run Locally

### Prerequisites
- Node.js & npm
- Docker & Docker Compose (for local Supabase)
- Supabase CLI (optional but recommended)

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/visha/ontru-cctv-management.git
   cd ontru-cctv-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
   *Note: For local development using a remote Supabase instance, fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.*

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 🚢 Deployment (Hostinger VPS)

This project is configured for automated deployment to a Hostinger VPS via GitHub Actions.

### Quick Start
1. **Connect to VPS** and clone the repo.
2. **Run the deployment script**:
   ```bash
   ./deploy/deploy.sh yourdomain.com
   ```
3. **Configure CI/CD**: Add `HOST`, `USERNAME`, and `SSH_KEY` to GitHub Repository Secrets.

For detailed instructions, see [deployment_guide.md](deployment_guide.md).

## 📄 License
Private - Proprietary Software.
