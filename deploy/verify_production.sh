#!/bin/bash

# Diagnostic Script for Ontru Production Environment
# Checking Container Status, Logs, and Database State

echo "============================================"
echo "ONTRU PRODUCTION DIAGNOSTIC REPORT"
echo "============================================"
date
echo ""

# 1. Check Container Status
echo "[1] Checking Container Status..."
docker-compose -f docker-compose.prod.yml ps
echo ""

# 2. Check Auth Service Logs (Last 100 lines)
echo "[2] Checking Auth Service Logs (Last 100 lines)..."
echo "These logs contain the detailed reason for 500 Errors."
docker-compose -f docker-compose.prod.yml logs --tail=100 auth
echo ""

# 3. Check Database Connection & Schema
echo "[3] Checking Database Schema (auth)..."
echo "Connecting to database via Docker..."

# Check if auth schema exists and list tables
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d postgres -c "
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'auth' 
ORDER BY table_name;"

# 4. Check for Seeded Users
echo ""
echo "[4] Checking for Seeded Users..."
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d postgres -c "
SELECT id, email, role, created_at FROM auth.users WHERE email IN ('admin@ontru.com', 'dealer@example.com');"

# 5. Check for Missing Roles
echo ""
echo "[5] Checking specific missing roles..."
docker-compose -f docker-compose.prod.yml exec -T db psql -U postgres -d postgres -c "
SELECT rolname FROM pg_roles WHERE rolname IN ('supabase_auth_admin', 'supabase_storage_admin', 'anon', 'authenticated', 'service_role');"

echo ""
echo "============================================"
echo "DIAGNOSTIC COMPLETE"
echo "============================================"
