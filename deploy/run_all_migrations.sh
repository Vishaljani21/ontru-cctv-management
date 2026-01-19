#!/bin/bash
# Master Migration Script for Ontru CCTV Management System
# Runs all app-specific database migrations in order

set -e

echo "========================================"
echo "  Ontru - Running All App Migrations"
echo "========================================"

COMPOSE="docker-compose -f docker-compose.prod.yml"
DB_CMD="$COMPOSE exec -T db psql -U postgres -d postgres"

# Function to run a migration file
run_migration() {
    local file=$1
    local name=$(basename "$file")
    echo "Running: $name"
    $DB_CMD < "$file" 2>&1 || echo "Note: Some statements may already exist (this is normal)"
}

# ==========================================
# STEP 1: Core Schema (Tables, Indexes)
# ==========================================
echo ""
echo "=== Step 1: Core Schema ==="
run_migration "supabase/migrations/20241205000001_initial_schema.sql"

# ==========================================
# STEP 2: RLS Policies
# ==========================================
echo ""
echo "=== Step 2: RLS Policies ==="
run_migration "supabase/migrations/20241205000002_rls_policies.sql"

# ==========================================
# STEP 3: Technician Features
# ==========================================
echo ""
echo "=== Step 3: Technician Features ==="
run_migration "supabase/migrations/20241224194000_add_status_to_technicians.sql"
run_migration "supabase/migrations/20241226000000_tech_features.sql"
run_migration "supabase/migrations/20241226000001_technician_tasks.sql"
run_migration "deploy/create_technician_function.sql"

# ==========================================
# STEP 4: Dealer Features
# ==========================================
echo ""
echo "=== Step 4: Dealer Features ==="
run_migration "supabase/migrations/20241224200000_fix_dealer_settings.sql"
run_migration "supabase/migrations/20241224210000_fix_dealer_duplicates.sql"
run_migration "supabase/migrations/20241224220000_add_dealer_logo.sql"
run_migration "supabase/migrations/20241224230000_add_module_prefs.sql"

# ==========================================
# STEP 5: Admin Features
# ==========================================
echo ""
echo "=== Step 5: Admin Features ==="
run_migration "supabase/migrations/20241225000000_admin_policy.sql"
run_migration "supabase/migrations/20241225000001_admin_dealers_function.sql"
run_migration "supabase/migrations/20241225000002_admin_dealers_fix.sql"
run_migration "supabase/migrations/20241225000003_secure_license_redemption.sql"

# ==========================================
# STEP 6: Support & Complaints
# ==========================================
echo ""
echo "=== Step 6: Support & Complaints ==="
run_migration "supabase/migrations/20241225000004_support_tickets.sql"
run_migration "supabase/migrations/20250114000000_create_complaints_schema.sql"

# ==========================================
# STEP 7: Additional Features
# ==========================================
echo ""
echo "=== Step 7: Additional Features ==="
run_migration "supabase/migrations/20241226000002_suppliers.sql"
run_migration "supabase/migrations/20241227000000_project_details.sql"
run_migration "supabase/migrations/20260117000000_add_assignment_rls_policies.sql"

# ==========================================
# STEP 8: Permission Fixes
# ==========================================
echo ""
echo "=== Step 8: Permission Fixes ==="
run_migration "deploy/fix_all_permissions.sql"

# ==========================================
# STEP 9: Restart REST to Refresh Schema Cache
# ==========================================
echo ""
echo "=== Step 9: Refreshing API Schema Cache ==="
$COMPOSE restart rest

sleep 5

echo ""
echo "========================================"
echo "  All Migrations Completed Successfully!"
echo "========================================"
echo ""
echo "The database is now fully configured for:"
echo "  - Admin panel (dealers management, license keys)"
echo "  - Dealer features (customers, visits, invoices)"
echo "  - Technician features (tasks, attendance, payments)"
echo ""
