-- Ontru CCTV Management - Seed Data
-- Run this after initial schema to populate sample data

-- ============================================
-- Sample Service Stations
-- ============================================
INSERT INTO service_stations (user_id, name, address, contact) 
SELECT id, 'Hikvision Service Center', 'Delhi', 'Mr. Verma'
FROM profiles WHERE role = 'dealer' LIMIT 1;

INSERT INTO service_stations (user_id, name, address, contact) 
SELECT id, 'Aditya Infotech', 'Chandigarh', 'Service Desk'
FROM profiles WHERE role = 'dealer' LIMIT 1;

-- ============================================
-- Note: Most seed data should be created through
-- the app's setup wizard for proper user association
-- ============================================
